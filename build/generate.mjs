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
const BLOG = JSON.parse(read("data/blog.json"));

/* ---- Constantes da marca ---- */
const WA = "5524974031431";
const GA4 = "G-5MZXPPJKSF"; // GA4 "Vou de Barco" (propriedade sob a conta Ilha Tour), fluxo web voudebarco.com.
const SITE = "https://voudebarco.com";
const IG = "https://instagram.com/voudebarco";
const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ============================================================
   ÍCONES (inline SVG, currentColor)
   ============================================================ */
const I = {
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411z"/></svg>`,
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
      <text x="700" y="300" fill="var(--amarelo)" opacity=".85">40 MIN · FLEX BOAT</text>
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

/* diagrama horizontal da travessia (Mangaratiba ⇄ Abraão · ≈40 min) */
function routeDiagram() {
  return `<svg class="route-diagram" viewBox="0 0 520 120" role="img" aria-label="Rota da travessia: Mangaratiba a Vila do Abraão em cerca de 40 minutos">
    <text x="260" y="20" text-anchor="middle" font-family="'Space Mono',monospace" font-size="12" letter-spacing="1.5" fill="var(--amarelo)">≈ 40 MIN · RUMO 042°</text>
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
      <text x="232" y="135">~40 MIN</text>
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
<link rel="stylesheet" href="/assets/css/styles.css">${GA4 ? `
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4}');</script>` : ""}`;
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
      ${A(`${prefix}como-chegar.html`, "comochegar", "Como chegar")}
      ${A(`${prefix}passeios-ilha-grande.html`, "passeios", "Passeios")}
      ${A(`${prefix}blog.html`, "blog", "Blog")}
      ${A(`${prefix}sobre.html`, "sobre", "Sobre")}
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
        <address class="footer__nap">
          ${I.pin}<span>Av. Célio Lopes, 89 — Centro, Mangaratiba/RJ</span><br>
          ${I.whatsapp}<a href="${waLink("Olá, Vou de Barco!")}" target="_blank" rel="noopener">(24) 97403-1431</a>
        </address>
      </div>
      <div class="footer__col">
        <h5>Navegue</h5>
        <a href="${prefix}travessia.html">Travessia</a>
        <a href="${prefix}passeios-ilha-grande.html">Passeios em Ilha Grande</a>
        <a href="${prefix}mangaratiba.html">Mangaratiba ⇄ Ilha Grande</a>
        <a href="${prefix}como-chegar.html">Como chegar</a>
        <a href="${prefix}blog.html">Blog</a>
        <a href="${prefix}sobre.html">Sobre</a>
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
  ["Travessia", "Qual é a rota e quanto tempo dura?", "Fazemos a travessia entre Mangaratiba e a Vila do Abraão, na Ilha Grande, em Flex Boat. O trajeto leva cerca de 40 minutos. Mangaratiba é o ponto mais próximo do Rio de Janeiro."],
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
    address: { "@type": "PostalAddress", streetAddress: "Av. Célio Lopes, 89 — Centro", addressLocality: "Mangaratiba", addressRegion: "RJ", addressCountry: "BR" },
    geo: { "@type": "GeoCoordinates", latitude: -22.9601, longitude: -44.0407 },
    location: [
      { "@type": "Place", name: "Agência Mangaratiba", address: { "@type": "PostalAddress", streetAddress: "Av. Célio Lopes, 89 — Centro", addressLocality: "Mangaratiba", addressRegion: "RJ", addressCountry: "BR" }, geo: { "@type": "GeoCoordinates", latitude: -22.9601, longitude: -44.0407 } },
      { "@type": "Place", name: "Agência Vila do Abraão", address: { "@type": "PostalAddress", streetAddress: "Rua da Praia, s/n — em frente ao cais da barca", addressLocality: "Vila do Abraão, Ilha Grande", addressRegion: "RJ", addressCountry: "BR" }, geo: { "@type": "GeoCoordinates", latitude: -23.1385, longitude: -44.1717 } },
    ],
    slogan: "Ilha Grande começa aqui.",
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.5", reviewCount: "39", bestRating: "5", worstRating: "1" },
    hasOfferCatalog: {
      "@type": "OfferCatalog", name: "Travessia e passeios de barco em Ilha Grande",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Travessia Mangaratiba ⇄ Ilha Grande (Flex Boat)", url: SITE + "/travessia.html" } },
        ...PASSEIOS.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "TouristTrip", name: `Passeio ${p.nome}`, url: `${SITE}/passeios/${p.id}.html` } })),
      ],
    },
  })}</script>`;
}
function ldWebsite() {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "WebSite", "@id": SITE + "/#website",
    name: "Vou de Barco", url: SITE, inLanguage: "pt-BR",
    publisher: { "@id": SITE + "/#business" },
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
  return `${head({ title: "Vou de Barco — Travessia Mangaratiba ⇄ Ilha Grande e passeios de barco", desc: "Travessia rápida de Flex Boat entre Mangaratiba e a Ilha Grande (~40 min) e passeios de barco pela Costa Verde. Frota própria, saída da Vila do Abraão. Reserve pelo WhatsApp.", canonical: `${SITE}/` })}
${ldOrg()}
${ldWebsite()}
${ldFaq()}
</head>
<body>
${header({ active: "inicio" })}
<main id="main">

  <!-- HERO -->
  <section class="hero" id="inicio">
    <div class="hero__bg"><img src="assets/img/hero-praia.jpg" alt="Águas cristalinas de Ilha Grande, na Costa Verde" width="1080" height="1116" fetchpriority="high"></div>
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
        <a class="hero__reviews" href="https://www.google.com/maps/search/?api=1&query=Vou%20de%20Barco%20Mangaratiba" target="_blank" rel="noopener" aria-label="4,5 estrelas com 39 avaliações no Google">
          <span class="stars" aria-hidden="true">★★★★★</span><b>4,5</b><span>· 39 avaliações no Google</span>
        </a>
      </div>
    </div>
    <div class="hero__readout" aria-hidden="true">
      ROTA PIONEIRA<br><b>MANGARATIBA → ABRAÃO</b><br>≈ 40 MIN · FLEX BOAT
    </div>
  </section>

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
        <h2 class="section-title">Do Rio à ilha, em cerca de 40 minutos.</h2>
        <p class="lead">${esc(TRAV.slogan)} Mangaratiba é o ponto mais próximo do Rio de Janeiro — e fomos os primeiros a fazer a travessia de Flex Boat por aqui.</p>
      </div>
      <div class="crossing">
        <div class="cross-card cross-card--dark reveal">
          <div class="cross-photo"><img src="${TRAV.img}" alt="Flex Boat da Vou de Barco na travessia para a Ilha Grande" loading="lazy" width="1080" height="1115"></div>
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
              <ul>${TRAV.horarios.ida.saidas.map((s) => `<li class="time" data-dep="${s.replace("h", ":")}">${s}</li>`).join("")}</ul>
            </div>
            <div class="horarios__col">
              <h4>${esc(TRAV.horarios.volta.titulo)}</h4>
              <ul>${TRAV.horarios.volta.saidas.map((s) => `<li class="time" data-dep="${s.replace("h", ":")}">${s}</li>`).join("")}</ul>
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
        <h2 class="section-title">Passeios de barco pelos melhores cantos da ilha.</h2>
        <p class="lead">Seis roteiros de <strong>passeio de barco e de lancha em Ilha Grande</strong> e Angra. Cada um inclui água mineral, cooler com gelo, flutuadores, coletes e o suporte da nossa equipe a bordo. Saída pela Vila do Abraão. Preços sob consulta.</p>
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
          <p>Temos <strong>agência de turismo física no Centro de Mangaratiba</strong> e operação regularizada (cadastro no CADASTUR, do Ministério do Turismo). Aqui você fala com gente de verdade, do cais até o seu destino.</p>
        </div>
        <figure class="about__photo reveal" data-d="1">
          <img src="assets/img/agencia-mangaratiba.jpg" alt="Agência de turismo da Vou de Barco no Centro de Mangaratiba" loading="lazy" width="960" height="1200">
          <figcaption>${I.pin} Nossa agência, no Centro de Mangaratiba</figcaption>
        </figure>
      </div>
      <div class="diffs diffs--row reveal">
        <div class="diff">${I.compass}<h4>Pioneiros no Flex Boat por Mangaratiba</h4></div>
        <div class="diff">${I.anchor}<h4>Frota própria e revisada</h4></div>
        <div class="diff">${I.heart}<h4>Marinheiros experientes e atendimento acolhedor</h4></div>
        <div class="diff">${I.boat}<h4>Passeios e travessia para todos os perfis</h4></div>
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
            <div class="channel">${I.pin}<span><b>Mangaratiba</b><span>Av. Célio Lopes, 89 — Centro</span></span></div>
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
${p.faq ? `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: p.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  })}</script>
` : ""}${ldBreadcrumb([{ name: "Início", url: SITE + "/" }, { name: "Passeios", url: SITE + "/#passeios" }, { name: p.nome, url: `${SITE}/passeios/${p.id}.html` }])}
</head>
<body>
${header({ active: "passeios", solid: true, prefix: "../" })}
<main id="main">

  <section class="subhero subhero--photo">
    <div class="subhero__bg"><img src="../${p.img}" alt="Passeio ${esc(p.nome)} — Ilha Grande" width="1080" height="1350"></div>
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
          <p class="lead">Passeio de barco e de lancha em Ilha Grande, com saída pela ${esc(p.saida)} · ${esc(p.duracao)}.</p>
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
${p.faq ? `
          <h2>Perguntas frequentes</h2>
          <div class="faq">
            ${p.faq.map(([q, a]) => `<details class="faq__item"><summary class="faq__q"><span>${esc(q)}</span><span class="faq__icon" aria-hidden="true"></span></summary><p class="faq__a">${esc(a)}</p></details>`).join("\n            ")}
          </div>
` : ""}        </div>

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
    description: "Travessia rápida de Flex Boat entre Mangaratiba e a Vila do Abraão, na Ilha Grande, em cerca de 40 minutos.",
    provider: { "@type": "TravelAgency", name: "Vou de Barco", url: SITE, "@id": SITE + "/#business" },
    areaServed: [{ "@type": "Place", name: "Mangaratiba" }, { "@type": "Place", name: "Ilha Grande" }, { "@type": "Place", name: "Vila do Abraão" }, { "@type": "Place", name: "Rio de Janeiro" }],
    image: SITE + "/" + TRAV.img, url: SITE + "/travessia.html",
  })}</script>
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: TRAV.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  })}</script>
${ldBreadcrumb([{ name: "Início", url: SITE + "/" }, { name: "Travessia", url: SITE + "/travessia.html" }])}
</head>
<body>
${header({ active: "travessia", solid: true })}
<main id="main">

  <section class="subhero subhero--photo subhero--flex">
    <div class="subhero__bg"><img src="${TRAV.img}" alt="Flex Boat da Vou de Barco na travessia Mangaratiba ⇄ Ilha Grande" width="1080" height="1115"></div>
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
          <p>Fazemos a travessia entre o <strong>cais de Mangaratiba</strong> e a Vila do Abraão, na Ilha Grande, em <strong>Flex Boat</strong> — cerca de 40 minutos de mar. Mangaratiba é o ponto mais próximo do Rio de Janeiro e tem estacionamento em conta, o que torna a viagem mais rápida e tranquila para quem vem da cidade de carro. Fomos pioneiros nessa rota e hoje ela é referência na região. Saiba mais sobre <a href="mangaratiba.html">Mangaratiba, a porta de entrada da Ilha Grande</a>, e veja <a href="como-chegar.html">como chegar</a> passo a passo.</p>

          <h2>Como funciona</h2>
          <div class="stops">
            ${TRAV.como_funciona.map((s) => `<div class="stop stop--time"><span class="n">${esc(s.n)}</span><span class="name"><strong>${esc(s.titulo)}</strong> — ${esc(s.texto)}</span></div>`).join("\n            ")}
          </div>

          <h2>Horários</h2>
          <div class="travessia__times" style="background:var(--bruma)">
            <div style="background:var(--nevoa)"><h4 style="color:var(--cobalto)">${esc(TRAV.horarios.ida.titulo)}</h4><ul>${TRAV.horarios.ida.saidas.map((s) => `<li style="background:var(--cobalto-12);color:var(--cobalto)">${s}</li>`).join("")}</ul></div>
            <div style="background:var(--nevoa)"><h4 style="color:var(--cobalto)">${esc(TRAV.horarios.volta.titulo)}</h4><ul>${TRAV.horarios.volta.saidas.map((s) => `<li style="background:var(--cobalto-12);color:var(--cobalto)">${s}</li>`).join("")}</ul></div>
          </div>
          <p style="margin-top:1rem;font-size:.95rem;color:var(--abismo-60)">Chegue ao cais cerca de 20 minutos antes do horário. Horários sujeitos às condições de clima e maré.</p>

          <h2>O que levar</h2>
          <ul class="included">
            ${TRAV.o_que_levar.map((x) => `<li>${I.check}${esc(x)}</li>`).join("\n            ")}
          </ul>

          <h2>Está incluso</h2>
          <ul class="included">
            ${TRAV.incluso.map((x) => `<li>${I.check}${esc(x)}</li>`).join("\n            ")}
          </ul>
          <p class="detail__note"><strong>Não inclui:</strong> ${TRAV.nao_incluso.map((x) => esc(x)).join(" · ")}.</p>

          <h2>Bilhetes e bagagem</h2>
          <p>Você escolhe <strong>ida</strong>, <strong>volta</strong> ou <strong>ida e volta</strong>. Fechar ida e volta garante a sua vaga no retorno e simplifica a logística.</p>
          <p>${esc(TRAV.bagagem)}</p>

          <h2>Segurança a bordo</h2>
          <ul class="strong-list">
            ${TRAV.seguranca.map((x) => `<li>${I.shield}<span>${esc(x)}</span></li>`).join("\n            ")}
          </ul>

          <h2>Chuva e mar — o que esperar</h2>
          <div class="tips">
            ${TRAV.dicas.map((d) => `<div class="tip"><h4>${esc(d.titulo)}</h4><p>${esc(d.texto)}</p></div>`).join("\n            ")}
          </div>

          <h2>Perguntas frequentes sobre a travessia</h2>
          <div class="faq">
            ${TRAV.faq.map(([q, a]) => `<details class="faq__item"><summary class="faq__q"><span>${esc(q)}</span><span class="faq__icon" aria-hidden="true"></span></summary><p class="faq__a">${esc(a)}</p></details>`).join("\n            ")}
          </div>
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
   PÁGINA: COMO CHEGAR (conteúdo/SEO)
   ============================================================ */
const CHEGAR_FAQ = [
  ["Como chegar a Ilha Grande saindo do Rio de Janeiro?", "Do Rio, você segue de carro ou ônibus até Mangaratiba, no continente (cerca de 2h a 2h30 pela Rio-Santos, a BR-101). De lá, faz a travessia de barco até a Vila do Abraão, na Ilha Grande. Mangaratiba é o ponto de partida mais próximo da capital."],
  ["Qual é o ponto de travessia mais próximo do Rio?", "Mangaratiba. É o ponto de embarque mais próximo do Rio de Janeiro e tem estacionamento em conta, o que torna a viagem mais rápida e tranquila para quem vem da cidade."],
  ["Quanto tempo dura a travessia até a Ilha Grande?", "A travessia de Flex Boat entre Mangaratiba e a Vila do Abraão leva cerca de 40 minutos. O desembarque é no Cais de Turismo, no centro da vila."],
  ["Dá para ir de carro até a Ilha Grande?", "Não. A Ilha Grande não tem acesso por carro — você deixa o veículo no continente (em Mangaratiba, por exemplo) e faz a travessia de barco até a ilha."],
];
function buildComoChegar() {
  const msg = "Olá, Vou de Barco! Quero informações de como chegar à Ilha Grande pela travessia de Mangaratiba.";
  const title = "Como chegar a Ilha Grande: travessia por Mangaratiba, o ponto mais próximo do Rio | Vou de Barco";
  const desc = "Guia de como chegar a Ilha Grande saindo do Rio de Janeiro: até Mangaratiba pela Rio-Santos e a travessia de Flex Boat até a Vila do Abraão em ~40 min. Horários, pontos de partida e dicas.";
  return `${head({ title, desc, canonical: `${SITE}/como-chegar.html`, type: "article" })}
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: CHEGAR_FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  })}</script>
${ldBreadcrumb([{ name: "Início", url: SITE + "/" }, { name: "Como chegar a Ilha Grande", url: SITE + "/como-chegar.html" }])}
</head>
<body>
${header({ active: "comochegar", solid: true })}
<main id="main">

  <section class="subhero subhero--photo subhero--flex">
    <div class="subhero__bg"><img src="${TRAV.img}" alt="Travessia de Flex Boat de Mangaratiba para a Ilha Grande" width="1080" height="1115"></div>
    <div class="wrap">
      <nav class="crumbs" aria-label="Trilha"><a href="index.html">Início</a> · Como chegar</nav>
      <span class="eyebrow eyebrow--light">Guia · Costa Verde</span>
      <h1>Como chegar a Ilha Grande</h1>
      <p class="subhero__slogan">Do Rio até a Vila do Abraão pelo caminho mais rápido: a travessia por Mangaratiba.</p>
      <div class="subhero__meta">
        <span class="chip">${I.clock}~40 min de travessia</span>
        <span class="chip">${esc(TRAV.embarcacao)}</span>
        <span class="chip">${I.pin}Mangaratiba ⇄ Abraão</span>
      </div>
    </div>
  </section>

  <section class="section section--branco">
    <div class="wrap">
      <div class="detail">
        <div class="detail__main">
          <h2>A Ilha Grande só se chega de barco</h2>
          <p>A Ilha Grande fica no litoral sul do Rio de Janeiro, na Costa Verde, entre Mangaratiba e Angra dos Reis. Como é uma ilha, <strong>não há acesso por carro</strong>: você deixa o veículo no continente e faz a travessia de barco até a <strong>Vila do Abraão</strong>, o principal povoado da ilha. É de lá que saem os passeios e onde ficam pousadas, restaurantes e as praias mais famosas.</p>

          <h2>Saindo do Rio de Janeiro, em 2 passos</h2>
          <div class="stops">
            <div class="stop stop--time"><span class="n">01</span><span class="name"><strong>Até Mangaratiba (continente)</strong> — de carro ou ônibus pela Rio-Santos (BR-101), cerca de 2h a 2h30 partindo do centro do Rio. Mangaratiba é o ponto de partida mais próximo da capital e tem estacionamento na cidade, em conta.</span></div>
            <div class="stop stop--time"><span class="n">02</span><span class="name"><strong>Travessia até a Vila do Abraão</strong> — no cais de Mangaratiba você embarca no nosso Flex Boat e chega à Vila do Abraão em cerca de 40 minutos, com desembarque no Cais de Turismo, no centro da vila.</span></div>
          </div>

          <h2>Por que sair de Mangaratiba</h2>
          <ul class="strong-list">
            <li>${I.check}<span>É o ponto de travessia <strong>mais próximo do Rio de Janeiro</strong> — menos estrada.</span></li>
            <li>${I.check}<span>Estacionamento acessível e em conta na cidade.</span></li>
            <li>${I.check}<span>Travessia rápida de <strong>Flex Boat</strong>, em cerca de 40 minutos.</span></li>
            <li>${I.check}<span>Boa infraestrutura no cais e saídas ao longo do dia.</span></li>
          </ul>

          <h2>Horários da travessia</h2>
          <div class="travessia__times" style="background:var(--bruma)">
            <div style="background:var(--nevoa)"><h4 style="color:var(--cobalto)">${esc(TRAV.horarios.ida.titulo)}</h4><ul>${TRAV.horarios.ida.saidas.map((s) => `<li style="background:var(--cobalto-12);color:var(--cobalto)">${s}</li>`).join("")}</ul></div>
            <div style="background:var(--nevoa)"><h4 style="color:var(--cobalto)">${esc(TRAV.horarios.volta.titulo)}</h4><ul>${TRAV.horarios.volta.saidas.map((s) => `<li style="background:var(--cobalto-12);color:var(--cobalto)">${s}</li>`).join("")}</ul></div>
          </div>
          <p style="margin-top:1rem;font-size:.95rem;color:var(--abismo-60)">Chegue ao cais com cerca de 20 minutos de antecedência. Horários sujeitos às condições de clima e maré. <a href="travessia.html">Ver todos os detalhes da travessia →</a></p>

          <h2>Outros pontos de partida no continente</h2>
          <p>Além de Mangaratiba, também é possível chegar à Ilha Grande por <strong>Conceição de Jacareí</strong> e pelo cais de <strong>Angra dos Reis</strong>. A Vou de Barco opera a rota por <strong>Mangaratiba</strong>, a mais próxima de quem vem do Rio de Janeiro.</p>

          <h2>Dicas para o dia da viagem</h2>
          <ul class="included">
            ${TRAV.o_que_levar.map((x) => `<li>${I.check}${esc(x)}</li>`).join("\n            ")}
          </ul>

          <h2>Perguntas frequentes</h2>
          <div class="faq">
            ${CHEGAR_FAQ.map(([q, a]) => `<details class="faq__item"><summary class="faq__q"><span>${esc(q)}</span><span class="faq__icon" aria-hidden="true"></span></summary><p class="faq__a">${esc(a)}</p></details>`).join("\n            ")}
          </div>
        </div>

        <aside class="booking-card">
          <h3>Reserve sua travessia</h3>
          <p class="price-note">Preço sob consulta</p>
          <ul class="spec-list">
            <li><span class="k">Rota</span><span class="v">Mangaratiba ⇄ Abraão</span></li>
            <li><span class="k">Embarcação</span><span class="v">${esc(TRAV.embarcacao)}</span></li>
            <li><span class="k">Tempo</span><span class="v">${esc(TRAV.tempo)}</span></li>
          </ul>
          <a class="btn" href="${waLink(msg)}" target="_blank" rel="noopener">${I.whatsapp} Falar no WhatsApp</a>
          <a class="back" href="travessia.html">${I.arrow} Ver a travessia</a>
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
   PÁGINA: MANGARATIBA (cluster de turismo / travessia)
   ============================================================ */
const MANGA_FAQ = [
  ["Como ir de Mangaratiba para a Ilha Grande?", "A partir do cais de Mangaratiba você faz a travessia de barco até a Vila do Abraão, na Ilha Grande. Fazemos essa travessia em Flex Boat, em cerca de 40 minutos. É o trajeto mais curto para quem vem do Rio de Janeiro."],
  ["Onde fica o cais de Mangaratiba?", "No Centro de Mangaratiba, no cais da barca — Av. Célio Lopes, 89. É o cais central da cidade, de onde saem as embarcações para a Ilha Grande."],
  ["Quanto tempo de Mangaratiba até a Ilha Grande?", "Cerca de 40 minutos de Flex Boat entre Mangaratiba e a Vila do Abraão, com desembarque no Cais de Turismo, no centro da vila."],
  ["Tem estacionamento em Mangaratiba?", "Sim, há estacionamento próximo ao cais, em conta. É um dos motivos de Mangaratiba ser o ponto mais prático para quem vem do Rio de carro e quer deixar o veículo em segurança."],
  ["Por que sair de Mangaratiba e não de Angra ou Conceição de Jacareí?", "Mangaratiba é o ponto de travessia mais próximo do Rio de Janeiro — menos estrada, chegada mais rápida e estacionamento em conta. Por isso é a rota preferida de quem vem da capital."],
  ["Quanto custa a travessia de Mangaratiba para a Ilha Grande?", "O valor é sob consulta e varia conforme o trecho (ida, volta ou ida e volta) e o número de pessoas. Fale com a gente pelo WhatsApp que passamos o preço na hora."],
];
function buildMangaratiba() {
  const msg = "Olá, Vou de Barco! Quero informações da travessia de Mangaratiba para a Ilha Grande.";
  const title = "Mangaratiba ⇄ Ilha Grande: travessia, cais e como chegar | Vou de Barco";
  const desc = "Mangaratiba é a porta de entrada mais próxima do Rio para a Ilha Grande. Veja como chegar, o cais de embarque, estacionamento e a travessia de Flex Boat até a Vila do Abraão (~40 min).";
  return `${head({ title, desc, canonical: `${SITE}/mangaratiba.html`, type: "article" })}
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: MANGA_FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  })}</script>
${ldBreadcrumb([{ name: "Início", url: SITE + "/" }, { name: "Mangaratiba", url: SITE + "/mangaratiba.html" }])}
</head>
<body>
${header({ active: "mangaratiba", solid: true })}
<main id="main">

  <section class="subhero subhero--photo subhero--flex">
    <div class="subhero__bg"><img src="${TRAV.img}" alt="Baía de Mangaratiba, ponto de partida da travessia para a Ilha Grande" width="1080" height="1115"></div>
    <div class="wrap">
      <nav class="crumbs" aria-label="Trilha"><a href="index.html">Início</a> · Mangaratiba</nav>
      <span class="eyebrow eyebrow--light">Costa Verde · Rio de Janeiro</span>
      <h1>Mangaratiba ⇄ Ilha Grande</h1>
      <p class="subhero__slogan">A porta de entrada mais próxima do Rio para a Ilha Grande — e onde a sua travessia começa.</p>
      <div class="subhero__meta">
        <span class="chip">${I.clock}~40 min de travessia</span>
        <span class="chip">${esc(TRAV.embarcacao)}</span>
        <span class="chip">${I.pin}Cais de Mangaratiba</span>
      </div>
    </div>
  </section>

  <section class="section section--branco">
    <div class="wrap">
      <div class="detail">
        <div class="detail__main">
          <h2>Por que Mangaratiba é o melhor caminho para a Ilha Grande</h2>
          <p>Mangaratiba é um município do litoral sul do Rio de Janeiro, na Costa Verde, e o <strong>ponto de partida mais próximo da capital</strong> para a Ilha Grande. Quem vem do Rio chega mais rápido, encara menos estrada e ainda encontra <strong>estacionamento em conta</strong> perto do cais. É de lá que sai a nossa travessia de Flex Boat até a <strong>Vila do Abraão</strong>, o principal povoado da ilha.</p>
          <p>Boa parte de quem pesquisa <strong>turismo em Mangaratiba</strong> está, na verdade, a caminho da Ilha Grande — e é justamente essa conexão, rápida e segura, que a Vou de Barco faz todos os dias.</p>
          <p>Procurando a <strong>barca para a Ilha Grande</strong>? A travessia de Flex Boat é a alternativa mais rápida: enquanto a barca tradicional pode levar mais de uma hora, o nosso Flex Boat faz o trajeto Mangaratiba ⇄ Vila do Abraão em cerca de 40 minutos, com horários ao longo do dia.</p>

          <h2>Como chegar a Mangaratiba</h2>
          <p>Saindo do Rio de Janeiro, o acesso é pela Rio-Santos (BR-101), cerca de 2h a 2h30 de carro ou ônibus até o Centro de Mangaratiba. Veja o guia completo de <a href="como-chegar.html">como chegar à Ilha Grande</a> passo a passo.</p>

          <h2>O cais de Mangaratiba: onde embarcar</h2>
          <p>O embarque é no <strong>cais da barca, no Centro de Mangaratiba — Av. Célio Lopes, 89</strong>. É o cais central da cidade, com boa infraestrutura e estacionamento próximo. Chegue cerca de 20 minutos antes do horário da sua travessia.</p>

          <h2>A travessia de Mangaratiba para a Ilha Grande</h2>
          <p>Fazemos a travessia em <strong>Flex Boat</strong> entre Mangaratiba e a Vila do Abraão em cerca de <strong>40 minutos</strong>, com coletes e suporte da nossa equipe a bordo. Você escolhe ida, volta ou ida e volta.</p>
          <div class="travessia__times" style="background:var(--bruma)">
            <div style="background:var(--nevoa)"><h4 style="color:var(--cobalto)">${esc(TRAV.horarios.ida.titulo)}</h4><ul>${TRAV.horarios.ida.saidas.map((s) => `<li style="background:var(--cobalto-12);color:var(--cobalto)">${s}</li>`).join("")}</ul></div>
            <div style="background:var(--nevoa)"><h4 style="color:var(--cobalto)">${esc(TRAV.horarios.volta.titulo)}</h4><ul>${TRAV.horarios.volta.saidas.map((s) => `<li style="background:var(--cobalto-12);color:var(--cobalto)">${s}</li>`).join("")}</ul></div>
          </div>
          <p style="margin-top:1rem;font-size:.95rem;color:var(--abismo-60)"><a href="travessia.html">Ver todos os detalhes da travessia →</a></p>

          <h2>O que fazer depois de chegar à Ilha Grande</h2>
          <p>Da Vila do Abraão saem os passeios de barco pelos cenários mais bonitos da região: Lagoa Azul, Lagoa Verde, Praia dos Meros, Aventureiro, a Gruta do Acaiá e as ilhas paradisíacas de Angra. Conheça a ilha pelo mar com a gente.</p>

          <h2>Perguntas frequentes sobre Mangaratiba</h2>
          <div class="faq">
            ${MANGA_FAQ.map(([q, a]) => `<details class="faq__item"><summary class="faq__q"><span>${esc(q)}</span><span class="faq__icon" aria-hidden="true"></span></summary><p class="faq__a">${esc(a)}</p></details>`).join("\n            ")}
          </div>
        </div>

        <aside class="booking-card">
          <h3>Travessia de Mangaratiba</h3>
          <p class="price-note">Preço sob consulta</p>
          <ul class="spec-list">
            <li><span class="k">Rota</span><span class="v">Mangaratiba ⇄ Abraão</span></li>
            <li><span class="k">Embarcação</span><span class="v">${esc(TRAV.embarcacao)}</span></li>
            <li><span class="k">Tempo</span><span class="v">${esc(TRAV.tempo)}</span></li>
            <li><span class="k">Embarque</span><span class="v">Av. Célio Lopes, 89</span></li>
          </ul>
          <a class="btn" href="${waLink(msg)}" target="_blank" rel="noopener">${I.whatsapp} Reservar no WhatsApp</a>
          <a class="back" href="travessia.html">${I.arrow} Ver a travessia</a>
        </aside>
      </div>
    </div>
  </section>

  ${wave(C.branco, C.nevoa)}

  <section class="section section--nevoa">
    <div class="wrap">
      <div class="section__head"><span class="eyebrow">Da ilha para o mar</span><h2 class="section-title">Passeios saindo da Ilha Grande</h2></div>
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
   PÁGINA: SOBRE
   ============================================================ */
const SOBRE_FAQ = [
  ["A Vou de Barco é uma empresa regularizada?", "Sim. Somos uma agência de turismo com agência física no Centro de Mangaratiba e cadastro no CADASTUR, do Ministério do Turismo. Trabalhamos com frota própria, embarcações revisadas e coletes para todos a bordo."],
  ["Onde fica a agência da Vou de Barco?", "No Centro de Mangaratiba, no cais da barca — Av. Célio Lopes, 89. Também atendemos na Vila do Abraão, na Ilha Grande."],
  ["A frota é própria?", "Sim, a Vou de Barco opera com frota e tripulação próprias, com marinheiros experientes que conhecem a região. Segurança e manutenção em dia são prioridade."],
  ["Como faço para reservar?", "Todo o atendimento é pelo WhatsApp: você conta o seu plano (travessia e/ou passeios, data e número de pessoas) e a gente passa disponibilidade e valores, sem compromisso."],
];
function buildSobre() {
  const msg = "Olá, Vou de Barco! Quero falar com vocês sobre a travessia e os passeios.";
  const title = "Sobre a Vou de Barco — agência náutica em Mangaratiba e Ilha Grande | Vou de Barco";
  const desc = "Conheça a Vou de Barco: operação náutica com frota própria, pioneira na travessia de Flex Boat por Mangaratiba, agência de turismo regularizada (CADASTUR) na Costa Verde do Rio.";
  return `${head({ title, desc, canonical: `${SITE}/sobre.html`, type: "article" })}
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "AboutPage",
    mainEntity: { "@id": SITE + "/#business" }, url: SITE + "/sobre.html",
  })}</script>
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: SOBRE_FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  })}</script>
${ldBreadcrumb([{ name: "Início", url: SITE + "/" }, { name: "Sobre", url: SITE + "/sobre.html" }])}
</head>
<body>
${header({ active: "sobre", solid: true })}
<main id="main">

  <section class="subhero subhero--photo subhero--flex">
    <div class="subhero__bg"><img src="${TRAV.img}" alt="Flex Boat da Vou de Barco na travessia para a Ilha Grande" width="1080" height="1115"></div>
    <div class="wrap">
      <nav class="crumbs" aria-label="Trilha"><a href="index.html">Início</a> · Sobre</nav>
      <span class="eyebrow eyebrow--light">Quem é a Vou de Barco</span>
      <h1>Gente de verdade, do cais até o seu destino</h1>
      <p class="subhero__slogan">Operação náutica com frota própria, pioneira na travessia de Flex Boat por Mangaratiba.</p>
    </div>
  </section>

  <section class="section section--branco">
    <div class="wrap">
      <div class="about">
        <div class="about__copy">
          <h2>Nascemos para resolver um problema real</h2>
          <p>A Vou de Barco é uma operação náutica com <strong>frota e tripulação próprias</strong>, dedicada a levar você até a Ilha Grande e a mostrar o melhor da Costa Verde no mar. Nascemos para resolver um problema real: chegar à ilha de forma mais rápida e confortável para quem vem do Rio de Janeiro.</p>
          <p>Mangaratiba é o ponto mais próximo da capital, mas ninguém fazia a travessia de <strong>Flex Boat</strong> por ali. Encaramos o desafio com marinheiros experientes e embarcação preparada, e nos tornamos <strong>pioneiros nessa rota</strong>, hoje consolidada e referência na região.</p>
          <p>Temos <strong>agência de turismo física no Centro de Mangaratiba</strong> e operação regularizada, com cadastro no CADASTUR (Ministério do Turismo). Levamos segurança a sério: embarcações revisadas, motor em dia e coletes para todos a bordo.</p>
        </div>
        <figure class="about__photo">
          <img src="assets/img/agencia-mangaratiba.jpg" alt="Agência de turismo da Vou de Barco no Centro de Mangaratiba" loading="lazy" width="960" height="1200">
          <figcaption>${I.pin} Nossa agência, no Centro de Mangaratiba</figcaption>
        </figure>
      </div>
      <div class="diffs diffs--row" style="margin-top:clamp(2rem,4vw,3rem)">
        <div class="diff">${I.compass}<h4>Pioneiros no Flex Boat por Mangaratiba</h4></div>
        <div class="diff">${I.anchor}<h4>Frota própria e revisada</h4></div>
        <div class="diff">${I.heart}<h4>Marinheiros experientes e atendimento acolhedor</h4></div>
        <div class="diff">${I.shield}<h4>Agência regularizada · CADASTUR</h4></div>
      </div>

      <div class="detail" style="margin-top:clamp(2.5rem,5vw,4rem)">
        <div class="detail__main">
          <h2>O que a gente faz</h2>
          <p>Fazemos a <a href="travessia.html">travessia de Mangaratiba para a Ilha Grande</a> em Flex Boat, em cerca de 40 minutos, e <a href="index.html#passeios">passeios de barco</a> pelos cenários mais bonitos da Costa Verde — Lagoa Azul, Lagoa Verde, Praia dos Meros, Aventureiro, a Gruta do Acaiá e as ilhas paradisíacas de Angra. Veja também <a href="mangaratiba.html">Mangaratiba, a porta de entrada da ilha</a>, e <a href="como-chegar.html">como chegar</a>.</p>

          <h2>Perguntas frequentes</h2>
          <div class="faq">
            ${SOBRE_FAQ.map(([q, a]) => `<details class="faq__item"><summary class="faq__q"><span>${esc(q)}</span><span class="faq__icon" aria-hidden="true"></span></summary><p class="faq__a">${esc(a)}</p></details>`).join("\n            ")}
          </div>
        </div>
        <aside class="booking-card">
          <h3>Fale com a gente</h3>
          <p class="price-note">Atendimento pelo WhatsApp</p>
          <ul class="spec-list">
            <li><span class="k">Agência</span><span class="v">Mangaratiba · Abraão</span></li>
            <li><span class="k">Frota</span><span class="v">Própria · Flex Boat</span></li>
            <li><span class="k">Cadastro</span><span class="v">CADASTUR</span></li>
          </ul>
          <a class="btn" href="${waLink(msg)}" target="_blank" rel="noopener">${I.whatsapp} Falar no WhatsApp</a>
          <a class="back" href="index.html">${I.arrowL} Voltar ao início</a>
        </aside>
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
   PÁGINA: PASSEIOS DE BARCO EM ILHA GRANDE (cluster)
   ============================================================ */
const PASSEIOS_FAQ = [
  ["Quanto custa um passeio de barco em Ilha Grande?", "O valor é sob consulta e varia conforme o passeio, a data e o número de pessoas. Fale com a gente pelo WhatsApp que passamos o preço atualizado na hora, sem compromisso."],
  ["Qual é o melhor passeio de barco em Ilha Grande?", "Depende do seu tempo e do seu perfil: a Meia Volta é ótima para famílias em mar calmo; o Ilhas Paradisíacas reúne as praias mais fotogênicas de Angra; o Volta na Ilha é o mais completo e aventureiro; e a Gruta do Acaiá é o mais surpreendente. A gente ajuda a escolher pelo WhatsApp."],
  ["O que está incluso nos passeios?", "Todos os passeios incluem água mineral, cooler com gelo, flutuadores, coletes salva-vidas e o suporte da nossa equipe a bordo do início ao fim. O almoço não está incluso."],
  ["De onde saem os passeios?", "Da Vila do Abraão, na Ilha Grande. Se você vem do continente, fazemos a travessia de Flex Boat de Mangaratiba até a vila."],
  ["Precisa reservar com antecedência?", "Sim, recomendamos reservar pelo WhatsApp para garantir a sua vaga na data desejada, principalmente em fins de semana e alta temporada."],
];
function buildPasseiosIlhaGrande() {
  const msg = "Olá, Vou de Barco! Quero informações sobre os passeios de barco em Ilha Grande.";
  const title = "Passeios de barco em Ilha Grande — Lagoa Azul, Dentista e mais | Vou de Barco";
  const desc = "Passeios de barco e de lancha em Ilha Grande e Angra: Lagoa Azul, Lagoa Verde, Praia do Dentista, Aventureiro, Gruta do Acaiá e ilhas paradisíacas. Saída da Vila do Abraão. Reserve pelo WhatsApp.";
  return `${head({ title, desc, canonical: `${SITE}/passeios-ilha-grande.html`, type: "article" })}
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: PASSEIOS_FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  })}</script>
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "ItemList",
    itemListElement: PASSEIOS.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.nome, url: `${SITE}/passeios/${p.id}.html` })),
  })}</script>
${ldBreadcrumb([{ name: "Início", url: SITE + "/" }, { name: "Passeios em Ilha Grande", url: SITE + "/passeios-ilha-grande.html" }])}
</head>
<body>
${header({ active: "passeios", solid: true })}
<main id="main">

  <section class="subhero subhero--photo">
    <div class="subhero__bg"><img src="assets/img/hero-praia.jpg" alt="Águas cristalinas de Ilha Grande em um passeio de barco" width="1080" height="1116"></div>
    <div class="wrap">
      <nav class="crumbs" aria-label="Trilha"><a href="index.html">Início</a> · Passeios em Ilha Grande</nav>
      <span class="eyebrow eyebrow--light">Roteiros · Costa Verde</span>
      <h1>Passeios de barco em Ilha Grande</h1>
      <p class="subhero__slogan">Lagoa Azul, Praia do Dentista, Aventureiro, Gruta do Acaiá e as ilhas mais bonitas de Angra — pelo mar, com a gente.</p>
    </div>
  </section>

  <section class="section section--branco">
    <div class="wrap">
      <div class="section__head">
        <span class="eyebrow">Escolha o seu roteiro</span>
        <h2 class="section-title">Seis jeitos de conhecer a ilha pelo mar</h2>
        <p class="lead">Cada passeio de barco inclui água mineral, cooler com gelo, flutuadores, coletes e o suporte da nossa equipe a bordo. Saída pela Vila do Abraão — e, se você vem do Rio, levamos você até lá na <a href="travessia.html">travessia por Mangaratiba</a>. Preços sob consulta.</p>
      </div>
      <div class="tours">
        ${PASSEIOS.map((p) => tourCard(p)).join("\n        ")}
      </div>
    </div>
  </section>

  ${wave(C.branco, C.nevoa)}

  <section class="section section--nevoa">
    <div class="wrap">
      <div class="section__head center"><span class="eyebrow">Perguntas frequentes</span><h2 class="section-title">Sobre os passeios de barco em Ilha Grande</h2></div>
      <div class="faq">
        ${PASSEIOS_FAQ.map(([q, a]) => `<details class="faq__item reveal"><summary class="faq__q"><span>${esc(q)}</span><span class="faq__icon" aria-hidden="true"></span></summary><p class="faq__a">${esc(a)}</p></details>`).join("\n        ")}
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
   BLOG
   ============================================================ */
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
function fmtData(iso) { const [a, m, d] = iso.split("-"); return `${d} ${MESES[+m - 1]} ${a}`; }
function renderBlocks(blocks) {
  return blocks.map((b) => {
    if (typeof b === "string") return `<p>${esc(b)}</p>`;
    if (b.h2) return `<h2>${esc(b.h2)}</h2>`;
    if (b.lista) return `<ul class="included">\n            ${b.lista.map((x) => `<li>${I.check}${esc(x)}</li>`).join("\n            ")}\n          </ul>`;
    if (b.html) return b.html;
    return "";
  }).join("\n          ");
}
function blogCard(post, prefix = "") {
  return `<article class="tour reveal">
  <div class="tour__media">
    <span class="tour__badge">${esc(post.categoria)}</span>
    <img src="${prefix}${post.img}" alt="${esc(post.titulo)}" loading="lazy" width="640" height="480">
  </div>
  <div class="tour__body">
    <h3 class="tour__name" style="font-size:1.2rem">${esc(post.titulo)}</h3>
    <p class="tour__slogan">${esc(post.resumo)}</p>
    <div class="tour__meta"><span class="chip">${I.clock}${fmtData(post.data)}</span></div>
    <a class="tour__link" href="${prefix}blog/${post.slug}.html">Ler artigo ${I.arrow}</a>
  </div>
  <a class="tour__stretch" href="${prefix}blog/${post.slug}.html" aria-label="Ler ${esc(post.titulo)}"></a>
</article>`;
}
function buildBlogIndex() {
  const title = "Blog da Vou de Barco — dicas de Ilha Grande, Mangaratiba e passeios de barco";
  const desc = "Guias, roteiros e dicas para a sua viagem à Ilha Grande: o que fazer, melhor época, como chegar e os melhores passeios de barco pela Costa Verde.";
  return `${head({ title, desc, canonical: `${SITE}/blog.html` })}
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "Blog", "@id": SITE + "/blog.html", name: "Blog da Vou de Barco", url: SITE + "/blog.html",
    publisher: { "@id": SITE + "/#business" },
    blogPost: BLOG.map((p) => ({ "@type": "BlogPosting", headline: p.titulo, url: `${SITE}/blog/${p.slug}.html`, datePublished: p.data, image: SITE + "/" + p.img })),
  })}</script>
${ldBreadcrumb([{ name: "Início", url: SITE + "/" }, { name: "Blog", url: SITE + "/blog.html" }])}
</head>
<body>
${header({ active: "blog", solid: true })}
<main id="main">

  <section class="subhero subhero--photo">
    <div class="subhero__bg"><img src="assets/img/hero-praia.jpg" alt="Águas cristalinas de Ilha Grande" width="1080" height="1116"></div>
    <div class="wrap">
      <nav class="crumbs" aria-label="Trilha"><a href="index.html">Início</a> · Blog</nav>
      <span class="eyebrow eyebrow--light">Guias & dicas</span>
      <h1>Blog da Vou de Barco</h1>
      <p class="subhero__slogan">Tudo para planejar a sua viagem à Ilha Grande e aproveitar o melhor da Costa Verde no mar.</p>
    </div>
  </section>

  <section class="section section--branco">
    <div class="wrap">
      <div class="tours">
        ${BLOG.map((p) => blogCard(p)).join("\n        ")}
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
function buildPost(post) {
  const msg = "Olá, Vou de Barco! Vim pelo blog e quero informações sobre a travessia e os passeios.";
  const outros = BLOG.filter((p) => p.slug !== post.slug).slice(0, 3);
  return `${head({ title: post.seo_title, desc: post.seo_desc, canonical: `${SITE}/blog/${post.slug}.html`, type: "article" })}
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "BlogPosting", headline: post.titulo, description: post.seo_desc,
    image: SITE + "/" + post.img, datePublished: post.data, dateModified: post.data,
    author: { "@type": "Organization", name: post.autor, url: SITE }, publisher: { "@id": SITE + "/#business" },
    mainEntityOfPage: `${SITE}/blog/${post.slug}.html`,
  })}</script>
${ldBreadcrumb([{ name: "Início", url: SITE + "/" }, { name: "Blog", url: SITE + "/blog.html" }, { name: post.titulo, url: `${SITE}/blog/${post.slug}.html` }])}
</head>
<body>
${header({ active: "blog", solid: true, prefix: "../" })}
<main id="main">

  <section class="subhero subhero--photo">
    <div class="subhero__bg"><img src="../${post.img}" alt="${esc(post.titulo)}" width="1080" height="720"></div>
    <div class="wrap">
      <nav class="crumbs" aria-label="Trilha"><a href="../index.html">Início</a> · <a href="../blog.html">Blog</a> · ${esc(post.categoria)}</nav>
      <span class="eyebrow eyebrow--light">${esc(post.categoria)} · ${fmtData(post.data)}</span>
      <h1>${esc(post.titulo)}</h1>
      <p class="subhero__slogan">${esc(post.resumo)}</p>
    </div>
  </section>

  <section class="section section--branco">
    <div class="wrap">
      <article class="post">
        <div class="post__body">
          ${renderBlocks(post.conteudo)}
        </div>
        <p class="post__meta">Publicado por <strong>${esc(post.autor)}</strong> · ${fmtData(post.data)}</p>
        <div class="post__cta">
          <a class="btn" href="${waLink(msg)}" target="_blank" rel="noopener">${I.whatsapp} Falar no WhatsApp</a>
          <a class="btn btn--outline" href="../travessia.html">Ver a travessia ${I.arrow}</a>
        </div>
      </article>
    </div>
  </section>

  ${wave(C.branco, C.nevoa)}

  <section class="section section--nevoa">
    <div class="wrap">
      <div class="section__head"><span class="eyebrow">Continue lendo</span><h2 class="section-title">Outros artigos</h2></div>
      <div class="tours">
        ${outros.map((p) => blogCard(p, "../")).join("\n        ")}
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
const urls = [`${SITE}/`, `${SITE}/travessia.html`, `${SITE}/passeios-ilha-grande.html`, `${SITE}/mangaratiba.html`, `${SITE}/como-chegar.html`, `${SITE}/sobre.html`, `${SITE}/blog.html`, ...PASSEIOS.map((p) => `${SITE}/passeios/${p.id}.html`), ...BLOG.map((p) => `${SITE}/blog/${p.slug}.html`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>${u === SITE + "/" ? "1.0" : "0.8"}</priority></url>`).join("\n")}
</urlset>`;
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;

write("index.html", buildIndex());
write("travessia.html", buildTravessia());
write("como-chegar.html", buildComoChegar());
write("mangaratiba.html", buildMangaratiba());
write("sobre.html", buildSobre());
write("passeios-ilha-grande.html", buildPasseiosIlhaGrande());
write("blog.html", buildBlogIndex());
BLOG.forEach((p) => write(`blog/${p.slug}.html`, buildPost(p)));
PASSEIOS.forEach((p) => write(`passeios/${p.id}.html`, buildPasseio(p)));
write("favicon.svg", favicon);
write("sitemap.xml", sitemap);
write("robots.txt", robots);

console.log("✓ index.html");
console.log("✓ travessia.html");
PASSEIOS.forEach((p) => console.log(`✓ passeios/${p.id}.html`));
console.log(`✓ ${PASSEIOS.length} placeholders SVG + favicon.svg`);
console.log("✓ sitemap.xml + robots.txt");
console.log("\nPronto. Abra index.html no navegador.");
