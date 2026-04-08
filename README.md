# BloomWay 🌸

> Travel recommendation website built with vanilla HTML, CSS & JavaScript.

BloomWay is a static travel recommendation site that helps users discover beaches, temples, and cities around the world. It features category-based search, live local time for each destination, dynamic booking pages, and a Stripe-styled payment mockup. Built as the final project for the **IBM Full-Stack JavaScript Developer** course.

🔗 **Live demo:** [https://sepuldosky.github.io/BloomwayWebSite/](https://sepuldosky.github.io/BloomwayWebSite/)

---

## ✨ Features

- **Smart search** — type `beach`, `temple`, `country`, or even aliases like `usa`, `tokyo`, or `rio`. Case-insensitive and tolerant to singular/plural variations.
- **Cross-page search** — search from any page (Home, About Us, Contact Us); results always render on the home page.
- **Live world clocks** — each result card shows the current local time at that destination, updated every second using the browser's `Intl.DateTimeFormat` API.
- **Dynamic booking pages** — click any destination card (or the "BOOK NOW" hero button for a random pick) to open a tailored booking page with dates, price, and trip details generated deterministically per destination.
- **Stripe-style payment mockup** — clean, realistic checkout form (demo only, no real transactions).
- **Fully responsive** — adapts to desktop, tablet, and mobile.
- **No frameworks, no build step** — pure HTML, CSS, and vanilla JavaScript.

---

## 📁 Project Structure

```
BloomwayWebSite/
├── index.html                  # Home page with hero and search
├── about.html                  # About Us — company info and team
├── contact.html                # Contact Us — info and contact form
├── booking.html                # Dynamic booking page (per destination)
├── style.css                   # Shared stylesheet for all pages
├── travel_recommendation.js    # Search, render, time, and booking logic
├── TravelData.json             # Destinations data source
└── images/                     # Destination photos
    ├── Sydney.jpg
    ├── Tokyo.jpg
    ├── ... (11 images)
```

---

## 🔍 How the search works

The search input accepts free-text queries and matches them against the catalog using these rules:

| User types          | Returns                                  |
| ------------------- | ---------------------------------------- |
| `beach`, `beaches`  | All beaches                              |
| `temple`, `temples` | All temples                              |
| `country`, `countries` | All cities from all countries        |
| `usa`, `us`, `america`, `new york` | Cities in the United States |
| `japan`, `tokyo`, `kyoto` | Cities in Japan                    |
| `australia`, `sydney`, `melbourne` | Cities in Australia        |
| `brazil`, `rio`, `sao paulo` | Cities in Brazil                 |

All matching is case-insensitive and uses `.toLowerCase().trim().includes(...)` for flexibility. The alias mapping lives in the `COUNTRY_ALIASES` object inside `travel_recommendation.js` and can be extended easily.

---

## 🛠️ Technologies

- **HTML5** — semantic markup
- **CSS3** — Grid, Flexbox, custom properties, responsive media queries
- **Vanilla JavaScript (ES6+)** — `fetch`, `Intl.DateTimeFormat`, `URLSearchParams`, event delegation
- **Font Awesome 6** — iconography (CDN)
- **Google Fonts** — Montserrat & Playfair Display (CDN)
- **GitHub Pages** — hosting

---

## 🚀 Running locally

This project has no build step. You only need a static file server because the JSON is loaded via `fetch`.

**Option 1 — VS Code Live Server (recommended):**
1. Open the project folder in VS Code.
2. Install the *Live Server* extension if you don't have it.
3. Right-click `index.html` → **Open with Live Server**.

**Option 2 — Python:**
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

⚠️ Opening `index.html` directly with double-click will not work because browsers block `fetch()` on local files for security reasons.

---

## 📋 IBM Course Checklist

This project satisfies all requirements of the *IBM Full-Stack JavaScript Developer* final assessment:

- ✅ Home page with Home, About Us, and Contact Us sections
- ✅ About Us page with company information and team guidance
- ✅ Contact Us page with contact info and email form
- ✅ Navigation bar with six elements: Home, About Us, Contact Us, search input, Search button, Clear button
- ✅ Search returns at least 2 results for `beach`, `temple`, and `country`
- ✅ Results display images with destination details
- ✅ Deployed via GitHub Pages

---

## 👤 Author

**Matías Sepúlveda**
[GitHub @Sepuldosky](https://github.com/Sepuldosky)

---

## 📄 License

This project is part of an educational course. Image assets are placeholders for demonstration purposes only.
