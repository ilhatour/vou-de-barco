# Vou de Barco — site

Site institucional e de captação da **Vou de Barco (VDB)**. LP de página única + páginas próprias para cada passeio e para a travessia. Venda **sob consulta** → todo CTA leva ao **WhatsApp** (24) 97403-1431.

- **Domínio:** voudebarco.com (Hostinger)
- **Stack:** HTML/CSS/JS estático puro (zero dependências em produção). Conteúdo vem de `data/*.json` e as páginas são geradas por um script Node.
- **Conceito visual:** "Carta Náutica" — paleta oficial VDB (abismo/cobalto/amarelo + ondas) com rota plotada, rótulos em fonte mono (instrumento de navegação) e os passeios 90°/210° tratados como rumos de bússola.

## Estrutura

```
vou-de-barco/
├─ index.html              ← LP (gerado)
├─ travessia.html          ← página da travessia (gerado)
├─ passeios/*.html         ← 1 página por passeio (gerado)
├─ favicon.svg             ← (gerado)
├─ sitemap.xml, robots.txt ← (gerado)
├─ assets/
│  ├─ css/styles.css       ← sistema de design (editar à mão)
│  ├─ js/main.js           ← nav, header, reveal, form→WhatsApp (editar à mão)
│  └─ img/*.svg            ← placeholders "foto em breve" (gerado) + fotos reais
├─ data/
│  ├─ passeios.json        ← FONTE da verdade dos 5 passeios
│  └─ travessia.json       ← FONTE da verdade da travessia
└─ build/generate.mjs      ← gerador estático
```

## Como editar conteúdo

1. Edite `data/passeios.json` ou `data/travessia.json` (textos, paradas, horários…).
2. Rode o gerador:
   ```bash
   node build/generate.mjs
   ```
3. Os arquivos `.html` são reescritos. CSS e JS **não** são tocados pelo gerador — edite direto.

> Os arquivos `.html` são gerados: não edite à mão (a próxima geração sobrescreve). Mude o JSON ou os templates dentro de `build/generate.mjs`.

## Como visualizar localmente

```bash
cd vou-de-barco
python3 -m http.server 8848
# abra http://localhost:8848
```

## Deploy na Hostinger

É site estático: basta subir os arquivos. **Não** suba `build/` nem `data/` (opcionais; só servem para regenerar).

**Opção A — Gerenciador de Arquivos (hPanel):**
1. hPanel → Arquivos → Gerenciador de Arquivos → pasta `public_html/`.
2. Suba o conteúdo da pasta (index.html, travessia.html, passeios/, assets/, favicon.svg, sitemap.xml, robots.txt). Mantenha a estrutura de pastas.

**Opção B — FTP:** aponte o cliente FTP para `public_html/` e envie os mesmos arquivos.

Depois do deploy, aponte o domínio `voudebarco.com` para a hospedagem (se ainda não estiver) e confira o HTTPS.

## Pendências (do handoff) — precisam do Miguel

1. **Fotos/vídeos reais** — hoje há placeholders SVG ("foto em breve"). Trocar `assets/img/passeio-*.svg` por fotos (ou apontar `img` no JSON para os arquivos reais) e criar `assets/img/og-vou-de-barco.jpg` (1200×630) para o compartilhamento.
2. **Logo/favicon definitivos** — há um favicon provisório (âncora + onda). Substituir por arte oficial.
3. **E-mail no domínio** (ex.: contato@voudebarco.com) — configurar na Hostinger.
4. **Entrega do formulário** — hoje o formulário monta uma mensagem e abre o WhatsApp da VDB com tudo preenchido (sem servidor). Se quiser também receber por e-mail, dá pra plugar um serviço (ex.: Formspree).
5. **Endereço da agência de Mangaratiba** — confirmar (no site está "Av. Célio Lopes, 100 — Centro").
