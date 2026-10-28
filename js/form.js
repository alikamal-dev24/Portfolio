/*
 * Contact form handler for #f on index.html
 *
 * - Sends the form with fetch() to the URL in data-endpoint
 *   (works with FormSubmit, Formspree, Web3Forms; set data-key for Web3Forms)
 * - If data-endpoint is empty, or sending fails, it falls back to the visitor's email app
 * - Spam checks: hidden honeypot field, minimum fill time, 30 second cooldown
 * - Runs in the capture phase on document, so it takes over before any other
 *   submit handler (such as the one in main.js) and nothing is sent twice.
 */
(function () {
  'use strict';

  var form = document.getElementById('f');
  if (!form || form.getAttribute('data-enhanced') === '1') return;
  form.setAttribute('data-enhanced', '1');

  var msg = document.getElementById('fm');
  var btn = form.querySelector('button[type="submit"]');
  var btnHTML = btn ? btn.innerHTML : '';
  var endpoint = (form.getAttribute('data-endpoint') || '').trim();
  var key = (form.getAttribute('data-key') || '').trim();
  var toEmail = (form.getAttribute('data-email') || 'ali.kamalofficial24@gmail.com').trim();
  var subject = form.getAttribute('data-subject') || 'New project enquiry from your portfolio';
  var openedAt = Date.now();
  var COOLDOWN_MS = 30000;
  var STORE_KEY = 'ak_form_last_sent';

  function say(text, type, withMailLink) {
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = type === 'ok' ? '#4ade80' : type === 'err' ? '#f87171' : '';
    if (withMailLink) {
      var a = document.createElement('a');
      a.href = 'mailto:' + toEmail;
      a.textContent = toEmail;
      a.style.textDecoration = 'underline';
      msg.appendChild(document.createTextNode(' '));
      msg.appendChild(a);
      msg.appendChild(document.createTextNode('.'));
    }
  }

  function busy(on) {
    if (!btn) return;
    btn.disabled = on;
    btn.setAttribute('aria-busy', on ? 'true' : 'false');
    btn.innerHTML = on ? 'Sending…' : btnHTML;
  }

  function read(name) {
    var el = form.elements[name];
    return el && typeof el.value === 'string' ? el.value.trim() : '';
  }

  function lastSent() {
    try { return parseInt(localStorage.getItem(STORE_KEY) || '0', 10) || 0; } catch (e) { return 0; }
  }
  function markSent() {
    try { localStorage.setItem(STORE_KEY, String(Date.now())); } catch (e) {}
  }

  function openMailApp(d) {
    var lines = [
      'Name: ' + d.name,
      'Email: ' + d.email,
      'Project type: ' + d.type,
      d.budget ? 'Budget: ' + d.budget : '',
      d.timeline ? 'Timeline: ' + d.timeline : '',
      '',
      d.details
    ].filter(function (l, i) { return l !== '' || i > 4; });
    window.location.href = 'mailto:' + toEmail +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  }

  function validate(d) {
    if (d.name.length < 2) return 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return 'Please enter a valid email address.';
    if (!d.type) return 'Please choose a project type.';
    if (d.details.length < 15) return 'Please add a few more details about your project (at least 15 characters).';
    return '';
  }

  document.addEventListener('submit', function (e) {
    if (e.target !== form) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    var d = {
      name: read('name'),
      email: read('email'),
      type: read('type'),
      details: read('details'),
      budget: read('budget'),
      timeline: read('timeline')
    };

    var problem = validate(d);
    if (problem) { say(problem, 'err'); return; }

    // Bots: filled honeypot or submitted in under 2.5 seconds. Pretend it worked.
    if (read('website') || Date.now() - openedAt < 2500) {
      say('Thanks! Your message was sent.', 'ok');
      form.reset();
      return;
    }

    if (Date.now() - lastSent() < COOLDOWN_MS) {
      say('Your message was just sent. Please wait a moment before sending another.', 'err');
      return;
    }

    if (!endpoint) {
      say('Opening your email app…', '');
      openMailApp(d);
      return;
    }

    var fd = new FormData();
    fd.append('name', d.name);
    fd.append('email', d.email);
    fd.append('project_type', d.type);
    fd.append('details', d.details);
    fd.append('budget', d.budget || 'Not given');
    fd.append('timeline', d.timeline || 'Not given');
    fd.append('_subject', subject);
    fd.append('subject', subject);
    fd.append('_replyto', d.email);
    fd.append('_template', 'table');
    fd.append('_captcha', 'false');
    fd.append('_honey', '');
    if (key) fd.append('access_key', key);

    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 15000) : null;

    busy(true);
    say('Sending your message…', '');

    fetch(endpoint, {
      method: 'POST',
      body: fd,
      headers: { 'Accept': 'application/json' },
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          var ok = res.ok && data.ok !== false && String(data.success) !== 'false';
          if (!ok) {
            var e = new Error((data && data.message) || ('HTTP ' + res.status));
            e.serverMessage = (data && (data.message || data.error)) || '';
            e.status = res.status;
            throw e;
          }
          return data;
        });
      })
      .then(function () {
        markSent();
        form.reset();
        say('Thank you! Your message was sent. I will reply within 24–48 hours.', 'ok');
      })
      .catch(function (err) {
        // Open the browser console (F12) to see the exact reason.
        if (window.console && console.error) {
          console.error('[contact form] send failed:', err, err && err.status ? ('status ' + err.status) : '');
        }
        var why = err && err.serverMessage ? String(err.serverMessage).slice(0, 220) : '';
        say(why
          ? 'The form service replied: "' + why + '". You can also email me directly at'
          : 'Your message could not be sent. Please try again, or email me directly at',
          'err', true);
      })
      .then(function () {
        if (timer) clearTimeout(timer);
        busy(false);
      });
  }, true);
})();
