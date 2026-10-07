
window.PROJECTS=[
 {
  "name": "GMK Lines",
  "url": "https://gmklines.com",
  "desc": "Transport services platform with optimized layout structures.",
  "builder": "Bricks Builder",
  "cat": "Transport",
  "h": 22,
  "abbr": "GMK",
  "featured": true,
  "slug": "gmk-lines",
  "shot": "assets/work/gmk-lines.webp"
 },
 {
  "name": "Sereti Africa",
  "url": "https://seretiafrica.com",
  "desc": "Clean corporate website for a strategy consulting firm.",
  "builder": "Bricks Builder",
  "cat": "Corporate",
  "h": 150,
  "abbr": "SA",
  "featured": true,
  "slug": "sereti-africa",
  "shot": "assets/work/sereti-africa.webp"
 },
 {
  "name": "In The Event",
  "url": "https://intheevent.com",
  "desc": "Custom e-commerce structure and product listings.",
  "builder": "Oxygen Builder",
  "cat": "E-commerce",
  "h": 195,
  "abbr": "ITE",
  "featured": true,
  "slug": "in-the-event",
  "shot": "assets/work/in-the-event.webp"
 },
 {
  "name": "Stranger Things Hub",
  "url": "https://strangerthingshub.com",
  "desc": "High-traffic content and blogging platform.",
  "builder": "Bricks Builder",
  "cat": "Blog",
  "h": 350,
  "abbr": "ST",
  "featured": true,
  "slug": "stranger-things-hub",
  "shot": "assets/work/stranger-things-hub.webp"
 },
 {
  "name": "SKED",
  "url": "https://sked.life",
  "desc": "Responsive static layouts with interactive UI elements.",
  "builder": "Divi Builder",
  "cat": "Interactive UI",
  "h": 265,
  "abbr": "SKED",
  "featured": false,
  "slug": "sked",
  "shot": "assets/work/sked.webp"
 }
];
/* TESTIMONIALS: real client feedback only. While this list is empty the whole reviews section stays hidden.
 Template:  {quote:"...",name:"Client Name",role:"Role, Company",photo:"assets/clients/name.webp",project:"GMK Lines"} */
window.TESTIMONIALS=[];
window.card=(p,c="")=>{const cs=!!p.case,h=cs?`case-study.html?p=${p.slug}`:p.url,x=cs?"":' target="_blank" rel="noopener"';
return `<a class="pc ${c}" href="${h}"${x}><div class="art" style="--h:${p.h}"><div class="win"><i></i><i></i><i></i><u></u><u></u><u></u></div><b>${p.abbr}</b><img src="${p.shot}" alt="${p.name} website" loading="lazy" onerror="this.remove()"></div><div class="pi"><div><h3>${p.name}</h3><p>${p.desc}</p><div class="tags"><span>${p.builder}</span><span>${p.cat}</span></div></div><span class="go">↗</span></div></a>`};
