"use strict";

// Only public landing-page copy. No application code or private API access.
const fields = [
  ".skip", ".brand small", ".language-label", ".eyebrow", ".title-first",
  ".title-second", ".intro", "#download-title", ".download p", ".badge",
  ".features article:nth-child(1) .number", ".features article:nth-child(1) h2", ".features article:nth-child(1) p",
  ".features article:nth-child(2) .number", ".features article:nth-child(2) h2", ".features article:nth-child(2) p",
  ".features article:nth-child(3) .number", ".features article:nth-child(3) h2", ".features article:nth-child(3) p",
  ".notice h2", ".notice p", "footer p"
];

const catalogs = {
  en: {
    lang: "en", title: "Spirit Meter · Downloads", home: "Spirit Meter, home", nav: "Links and language", features: "Project features",
    description: "Spirit Meter: combat, effects and farming in an overlay for SpiritVale. Check download availability.",
    text: ["Skip to content", "YOUR ADVENTURE COMPANION", "Language", "IN DEVELOPMENT · ALPHA", "Your adventure.", "In detail.",
      "Track your combat, organize your effects and understand your farming with Spirit Meter, an overlay for SpiritVale.",
      "Downloads coming soon", "No public version is available yet. Packages will be published here after validation with testers.", "IN PREPARATION",
      "01 / COMBAT", "Every encounter counts.", "DPS, healing and combat history to look beyond the final number.",
      "02 / EFFECTS", "What matters, in view.", "Buff, aura and debuff panels with filters and independent positioning.",
      "03 / FARMING", "Your progress, clear.", "Track experience, gold and items acquired during your session.",
      "A project in progress", "Features are still being tested and may change. This space hosts the distribution page and, in the future, packages and release notes — not the application's source code.",
      "Independent project, not officially affiliated with SpiritVale."]
  },
  pt: {
    lang: "pt-BR", title: "Spirit Meter · Downloads", home: "Spirit Meter, início", nav: "Links e idioma", features: "Recursos do projeto",
    description: "Spirit Meter: combate, efeitos e farm em um overlay para SpiritVale. Acompanhe a disponibilidade de downloads.",
    text: ["Pular para o conteúdo", "COMPANHEIRO DE AVENTURA", "Idioma", "EM DESENVOLVIMENTO · ALPHA", "Sua aventura.", "Em detalhes.",
      "Acompanhe seu combate, organize seus efeitos e entenda seu farm com o Spirit Meter, um overlay para SpiritVale.",
      "Downloads em breve", "Ainda não há uma versão pública disponível. Os pacotes serão publicados aqui após a validação com os testers.", "EM PREPARAÇÃO",
      "01 / COMBATE", "Cada encontro conta.", "DPS, cura e histórico de combate para olhar além do número final.",
      "02 / EFEITOS", "O que importa, à vista.", "Painéis de buffs, auras e debuffs com filtros e posicionamento independente.",
      "03 / FARM", "Seu progresso, claro.", "Acompanhe experiência, ouro e itens adquiridos durante sua sessão.",
      "Um projeto em evolução", "Os recursos ainda estão em testes e podem mudar. Este espaço reúne a página de distribuição e, futuramente, os pacotes e notas de versão — não o código-fonte do aplicativo.",
      "Projeto independente, sem afiliação oficial com SpiritVale."]
  },
  es: {
    lang: "es", title: "Spirit Meter · Descargas", home: "Spirit Meter, inicio", nav: "Enlaces e idioma", features: "Funciones del proyecto",
    description: "Spirit Meter: combate, efectos y farmeo en un overlay para SpiritVale. Consulta la disponibilidad de descargas.",
    text: ["Saltar al contenido", "TU COMPAÑERO DE AVENTURA", "Idioma", "EN DESARROLLO · ALFA", "Tu aventura.", "En detalle.",
      "Sigue tus combates, organiza tus efectos y analiza tu farmeo con Spirit Meter, un overlay para SpiritVale.",
      "Descargas próximamente", "Todavía no hay una versión pública disponible. Los paquetes se publicarán aquí tras su validación con los testers.", "EN PREPARACIÓN",
      "01 / COMBATE", "Cada encuentro cuenta.", "DPS, curación e historial de combate para ver más allá de la cifra final.",
      "02 / EFECTOS", "Lo importante, a la vista.", "Paneles de beneficios, auras y perjuicios con filtros y posicionamiento independiente.",
      "03 / FARMEO", "Tu progreso, claro.", "Sigue la experiencia, el oro y los objetos obtenidos durante tu sesión.",
      "Un proyecto en evolución", "Las funciones siguen en pruebas y pueden cambiar. Este espacio contiene la página de distribución y, en el futuro, los paquetes y las notas de versión, no el código fuente de la aplicación.",
      "Proyecto independiente, sin afiliación oficial con SpiritVale."]
  },
  zh: {
    lang: "zh-CN", title: "Spirit Meter · 下载", home: "Spirit Meter 首页", nav: "链接和语言", features: "项目功能",
    description: "Spirit Meter：用于 SpiritVale 的战斗、状态效果和刷怪收益悬浮窗。查看下载开放情况。",
    text: ["跳转到正文", "你的冒险伙伴", "语言", "开发中 · ALPHA", "你的冒险。", "尽在细节中。",
      "使用 Spirit Meter 这款 SpiritVale 悬浮窗，追踪战斗数据、整理状态效果并了解刷怪收益。",
      "下载即将开放", "目前尚无公开版本。安装包通过测试人员验证后，将在此发布。", "准备中",
      "01 / 战斗", "每场战斗都值得记录。", "通过 DPS、治疗和战斗历史，了解最终数字背后的细节。",
      "02 / 状态效果", "重要信息，一目了然。", "增益、光环和减益面板，支持筛选和独立定位。",
      "03 / 收益追踪", "清晰掌握你的进展。", "追踪本次游戏期间获得的经验、金币和物品。",
      "持续完善的项目", "各项功能仍在测试中，可能会调整。此处提供分发页面，未来还将提供安装包和版本说明，但不包含应用程序源代码。",
      "独立项目，与 SpiritVale 官方无隶属关系。"]
  },
  ja: {
    lang: "ja", title: "Spirit Meter · ダウンロード", home: "Spirit Meter ホーム", nav: "リンクと言語", features: "プロジェクトの機能",
    description: "Spirit Meter：SpiritVale の戦闘、効果、ファームを確認できるオーバーレイ。ダウンロードの公開状況をご確認ください。",
    text: ["本文へ移動", "あなたの冒険のパートナー", "言語", "開発中 · アルファ版", "あなたの冒険を。", "もっと詳しく。",
      "SpiritVale 用オーバーレイ Spirit Meter で、戦闘を記録し、効果を整理し、ファームの成果を確認できます。",
      "ダウンロードは近日公開", "現在、公開版はありません。テスターによる検証後、ここでパッケージを公開します。", "準備中",
      "01 / 戦闘", "すべての戦闘を記録。", "DPS、回復、戦闘履歴で、最終的な数値の先にある詳細を確認できます。",
      "02 / 効果", "大切な情報を、見やすく。", "バフ、オーラ、デバフのパネルを、フィルターと個別の位置設定で整理できます。",
      "03 / ファーム", "成果を、わかりやすく。", "セッション中に獲得した経験値、ゴールド、アイテムを確認できます。",
      "進化を続けるプロジェクト", "各機能はテスト中であり、変更される場合があります。このサイトでは配布ページを提供し、今後パッケージとリリースノートを公開する予定です。アプリのソースコードは含まれません。",
      "SpiritVale 公式とは関係のない独立したプロジェクトです。"]
  }
};

function supportedLanguage(value) {
  const code = String(value || "").toLowerCase().split(/[-_]/)[0];
  return Object.hasOwn(catalogs, code) ? code : null;
}

function applyLanguage(language) {
  const code = supportedLanguage(language) || "en";
  const copy = catalogs[code];
  document.documentElement.lang = copy.lang;
  document.title = copy.title;
  document.querySelector('meta[name="description"]').setAttribute("content", copy.description);
  document.querySelector(".brand").setAttribute("aria-label", copy.home);
  document.querySelector("nav").setAttribute("aria-label", copy.nav);
  document.querySelector(".features").setAttribute("aria-label", copy.features);
  fields.forEach((selector, index) => { document.querySelector(selector).textContent = copy.text[index]; });
  document.querySelector("#language").value = code;
  if (typeof renderGallery === "function") renderGallery(code);
}

let savedLanguage;
try { savedLanguage = supportedLanguage(localStorage.getItem("spirit-meter-language")); } catch { /* Storage may be blocked. */ }
const browserLanguage = (navigator.languages || [navigator.language]).map(supportedLanguage).find(Boolean);
applyLanguage(savedLanguage || browserLanguage || "en");
document.querySelector("#language").addEventListener("change", (event) => {
  const code = supportedLanguage(event.target.value) || "en";
  applyLanguage(code);
  try { localStorage.setItem("spirit-meter-language", code); } catch { /* The selector still works without storage. */ }
});
