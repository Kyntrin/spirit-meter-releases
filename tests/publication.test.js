import { test, expect } from 'bun:test';
import { readFileSync, mkdtempSync, writeFileSync, unlinkSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateBlob, validateMessage, validateRemote } from '../scripts/verify-public.mjs';

test('only the expected public remote is accepted', () => {
  validateRemote('https://github.com/Kyntrin/spirit-meter-releases.git');
  validateRemote('git@github.com:Kyntrin/spirit-meter-releases.git');
  expect(() => validateRemote('https://github.com/example/wrong.git')).toThrow();
});
test('application files, symlinks, submodules and arbitrary screenshots are rejected', () => {
  for (const file of ['src/server.ts', 'capture.log', '.env', 'assets/other.png']) expect(() => validateBlob(file, '100644', Buffer.from('test'))).toThrow();
  for (const mode of ['120000', '160000']) expect(() => validateBlob('index.html', mode, Buffer.from('test'))).toThrow();
});
test('tokens and local paths are rejected without revealing their contents', () => {
  for (const text of ['gh' + 'p_' + 'x'.repeat(36), '/' + 'home/' + 'example/file']) expect(() => validateBlob('index.html', '100644', Buffer.from(text))).toThrow();
});
test('screenshots reject non-PNG payloads and appended data', () => {
  const png = readFileSync(new URL('../assets/screenshots/dps.png', import.meta.url));
  validateBlob('assets/screenshots/dps.png', '100644', png);
  expect(() => validateBlob('assets/screenshots/dps.png', '100644', Buffer.from('not a screenshot'))).toThrow();
  expect(() => validateBlob('assets/screenshots/dps.png', '100644', Buffer.concat([png, Buffer.from('extra')]))).toThrow();
});
test('public commit subjects are short and conventional', () => {
  validateMessage('fix(site): correct class icons\n');
  expect(() => validateMessage('fix(site): update\n\nInternal notes')).toThrow();
  expect(() => validateMessage('notes')).toThrow();
  expect(() => validateMessage('chore: ' + 'x'.repeat(80))).toThrow();
});

test('push checks reject an intermediate forbidden file even after deletion', () => {
  const directory = mkdtempSync(join(tmpdir(), 'publication-guard-test-'));
  const git = (...args) => execFileSync('git', args, {cwd: directory, stdio: ['pipe','pipe','pipe']}).toString().trim();
  const script = fileURLToPath(new URL('../scripts/verify-public.mjs', import.meta.url));
  try {
    git('init', '-b', 'feature');
    git('config', 'user.name', 'Test'); git('config', 'user.email', 'test@example.invalid');
    git('remote', 'add', 'origin', 'https://github.com/Kyntrin/spirit-meter-releases.git');
    writeFileSync(join(directory, 'README.md'), '# Website\n');
    git('add', 'README.md'); git('commit', '-m', 'docs: initial page');
    const base = git('rev-parse', 'HEAD');
    writeFileSync(join(directory, 'unapproved.txt'), 'fixture');
    git('add', 'unapproved.txt'); git('commit', '-m', 'docs: fixture');
    unlinkSync(join(directory, 'unapproved.txt'));
    git('add', '-u'); git('commit', '-m', 'docs: remove fixture');
    const tip = git('rev-parse', 'HEAD');
    expect(() => execFileSync(process.execPath, [script, '--ref', 'HEAD'], {cwd: directory, stdio:'pipe'})).not.toThrow();
    expect(() => execFileSync(process.execPath, [script, '--push-url', 'https://github.com/Kyntrin/spirit-meter-releases.git'], {
      cwd: directory, stdio:'pipe', input:`refs/heads/feature ${tip} refs/heads/feature ${base}\n`
    })).toThrow();
    writeFileSync(join(directory, 'unapproved.txt'), 'fixture'); git('add', 'unapproved.txt'); unlinkSync(join(directory, 'unapproved.txt'));
    expect(() => execFileSync(process.execPath, [script, '--staged'], {cwd: directory, stdio:'pipe'})).toThrow();
  } finally { rmSync(directory, {recursive:true, force:true}); }
});
