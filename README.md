# Boltera Medical — boltera.ca

Static marketing site. Plain HTML / CSS / vanilla JS — no build step.

## Files
- `index.html` — home
- `our-company.html` — company / facility / timeline
- `products.html` — products catalog
- `contact.html` — contact form + map
- `styles.css` — shared styles
- `translate.js` — EN/TR toggle (Google Translate widget)
- `assets/` — logo + hero photo
- `CNAME` — GitHub Pages custom domain (`boltera.ca`)

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then in the GitHub repo:
1. **Settings → Pages**
2. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`
3. The `CNAME` file already sets `boltera.ca` as the custom domain
4. Tick **Enforce HTTPS** once it lights up

## Porkbun DNS for boltera.ca

| Type | Host | Answer |
|---|---|---|
| A | (root) | 185.199.108.153 |
| A | (root) | 185.199.109.153 |
| A | (root) | 185.199.110.153 |
| A | (root) | 185.199.111.153 |
| CNAME | www | &lt;your-username&gt;.github.io |

Propagation: 10–30 min. SSL auto-issues from Let's Encrypt after DNS resolves.

## Local preview

Any static server works, e.g.:
```bash
python3 -m http.server 8000
# or
npx serve .
```

## Notes
- Contact form (`contact.html`) currently shows a success banner client-side only — it does not send email. To collect submissions, point the form `action` at a service like Formspree or Netlify Forms.
- EN/TR toggle relies on the public Google Translate widget — no API key.
