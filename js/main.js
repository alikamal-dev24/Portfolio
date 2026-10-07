/* =====================================================================
   main.js — behaviour for the HOME page (index.html)

   Sections (search for the numbers):
   1  Setup & helpers          8  Counters
   2  Typing role              9  Process timeline line
   3  Marquee                  10 Technical tabs
   4  Header & navigation      11 Testimonials slider
   5  Hero spotlight           12 Contact form
   6  Cursor                   13 Animations (GSAP, with a CSS fallback)
   7  Orb tilt & magnet buttons
   ===================================================================== */
(() => {
  'use strict';

  /* 1 ── Setup & helpers ─────────────────────────────────────────── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover     = matchMedia('(hover: hover) and (pointer: fine)').matches;
  // GSAP is loaded from a CDN. If it fails to load, the site still works.
  const useGsap      = !reduceMotion && window.gsap && window.ScrollTrigger;

  $('#yr').textContent = new Date().getFullYear();

  /* 2 ── Typing role in the hero ─────────────────────────────────── */
  const roles = ['Front-End Developer', 'WordPress Developer', 'Bricks Builder Expert', 'Performance Specialist'];
  const roleEl = $('#ty');
  let roleIndex = 0, charCount = roles[0].length, deleting = true;

  function typeRole() {
    if (deleting) {
      charCount--;
      if (charCount <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    } else {
      charCount++;
      if (charCount >= roles[roleIndex].length) deleting = true;
    }
    roleEl.textContent = roles[roleIndex].slice(0, charCount);
    const pause = (charCount >= roles[roleIndex].length && deleting) ? 1800 : deleting ? 35 : 75;
    setTimeout(typeRole, pause);
  }
  if (!reduceMotion) typeRole();

  /* 3 ── Marquee: duplicate the items so the loop is seamless ────── */
  const marquee = $('#mt');
  marquee.innerHTML += marquee.innerHTML;

  /* 4 ── Header, scroll progress bar, active link, mobile menu ───── */
  const header = $('#hd');
  const bar    = $('#bar');
  const navLinks = $$('nav a');
  const navTargets = navLinks.map(a => $(a.getAttribute('href')));

  addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('s', scrollY > 20);
    bar.style.width = (scrollY / maxScroll * 100) + '%';

    // Highlight the link whose section is closest to the top of the screen
    // (works even if the menu order differs from the page order).
    let current = 0, closest = -Infinity;
    navTargets.forEach((section, i) => {
      if (!section) return;
      const top = section.getBoundingClientRect().top;
      if (top < innerHeight * 0.4 && top > closest) { closest = top; current = i; }
    });
    navLinks.forEach((a, i) => a.classList.toggle('on', i === current));
  }, { passive: true });

  const menuBtn = $('#mb');
  const menu    = $('#nv');
  function setMenu(open) {
    menu.classList.toggle('o', open);
    menuBtn.classList.toggle('o', open);
    menuBtn.setAttribute('aria-expanded', open);
  }
  menuBtn.onclick = () => setMenu(!menu.classList.contains('o'));
  navLinks.forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* 5 ── Hero spotlight follows the mouse ────────────────────────── */
  const hero = $('.hero');
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  /* 6 ── Custom cursor: orange dot + trailing ring ───────────────── */
  if (canHover) {
    const dot = $('.cur'), ring = $('.ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    });
    (function followLoop() {              // the ring eases toward the dot
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(followLoop);
    })();
    document.addEventListener('mouseover', e => {
      ring.classList.toggle('big', !!e.target.closest('a, button, .card, .frame, .bt, .sv, [role=tab]'));
    });
  }

  /* 7 ── Hero orb tilt + magnetic buttons ────────────────────────── */
  if (!reduceMotion && canHover) {
    const orb = $('.port');
    orb.addEventListener('mousemove', e => {
      const r = orb.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      orb.style.transition = 'transform .1s';
      orb.style.transform = `perspective(900px) rotateX(${(0.5 - y / r.height) * 10}deg) rotateY(${(x / r.width - 0.5) * 10}deg)`;
    });
    orb.addEventListener('mouseleave', () => {
      orb.style.transition = 'transform .5s';
      orb.style.transform = '';
    });

    $$('.mag').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.2;
        const dy = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => (btn.style.transform = ''));
    });
  }

  /* Sticky "Let's Talk" button: appears after the hero, hides at the contact form */
  const stickyCta = $('#stk');
  let contactVisible = false;
  const updateSticky = () => stickyCta.classList.toggle('on', scrollY > innerHeight * 0.6 && !contactVisible);
  new IntersectionObserver(entries => { contactVisible = entries[0].isIntersecting; updateSticky(); }).observe($('#contact'));
  addEventListener('scroll', updateSticky, { passive: true });

  /* 8 ── Counters: real numbers live in the HTML; count up on view ─ */
  if (!reduceMotion) {
    $$('[data-n]').forEach(el => {
      const target = +el.dataset.n, suffix = el.dataset.s || '';
      new IntersectionObserver((entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        let start = null;
        const step = t => {
          start ??= t;
          const p = Math.min((t - start) / 1400, 1);                   // 0 → 1
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (p < 1 ? '' : suffix);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, { threshold: 0.6 }).observe(el);
    });
  }

  /* 9 ── Process timeline: the line draws in when it scrolls into view */
  const timeline = $('#tlh');
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) { timeline.classList.add('in'); obs.disconnect(); }
  }, { threshold: 0.35 }).observe(timeline);

  /* 10 ── "Beyond page building" tabs (keyboard accessible) ──────── */
  const tabs   = $$('[role=tab]');
  const panels = $$('[role=tabpanel]');
  function selectTab(i) {
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
    panels.forEach((p, k) => (p.hidden = k !== i));
    if (useGsap) {
      gsap.from(panels[i].querySelectorAll('h3, li'), {
        y: 18, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out', clearProps: 'opacity,transform'
      });
    }
  }
  tabs.forEach((tab, i) => {
    tab.onclick = () => selectTab(i);
    tab.onkeydown = e => {
      const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
      if (next === null) return;
      e.preventDefault();
      const j = (next + tabs.length) % tabs.length;
      selectTab(j); tabs[j].focus();
    };
  });

  /* 11 ── Testimonials slider (data comes from js/data.js) ──────── */
  const reviews = window.TESTIMONIALS || [];
  const reviewSection = $('#reviews');
  if (reviews.length && reviewSection) {
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const track = $('#tk'), dots = $('#dt');
    let current = 0;
    reviewSection.hidden = false;

    track.innerHTML = reviews.map((t, k) => `
      <div class="slide" role="group" aria-roledescription="slide" aria-label="${k + 1} of ${reviews.length}">
        <figure>
          <div class="stars" role="img" aria-label="5 out of 5 stars">★★★★★</div>
          <blockquote>“${esc(t.quote)}”</blockquote>
          <figcaption>
            ${t.photo ? `<img src="${esc(t.photo)}" alt="" loading="lazy" onerror="this.remove()">` : ''}
            <div><b>${esc(t.name)}</b><span>${esc(t.role || '')}</span>${t.project ? ` · <a href="projects.html">${esc(t.project)}</a>` : ''}</div>
          </figcaption>
        </figure>
      </div>`).join('');
    dots.innerHTML = reviews.map((_, k) => `<button aria-label="Show testimonial ${k + 1}"></button>`).join('');

    const slides = $$('.slide');
    const dotButtons = $$('button', dots);
    function goTo(n) {
      current = (n + reviews.length) % reviews.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      slides.forEach((s, k) => { s.inert = k !== current; s.setAttribute('aria-hidden', k !== current); });
      dotButtons.forEach((b, k) => b.setAttribute('aria-current', k === current));
    }
    $('#pv').onclick = () => goTo(current - 1);
    $('#nx').onclick = () => goTo(current + 1);
    dotButtons.forEach((b, k) => (b.onclick = () => goTo(k)));

    const slider = $('#sl');
    slider.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });
    let touchX = 0;                                         // swipe on touch screens
    slider.addEventListener('touchstart', e => (touchX = e.touches[0].clientX), { passive: true });
    slider.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
    });
    if (reviews.length < 2) $('#ct').hidden = true;
    goTo(0);
  }

  /* 12 ── Contact form ───────────────────────────────────────────
     If the <form> has data-endpoint="https://formspree.io/f/xxxx" it sends
     the message there. Otherwise it opens the visitor's email app. */
  const form = $('#f'), formMsg = $('#fm');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    if (d.website) return;                                  // spam trap field
    const body = `Project type: ${d.type}\nBudget: ${d.budget || '-'}\nTimeline: ${d.timeline || '-'}\n\n${d.details}\n\nFrom: ${d.name} (${d.email})`;

    if (form.dataset.endpoint) {
      try {
        const res = await fetch(form.dataset.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(d)
        });
        if (!res.ok) throw new Error('bad response');
        form.reset();
        formMsg.textContent = 'Thanks! Your message has been sent. I will get back to you as soon as possible.';
      } catch (err) {
        formMsg.textContent = 'Something went wrong. Please email me directly.';
      }
      return;
    }
    location.href = 'mailto:ali.kamalofficial24@gmail.com?subject=' +
      encodeURIComponent(`Project enquiry: ${d.type} from ${d.name}`) + '&body=' + encodeURIComponent(body);
    formMsg.textContent = 'Opening your email app...';
  });

  /* 13 ── Animations ─────────────────────────────────────────────── */

  // 13a  No GSAP (failed to load): fade sections in with a simple observer.
  if (!useGsap) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.15 });
    $$('.rv').forEach(el => io.observe(el));
    return;
  }

  // 13b  GSAP animations
  document.documentElement.classList.add('gsap-on');       // switches off the CSS fallbacks
  gsap.registerPlugin(ScrollTrigger);

  // Hide everything that reveals on scroll. CSS transitions are paused while
  // GSAP drives the element, and restored afterwards so hover effects work.
  const revealItems = $$('.rv');
  revealItems.forEach(el => (el.style.transition = 'none'));
  gsap.set(revealItems, { opacity: 0, y: 40 });

  // Hero entrance: header drops in, headline lines rise, text + orb follow.
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .from('#hd', { yPercent: -120, opacity: 0, duration: 0.8 })
    .from('#h1 .c', { yPercent: 115, rotate: 4, duration: 1.1, stagger: 0.12 }, '<0.1')
    .from('.hero .fade', { y: 28, opacity: 0, duration: 0.8, stagger: 0.1, clearProps: 'opacity,transform' }, '-=0.8')
    .from('.port', { opacity: 0, scale: 0.7, rotate: -10, duration: 1.4, ease: 'expo.out', clearProps: 'opacity,transform' }, '<0.1')
    .from('.chip', { opacity: 0, duration: 0.6, stagger: 0.12 }, '-=0.9')
    .from('.scroll, .mq', { opacity: 0, duration: 0.6 }, '-=0.4');

  // Scroll reveals: elements in the same row appear with a small stagger.
  ScrollTrigger.batch(revealItems, {
    start: 'top 90%',
    once: true,
    onEnter: batch => gsap.to(batch, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, overwrite: true,
      clearProps: 'opacity,transform',
      onComplete: () => batch.forEach(el => (el.style.transition = ''))
    })
  });

  // Project screenshots: the frame opens up and the image settles in.
  $$('.frame').forEach(frame => {
    const trigger = { trigger: frame, start: 'top 88%', once: true };
    gsap.from(frame, {
      clipPath: 'inset(10% 6% 10% 6% round 16px)', opacity: 0, y: 50, duration: 1.1, ease: 'power3.out',
      clearProps: 'clipPath,opacity,transform', scrollTrigger: trigger
    });
    const img = $('img', frame);
    if (img) gsap.from(img, { scale: 1.18, duration: 1.6, ease: 'power3.out', clearProps: 'transform', scrollTrigger: trigger });
  });

  // Orange page wipe when opening the projects page or a case study.
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href="projects.html"], a[href^="case-study.html"]');
    if (!link || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    gsap.to('.wipe', { yPercent: -100, duration: 0.6, ease: 'power4.inOut', onComplete: () => (location.href = link.href) });
  });
  addEventListener('pageshow', e => { if (e.persisted) gsap.set('.wipe', { yPercent: 0 }); });
})();
