# Cursor — Istruzioni di progetto: Salumificio Getra Sila

Sito vetrina statico (no e-commerce) per il **Salumificio Getra Sila** (Bocchigliero, Sila Greca — Calabria, dal 2002, famiglia Parrilla). Quattro pagine: Home, Chi Siamo, Prodotti, Contatti.

> **Lingua dei contenuti**: italiano. Code, classi, commenti tecnici: inglese.
> **Stile editoriale**: pergamena + bordeaux, serif Cormorant + sans Jost, stampe decorative, illustrazioni a tratto. Riferimento: design tradizionale ma elegante (no flat moderno).

---

## Stack & architettura

- **HTML/CSS/JS vanilla**, nessun framework, nessun bundler, nessun build step.
- Si apre con un semplice server statico (`python3 -m http.server` o equivalente).
- Font da Google Fonts (Cormorant Garamond, Jost, Allura).
- Web Component custom `<image-slot>` per drag-and-drop foto (in `image-slot.js`).
- Mobile menu in `menu.js`.

**Niente build pipeline, niente Node, niente npm**. Se serve aggiungere qualcosa, valuta prima se si può fare in CSS/JS puri.

---

## Struttura file

```
/
├── index.html            # Home
├── chi-siamo.html        # Storia, famiglia, territorio
├── prodotti.html         # Catalogo salumi
├── contatti.html         # Form, mappa, FAQ
├── styles.css            # Design system + componenti
├── image-slot.js         # Web component <image-slot>
├── menu.js               # Logica burger menu + overlay
└── cursor.md             # Questo file
```

Una nuova pagina = nuovo file HTML in root con stessa struttura `<head>`, topbar, footer.

---

## Design system

Tutte le variabili sono in `:root` in [styles.css](styles.css). **Usa SEMPRE le variabili CSS, mai valori hardcoded.**

### Palette

```css
--bg-cream: #f1e7d2;   /* pergamena base */
--bg-cream-soft: #f5eedb;
--bg-cream-warm: #e8dcc1;
--ink: #1f1810;        /* testo principale */
--ink-soft: #3a2e22;
--ink-mute: #6b5b48;
--wine: #6b1f23;       /* bordeaux, accento principale */
--wine-deep: #4f1418;
--sepia: #8a6f4a;      /* dettagli, stampe */
--gold-soft: #c9a366;  /* su sfondo scuro */
--dark: #1b120c;       /* footer, sezioni scure */
```

### Tipografia

- **Display**: `var(--ff-display)` → Cormorant Garamond (titoli H1-H4, citazioni, "stat__num")
- **Body / UI**: `var(--ff-body)` / `var(--ff-label)` → Jost (paragrafi, bottoni, eyebrow, nav)
- **Script**: `var(--ff-script)` → Allura (solo firma, "Lino Parrilla", "Sila")
- Eyebrow = label maiuscola con `letter-spacing: 0.28em`. Mai un titolo grande in maiuscolo.
- Le `em` sono **italic + colore bordeaux** dentro i titoli (es: `<em>tempo.</em>`).

### Scala tipografica (responsive con clamp)

```css
--fs-display-xl: clamp(56px, 7vw, 116px);  /* H1 hero */
--fs-display: clamp(44px, 5.4vw, 86px);    /* H1 */
--fs-h2: clamp(34px, 3.6vw, 60px);
--fs-h3: clamp(24px, 2vw, 32px);
--fs-lead: clamp(16px, 1.1vw, 18px);
```

### Layout

- `--maxw: 1440px` → larghezza massima contenuto
- `--gutter: clamp(20px, 3vw, 56px)` → padding orizzontale sezioni
- `--topbar-h: 92px` (72px su mobile <600px)
- Pattern sezione: `<section class="nome"><div class="nome__inner">...</div></section>` — l'inner gestisce maxw e padding.

### Bottoni

- `.btn` → bordeaux pieno (CTA primario)
- `.btn--ghost` → bordo bordeaux, sfondo trasparente
- `.btn--cream` → fondo crema su sezioni scure
- `.link-arrow` → link sottolineato con freccia animata

### Decorazioni ricorrenti

- `.diamond-divider` — divisore con rombi laterali
- `.corner-stamp` — timbro circolare angolo
- `.card--ornate` — card con angoli decorati (::before / ::after)
- `.botanical` — illustrazioni floreali laterali (opacità ~0.32)
- Bordi: `1px solid var(--sepia-line)`

---

## Convenzioni HTML / CSS / JS

### HTML

- `lang="it"` su `<html>`.
- Strutture semantiche: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`.
- `data-screen-label="..."` sul body identifica la pagina (usato dal design system).
- Topbar di pagina: `topbar topbar--cream` per pagine chiare, `topbar topbar--dark` per pagine con hero scuro (es. Chi Siamo).
- Nav-link attivo: classe `nav-link--active` (sia desktop che JS la replica nel mobile menu).

### CSS

- **BEM-lite**: `.block`, `.block__element`, `.block--modifier` (es. `.prod-card`, `.prod-card__title`, `.btn--ghost`).
- Stili specifici di una sola pagina vanno in `<style>` in fondo al body di quella pagina.
- Stili condivisi (componenti, design system, responsive globale) in `styles.css`.
- Niente `!important`, niente ID selectors, niente nested selectors profondi (>3 livelli).
- Niente reset CSS aggressivi, c'è già un reset minimale.

### JS

- Vanilla. IIFE `(function(){})()` per evitare globals.
- `var` o `const`/`let` come ti pare, ma resta coerente con i file esistenti (`var` in menu.js).
- Listener su `DOMContentLoaded` se serve interagire col DOM.
- Niente librerie esterne. Niente import/export module.

---

## Responsive

Breakpoint definiti in `styles.css`:

- **≤ 880px** — mobile/tablet: nav desktop nascosta, appare burger, hero in colonna, footer 2 col, etc.
- **≤ 600px** — telefono: topbar ridotta a 72px, logo più piccolo, footer 1 col, strip 2×2.
- **≤ 420px** — telefono piccolo: strip 1 col.

**Sempre testare a 320px, 375px, 768px, 1024px, 1440px.**

### Regole responsive

1. Mobile-first non è obbligatorio — il design parte da desktop, ma ogni nuova sezione DEVE avere il suo blocco `@media (max-width: 880px)`.
2. Mai larghezze fisse > 100vw. Sempre `max-width` + `width: 100%`.
3. Padding orizzontale = `var(--gutter)`, mai numeri fissi.
4. Font scalano con `clamp(min, fluid, max)`.
5. Immagini: `max-width: 100%; display: block;` (già nel reset).
6. `image-slot` è già responsive — non toccare le sue dimensioni interne.

---

## Componenti chiave

### `<image-slot>` (image-slot.js)

Web component per drag-and-drop di foto. Le foto droppate si salvano in localStorage e persistono tra i refresh.

```html
<image-slot id="prod-capocollo" shape="rect" placeholder="Capocollo intero e affettato"></image-slot>
```

- `id` univoco per pagina (la chiave di salvataggio)
- `shape="rect"` (default) o altro
- `placeholder` = testo mostrato finché non c'è una foto

**Per usare foto reali in produzione**: sostituire `<image-slot>` con `<img src="..." alt="..." />` mantenendo le stesse dimensioni CSS contenitore.

### Mobile menu (menu.js)

- Burger nella topbar (sotto 880px)
- Overlay fullscreen `<div class="mobile-menu" id="mobile-menu">`
- Pulsante X circolare in alto a destra (`.mobile-menu__close`)
- Active link calcolato dinamicamente in base a `location.pathname`
- Si chiude con: click voce, click X, Esc, resize > 880px

**Se aggiungi una pagina**: ricordati di aggiungere il link sia nella `<nav class="nav">` desktop che nella `<nav class="mobile-menu__nav">` di ogni pagina.

---

## Ricette — operazioni comuni

### Aggiungere una nuova pagina

1. Duplica `index.html` come template.
2. Cambia `<title>`, `data-screen-label`, e `nav-link--active`.
3. Aggiorna `<nav class="nav">` e `<nav class="mobile-menu__nav">` in **tutte e 5** le pagine per includere il nuovo link.
4. Aggiungi anche nel footer (`.footer-col ul`) se rilevante.

### Aggiungere un prodotto in `prodotti.html`

Pattern di una card prodotto:

```html
<article class="prod-card card--ornate">
  <div class="prod-card__head">
    <p class="prod-card__kicker">Etichetta breve</p>
    <span class="seal seal--dop"><svg>...</svg></span>
  </div>
  <h3 class="prod-card__title">Nome<br/>prodotto</h3>
  <image-slot id="prod-XXX" placeholder="Descrizione foto"></image-slot>
  <div class="prod-card__foot">
    <p class="prod-card__meta">Stagionatura 90 giorni</p>
    <p class="prod-card__var">Variante 1 · Variante 2</p>
  </div>
</article>
```

### Cambiare i contatti

Dati placeholder da sostituire ovunque appaiono (footer di tutte e 4 le pagine, `contatti.html`, mobile-menu):

- Telefono: `+39 0983 845 000`
- Email: `info@getrasila.it`
- P. IVA: `02xxx5xxxxx`
- Indirizzo: `Via Roma, 12 — 87060 Bocchigliero (CS)`

---

## Linee guida frontend (generali)

1. **Accessibilità**
   - Ogni `<button>` ha `aria-label` se contiene solo un'icona.
   - `aria-expanded`, `aria-controls`, `aria-hidden`, `role="dialog"`, `aria-modal` sono già usati nel mobile menu — mantienili.
   - Contrast ratio AA: bordeaux su crema ✓, crema su dark ✓.
   - Focus visibile su tutti gli elementi interattivi (non sopprimere mai `:focus`).

2. **Performance**
   - Niente JavaScript per cose che CSS può fare (animazioni, transizioni, hover).
   - Font preconnect già nel `<head>` di ogni pagina.
   - SVG inline invece di immagini per icone e decorazioni (già fatto).
   - Lazy loading per le foto reali: `<img loading="lazy" ...>`.

3. **SEO**
   - `<title>` unico per pagina (`Nome pagina — Salumificio Getra Sila`).
   - Aggiungere `<meta name="description">` per ogni pagina (al momento manca).
   - `<h1>` unico per pagina, gerarchia `h2`, `h3` coerente.
   - Link interni con testo descrittivo (no "clicca qui").

4. **Cura editoriale**
   - Apostrofi tipografici `'` non `'`.
   - Trattini lunghi `—` per incisi.
   - Numeri romani per anni storici se calzano (`est. MMII`).
   - Italiano formale ma caldo — il brand è artigianale, non aziendale.

---

## Cose da NON fare

- ❌ Non installare framework (React, Vue, Tailwind, Bootstrap…) — il design è pensato come HTML/CSS puro.
- ❌ Non spostare gli stili condivisi dentro `<style>` di una singola pagina.
- ❌ Non hardcodare colori, font, spazi — usa le variabili CSS.
- ❌ Non rimuovere le decorazioni SVG inline pensando siano "rumore" — sono il cuore dell'estetica editoriale.
- ❌ Non usare emoji nei contenuti del sito (solo nei commenti tecnici se serve).
- ❌ Non modificare la struttura della topbar / footer senza propagarlo a tutte e 4 le pagine.
- ❌ Non aggiungere librerie JS per cose semplici (slider, modal, ecc.) — scrivile a mano in vanilla.
- ❌ Non rompere la sticky topbar (`position: sticky; top: 0`).

---

## Continuare il progetto con Cursor

### Suggerimenti pratici

1. **Apri il progetto in Cursor**: `cursor .` dalla root.
2. **Cursor leggerà questo `cursor.md` per il contesto** — tienilo aggiornato quando aggiungi pattern nuovi.
3. **Prima di chiedere a Cursor di scrivere codice**: rimanda al design system di questo file (esempio: "usa la palette in cursor.md, sezione Design System").
4. **Per evoluzioni grosse** (es. integrare un CMS, aggiungere e-commerce), apri una discussione prima — il sito è oggi statico e ogni dipendenza esterna va valutata.

### Prompt utili da copiare

> "Aggiungi una nuova pagina `eventi.html` seguendo il pattern di `chi-siamo.html`. Hero scuro con titolo editoriale, poi 3 sezioni: prossimi eventi (card), galleria (image-slot), come prenotare (CTA). Rispetta le convenzioni in `cursor.md`."

> "Sostituisci tutti gli `<image-slot>` di `prodotti.html` con `<img loading='lazy'>` puntando a file in `/img/prodotti/`. Mantieni le dimensioni del contenitore."

> "Aggiungi `<meta name='description'>` a tutte e 4 le pagine, in italiano, ~150 caratteri ciascuna, focalizzate sul tema della pagina."

> "Aggiungi una sezione FAQ accordion in `contatti.html` con 5 domande tipiche su spedizioni e ordini. Solo HTML+CSS, niente JS — usa `<details>` / `<summary>`."

### Cose a cui Cursor tende a sbagliare in questo progetto

- Cursor potrebbe voler "modernizzare" lo stile (flat, sans-serif, blu) — **rifiuta**, mantieni l'editoriale.
- Potrebbe voler usare framework — ricordagli di restare in vanilla.
- Potrebbe sostituire SVG inline con icone Lucide / Font Awesome — non farlo, le decorazioni sono custom.
- Potrebbe rifattorizzare in componenti — non c'è un sistema di componenti, è HTML statico.

---

## Comandi utili

```bash
# Avvia server locale
python3 -m http.server 8000
# oppure
npx serve .

# Verifica che tutte le pagine rispondano
for f in index chi-siamo prodotti contatti; do
  curl -s -o /dev/null -w "$f: %{http_code}\n" http://localhost:8000/$f.html
done

# Grep di una classe in tutto il progetto
grep -rn "topbar__cta" *.html

# Validare HTML (richiede npm i -g html-validate)
html-validate *.html
```

---

## Riferimenti utili

- Cormorant Garamond — https://fonts.google.com/specimen/Cormorant+Garamond
- Jost — https://fonts.google.com/specimen/Jost
- Allura — https://fonts.google.com/specimen/Allura
- MDN Web Components (image-slot) — https://developer.mozilla.org/en-US/docs/Web/Web_Components

---

_Ultimo aggiornamento manuale: aggiunta della X di chiusura nel mobile menu. Aggiornare questo file quando si introducono pattern nuovi._
