/* ============================================================
   Infinite Designs — interaction layer
   Every page is real HTML. This file only adds behaviour:
   preloader, ambient canvas, parallax, scroll reveals, counters,
   accordions, card tilt, portfolio filter, quote slider,
   contact form validation, custom cursor and the mobile menu.
   Nothing here is required for the content to be readable.
   ============================================================ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- preloader ---------------------------------- */
  (function loader() {
    var ld = $('#loader'), bar = $('#loadbar'), pc = $('#loadpc');
    if (!ld) return;
    var v = 0;
    var t = setInterval(function () {
      v = Math.min(100, v + Math.random() * 18 + 11);
      if (bar) bar.style.width = v + '%';
      if (pc) pc.textContent = String(Math.round(v)).padStart(2, '0');
      if (v >= 100) {
        clearInterval(t);
        setTimeout(function () { ld.classList.add('gone'); }, reduce ? 0 : 220);
      }
    }, reduce ? 10 : 85);
  })();

  /* ---------- hero headline, split into words ------------ */
  (function splitHero() {
    var h = $('#heroTitle');
    if (!h || reduce) return;
    var words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words.map(function (w, i) {
      return '<span class="w"><i style="animation-delay:' + (i * 52 + 90) + 'ms">' + w + '</i></span>';
    }).join(' ');
  })();

  /* ---------- scroll reveals ------------------------------
     Anything already on screen stays visible. Only sections
     below the fold are hidden and then revealed on scroll.   */
  (function reveals() {
    var targets = $$('.reveal');
    if (reduce) { targets.forEach(function (t) { t.classList.remove('reveal'); }); return; }
    var vh = window.innerHeight, below = [];
    targets.forEach(function (t) {
      t.classList.remove('reveal');
      if (t.getBoundingClientRect().top > vh * 0.9) { t.classList.add('js-reveal'); below.push(t); }
    });
    if (!('IntersectionObserver' in window)) { below.forEach(function (t) { t.classList.add('seen'); }); return; }
    var obs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('seen'); o.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    below.forEach(function (t) { obs.observe(t); });
  })();

  /* ---------- animated counters --------------------------- */
  (function counters() {
    var els = $$('[data-count]');
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) return;
    var run = function (el) {
      var to = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', dur = 1500, t0 = performance.now();
      (function tick(now) {
        var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    };
    var o = new IntersectionObserver(function (es, ob) {
      es.forEach(function (e) { if (e.isIntersecting) { run(e.target); ob.unobserve(e.target); } });
    }, { threshold: 0.4 });
    els.forEach(function (e) { o.observe(e); });
  })();

  /* ---------- accordions (FAQs, job listings) ------------- */
  $$('.acc-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var item = b.parentElement, panel = b.nextElementSibling, open = item.classList.contains('open');
      $$('.acc-item.open', item.parentElement).forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.acc-panel').style.height = '0px';
      });
      if (!open) { item.classList.add('open'); panel.style.height = panel.firstElementChild.offsetHeight + 'px'; }
    });
  });
  window.addEventListener('resize', function () {
    $$('.acc-item.open').forEach(function (o) {
      var p = o.querySelector('.acc-panel');
      p.style.height = p.firstElementChild.offsetHeight + 'px';
    });
  });

  /* ---------- card tilt + cursor-tracking glow ------------ */
  if (!reduce && fine) {
    $$('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateX(' + (-y * 4.5) + 'deg) rotateY(' + (x * 5.5) + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
    $$('.btn').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.16) + 'px,' +
                            ((e.clientY - r.top - r.height / 2) * 0.24 - 2) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }
  $$('.card').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  /* ---------- case study sector filter -------------------- */
  (function filter() {
    var bar = $('#workFilter'), grid = $('#workGrid');
    if (!bar || !grid) return;
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      $$('.chip', bar).forEach(function (c) { c.classList.remove('on'); });
      b.classList.add('on');
      var f = b.dataset.f;
      $$('.work-card', grid).forEach(function (card) {
        card.style.display = (f === 'all' || card.dataset.sector === f) ? '' : 'none';
      });
    });
  })();

  /* ---------- testimonial slider -------------------------- */
  (function quotes() {
    var track = $('#qtrack'), nav = $('#qnav');
    if (!track || !nav) return;
    var n = track.children.length, i = 0, timer = null;
    var set = function (k) {
      i = (k + n) % n;
      track.style.transform = 'translateX(-' + (i * 100) + '%)';
      $$('.qdot', nav).forEach(function (d, j) { d.classList.toggle('on', j === i); });
    };
    var restart = function () {
      clearInterval(timer);
      if (!reduce) timer = setInterval(function () { set(i + 1); }, 6500);
    };
    nav.addEventListener('click', function (e) {
      var d = e.target.closest('.qdot');
      if (d) { set(+d.dataset.q); restart(); }
    });
    restart();
  })();

  /* ---------- contact form -------------------------------
     Validates in the browser. To actually send, replace the
     two lines marked below — see README.md.                  */
  (function form() {
    var f = $('#contactForm');
    if (!f) return;
    var ok = $('#formOk'), reset = $('#formReset');
    var mark = function (id, bad) { $('#' + id).closest('.field').classList.toggle('bad', bad); return !bad; };
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      valid = mark('cf-name', $('#cf-name').value.trim().length < 2) && valid;
      valid = mark('cf-email', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#cf-email').value.trim())) && valid;
      valid = mark('cf-company', $('#cf-company').value.trim().length < 2) && valid;
      valid = mark('cf-budget', !$('#cf-budget').value) && valid;
      valid = mark('cf-when', !$('#cf-when').value) && valid;
      valid = mark('cf-msg', $('#cf-msg').value.trim().length < 12) && valid;
      if (!valid) {
        var bad = f.querySelector('.field.bad input,.field.bad select,.field.bad textarea');
        if (bad) bad.focus();
        return;
      }
      /* --- replace these two lines to POST to your endpoint --- */
      f.style.display = 'none';
      ok.classList.add('show');
      ok.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
    f.addEventListener('input', function (e) {
      var fld = e.target.closest('.field');
      if (fld) fld.classList.remove('bad');
    });
    if (reset) reset.addEventListener('click', function () {
      ok.classList.remove('show');
      f.style.display = '';
      f.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
  })();

  /* ---------- mobile menu --------------------------------- */
  (function menu() {
    var burger = $('#burger'), drawer = $('#drawer');
    if (!burger || !drawer) return;
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      burger.classList.toggle('x', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        drawer.classList.remove('open');
        burger.classList.remove('x');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  })();

  /* ---------- custom cursor ------------------------------- */
  (function cursor() {
    var cur = $('#cursor');
    if (!cur || !fine || reduce) return;
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2, tx = cx, ty = cy;
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY; cur.classList.add('live');
    }, { passive: true });
    (function trail() {
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(trail);
    })();
    document.addEventListener('mouseover', function (e) {
      cur.classList.toggle('big', !!e.target.closest('[data-cursor-big],a,button'));
    });
  })();

  /* ---------- parallax, sticky header, progress bar ------- */
  var parEls = $$('[data-par]').map(function (el) { return { el: el, s: parseFloat(el.dataset.par) }; });
  var ticking = false, scrollY = 0;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY, vh = window.innerHeight;
      var doc = document.documentElement.scrollHeight - vh;
      var prog = $('#progress'), hdr = $('#hdr');
      if (prog) prog.style.width = (doc > 0 ? Math.min(100, y / doc * 100) : 0) + '%';
      if (hdr) hdr.classList.toggle('stuck', y > 24);
      if (!reduce) {
        for (var i = 0; i < parEls.length; i++) {
          var r = parEls[i].el.getBoundingClientRect();
          var off = (r.top + r.height / 2 - vh / 2) * parEls[i].s;
          parEls[i].el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
        }
      }
      scrollY = y;
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- ambient delta field -------------------------
     Flowing channel lines behind the page — a nod to the
     river delta the studio sits in. Drawn on canvas.         */
  (function delta() {
    var cv = $('#delta');
    if (!cv) return;
    var cx2 = cv.getContext('2d'), W = 0, H = 0, DPR = 1, t = 0;

    function size() {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.floor(W * DPR); cv.height = Math.floor(H * DPR);
      cx2.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function draw() {
      cx2.clearRect(0, 0, W, H);
      var LINES = 13, i, x, y;
      for (i = 0; i < LINES; i++) {
        var p = i / (LINES - 1);
        var base = H * (0.08 + p * 0.92) + Math.sin(t * 0.00016 + i) * 10 - scrollY * 0.035 * (0.3 + p * 0.9);
        var amp = 26 + p * 54, freq = 0.0016 + p * 0.0011, ph = t * 0.00022 + i * 0.55;
        cx2.beginPath();
        for (x = -40; x <= W + 40; x += 14) {
          y = base + Math.sin(x * freq + ph) * amp + Math.sin(x * freq * 2.3 + ph * 1.6) * amp * 0.28;
          if (x === -40) cx2.moveTo(x, y); else cx2.lineTo(x, y);
        }
        var g = cx2.createLinearGradient(0, 0, W, 0);
        var a = 0.030 + 0.055 * Math.sin(p * Math.PI);
        g.addColorStop(0, 'rgba(123,92,255,0)');
        g.addColorStop(0.28, 'rgba(123,92,255,' + a + ')');
        g.addColorStop(0.62, 'rgba(107,123,255,' + (a * 1.15) + ')');
        g.addColorStop(0.88, 'rgba(58,224,208,' + (a * 0.9) + ')');
        g.addColorStop(1, 'rgba(58,224,208,0)');
        cx2.strokeStyle = g; cx2.lineWidth = 1.1; cx2.stroke();
      }
      for (i = 0; i < 7; i++) {
        x = (W * 0.13 * i + (t * 0.010 * (i % 3 + 1)) % (W + 200)) - 100;
        y = H * (0.16 + 0.12 * i) + Math.sin(t * 0.0004 + i * 1.7) * 26 - scrollY * 0.05;
        cx2.beginPath(); cx2.arc(x, y, 1.8, 0, Math.PI * 2);
        cx2.fillStyle = i % 2 ? 'rgba(58,224,208,.30)' : 'rgba(123,92,255,.34)';
        cx2.fill();
      }
    }

    size();
    window.addEventListener('resize', function () { size(); onScroll(); }, { passive: true });
    if (reduce) { draw(); }
    else { (function loop(now) { t = now; draw(); requestAnimationFrame(loop); })(0); }
  })();

  onScroll();
})();
