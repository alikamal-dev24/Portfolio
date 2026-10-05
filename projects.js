/* ====== ALL YOUR PROJECTS LIVE HERE ======
   Add a new project = copy one line below and edit it. Both the home page
   ("featured: true" ones only) and projects.html read from this list.
   h = card colour (0-360), abbr = big letters on the card. */
window.PROJECTS=[
 {name:"GMK Lines",url:"https://gmklines.com",desc:"Transport services platform with optimized layout structures.",builder:"Bricks Builder",cat:"Business",h:22,abbr:"GMK",featured:true},
 {name:"SKED",url:"https://sked.life",desc:"Responsive static layouts with interactive UI elements.",builder:"Divi Builder",cat:"Interactive UI",h:265,abbr:"SKED",featured:true},
 {name:"Sereti Africa",url:"https://seretiafrica.com",desc:"Clean corporate website for a strategy consulting firm.",builder:"Bricks Builder",cat:"Corporate",h:150,abbr:"SA",featured:true},
 {name:"Stranger Things Hub",url:"https://strangerthingshub.com",desc:"High-traffic content and blogging platform.",builder:"Bricks Builder",cat:"Blog",h:350,abbr:"ST",featured:true},
 {name:"In The Event",url:"https://intheevent.com",desc:"Custom e-commerce structure and product listings.",builder:"Oxygen Builder",cat:"E-commerce",h:195,abbr:"ITE",featured:true}
 // {name:"Client name",url:"https://example.com",desc:"One line about it.",builder:"Elementor",cat:"E-commerce",h:300,abbr:"CN",featured:false},
];
window.card=(p,c="")=>`<a class="pc ${c}" href="${p.url}" target="_blank" rel="noopener"><div class="art" style="--h:${p.h}"><div class="win"><i></i><i></i><i></i><u></u><u></u><u></u></div><b>${p.abbr}</b></div><div class="pi"><div><h3>${p.name}</h3><p>${p.desc}</p><div class="tags"><span>${p.builder}</span><span>${p.cat}</span></div></div><span class="go">↗</span></div></a>`;
