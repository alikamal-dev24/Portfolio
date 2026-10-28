# Ali Kamal portfolio: file guide

```
index.html          Home page (HTML only)
projects.html       All projects page
case-study.html     Case-study template (reads ?p=<slug>)
css/style.css       ALL styles. Colours/fonts are variables in :root at the top
js/data.js          YOUR CONTENT: projects + testimonials (edit this most often)
js/main.js          Home page behaviour (typing role, cursor, tabs, slider, form, GSAP)
js/projects-page.js Projects page (search, filters, show more)
js/case-study.js    Builds a case-study page from data.js
assets/work/        Optional project screenshots: <slug>.jpg; cards show initials until real screenshots are added
assets/ali-kamal.webp  Your photo (optional)
robots.txt, sitemap.xml
```

## Add a project
Open `js/data.js`, copy one object inside `window.PROJECTS`, change the fields.
Add a `case:{...}` object to give it a case-study page. Only write facts that are true.

## Change which projects show on the home page
The home page shows the 4 hand-picked in `index.html` (search for `class="proj`).

## Testimonials
Keep `window.TESTIMONIALS` empty until each client approves the exact quote and attribution. Never publish drafted or unverified reviews as client testimonials.

## Contact form
`js/form.js` handles the form (it loads before `main.js` and takes over, so nothing is sent twice).
`data-endpoint` on `<form id="f">` in `index.html` is where messages are posted. It is set to FormSubmit
(`https://formsubmit.co/ajax/<your email>`). The FIRST message you send makes FormSubmit email you a
confirmation link; click it once. To use Formspree, paste your Formspree URL into `data-endpoint`.
For Web3Forms use `https://api.web3forms.com/submit` and put your access key in `data-key`.
If `data-endpoint` is empty or sending fails, visitors get a link to email you. Change the address in
`data-endpoint` and `data-email` together.

## SEO, icons and case-study pages
Every page has its own title, description, canonical URL, share tags and structured data.
Icons: favicon.ico/.svg/-16/-32, apple-touch-icon, icon-192/512, site.webmanifest. Share image: og-image.png.
Projects that have a `case` in data.js also need a page in `work/<slug>.html` (copy an existing one, change
the slug, title, description, canonical and the text inside <noscript>) and a line in sitemap.xml.
`case-study.html` is the generic template: noindex, and it forwards old links to the new `work/` pages.

Upload all files together, keeping the folders (css/, js/, assets/).
