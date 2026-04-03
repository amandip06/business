# 🎂 Prince Home Made Cakes & Chocolates

**A premium, fully animated front-end business website**  
Owner: **Arpita Pradip Singh**

---

## ✨ Features

- 🌞 / 🌙 Light & Dark mode toggle (saved in localStorage)
- 🎬 Animated loading screen with cake bounce
- 🖱️ Custom animated cursor (desktop)
- 📜 Scroll progress bar
- 🍰 Floating cake/chocolate particles
- 🎂 Scroll-reveal animations on every section
- 🛒 Product cards with Quick View modal
- 🔍 Category filter for products
- 🌟 Today's Special spotlight section
- 💬 Testimonials auto-sliding carousel (with touch support)
- 📊 Animated number counters
- 🖼️ Gallery with hover zoom & lightbox
- 🏷️ Offers with copy-to-clipboard promo codes
- ❓ FAQ accordion
- 📋 Order process steps
- ✅ Contact/Order form with full front-end validation
- 💚 WhatsApp floating order button
- ⬆️ Back-to-top button
- 📱 Fully responsive: mobile, tablet, desktop

---

## 📁 Folder Structure

```
prince-cakes/
├── index.html              ← Main HTML file
├── README.md               ← This file
│
├── css/
│   ├── style.css           ← Core styles, variables, components
│   ├── animations.css      ← All animation keyframes & effects
│   └── responsive.css      ← Breakpoint overrides
│
├── js/
│   ├── theme-toggle.js     ← Dark/light mode logic
│   ├── animations.js       ← Cursor, scroll reveal, counters, particles
│   ├── products.js         ← Loads JSON, renders all sections
│   └── main.js             ← Nav, form validation, misc interactions
│
├── data/
│   └── products.json       ← All product, testimonial, offer & FAQ data
│
└── assets/
    ├── images/             ← Add your real product photos here
    └── icons/              ← Add custom icons here
```

---

## 🚀 How to Run Locally

### Option 1 — Simple (Open in Browser)

> ⚠️ Due to `fetch()` loading `products.json`, you **cannot** simply double-click `index.html` in most browsers (CORS policy blocks local file fetches). Use one of the methods below instead.

### Option 2 — VS Code Live Server (Recommended)

1. Install **VS Code**: https://code.visualstudio.com
2. Install the **Live Server** extension (by Ritwick Dey)
3. Open the `prince-cakes/` folder in VS Code
4. Right-click `index.html` → **"Open with Live Server"**
5. Browser opens at `http://127.0.0.1:5500`

### Option 3 — Python HTTP Server

Open a terminal in the `prince-cakes/` folder and run:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Option 4 — Node.js

```bash
npx serve .
```

Then open the URL shown in terminal (usually `http://localhost:3000`).

---

## 🎨 Customisation Guide

### Update Business Details

Open `index.html` and search/replace:
- `XXXXXXXXXX` → your actual phone number
- `princecakes@email.com` → your real email
- `Your City, State, India — 400 XXX` → your address
- WhatsApp link: `https://wa.me/91XXXXXXXXXX` → your number

### Add Real Product Images

Replace the emoji placeholders in `products.json`:
1. Add your images to `/assets/images/`
2. In `products.js`, update `productCardHTML()` — replace the emoji `<span>` with an `<img>` tag

### Update Products

Edit `data/products.json` to:
- Change product names, descriptions, prices, ratings
- Add or remove products
- Add new categories

### Change Colors

All colors are CSS variables in `css/style.css` under `:root { }`.  
Change `--caramel`, `--gold`, `--rose`, `--choco-dark` etc. to match your brand.

### Update Fonts

Fonts are loaded from Google Fonts in `style.css` `@import` at the top.  
Change `Playfair Display`, `DM Sans`, or `Dancing Script` as desired.

---

## 📱 Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Chrome/Safari | ✅ Full |

---

## 📦 Technologies Used

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, Grid, Flexbox, Animations, Backdrop-filter
- **Vanilla JavaScript (ES6+)** — No frameworks, no dependencies
- **JSON** — Product & content data
- **Google Fonts** — Playfair Display, DM Sans, Dancing Script
- **IntersectionObserver API** — Scroll reveal
- **Web Animations / CSS Keyframes** — All motion effects

---

## 💡 Tips

- To add real WhatsApp ordering, replace `91XXXXXXXXXX` with your WhatsApp number (country code + number, no spaces)
- For a real contact form backend, connect to **Formspree**, **EmailJS**, or **Web3Forms** (all free tiers available)
- For SEO, update the `<meta>` description and title in `index.html`
- Add your Google Maps embed in the map placeholder section in `index.html`

---

*Made with ❤️ for Prince Home Made Cakes & Chocolates*  
*© 2025 Arpita Pradip Singh — All Rights Reserved*
