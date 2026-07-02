#!/usr/bin/env node
/* ============================================================
   VOU DE BARCO — gerador estático (sem dependências)
   Lê data/*.json e escreve index.html, passeios/*.html, travessia.html
   Rode:  node build/generate.mjs
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const write = (p, c) => { mkdirSync(dirname(join(ROOT, p)), { recursive: true }); writeFileSync(join(ROOT, p), c); };

const PASSEIOS = JSON.parse(read("data/passeios.json"));
const TRAV = JSON.parse(read("data/travessia.json"));

/* ---- Constantes da marca ---- */
const WA = "5524974031431";
const SITE = "https://voudebarco.com";
const IG = "https://instagram.com/voudebarco";
const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ============================================================
   ÍCONES (inline SVG, currentColor)
   ============================================================ */
const I = {
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.05 4.91A10 10 0 0 0 2.1 13.5L1 22l8.7-1.07A10 10 0 1 0 19.05 4.9Zm-7.03 15.3a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-3.13.39.42-3.05-.2-.31a8.3 8.3 0 1 1 7.44 4.31Zm4.56-6.22c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42l-.48-.01c-.17 0-.44.06-.67.31s-.88.86-.88 2.1.9 2.43 1.03 2.6c.13.17 1.78 2.72 4.3 3.82.6.26 1.07.41 1.44.53.6.19 1.15.16 1.59.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29Z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.4 7.7 8 9 4.6-1.3 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  anchor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="5" r="2.4"/><path d="M12 7.5V22"/><path d="M5 12H3a9 9 0 0 0 18 0h-2"/><path d="M8.5 10.5 12 12l3.5-1.5"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 5.5a4.5 4.5 0 0 0-7 .9 4.5 4.5 0 0 0-7-.9C2.8 7.6 3 11 7 14.5l5 4.5 5-4.5c4-3.5 4.2-6.9 2-9Z"/></svg>`,
  compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>`,
  arrowL: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  boat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 14h18l-2.2 5.2a2 2 0 0 1-1.84 1.2H7.04a2 2 0 0 1-1.84-1.2L3 14Z"/><path d="M12 3v8M12 3l5 4-5 1.5L7 7l5-4Z"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"/><circle cx="12" cy="10" r="2.6"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  mark: `<svg class="mark" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="14.5" stroke="currentColor" stroke-width="1.5"/><path d="M6 19c2.2 1.6 3.6 1.6 5.6 0 2-1.6 3.4-1.6 5.6 0 2.2 1.6 3.6 1.6 5.6 0" stroke="var(--amarelo)" stroke-width="2" stroke-linecap="round"/><path d="M16 5.5 21 13H11l5-7.5Z" fill="currentColor"/><path d="M16 8.5V19" stroke="var(--amarelo)" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

/* ============================================================
   FUNDO DE CARTA NÁUTICA (hero / subhero)
   ============================================================ */
function chartBg(withRoute = true) {
  const route = withRoute ? `
    <path class="route-line" style="--len:980" d="M120 470 C 360 360, 560 300, 740 250 S 1120 150, 1300 120"
      stroke="var(--amarelo)" stroke-width="2.5" stroke-dasharray="980" fill="none" stroke-linecap="round" opacity=".9"/>
    <g class="route-dot">
      <circle cx="120" cy="470" r="6" fill="var(--amarelo)"/>
      <circle cx="1300" cy="120" r="6" fill="var(--amarelo)"/>
    </g>
    <g class="chart-labels" font-family="'Space Mono', monospace" fill="rgba(255,255,255,.55)" font-size="13" letter-spacing="1">
      <text x="120" y="500">MANGARATIBA</text>
      <text x="1230" y="108">ABRAÃO</text>
      <text x="700" y="300" fill="var(--amarelo)" opacity=".85">35 MIN · FLEX BOAT</text>
    </g>` : "";
  return `<svg viewBox="0 0 1440 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="depth" cx="78%" cy="20%" r="90%">
        <stop offset="0" stop-color="rgba(31,102,196,.30)"/>
        <stop offset="1" stop-color="rgba(31,102,196,0)"/>
      </radialGradient>
    </defs>
    <rect width="1440" height="560" fill="url(#depth)"/>
    <g stroke="rgba(220,230,236,.10)" fill="none" stroke-width="1">
      <path d="M-50 120 C 300 60, 700 180, 1100 90 S 1600 130, 1600 130"/>
      <path d="M-50 220 C 320 160, 760 280, 1140 190 S 1600 230, 1600 230"/>
      <path d="M-50 340 C 280 290, 720 400, 1180 300 S 1600 350, 1600 350"/>
      <path d="M-50 450 C 340 410, 780 520, 1220 420 S 1600 470, 1600 470"/>
    </g>
    <g stroke="rgba(220,230,236,.05)" stroke-width="1">
      <path d="M0 0 V560 M360 0 V560 M720 0 V560 M1080 0 V560 M1440 0 V560"/>
      <path d="M0 140 H1440 M0 280 H1440 M0 420 H1440"/>
    </g>
    <g font-family="'Space Mono', monospace" fill="rgba(220,230,236,.16)" font-size="12">
      <text x="240" y="200">12</text><text x="520" y="380">18</text>
      <text x="940" y="240">9</text><text x="1180" y="430">22</text><text x="640" y="120">15</text>
    </g>
    ${route}
  </svg>`;
}

/* painel "próximas saídas" — terminal de barca; JS destaca a próxima */
function departuresBoard() {
  const to24 = (s) => s.replace("h", ":").padEnd(5, "0");
  const row = (titulo, saidas) => `<div class="dep-route">
        <span class="dep-route__name">${esc(titulo)}</span>
        <ul class="dep-times">${saidas.map((s) => `<li class="dep-time" data-dep="${to24(s)}"><span>${s}</span></li>`).join("")}</ul>
      </div>`;
  return `<section class="departures" aria-label="Próximas saídas da travessia">
    <div class="wrap">
      <div class="departures__head">
        <span class="eyebrow eyebrow--light">Próximas saídas · Flex Boat</span>
        <span class="departures__note">Sujeito a clima e maré · reserve com antecedência</span>
      </div>
      <div class="departures__routes">
        ${row(TRAV.horarios.ida.titulo, TRAV.horarios.ida.saidas)}
        ${row(TRAV.horarios.volta.titulo, TRAV.horarios.volta.saidas)}
      </div>
      <a class="btn departures__cta" href="${waLink("Olá, Vou de Barco! Quero reservar a travessia. Podem me passar horários e valores?")}" target="_blank" rel="noopener">${I.whatsapp} Reservar travessia</a>
    </div>
  </section>`;
}

function compass() {
  return `<div class="compass" aria-hidden="true"><svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1"/>
    <g stroke="rgba(255,255,255,.3)" stroke-width="1"><path d="M50 4 V14 M50 86 V96 M4 50 H14 M86 50 H96"/></g>
    <text x="50" y="27" text-anchor="middle" font-family="'Space Mono',monospace" font-size="11" fill="rgba(255,255,255,.6)">N</text>
    <path d="M50 16 L57 50 L50 46 L43 50 Z" fill="var(--amarelo)"/>
    <path d="M50 84 L43 50 L50 54 L57 50 Z" fill="rgba(255,255,255,.5)"/>
    <circle cx="50" cy="50" r="3.5" fill="#fff"/>
  </svg></div>`;
}

/* diagrama horizontal da travessia (Mangaratiba ⇄ Abraão · ≈35 min) */
function routeDiagram() {
  return `<svg class="route-diagram" viewBox="0 0 520 120" role="img" aria-label="Rota da travessia: Mangaratiba a Vila do Abraão em cerca de 35 minutos">
    <text x="260" y="20" text-anchor="middle" font-family="'Space Mono',monospace" font-size="12" letter-spacing="1.5" fill="var(--amarelo)">≈ 35 MIN · RUMO 042°</text>
    <line x1="60" y1="60" x2="460" y2="60" stroke="var(--branco-22)" stroke-width="2"/>
    <line x1="60" y1="60" x2="460" y2="60" stroke="var(--amarelo)" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round"/>
    <g transform="translate(255 60)"><path d="M-11 4 H11 L8 12 H-8 Z" fill="#fff"/><path d="M0 -11 L6 2 H-6 Z" fill="var(--amarelo)"/></g>
    <g fill="var(--amarelo)"><circle cx="60" cy="60" r="8"/><circle cx="460" cy="60" r="8"/></g>
    <g fill="none" stroke="var(--amarelo)" stroke-width="1.5" opacity=".45"><circle cx="60" cy="60" r="15"/><circle cx="460" cy="60" r="15"/></g>
    <g font-family="'Space Mono',monospace" font-size="13" letter-spacing="1" fill="var(--branco)">
      <text x="60" y="100" text-anchor="middle">MANGARATIBA</text>
      <text x="460" y="100" text-anchor="middle">ABRAÃO</text>
    </g>
  </svg>`;
}

/* ============================================================
   MAPA DA ROTA (cartão da travessia)
   ============================================================ */
function routeMap() {
  return `<svg class="route-map" viewBox="0 0 520 300" role="img" aria-label="Rota da travessia: Mangaratiba até a Vila do Abraão, Ilha Grande">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="520" height="300" fill="url(#grid)" rx="14"/>
    <path d="M0 70 q60 6 120 0 t120 4 130-6 150 2 V0 H0Z" fill="rgba(31,102,196,.18)"/>
    <path d="M40 250 q70 -8 150 -2 t170 -6 160 0 V300 H40Z" fill="rgba(31,102,196,.18)"/>
    <path d="M70 95 C 200 150, 320 150, 450 200" fill="none" stroke="var(--amarelo)" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>
    <g transform="translate(70 95)"><circle r="7" fill="var(--amarelo)"/><circle r="13" fill="none" stroke="var(--amarelo)" stroke-opacity=".4" stroke-width="1.5"/></g>
    <g transform="translate(450 200)"><circle r="7" fill="var(--amarelo)"/><circle r="13" fill="none" stroke="var(--amarelo)" stroke-opacity=".4" stroke-width="1.5"/></g>
    <g transform="translate(255 168) rotate(22)" fill="var(--branco)">
      <path d="M-9 4 H9 L6 11 H-6 Z"/><path d="M0 -10 L5 2 H-5 Z"/>
    </g>
    <g font-family="'Space Mono', monospace" font-size="13" fill="var(--branco)" letter-spacing="1">
      <text x="58" y="80">MANGARATIBA</text>
      <text x="360" y="232">VILA DO ABRAÃO</text>
    </g>
    <g font-family="'Space Mono', monospace" font-size="12" fill="var(--amarelo)" letter-spacing="1">
      <text x="232" y="135">~35 MIN</text>
    </g>
  </svg>`;
}

/* ============================================================
   ONDA DIVISÓRIA  (bg = cor da seção anterior, fill = próxima)
   ============================================================ */
function wave(prevColor, nextColor, flip = false) {
  return `<div class="wave${flip ? " wave--flip" : ""}" style="background:${prevColor}">
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path fill="${nextColor}" d="M0,48 C240,116 480,4 720,44 C960,84 1200,12 1440,52 L1440,130 L0,130 Z"></path>
    </svg></div>`;
}
const C = { branco: "#FFFFFF", nevoa: "#EEF1F4", abismo: "#061A40" };

/* ============================================================
   PARTIAIS
   ============================================================ */
function head({ title, desc, canonical, type = "website" }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/assets/img/og-vou-de-barco.jpg">
<meta name="theme-color" content="#061A40">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/styles.css">`;
}

function header({ active = "", solid = false, prefix = "" } = {}) {
  const A = (href, key, label) => `<a href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<a class="skip-link" href="#main">Pular para o conteúdo</a>
<header class="site-header${solid ? " header--solid is-scrolled" : ""}">
  <div class="wrap">
    <a class="brand" href="${prefix}index.html" aria-label="Vou de Barco — início">${I.mark}<span>Vou de Barco</span></a>
    <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav">${I.menu}</button>
    <nav class="nav" id="nav" aria-label="Principal">
      ${A(`${prefix}index.html#inicio`, "inicio", "Início")}
      ${A(`${prefix}index.html#travessia`, "travessia", "Travessia")}
      ${A(`${prefix}index.html#passeios`, "passeios", "Passeios")}
      ${A(`${prefix}index.html#sobre`, "sobre", "Sobre")}
      ${A(`${prefix}index.html#contato`, "contato", "Contato")}
      <a class="btn nav-cta" href="${waLink("Olá, Vou de Barco! Quero reservar.")}" target="_blank" rel="noopener">${I.whatsapp} Reservar</a>
    </nav>
  </div>
</header>`;
}

function waFloat() {
  return `<a class="wa-float" href="${waLink("Olá, Vou de Barco! Quero reservar.")}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
    ${I.whatsapp}<span class="label">Reservar no WhatsApp</span></a>`;
}

function footer({ prefix = "" } = {}) {
  const links = PASSEIOS.map((p) => `<a href="${prefix}passeios/${p.id}.html">${esc(p.nome)}</a>`).join("\n      ");
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer__top">
      <div class="footer__brand">
        <a class="brand" href="${prefix}index.html">${I.mark}<span>Vou de Barco</span></a>
        <p>Travessia e passeios de barco em Ilha Grande e Mangaratiba. Frota e tripulação próprias, segurança em primeiro lugar.</p>
      </div>
      <div class="footer__col">
        <h5>Navegue</h5>
        <a href="${prefix}index.html#passeios">Passeios</a>
        <a href="${prefix}travessia.html">Travessia</a>
        <a href="${prefix}index.html#sobre">Sobre</a>
        <a href="${prefix}index.html#contato">Contato</a>
      </div>
      <div class="footer__col">
        <h5>Passeios</h5>
        ${links}
      </div>
    </div>
    <div class="footer__bottom">
      <span>Vou de Barco — Travessia e passeios de barco em Ilha Grande e Mangaratiba. © 2026.</span>
      <span>
        <a href="${IG}" target="_blank" rel="noopener">@voudebarco</a> ·
        <a href="${waLink("Olá, Vou de Barco!")}" target="_blank" rel="noopener">WhatsApp (24) 97403-1431</a>
      </span>
    </div>
  </div>
</footer>`;
}

const scripts = (prefix = "") => `<script src="${prefix}assets/js/main.js" defer></script>`;

/* ============================================================
   COMPONENTES DE CONTEÚDO
   ============================================================ */
function tourCard(p, prefix = "") {
  return `<article class="tour reveal">
  <div class="tour__media">
    <span class="tour__badge">${esc(p.badge)}</span>
    <img src="${prefix}${p.img}" alt="Passeio ${esc(p.nome)} — Ilha Grande" loading="lazy" width="640" height="480">
  </div>
  <div class="tour__body">
    <h3 class="tour__name">${esc(p.nome)}</h3>
    <p class="tour__slogan">${esc(p.slogan)}</p>
    <div class="tour__meta">
      <span class="chip">${I.clock}${esc(p.duracao)}</span>
      <span class="chip">${esc(p.embarcacao)}</span>
    </div>
    <a class="tour__link" href="${prefix}passeios/${p.id}.html">Ver roteiro ${I.arrow}</a>
  </div>
  <a class="tour__stretch" href="${prefix}passeios/${p.id}.html" aria-label="Ver roteiro do ${esc(p.nome)}"></a>
</article>`;
}

const FAQ = [
  ["Travessia", "Qual é a rota e quanto tempo dura?", "Fazemos a travessia entre Mangaratiba e a Vila do Abraão, na Ilha Grande, em Flex Boat. O trajeto leva cerca de 35 minutos. Mangaratiba é o ponto mais próximo do Rio de Janeiro."],
  ["Travessia", "Quais são os horários?", "Saídas de Mangaratiba para Abraão: 09h00, 13h30 e 16h30. Saídas de Abraão para Mangaratiba: 10h00, 14h00 e 17h15. Recomendamos chegar ao cais com antecedência."],
  ["Travessia", "Posso comprar só ida, só volta ou ida e volta? E a bagagem?", "Você escolhe ida, volta ou ida e volta. A passagem inclui o transporte de bagagem padrão. Para grupos ou bagagem extra, fale com a gente pelo WhatsApp."],
  ["Passeio", "O que está incluso?", "Todos os passeios incluem água mineral, cooler com gelo, flutuadores, coletes salva-vidas e o suporte da nossa equipe a bordo do início ao fim."],
  ["Passeio", "Acontece com chuva? Depende da maré?", "A operação depende das condições de clima e maré, sempre pensando na sua segurança. Em dias ruins, podemos ajustar paradas ou remarcar. A confirmação é feita com você pelo WhatsApp."],
  ["Empresa", "Quem é a Vou de Barco?", "Somos uma operação náutica com frota e tripulação próprias, pioneira na travessia de Flex Boat por Mangaratiba. Levamos segurança e qualidade a sério: embarcações revisadas, motor em dia e coletes para todos a bordo."],
];

function faqBlock() {
  return FAQ.map(([cat, q, a]) => `<details class="faq__item reveal">
  <summary class="faq__q"><span><span class="faq__cat">${esc(cat)}</span>${esc(q)}</span><span class="faq__icon" aria-hidden="true"></span></summary>
  <p class="faq__a">${esc(a)}</p>
</details>`).join("\n");
}

/* JSON-LD */
function ldOrg() {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "TravelAgency", "@id": SITE + "/#business",
    name: "Vou de Barco", url: SITE,
    image: SITE + "/assets/img/og-vou-de-barco.jpg", logo: SITE + "/favicon.svg",
    description: "Operação náutica com frota própria. Travessia de Flex Boat por Mangaratiba e passeios de barco em Ilha Grande e na Costa Verde.",
    telephone: "+55-24-97403-1431", knowsLanguage: "pt-BR",
    areaServed: [
      { "@type": "Place", name: "Ilha Grande" }, { "@type": "Place", name: "Mangaratiba" },
      { "@type": "Place", name: "Angra dos Reis" }, { "@type": "Place", name: "Costa Verde, Rio de Janeiro" },
    ],
    sameAs: [IG],
    address: { "@type": "PostalAddress", streetAddress: "Av. Célio Lopes, 100 — Centro", addressLocality: "Mangaratiba", addressRegion: "RJ", addressCountry: "BR" },
    geo: { "@type": "GeoCoordinates", latitude: -22.9601, longitude: -44.0407 },
    location: [
      { "@type": "Place", name: "Agência Mangaratiba", address: { "@type": "PostalAddress", streetAddress: "Av. Célio Lopes, 100 — Centro", addressLocality: "Mangaratiba", addressRegion: "RJ", addressCountry: "BR" }, geo: { "@type": "GeoCoordinates", latitude: -22.9601, longitude: -44.0407 } },
      { "@type": "Place", name: "Agência Vila do Abraão", address: { "@type": "PostalAddress", streetAddress: "Rua da Praia, s/n — em frente ao cais da barca", addressLocality: "Vila do Abraão, Ilha Grande", addressRegion: "RJ", addressCountry: "BR" }, geo: { "@type": "GeoCoordinates", latitude: -23.1385, longitude: -44.1717 } },
    ],
  })}</script>`;
}
function ldBreadcrumb(items) {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  })}</script>`;
}
function ldFaq() {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: FAQ.map(([, q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  })}</script>`;
}

/* ============================================================
   PÁGINA: INDEX
   ============================================================ */
function buildIndex() {
  const heroMsg = "Olá, Vou de Barco! Quero reservar.";
  return `${head({ title: "Vou de Barco — Travessia Mangaratiba ⇄ Ilha Grande e passeios de barco", desc: "Travessia rápida de Flex Boat entre Mangaratiba e a Ilha Grande (~35 min) e passeios de barco pela Costa Verde. Frota própria, saída da Vila do Abraão. Reserve pelo WhatsApp.", canonical: `${SITE}/` })}
${ldOrg()}
${ldFaq()}
</head>
<body>
${header({ active: "inicio" })}
<main id="main">

  <!-- HERO -->
  <section class="hero" id="inicio">
    <div class="hero__chart">${chartBg(false)}</div>
    ${compass()}
    <div class="wrap">
      <div class="hero__inner">
        <span class="eyebrow eyebrow--light">Mangaratiba ⇄ Ilha Grande · Flex Boat</span>
        <h1>Ilha Grande <span class="accent">começa aqui.</span></h1>
        <p class="hero__sub">Travessia rápida de Flex Boat por Mangaratiba e passeios pelos cenários mais bonitos da Costa Verde. Frota própria, marinheiros experientes e segurança em primeiro lugar.</p>
        <div class="hero__actions">
          <a class="btn" href="${waLink(heroMsg)}" target="_blank" rel="noopener">${I.whatsapp} Reservar pelo WhatsApp</a>
          <a class="btn btn--ghost" href="#travessia">Ver travessia</a>
          <a class="btn btn--ghost" href="#passeios">Ver passeios</a>
        </div>
      </div>
    </div>
    <div class="hero__readout" aria-hidden="true">
      ROTA PIONEIRA<br><b>MANGARATIBA → ABRAÃO</b><br>≈ 35 MIN · FLEX BOAT
    </div>
  </section>

  ${departuresBoard()}

  <!-- SELOS / PAINEL DE CONFIANÇA -->
  <section class="trust" aria-label="Por que a Vou de Barco">
    <div class="wrap">
      <div class="trust__item">${I.compass}<span><b>Pioneiros no Flex Boat por Mangaratiba</b>, o ponto mais próximo do Rio.</span></div>
      <div class="trust__item">${I.shield}<span><b>Frota própria, revisada</b> e com coletes para todos a bordo.</span></div>
      <div class="trust__item">${I.heart}<span><b>Atendimento que cuida de você</b> do cais até o destino.</span></div>
    </div>
  </section>

  ${wave(C.abismo, C.nevoa)}

  <!-- TRAVESSIA -->
  <section class="section section--nevoa" id="travessia">
    <div class="wrap">
      <div class="section__head reveal">
        <span class="eyebrow eyebrow--wp">A rota pioneira</span>
        <h2 class="section-title">Do Rio à ilha, em cerca de 35 minutos.</h2>
        <p class="lead">${esc(TRAV.slogan)} Mangaratiba é o ponto mais próximo do Rio de Janeiro — e fomos os primeiros a fazer a travessia de Flex Boat por aqui.</p>
      </div>
      <div class="crossing">
        <div class="cross-card cross-card--dark reveal">
          ${routeDiagram()}
          <div class="cross-embark">
            <div class="embark-item">${I.pin}<div><span class="k">Embarque</span><b>${esc(TRAV.embarque.local)}</b><span class="d">${esc(TRAV.embarque.detalhe)}</span></div></div>
            <div class="embark-item">${I.anchor}<div><span class="k">Desembarque</span><b>${esc(TRAV.desembarque.local)}</b><span class="d">${esc(TRAV.desembarque.detalhe)}</span></div></div>
            <div class="embark-item">${I.boat}<div><span class="k">Embarcação · bilhetes</span><b>${esc(TRAV.embarcacao)}</b><span class="d">${TRAV.bilhetes.join(" · ")}</span></div></div>
          </div>
        </div>
        <div class="cross-card cross-card--horarios reveal" data-d="1">
          <span class="eyebrow">${I.clock} Horários de saída</span>
          <div class="horarios">
            <div class="horarios__col">
              <h4>${esc(TRAV.horarios.ida.titulo)}</h4>
              <ul>${TRAV.horarios.ida.saidas.map((s) => `<li class="time">${s}</li>`).join("")}</ul>
            </div>
            <div class="horarios__col">
              <h4>${esc(TRAV.horarios.volta.titulo)}</h4>
              <ul>${TRAV.horarios.volta.saidas.map((s) => `<li class="time">${s}</li>`).join("")}</ul>
            </div>
          </div>
          <p class="horarios__meta">Chegue ao cais com antecedência. Horários sujeitos a clima e maré. <b>Preço sob consulta.</b></p>
          <div class="horarios__cta">
            <a class="btn" href="${waLink("Olá, Vou de Barco! Quero informações da travessia Mangaratiba ⇄ Ilha Grande (horários, bilhetes e valores).")}" target="_blank" rel="noopener">${I.whatsapp} Reservar no WhatsApp</a>
            <a class="btn btn--outline" href="travessia.html">Ver detalhes ${I.arrow}</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${wave(C.nevoa, C.branco, true)}

  <!-- PASSEIOS -->
  <section class="section section--branco" id="passeios">
    <div class="wrap">
      <div class="section__head">
        <span class="eyebrow">Roteiros · Costa Verde</span>
        <h2 class="section-title">Cinco rumos para conhecer o melhor da ilha.</h2>
        <p class="lead">Cada passeio inclui água mineral, cooler com gelo, flutuadores, coletes e o suporte da nossa equipe a bordo. Saída pela Vila do Abraão. Preços sob consulta.</p>
      </div>
      <div class="tours">
        ${PASSEIOS.map((p) => tourCard(p)).join("\n        ")}
      </div>
    </div>
  </section>

  ${wave(C.branco, C.nevoa)}

  <!-- SOBRE -->
  <section class="section section--nevoa" id="sobre">
    <div class="wrap">
      <div class="about">
        <div class="about__copy reveal">
          <span class="eyebrow">Sobre a Vou de Barco</span>
          <h2 class="section-title">Nascemos para resolver um problema real.</h2>
          <p>A Vou de Barco é uma operação náutica com frota e tripulação próprias, dedicada a levar você até a Ilha Grande e a mostrar o melhor da Costa Verde no mar. Nascemos para resolver um problema real: chegar à Ilha mais rápido e confortável para quem vem do Rio.</p>
          <p>Mangaratiba é o ponto mais próximo, mas ninguém fazia a travessia de Flex Boat por ali. Encaramos o desafio com marinheiros experientes e embarcação preparada, e nos tornamos pioneiros nessa rota, hoje consolidada e referência na região. Levamos segurança e qualidade a sério: embarcações revisadas, motor em dia e coletes para todos a bordo.</p>
        </div>
        <div class="diffs reveal" data-d="1">
          <div class="diff">${I.compass}<h4>Pioneiros no Flex Boat por Mangaratiba</h4></div>
          <div class="diff">${I.anchor}<h4>Frota própria e revisada</h4></div>
          <div class="diff">${I.heart}<h4>Marinheiros experientes e atendimento acolhedor</h4></div>
          <div class="diff">${I.boat}<h4>Passeios e travessia para todos os perfis</h4></div>
        </div>
      </div>
    </div>
  </section>

  ${wave(C.nevoa, C.branco, true)}

  <!-- FAQ -->
  <section class="section section--branco" id="faq">
    <div class="wrap">
      <div class="section__head center">
        <span class="eyebrow">Perguntas frequentes</span>
        <h2 class="section-title">Tudo o que você precisa saber antes de embarcar.</h2>
      </div>
      <div class="faq">
        ${faqBlock()}
      </div>
    </div>
  </section>

  ${wave(C.branco, C.abismo, true)}

  <!-- CONTATO -->
  <section class="section section--abismo" id="contato">
    <div class="wrap">
      <div class="contact">
        <div class="contact__aside reveal">
          <span class="eyebrow eyebrow--light">Reserve com a gente</span>
          <h2>Conte seu plano. A gente cuida do mar.</h2>
          <p class="lead">Preencha e a gente continua o atendimento pelo WhatsApp, com disponibilidade e valores para a sua data.</p>
          <div class="contact__channels">
            <div class="channel">${I.whatsapp}<span><b>WhatsApp</b><a href="${waLink("Olá, Vou de Barco!")}" target="_blank" rel="noopener">(24) 97403-1431</a></span></div>
            <div class="channel">${I.instagram}<span><b>Instagram</b><a href="${IG}" target="_blank" rel="noopener">@voudebarco</a></span></div>
            <div class="channel">${I.pin}<span><b>Mangaratiba</b><span>Av. Célio Lopes, 100 — Centro</span></span></div>
            <div class="channel">${I.pin}<span><b>Vila do Abraão (Ilha Grande)</b><span>Rua da Praia, s/n — em frente ao cais da barca</span></span></div>
          </div>
        </div>
        <form class="form reveal" data-d="1" data-wa-form>
          <div class="form__grid">
            <div class="field field--full">
              <label for="f-nome">Nome</label>
              <input id="f-nome" name="nome" type="text" autocomplete="name" placeholder="Seu nome" required>
            </div>
            <div class="field">
              <label for="f-wpp">WhatsApp</label>
              <input id="f-wpp" name="whatsapp" type="tel" autocomplete="tel" placeholder="(00) 00000-0000" required>
            </div>
            <div class="field">
              <label for="f-data">Data desejada</label>
              <input id="f-data" name="data" type="date">
            </div>
            <div class="field">
              <label for="f-pessoas">Nº de pessoas</label>
              <input id="f-pessoas" name="pessoas" type="number" min="1" inputmode="numeric" placeholder="2">
            </div>
            <div class="field">
              <label for="f-interesse">Interesse</label>
              <select id="f-interesse" name="interesse">
                <option value="Travessia Mangaratiba ⇄ Abraão">Travessia Mangaratiba ⇄ Abraão</option>
                ${PASSEIOS.map((p) => `<option value="Passeio ${esc(p.nome)}">Passeio ${esc(p.nome)}</option>`).join("\n                ")}
                <option value="Ainda não sei / quero ajuda">Ainda não sei / quero ajuda</option>
              </select>
            </div>
          </div>
          <button class="btn" type="submit">${I.whatsapp} Enviar pelo WhatsApp</button>
          <p class="form__note">Ao enviar, abrimos uma conversa no WhatsApp com os seus dados preenchidos. Sem compromisso.</p>
        </form>
      </div>
    </div>
  </section>

</main>
${footer()}
${waFloat()}
${scripts()}
</body>
</html>`;
}

/* ============================================================
   PÁGINA: PASSEIO
   ============================================================ */
function buildPasseio(p) {
  const msg = `Olá, Vou de Barco! Tenho interesse no passeio ${p.nome}. Pode me passar disponibilidade e valores?`;
  const incl = ["Água mineral", "Cooler com gelo", "Flutuadores", "Coletes salva-vidas", "Suporte da equipe a bordo"];
  const outros = PASSEIOS.filter((x) => x.id !== p.id);
  return `${head({ title: p.seo_title, desc: p.seo_desc, canonical: `${SITE}/passeios/${p.id}.html`, type: "article" })}
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "TouristTrip", name: p.nome, description: p.descricao || p.resumo,
    touristType: p.para_quem, provider: { "@type": "TravelAgency", name: "Vou de Barco", url: SITE, "@id": SITE + "/#business" },
    image: SITE + "/" + p.img, itinerary: { "@type": "ItemList", itemListElement: p.paradas.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s })) },
  })}</script>
${ldBreadcrumb([{ name: "Início", url: SITE + "/" }, { name: "Passeios", url: SITE + "/#passeios" }, { name: p.nome, url: `${SITE}/passeios/${p.id}.html` }])}
</head>
<body>
${header({ active: "passeios", solid: true, prefix: "../" })}
<main id="main">

  <section class="subhero">
    <div class="subhero__chart">${chartBg(false)}</div>
    <div class="wrap">
      <nav class="crumbs" aria-label="Trilha"><a href="../index.html">Início</a> · <a href="../index.html#passeios">Passeios</a> · ${esc(p.nome)}</nav>
      <span class="eyebrow eyebrow--light">${esc(p.badge)} · Saída pela ${esc(p.saida)}</span>
      <h1>${esc(p.nome)}</h1>
      <p class="subhero__slogan">${esc(p.slogan)}</p>
      <div class="subhero__meta">
        <span class="chip">${I.clock}${esc(p.duracao)}</span>
        <span class="chip">${esc(p.embarcacao)}</span>
        <span class="chip">${I.pin}${esc(p.saida)}</span>
      </div>
    </div>
  </section>

  <section class="section section--branco">
    <div class="wrap">
      <div class="detail">
        <div class="detail__main">
          <h2>Sobre o passeio</h2>
          <p>${esc(p.descricao || p.resumo)}</p>
${p.pontos_fortes ? `
          <h2>Por que vale a pena</h2>
          <ul class="strong-list">
            ${p.pontos_fortes.map((x) => `<li>${I.check}<span>${esc(x)}</span></li>`).join("\n            ")}
          </ul>
` : ""}
          <h2>Roteiro do dia</h2>
          <div class="stops">
            ${p.cronograma ? `<div class="stop stop--time"><span class="n">${esc(p.cronograma.checkin)}</span><span class="name">Check-in na nossa agência</span></div>
            <div class="stop stop--time"><span class="n">${esc(p.cronograma.saida)}</span><span class="name">Saída do passeio</span></div>` : ""}
            ${p.paradas.map((s) => `<div class="stop"><span class="n">→</span><span class="name">${esc(s)}</span></div>`).join("\n            ")}
            ${p.cronograma ? `<div class="stop stop--time"><span class="n">${esc(p.cronograma.desembarque)}</span><span class="name">Desembarque na Vila do Abraão</span></div>` : ""}
          </div>
          <p class="detail__note">O roteiro pode sofrer alterações para a melhor experiência e a segurança a bordo.</p>

          <h2>Está incluso</h2>
          <ul class="included">
            ${incl.map((x) => `<li>${I.check}${esc(x)}</li>`).join("\n            ")}
          </ul>

          <h2>Para quem é</h2>
          <p>${esc(p.para_quem)}</p>
        </div>

        <aside class="booking-card">
          <h3>Reservar este passeio</h3>
          <p class="price-note">Preço sob consulta</p>
          <ul class="spec-list">
            <li><span class="k">Duração</span><span class="v">${esc(p.duracao)}</span></li>
            <li><span class="k">Embarcação</span><span class="v">${esc(p.embarcacao)}</span></li>
            <li><span class="k">Saída</span><span class="v">${esc(p.saida)}</span></li>
          </ul>
          <a class="btn" href="${waLink(msg)}" target="_blank" rel="noopener">${I.whatsapp} Reservar no WhatsApp</a>
          <a class="back" href="../index.html#passeios">${I.arrowL} Ver todos os passeios</a>
        </aside>
      </div>
    </div>
  </section>

  ${wave(C.branco, C.nevoa)}

  <section class="section section--nevoa">
    <div class="wrap">
      <div class="section__head"><span class="eyebrow">Continue navegando</span><h2 class="section-title">Outros roteiros</h2></div>
      <div class="tours">
        ${outros.map((x) => tourCard(x, "../")).join("\n        ")}
      </div>
    </div>
  </section>

</main>
${footer({ prefix: "../" })}
${waFloat()}
${scripts("../")}
</body>
</html>`;
}

/* ============================================================
   PÁGINA: TRAVESSIA
   ============================================================ */
function buildTravessia() {
  const msg = "Olá, Vou de Barco! Quero informações da travessia Mangaratiba ⇄ Ilha Grande (horários, bilhetes e valores).";
  return `${head({ title: TRAV.seo_title, desc: TRAV.seo_desc, canonical: `${SITE}/travessia.html` })}
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "Service", serviceType: "Travessia de barco (Flex Boat)",
    name: "Travessia Mangaratiba ⇄ Vila do Abraão (Ilha Grande)",
    description: "Travessia rápida de Flex Boat entre Mangaratiba e a Vila do Abraão, na Ilha Grande, em cerca de 35 minutos.",
    provider: { "@type": "TravelAgency", name: "Vou de Barco", url: SITE, "@id": SITE + "/#business" },
    areaServed: [{ "@type": "Place", name: "Mangaratiba" }, { "@type": "Place", name: "Ilha Grande" }],
  })}</script>
${ldBreadcrumb([{ name: "Início", url: SITE + "/" }, { name: "Travessia", url: SITE + "/travessia.html" }])}
</head>
<body>
${header({ active: "travessia", solid: true })}
<main id="main">

  <section class="subhero">
    <div class="subhero__chart">${chartBg(true)}</div>
    <div class="wrap">
      <nav class="crumbs" aria-label="Trilha"><a href="index.html">Início</a> · Travessia</nav>
      <span class="eyebrow eyebrow--light">Rota pioneira · Flex Boat</span>
      <h1>Travessia Mangaratiba ⇄ Ilha Grande</h1>
      <p class="subhero__slogan">${esc(TRAV.slogan)}</p>
      <div class="subhero__meta">
        <span class="chip">${I.clock}${esc(TRAV.tempo)}</span>
        <span class="chip">${esc(TRAV.embarcacao)}</span>
        <span class="chip">${I.pin}Mangaratiba ⇄ Abraão</span>
      </div>
    </div>
  </section>

  <section class="section section--branco">
    <div class="wrap">
      <div class="detail">
        <div class="detail__main">
          <h2>A rota mais próxima do Rio</h2>
          <p>Fazemos a travessia entre Mangaratiba e a Vila do Abraão, na Ilha Grande, em Flex Boat — cerca de 35 minutos de mar. Mangaratiba é o ponto mais próximo do Rio de Janeiro e tem estacionamento em conta, o que torna a viagem mais rápida e tranquila para quem vem da cidade. Fomos pioneiros nessa rota e hoje ela é referência na região.</p>

          <h2>Horários</h2>
          <div class="travessia__times" style="background:var(--bruma)">
            <div style="background:var(--nevoa)"><h4 style="color:var(--cobalto)">${esc(TRAV.horarios.ida.titulo)}</h4><ul>${TRAV.horarios.ida.saidas.map((s) => `<li style="background:var(--cobalto-12);color:var(--cobalto)">${s}</li>`).join("")}</ul></div>
            <div style="background:var(--nevoa)"><h4 style="color:var(--cobalto)">${esc(TRAV.horarios.volta.titulo)}</h4><ul>${TRAV.horarios.volta.saidas.map((s) => `<li style="background:var(--cobalto-12);color:var(--cobalto)">${s}</li>`).join("")}</ul></div>
          </div>
          <p style="margin-top:1rem;font-size:.95rem;color:var(--abismo-60)">Recomendamos chegar ao cais com antecedência. Horários sujeitos às condições de clima e maré.</p>

          <h2>Bilhetes e bagagem</h2>
          <p>Você escolhe <strong>ida</strong>, <strong>volta</strong> ou <strong>ida e volta</strong>. A passagem inclui o transporte de bagagem padrão. Para grupos ou bagagem extra, fale com a gente pelo WhatsApp.</p>

          <h2>Está incluso</h2>
          <ul class="included">
            ${TRAV.incluso.map((x) => `<li>${I.check}${esc(x)}</li>`).join("\n            ")}
          </ul>
        </div>

        <aside class="booking-card">
          <h3>Reservar a travessia</h3>
          <p class="price-note">Preço sob consulta</p>
          <ul class="spec-list">
            <li><span class="k">Rota</span><span class="v">Mangaratiba ⇄ Abraão</span></li>
            <li><span class="k">Embarcação</span><span class="v">${esc(TRAV.embarcacao)}</span></li>
            <li><span class="k">Tempo</span><span class="v">${esc(TRAV.tempo)}</span></li>
            <li><span class="k">Bilhetes</span><span class="v">${TRAV.bilhetes.join(" · ")}</span></li>
          </ul>
          <a class="btn" href="${waLink(msg)}" target="_blank" rel="noopener">${I.whatsapp} Reservar no WhatsApp</a>
          <a class="back" href="index.html">${I.arrowL} Voltar ao início</a>
        </aside>
      </div>
    </div>
  </section>

  ${wave(C.branco, C.nevoa)}

  <section class="section section--nevoa">
    <div class="wrap">
      <div class="section__head"><span class="eyebrow">Depois de chegar</span><h2 class="section-title">Conheça a ilha pelo mar</h2></div>
      <div class="tours">
        ${PASSEIOS.slice(0, 3).map((x) => tourCard(x)).join("\n        ")}
      </div>
    </div>
  </section>

</main>
${footer()}
${waFloat()}
${scripts()}
</body>
</html>`;
}

/* ============================================================
   PLACEHOLDERS DE IMAGEM (SVG carta náutica) — até as fotos reais
   ============================================================ */
function placeholder(p, i) {
  const tints = ["#0c2e62", "#103a86", "#0a2350", "#12407a", "#0e3468"];
  const bg = tints[i % tints.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="640" height="480" role="img" aria-label="${esc(p.nome)}">
  <defs><radialGradient id="g${i}" cx="70%" cy="25%" r="90%"><stop offset="0" stop-color="#1F66C4"/><stop offset="1" stop-color="${bg}"/></radialGradient></defs>
  <rect width="640" height="480" fill="url(#g${i})"/>
  <g stroke="rgba(255,255,255,.10)" fill="none" stroke-width="1">
    <path d="M-20 120 C 140 80 320 170 480 110 S 700 140 700 140"/>
    <path d="M-20 230 C 160 190 340 280 500 220 S 700 250 700 250"/>
    <path d="M-20 350 C 150 310 330 400 520 330 S 700 370 700 370"/>
  </g>
  <path d="M60 380 C 200 300 360 300 540 360" stroke="#FFCA1E" stroke-width="2.5" stroke-dasharray="2 8" fill="none" stroke-linecap="round"/>
  <circle cx="60" cy="380" r="6" fill="#FFCA1E"/><circle cx="540" cy="360" r="6" fill="#FFCA1E"/>
  <text x="40" y="70" font-family="'Space Mono', monospace" font-size="15" letter-spacing="2" fill="rgba(255,255,255,.55)">${esc(p.badge)}</text>
  <text x="40" y="440" font-family="'Bricolage Grotesque','Arial Narrow',sans-serif" font-size="34" font-weight="800" fill="#FFFFFF">${esc(p.nome)}</text>
  <text x="600" y="440" text-anchor="end" font-family="'Space Mono', monospace" font-size="13" fill="rgba(255,255,255,.4)">FOTO EM BREVE</text>
</svg>`;
}

/* favicon */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#061A40"/><path d="M5 20c2.4 1.7 4 1.7 6.2 0 2.2-1.7 3.8-1.7 6 0 2.2 1.7 3.8 1.7 6 0" fill="none" stroke="#FFCA1E" stroke-width="2.2" stroke-linecap="round"/><path d="M16 5 22 14H10l6-9Z" fill="#fff"/><path d="M16 8v10" stroke="#FFCA1E" stroke-width="1.6" stroke-linecap="round"/></svg>`;

/* ============================================================
   ESCREVER TUDO
   ============================================================ */
/* sitemap + robots */
const urls = [`${SITE}/`, `${SITE}/travessia.html`, ...PASSEIOS.map((p) => `${SITE}/passeios/${p.id}.html`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>${u === SITE + "/" ? "1.0" : "0.8"}</priority></url>`).join("\n")}
</urlset>`;
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;

write("index.html", buildIndex());
write("travessia.html", buildTravessia());
PASSEIOS.forEach((p) => write(`passeios/${p.id}.html`, buildPasseio(p)));
PASSEIOS.forEach((p, i) => write(p.img, placeholder(p, i)));
write("favicon.svg", favicon);
write("sitemap.xml", sitemap);
write("robots.txt", robots);

console.log("✓ index.html");
console.log("✓ travessia.html");
PASSEIOS.forEach((p) => console.log(`✓ passeios/${p.id}.html`));
console.log(`✓ ${PASSEIOS.length} placeholders SVG + favicon.svg`);
console.log("✓ sitemap.xml + robots.txt");
console.log("\nPronto. Abra index.html no navegador.");
