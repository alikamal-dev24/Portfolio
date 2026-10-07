/* =====================================================================
   case-study.js — builds a case-study page from js/data.js
   URL format: case-study.html?p=<project-slug>
   Sections only appear when the project's `case` object has that field,
   so nothing is ever shown as "To be added".
   ===================================================================== */
(() => {
  'use strict';
  const $ = sel => document.querySelector(sel);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  $('#yr').textContent = new Date().getFullYear();

  /* Header + mobile menu */
  const header = $('#hd');
  addEventListener('scroll', () => header.classList.toggle('s', scrollY > 20), { passive: true });
  const menuBtn = $('#mb'), menu = $('#nv');
  menuBtn.onclick = () => {
    const open = menu.classList.toggle('o');
    menuBtn.classList.toggle('o', open);
    menuBtn.setAttribute('aria-expanded', open);
  };

  /* Orange cursor */
  if (canHover) {
    const dot = $('.cur'), ring = $('.ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px)`; });
    (function loop() { rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16; ring.style.transform = `translate(${rx}px, ${ry}px)`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => ring.classList.toggle('big', !!e.target.closest('a, button')));
  }

  /* Find the project from the URL */
  const slug = new URLSearchParams(location.search).get('p');
  const project = PROJECTS.find(p => p.slug === slug);
  const root = $('#root');

  if (!project) {
    root.innerHTML = '<a class="back" href="projects.html">← All projects</a><h1>Project not found</h1>';
    return;
  }

  const c = project.case || {};
  document.title = `${project.name} — Case Study | Ali Kamal`;
  const metaDescription = document.querySelector('meta[name=description]');
  if (metaDescription) metaDescription.content = project.desc;

  // A section is only rendered when it has content.
  const section = (title, body) => body ? `<h2>${title}</h2>${body}` : '';
  const tagList = items => '<div class="tags">' + items.map(x => `<span>${esc(x)}</span>`).join('') + '</div>';

  const facts = [
    ['Industry', project.cat], ['Role', project.role], ['Technology', project.tech.join(' · ')],
    ['Client', c.client], ['Year', c.year]
  ].filter(f => f[1]);

  root.innerHTML = `
    <a class="back" href="projects.html">← All projects</a>
    <small style="color:var(--a);font-weight:600;display:block">Case study</small>
    <h1>${esc(project.name)}</h1>
    <div class="facts">${facts.map(f => `<div><span>${f[0]}</span><b>${esc(f[1])}</b></div>`).join('')}</div>

    <div class="frame">
      <div class="fb"><i></i><i></i><i></i><span>${esc(project.url.replace('https://', '').replace(/[/]$/, ''))}</span></div>
      <div class="screen" style="--h:${project.h}"><b>${esc(project.abbr)}</b>
        <img src="${esc(project.shot)}" alt="${esc(project.name)} website" onerror="this.remove()"></div>
    </div>

    ${section('Overview', '<p>' + esc(c.overview || project.desc) + '</p>')}
    ${section('The challenge', c.challenge && '<p>' + esc(c.challenge) + '</p>')}
    ${section('The approach', c.approach && '<p>' + esc(c.approach) + '</p>')}
    ${section('What I built', c.built && '<ul>' + c.built.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>')}
    ${section('Key website areas', c.areas && tagList(c.areas))}
    ${section('Technology', tagList(project.tech))}
    ${section('The result', c.result && '<p>' + esc(c.result) + '</p>')}
    ${section('Gallery', c.gallery && '<div class="gal">' + c.gallery.map(g => `<img src="${esc(g)}" alt="${esc(project.name)} screenshot" loading="lazy">`).join('') + '</div>')}

    <div class="end">
      <h2>Have a similar project? Let's build it.</h2>
      <div class="cta" style="justify-content:center">
        <a class="btn p" href="index.html#contact">Start a Conversation →</a>
        <a class="btn" href="${esc(project.url)}" target="_blank" rel="noopener">View Live Website ↗</a>
      </div>
    </div>`;

  if (!reduceMotion && window.gsap) {
    gsap.from('.cs .wrap > *', { y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', clearProps: 'opacity,transform' });
  }
})();
