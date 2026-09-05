import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../site.js", import.meta.url), "utf8");
function page(languages, saved, blocked = false) {
  const nodes = new Map();
  const storage = new Map([["spirit-meter-language", saved]]);
  const document = { documentElement: {}, querySelector(selector) {
    if (!nodes.has(selector)) nodes.set(selector, { setAttribute(k, v) { this[k] = v; }, addEventListener(k, v) { this[k] = v; } });
    return nodes.get(selector);
  } };
  const context = { document, navigator: { languages }, localStorage: {
    getItem(k) { if (blocked) throw Error("Blocked"); return storage.get(k); },
    setItem(k, v) { if (blocked) throw Error("Blocked"); storage.set(k, v); }
  } };
  runInNewContext(source + "\n globalThis.catalogAudit = { codes: Object.keys(catalogs), complete: Object.values(catalogs).every(c => c.text.length === fields.length && c.text.every(t => typeof t === 'string' && t.trim().length > 0)) };", context);
  return { document, nodes, storage, context };
}

test("all five catalogs have complete nonempty copy", () => {
  const { context } = page(["en"]);
  expect(context.catalogAudit.codes).toEqual(["en", "pt", "es", "zh", "ja"]);
  expect(context.catalogAudit.complete).toBe(true);
});
for (const [browser, lang] of [["en-US", "en"], ["pt-BR", "pt-BR"], ["es-MX", "es"], ["zh-CN", "zh-CN"], ["ja-JP", "ja"]]) {
  test(`detects ${browser} and translates every field`, () => {
    const { document, nodes } = page([browser]);
    expect(document.documentElement.lang).toBe(lang);
    expect([...nodes.values()].filter(n => typeof n.textContent === "string")).toHaveLength(22);
  });
}
test("saved preference overrides browser; switching updates language and storage", () => {
  const { document, nodes, storage } = page(["en"], "ja");
  expect(document.documentElement.lang).toBe("ja");
  nodes.get("#language").change({ target: { value: "es" } });
  expect(document.documentElement.lang).toBe("es");
  expect(document.title).toBe("Spirit Meter · Descargas");
  expect(storage.get("spirit-meter-language")).toBe("es");
});
test("unsupported preferences fall back safely", () => {
  expect(page(["de", "pt-PT"], "garbage").document.documentElement.lang).toBe("pt-BR");
  expect(page(["de"]).document.documentElement.lang).toBe("en");
  expect(page(["constructor"]).document.documentElement.lang).toBe("en");
});
test("blocked storage does not break language switching", () => {
  const { document, nodes } = page(["en"], null, true);
  nodes.get("#language").change({ target: { value: "zh" } });
  expect(document.documentElement.lang).toBe("zh-CN");
});
