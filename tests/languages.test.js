import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../site.js", import.meta.url), "utf8");
const gallery = readFileSync(new URL("../gallery.js", import.meta.url), "utf8");
function page(languages, saved, blocked = false, includeGallery = false) {
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
  runInNewContext((includeGallery ? gallery + "\n" : "") + source + "\n globalThis.catalogAudit = { codes: Object.keys(catalogs), complete: Object.values(catalogs).every(c => c.text.length === fields.length && c.text.every(t => typeof t === 'string' && t.trim().length > 0)) };", context);
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

for (const language of ["en", "pt", "es", "zh", "ja"]) {
  test(`gallery renders all ten descriptions and image labels in ${language}`, () => {
    const { nodes } = page([language], null, false, true);
    const descriptions = [...nodes.entries()].filter(([s]) => s.endsWith(".feature-description"));
    expect(descriptions).toHaveLength(10);
    for (const [, node] of descriptions) expect(node.textContent.length).toBeGreaterThan(30);
    const images = [...nodes.entries()].filter(([s]) => s.endsWith(" img"));
    expect(images).toHaveLength(10);
    for (const [, node] of images) expect(node.alt.length).toBeGreaterThan(5);
    const title = nodes.get("#gallery-title").textContent;
    nodes.get("#language").change({ target: { value: language === "en" ? "pt" : "en" } });
    expect(nodes.get("#gallery-title").textContent).not.toBe(title);
  });
}

test("gallery has real local PNGs, dimensions, lazy loading and no-JS links", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const images = [...html.matchAll(/<img src="(assets\/screenshots\/[a-z]+\.png)" width="(\d+)" height="(\d+)" loading="lazy" decoding="async" alt="([^"]+)"/g)];
  expect(images).toHaveLength(10);
  for (const [, path, width, height, alt] of images) {
    const png = readFileSync(new URL("../" + path, import.meta.url));
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(Number(width));
    expect(png.readUInt32BE(20)).toBe(Number(height));
    expect(alt.length).toBeGreaterThan(10);
    expect(html).toContain(`href="${path}"`);
    // Generated screenshots must contain no textual metadata or embedded profiles.
    let cursor = 8;
    while (cursor < png.length) {
      const length = png.readUInt32BE(cursor);
      const type = png.toString("ascii", cursor + 4, cursor + 8);
      expect(["tEXt", "iTXt", "zTXt", "eXIf"]).not.toContain(type);
      cursor += 12 + length;
    }
  }
});
