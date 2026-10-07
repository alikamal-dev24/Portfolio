/* =====================================================================
   projects-page.js — behaviour for projects.html
   Shows every project from js/data.js with search, filters and
   "Show more". Add a project in data.js and it appears here.
   ===================================================================== */
(() => {
  'use strict';
  const $ = sel => document.querySelector(sel);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const useGsap = !reduceMotion && window.gsap;
  const PAGE_SIZE = 12;

  $('#yr').textContent = new Date().getFullYear();

  /* ── Filters, search and the project grid ───────────────────── */
  const grid = $('#pj'), moreBtn = $('#mo');
  let filter = 'All', query = '', visible = PAGE_SIZE;

  // Only show filter buttons that actually have projects behind them.
  const ORDER = ['WordPress', 'Bricks Builder', 'Custom Development', 'Page Development'];
  const filters = ['All', ...ORDER.filter(f => PROJECTS.some(p => p.filters.includes(f)))];
  $('#fl').innerHTML = filters.map(f => `<button class="${f === 'All' ? 'on' : ''}">${f}</button>`).join('');

  function render(animate) {
    const list = PROJECTS.filter(p =>
      (filter === 'All' || p.filters.includes(filter)) &&
      (p.name + p.desc + p.cat + p.tags.join(' ')).toLowerCase().includes(query)
    );
    grid.innerHTML = list.slice(0, visible).map(p => card(p)).join('') ||
      '<p class="none">No projects match your search.</p>';
    $('#cnt').textContent = `Showing ${Math.min(visible, list.length)} of ${list.length} project${list.length === 1 ? '' : 's'}`;
    moreBtn.style.display = visible >= list.length ? 'none' : '';
    if (useGsap && animate) {
      gsap.from('#pj .pc', { y: 50, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out', clearProps: 'opacity,transform' });
    }
  }

  $('#fl').onclick = e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    filter = btn.textContent; visible = PAGE_SIZE;
    $('#fl .on').classList.remove('on'); btn.classList.add('on');
    render(true);
  };
  $('#q').oninput = e => { query = e.target.value.toLowerCase().trim(); visible = PAGE_SIZE; render(true); };
  moreBtn.onclick = () => {
    const before = visible;
    visible += PAGE_SIZE;
    render(false);
    if (useGsap) gsap.from([...grid.children].slice(before), { y: 40, opacity: 0, duration: 0.7, stagger: 0.06, clearProps: 'opacity,transform' });
  };
  render(false);

  /* ── 3D tilt on cards (event delegation, so it survives re-renders) ── */
  if (!reduceMotion && canHover) {
    grid.addEventListener('mousemove', e => {
      const c = e.target.closest('.pc');
      if (!c) return;
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.transform = `perspective(900px) rotateX(${(0.5 - y / r.height) * 6}deg) rotateY(${(x / r.width - 0.5) * 6}deg)`;
    });
    grid.addEventListener('mouseout', e => {
      const c = e.target.closest('.pc');
      if (c && !c.contains(e.relatedTarget)) c.style.transform = '';
    });
  }

  /* ── Header, progress bar, mobile menu ──────────────────────── */
  const header = $('#hd'), bar = $('#bar');
  addEventListener('scroll', () => {
    header.classList.toggle('s', scrollY > 20);
    bar.style.width = scrollY / (document.documentElement.scrollHeight - innerHeight) * 100 + '%';
  }, { passive: true });
  const menuBtn = $('#mb'), menu = $('#nv');
  menuBtn.onclick = () => {
    const open = menu.classList.toggle('o');
    menuBtn.classList.toggle('o', open);
    menuBtn.setAttribute('aria-expanded', open);
  };

  /* ── Orange cursor ──────────────────────────────────────────── */
  if (canHover) {
    const dot = $('.cur'), ring = $('.ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px)`; });
    (function loop() { rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16; ring.style.transform = `translate(${rx}px, ${ry}px)`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => ring.classList.toggle('big', !!e.target.closest('a, button, .pc')));
  }

  /* ── GSAP: the orange curtain lifts, then content rises in ──── */
  if (useGsap) {
    gsap.set('.wipe', { yPercent: -100 });
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .to('.wipe', { yPercent: -200, duration: 1, ease: 'power4.inOut' })
      .from('#hd', { yPercent: -120, opacity: 0, duration: 0.9 }, '-=0.5')
      .from('.back', { x: -30, opacity: 0, duration: 0.7 }, '<0.1')
      .from('h1 .c2', { yPercent: 125, rotate: 6, duration: 1.1, stagger: 0.1 }, '<')
      .from('.ph .lead, .tools, .cnt', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, clearProps: 'opacity,transform' }, '-=0.7')
      .from('#pj .pc', { y: 60, opacity: 0, duration: 0.9, stagger: 0.07, clearProps: 'opacity,transform' }, '-=0.5');

    addEventListener('pageshow', e => { if (e.persisted) gsap.set('.wipe', { yPercent: 0 }); });
    document.addEventListener('click', e => {         // wipe out when going back to the home page
      const link = e.target.closest('a[href^="index.html"]');
      if (!link || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      gsap.set('.wipe', { yPercent: 0 });
      gsap.to('.wipe', { yPercent: -100, duration: 0.8, ease: 'power4.inOut', onComplete: () => (location.href = link.href) });
    });
  }
})();
