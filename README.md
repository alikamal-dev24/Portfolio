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
assets/work/        Project screenshots:  <slug>.webp  (e.g. ric-architects.webp)
assets/ali-kamal.webp  Your photo (optional)
robots.txt, sitemap.xml
```

## Add a project
Open `js/data.js`, copy one object inside `window.PROJECTS`, change the fields.
Add a `case:{...}` object to give it a case-study page. Only write facts that are true.

## Change which projects show on the home page
The home page shows the 4 hand-picked in `index.html` (search for `class="proj`).

## Publish a testimonial
Move it from the commented "held back" list into `window.TESTIMONIALS` in `js/data.js`.

## Contact form
Paste a Formspree URL into `data-endpoint=""` on `<form id="f">` in `index.html`.
Without it, the form opens the visitor's email app.

Upload all files together, keeping the folders (css/, js/, assets/).
