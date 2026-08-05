/* ==========================================================
   Educational Equity Thailand — interactions
   ========================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      var open = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { ro.observe(el); });
    }
  }

  /* ---- animated bar fills (charts) ---- */
  var charts = document.querySelectorAll('.chart');
  function fillBars(chart) {
    chart.querySelectorAll('.fill').forEach(function (f) {
      var w = f.getAttribute('data-w');
      if (reduce) { f.style.width = w + '%'; }
      else { requestAnimationFrame(function () { f.style.width = w + '%'; }); }
    });
  }
  if (charts.length) {
    if (!('IntersectionObserver' in window)) {
      charts.forEach(fillBars);
    } else {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { fillBars(e.target); co.unobserve(e.target); }
        });
      }, { threshold: 0.3 });
      charts.forEach(function (c) { co.observe(c); });
    }
  }

  /* ---- count-up stats ---- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce || isNaN(target)) { el.textContent = format(target, dec) + suffix; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased, dec) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(target, dec) + suffix;
    }
    requestAnimationFrame(step);
  }
  function format(n, dec) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  var counts = document.querySelectorAll('[data-count]');
  if (counts.length) {
    if (!('IntersectionObserver' in window)) {
      counts.forEach(countUp);
    } else {
      var nu = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { countUp(e.target); nu.unobserve(e.target); }
        });
      }, { threshold: 0.6 });
      counts.forEach(function (c) { nu.observe(c); });
    }
  }

  /* ---- decoder tabs ---- */
  var tabs = document.querySelectorAll('.decoder-tab');
  var panels = document.querySelectorAll('.decoder-panel');
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('data-target');
        tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
        var panel = document.getElementById(id);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ---- back to top ---- */
  var bt = document.querySelector('.backtop');
  if (bt) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) bt.classList.add('show'); else bt.classList.remove('show');
    }, { passive: true });
    bt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---- footer year ---- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear() + 543; // Thai Buddhist year
})();
