import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const repository = 'github.com/Kyntrin/spirit-meter-releases';
const allowed = new Set([
  '.gitignore', '.nojekyll', 'AGENTS.md', 'README.md',
  'index.html', 'site.js', 'styles.css', 'gallery.js', 'gallery.css',
  'tests/languages.test.js', 'tests/publication.test.js',
  'scripts/verify-public.mjs', '.github/workflows/checks.yml',
  '.githooks/pre-commit', '.githooks/pre-push', '.githooks/commit-msg',
  ...['casts', 'controls', 'debuffs', 'dps', 'effects', 'farm', 'healing', 'history', 'selection', 'uptime']
    .map(name => `assets/screenshots/${name}.png`),
]);
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /(?:\/home\/|\/Users\/|[A-Z]:\\Users\\)[^\s"'<>]+/,
];
function fail(message) { throw new Error(message); }
function git(...args) { return execFileSync('git', args, { maxBuffer: 16 * 1024 * 1024 }); }

export function validateRemote(value) {
  if (![ `https://${repository}`, `git@${repository.replace('/', ':')}` ]
    .some(base => value === base || value === base + '.git')) fail('Unexpected publication destination');
}

export function validateMessage(message) {
  const trimmed = message.trimEnd();
  if (trimmed.includes('\n') || trimmed.length > 72 || !/^(feat|fix|docs|test|ci|chore|refactor)(\([a-z-]+\))?: [\x20-\x7e]+$/.test(trimmed)) {
    fail('Use one short English conventional commit subject (maximum 72 characters)');
  }
  if (secretPatterns.some(pattern => pattern.test(trimmed))) fail('Commit message contains restricted information');
}

export function validateBlob(file, mode, bytes) {
  if (!allowed.has(file)) fail(`File is not approved for publication: ${file}`);
  if (!['100644', '100755'].includes(mode) || (mode === '100755' && !file.startsWith('.githooks/'))) fail(`Unsupported file mode: ${file}`);
  if (file.endsWith('.png')) {
    if (bytes.length > 3 * 1024 * 1024 || !bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) fail(`Invalid screenshot: ${file}`);
    let cursor = 8;
    let header = false;
    let data = false;
    let end = false;
    while (cursor + 12 <= bytes.length) {
      const length = bytes.readUInt32BE(cursor);
      const kind = bytes.toString('ascii', cursor + 4, cursor + 8);
      if (cursor + 12 + length > bytes.length || !['IHDR','PLTE','IDAT','IEND','tRNS','pHYs','sRGB','gAMA','cHRM'].includes(kind)) fail(`Invalid or unapproved PNG metadata: ${file}`);
      if (!header) {
        if (kind !== 'IHDR' || length !== 13) fail(`Missing PNG header: ${file}`);
        const width = bytes.readUInt32BE(cursor + 8), height = bytes.readUInt32BE(cursor + 12);
        if (!width || !height || width > 4096 || height > 4096) fail(`Unexpected screenshot dimensions: ${file}`);
        header = true;
      } else if (kind === 'IHDR') fail(`Duplicate PNG header: ${file}`);
      if (kind === 'IDAT') data = true;
      cursor += 12 + length;
      if (kind === 'IEND') { if (length !== 0) fail(`Invalid PNG end: ${file}`); end = true; break; }
    }
    if (!header || !data || !end || cursor !== bytes.length) fail(`Incomplete screenshot or appended data: ${file}`);
  } else {
    if (bytes.length > 256 * 1024 || bytes.includes(0)) fail(`Unexpected text file payload: ${file}`);
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    if (secretPatterns.some(pattern => pattern.test(text))) fail(`Restricted content detected in: ${file}`);
  }
}

function inspect(ref) {
  const staged = ref === '--staged';
  const entries = git(...(staged ? ['ls-files', '--stage', '-z'] : ['ls-tree', '-r', '-z', ref])).toString().split('\0').filter(Boolean);
  if (!entries.length) fail('No files to verify');
  for (const entry of entries) {
    const split = entry.indexOf('\t');
    const [mode, middle, last] = entry.slice(0, split).split(' ');
    if (staged && last !== '0') fail('Resolve the index conflict before publication');
    const oid = staged ? middle : last;
    validateBlob(entry.slice(split + 1), mode, git('cat-file', 'blob', oid));
  }
}

export function run(args) {
  for (const url of git('remote', 'get-url', '--push', '--all', 'origin').toString().trim().split('\n')) validateRemote(url);
  if (args[0] === '--message') { validateMessage(readFileSync(args[1], 'utf8')); return; }
  if (args[0] === '--push-url') {
    validateRemote(args[1]);
    for (const line of readFileSync(0, 'utf8').trim().split('\n').filter(Boolean)) {
      const [localRef, localOid, remoteRef, remoteOid] = line.split(/\s+/);
      if (![localOid, remoteOid].every(oid => /^[0-9a-f]{40,64}$/.test(oid || ''))) fail('Invalid push update');
      if (!remoteRef.startsWith('refs/heads/') || /^0+$/.test(localOid)) fail('Tag publication and branch deletion require a separate reviewed workflow');
      if (remoteRef === 'refs/heads/main') fail('Push a feature branch and merge through a checked pull request');
      const range = /^0+$/.test(remoteOid) ? localOid : `${remoteOid}..${localOid}`;
      const commits = git('rev-list', '--reverse', range).toString().trim().split('\n').filter(Boolean);
      for (const commit of commits) inspect(commit);
      console.log(`Verified ${commits.length} outgoing commit trees for ${localRef}`);
    }
  } else if (args[0] === '--staged' || args[0] === '--ref') {
    const ref = args[0] === '--staged' ? '--staged' : args[1];
    if (!ref || (ref !== '--staged' && ref.startsWith('-'))) fail('Invalid revision');
    inspect(ref);
  } else fail('Usage: --staged | --ref REV | --push-url URL | --message FILE');
  console.log('Publication checks passed');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { run(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
