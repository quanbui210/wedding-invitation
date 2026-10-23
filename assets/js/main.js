/* =====================================================================
   Wedding invitation · page logic
   Reads everything from window.WEDDING (config.js).
   ===================================================================== */
(function () {
  'use strict';

  var C = window.WEDDING;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var VN_OFFSET = 7 * 3600e3;
  var MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  document.documentElement.classList.add('js');

  /* ---------- Language ---------- */
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var lang = (function () {
    var q = (location.search.match(/[?&]lang=(vi|en)/) || [])[1];
    return q || store('wedding-lang') || C.defaultLang || 'vi';
  })();
  if (!C.text[lang]) lang = 'vi';

  function t(key) { return C.text[lang][key] != null ? C.text[lang][key] : C.text.vi[key]; }
  function pick(o) { return o == null ? '' : typeof o === 'string' ? o : (o[lang] || o.vi || ''); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Dates (always shown in Vietnam time) ---------- */
  function vn(iso) { return new Date(new Date(iso).getTime() + VN_OFFSET); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtTime(iso) {
    var d = vn(iso), h = d.getUTCHours(), m = pad(d.getUTCMinutes());
    if (lang === 'vi') return pad(h) + ':' + m;
    return ((h % 12) || 12) + ':' + m + (h < 12 ? ' AM' : ' PM');
  }
  function fmtDate(iso) {
    var d = vn(iso), wd = t('weekdays')[d.getUTCDay()];
    if (lang === 'vi') return wd + ' · ' + pad(d.getUTCDate()) + '.' + pad(d.getUTCMonth() + 1) + '.' + d.getUTCFullYear();
    return wd + ' · ' + d.getUTCDate() + ' ' + MONTHS_EN[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
  }
  var mainEvent = C.events.filter(function (e) { return e.main; })[0] || C.events[C.events.length - 1];

  /* ---------- Static copy ---------- */
  function namesHTML() {
    return esc(C.couple.groom.shortName) + '<span class="amp">&amp;</span>' + esc(C.couple.bride.shortName);
  }
  function monogramText() { return C.couple.monogram.left + ' · ' + C.couple.monogram.right; }

  function applyText() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-placeholder]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
    $$('[data-names]').forEach(function (el) { el.innerHTML = namesHTML(); });
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    $('#gift-toggle').textContent = t($('#gift-toggle').getAttribute('aria-expanded') === 'true' ? 'giftToggleClose' : 'giftToggleOpen');
    $('#rsvp-deadline').textContent = pick(C.rsvp.deadline);
    $('#hashtag').textContent = C.hashtag || '';
    $('#monogram').innerHTML = '<span>' + esc(C.couple.monogram.left) + '<i>&amp;</i>' + esc(C.couple.monogram.right) + '</span>';

    renderHero();
    renderFamily();
    renderEvents();
    renderProgram();
    renderStory();
    renderGifts();
    renderRsvpEvents();
    renderAlbum();
    tickCountdown();
    syncMusicLabel();
    if (lastReply) showThanks(lastReply);
  }

  /* ---------- Hero ---------- */
  function placeholderHTML(label) {
    return '<div class="ph"><span class="hy" aria-hidden="true">囍</span><span class="ph__mono">' + esc(monogramText()) + '</span>' +
      (label ? '<span class="ph__label">' + esc(label) + '</span>' : '') + '</div>';
  }
  var heroDone = false;
  function renderHero() {
    var d = vn(mainEvent.start);
    $('#hero-date').innerHTML =
      '<span>' + esc(t('weekdays')[d.getUTCDay()]) + '</span>' +
      '<span class="date__big">' + pad(d.getUTCDate()) + '.' + pad(d.getUTCMonth() + 1) + '</span>' +
      '<span>' + d.getUTCFullYear() + '</span>';
    $('#hero-lunar').textContent = pick(mainEvent.lunar);
    $('#cover-date').textContent = t('weekdays')[d.getUTCDay()] + ' · ' + pad(d.getUTCDate()) + '.' + pad(d.getUTCMonth() + 1) + '.' + d.getUTCFullYear();
    $('#hero-quote').hidden = !C.quote;
    $('#hero-quote').textContent = C.quote ? '“' + pick(C.quote) + '”' : '';

    var box = $('#hero-photo');
    if (C.photos.hero && !heroDone) {
      var img = new Image();
      img.alt = pick(C.photos.heroAlt);
      img.decoding = 'async';
      img.setAttribute('fetchpriority', 'high');
      img.onerror = function () { box.innerHTML = placeholderHTML(t('photoLabel')); };
      img.src = C.photos.hero;
      box.innerHTML = '';
      box.appendChild(img);
      heroDone = true;
    } else if (!C.photos.hero) {
      box.innerHTML = placeholderHTML(t('photoLabel'));
    } else {
      var im = box.querySelector('img');
      if (im) im.alt = pick(C.photos.heroAlt);
    }
  }

  /* ---------- Family ---------- */
  function renderFamily() {
    var f = C.family, sk = window.Sketches;
    function col(side, key, art, dir) {
      return '<div class="family__col ' + rv(dir) + '">' +
        (sk ? '<div class="family__art">' + sk.render(art) + '</div>' : '') +
        '<p class="kicker">' + esc(t(key)) + '</p>' +
        '<p class="family__parent">' + esc(side.father) + '</p><p class="family__parent">' + esc(side.mother) + '</p>' +
        (side.address ? '<p class="addr">' + esc(side.address) + '</p>' : '') + '</div>';
    }
    $('#family').innerHTML = col(f.groom, 'groomSide', 'houseGroom', 'left') + col(f.bride, 'brideSide', 'houseBride', 'right');
    $('#family-thread').innerHTML = sk ? sk.render('thread') : '';
    var g = C.couple.groom, b = C.couple.bride;
    function person(p, label, dir) {
      return '<div class="family__person ' + rv(dir) + '"><span class="kicker">' + esc(p.order ? pick(p.order) : t(label)) + '</span>' +
        '<span class="person">' + esc(p.fullName) + '</span></div>';
    }
    $('#couple').innerHTML = person(g, 'groomLabel', 'left') + person(b, 'brideLabel', 'right');
    prepSketch($('#family')); prepSketch($('#family-thread'));
  }

  /* ---------- Events + calendar ---------- */
  function icsStamp(iso) { return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function icsEsc(s) { return String(s).replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n'); }
  function eventTitle(ev) {
    return pick(ev.name) + ' · ' + C.couple.groom.shortName + ' & ' + C.couple.bride.shortName;
  }
  function icsHref(ev) {
    var body = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + ev.id + '@wedding-invitation',
      'DTSTAMP:' + icsStamp(new Date().toISOString()),
      'DTSTART:' + icsStamp(ev.start),
      'DTEND:' + icsStamp(ev.end || ev.start),
      'SUMMARY:' + icsEsc(eventTitle(ev)),
      'LOCATION:' + icsEsc(ev.venue + ', ' + ev.address),
      'DESCRIPTION:' + icsEsc(pick(ev.lunar) + (ev.mapUrl ? '\n' + ev.mapUrl : '')),
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEsc(eventTitle(ev)), 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(body);
  }
  function googleHref(ev) {
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(eventTitle(ev)) +
      '&dates=' + icsStamp(ev.start) + '/' + icsStamp(ev.end || ev.start) +
      '&location=' + encodeURIComponent(ev.venue + ', ' + ev.address) +
      '&details=' + encodeURIComponent(pick(ev.lunar)) +
      '&ctz=Asia/Ho_Chi_Minh';
  }

  function renderEvents() {
    $('#events').innerHTML = C.events.map(function (ev, i) {
      var d = vn(ev.start);
      function fact(label, big, sub) {
        return '<div class="event__fact"><span class="event__label">' + esc(label) + '</span>' +
          '<span class="event__big">' + esc(big) + '</span><span class="event__sub">' + esc(sub) + '</span></div>';
      }
      var facts =
        fact(t('factTime'), fmtTime(ev.start), ev.doors ? t('doors').replace('{t}', ev.doors) : '') +
        fact(t('factDate'), pad(d.getUTCDate()) + '.' + pad(d.getUTCMonth() + 1), t('weekdays')[d.getUTCDay()] + ' · ' + d.getUTCFullYear()) +
        (ev.lunarShort ? fact(t('factLunar'), ev.lunarShort, pick(ev.lunarYear)) : '');
      return '<article class="event ' + rv() + '" aria-labelledby="ev-' + i + '">' +
        '<span class="event__corner" aria-hidden="true"></span><span class="event__corner" aria-hidden="true"></span>' +
        '<span class="event__corner" aria-hidden="true"></span><span class="event__corner" aria-hidden="true"></span>' +
        (ev.sketch && window.Sketches ? '<div class="event__art">' + Sketches.render(ev.sketch) + '</div>' : '') +
        '<p class="kicker event__name" id="ev-' + i + '">' + esc(pick(ev.name)) + '</p>' +
        '<h3 class="event__venue">' + esc(ev.venue) + '</h3>' +
        '<p class="event__host">' + esc(pick(ev.host)) + '</p>' +
        '<div class="event__facts">' + facts + '</div>' +
        (ev.lunarShort ? '' : '<p class="event__lunar">' + esc(pick(ev.lunar)) + '</p>') +
        '<div class="event__where"><span class="event__label">' + esc(t('factWhere')) + '</span>' +
          (ev.mapUrl ? '<a class="event__addr" href="' + esc(ev.mapUrl) + '" target="_blank" rel="noopener">' : '<p class="event__addr">') +
          '<svg class="event__pin" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>' +
          '<span>' + esc(ev.address) + '</span>' + (ev.mapUrl ? '</a>' : '</p>') + '</div>' +
        (ev.dressCode ? '<p class="event__dress">' + esc(pick(ev.dressCode)) + '</p>' : '') +
        '<div class="event__actions">' +
        (ev.mapUrl ? '<a class="btn btn--solid" href="' + esc(ev.mapUrl) + '" target="_blank" rel="noopener">' + esc(t('directions')) + '</a>' : '') +
        '<button class="btn btn--ghost" type="button" data-cal="' + i + '" aria-expanded="false" aria-controls="cal-' + i + '">' + esc(t('addCalendar')) + '</button>' +
        '</div>' +
        '<div class="event__cal" id="cal-' + i + '" hidden>' +
        '<a href="' + icsHref(ev) + '" download="' + esc(ev.id) + '.ics">' + esc(t('calendarIcs')) + '</a>' +
        '<a href="' + esc(googleHref(ev)) + '" target="_blank" rel="noopener">' + esc(t('calendarGoogle')) + '</a>' +
        '</div></article>';
    }).join('');
    prepSketch($('#events'));
  }
  $('#events').addEventListener('click', function (e) {
    var b = e.target.closest('[data-cal]');
    if (!b) return;
    var panel = document.getElementById('cal-' + b.getAttribute('data-cal'));
    var open = panel.hidden;
    panel.hidden = !open;
    b.setAttribute('aria-expanded', String(open));
  });

  /* ---------- Countdown ---------- */
  function tickCountdown() {
    var el = $('#countdown');
    var ms = new Date(mainEvent.start).getTime() - Date.now();
    if (ms <= 0) { el.innerHTML = '<p class="countdown__done">' + esc(t('countdownDone')) + '</p>'; return; }
    var m = Math.floor(ms / 60000);
    var parts = [[Math.floor(m / 1440), 'days'], [Math.floor(m / 60) % 24, 'hours'], [m % 60, 'minutes']];
    el.innerHTML = parts.map(function (p) {
      return '<div class="countdown__cell"><span class="countdown__num">' + (p[1] === 'days' ? p[0] : pad(p[0])) +
        '</span><span class="countdown__label">' + esc(t(p[1])) + '</span></div>';
    }).join('');
  }
  setInterval(tickCountdown, 20000);

  /* ---------- Album ---------- */
  function renderAlbum() {
    window.Album.mount($('#album'), {
      items: C.photos.album,
      placeholderLayout: C.photos.placeholderLayout,
      monogram: monogramText(),
      lang: lang,
      text: { albumSoon: t('albumSoon'), close: t('close'), prev: t('prev'), next: t('next') }
    });
  }

  /* ---------- Program (hand-drawn sketches) ---------- */
  // Every stroke gets pathLength=1 so CSS can draw it from 0 to 1 regardless of its real length.
  function prepSketch(root) {
    $$('svg.sketch', root).forEach(function (svg) {
      $$('path, circle, line, ellipse, polyline, rect', svg).forEach(function (el, i) {
        el.setAttribute('pathLength', '1');
        el.classList.add('ln'); // styled by class: Chrome misses style updates on [pathLength] selectors
        el.style.setProperty('--i', i); // stroke order within this sketch
      });
    });
  }
  function renderProgram() {
    var list = C.program || [];
    var mono = C.couple.monogram.left + ' & ' + C.couple.monogram.right;
    $('#program-section').hidden = !list.length;
    var d = vn(mainEvent.start);
    $('#program-date').textContent = pad(d.getUTCDate()) + ' · ' + pad(d.getUTCMonth() + 1) + ' · ' + d.getUTCFullYear();
    $('#program').innerHTML = list.map(function (p, i) {
      return '<li class="program__item ' + rv(i % 2 ? 'right' : 'left') + '">' +
        '<div class="program__art">' + (window.Sketches ? Sketches.render(p.sketch, mono) : '') + '</div>' +
        '<div class="program__text"><p class="program__time">' + esc(p.time) + '</p>' +
        '<h3 class="program__title">' + esc(pick(p.title)) + '</h3>' +
        (p.note ? '<p class="program__note">' + esc(pick(p.note)) + '</p>' : '') + '</div></li>';
    }).join('');
    prepSketch($('#program'));
    $('#gift-art').innerHTML = window.Sketches ? Sketches.render('envelope') : '';
    prepSketch($('#gift-art'));
  }

  /* ---------- Story ---------- */
  function renderStory() {
    var list = C.story || [];
    $('#story-section').hidden = !list.length;
    $('#story').innerHTML = list.map(function (s, i) {
      return '<li class="story__item ' + rv(i % 2 ? 'right' : 'left') + '"><span class="story__year">' + esc(s.year) + '</span>' +
        '<h3 class="story__title">' + esc(pick(s.title)) + '</h3>' +
        '<p class="story__text">' + esc(pick(s.text)) + '</p></li>';
    }).join('');
  }

  /* ---------- Gift ---------- */
  function renderGifts() {
    var list = C.gifts || [];
    $('#gift-section').hidden = !list.length;
    $('#gift-panel').innerHTML = list.map(function (g, i) {
      var qr = g.qr
        ? '<img src="' + esc(g.qr) + '" alt="QR ' + esc(g.bank) + '" loading="lazy">'
        : placeholderHTML(t('qrSoon'));
      return '<div class="gift__card ' + rv(i % 2 ? 'right' : 'left') + '"><p class="kicker">' + esc(pick(g.side)) + '</p>' +
        '<div class="gift__qr">' + qr + '</div>' +
        '<dl class="gift__rows">' +
        '<div><dt>' + esc(t('bank')) + '</dt><dd>' + esc(g.bank) + '</dd></div>' +
        '<div><dt>' + esc(t('holder')) + '</dt><dd>' + esc(g.holder) + '</dd></div>' +
        '<div><dt>' + esc(t('account')) + '</dt><dd class="gift__num">' + esc(g.number) + '</dd></div>' +
        '</dl><button class="btn btn--ghost" type="button" data-copy="' + i + '">' + esc(t('copy')) + '</button></div>';
    }).join('');
    $$('#gift-panel img').forEach(function (img) {
      img.addEventListener('error', function () { img.parentNode.innerHTML = placeholderHTML(t('qrSoon')); });
    });
  }
  $('#gift-toggle').addEventListener('click', function () {
    var panel = $('#gift-panel'), open = panel.hidden;
    panel.hidden = !open;
    panel.classList.toggle('is-in', open);
    this.setAttribute('aria-expanded', String(open));
    this.textContent = t(open ? 'giftToggleClose' : 'giftToggleOpen');
  });
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) { // in-app browsers without the Clipboard API
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }
  $('#gift-panel').addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    copyText(C.gifts[+b.getAttribute('data-copy')].number.replace(/\s/g, '')).then(function () {
      b.textContent = t('copied');
      setTimeout(function () { b.textContent = t('copy'); }, 2000);
    }).catch(function () {});
  });

  /* ---------- Music ---------- */
  var audio = $('#bgm'), musicBtn = $('#music'), musicBroken = !C.music || !C.music.src, wasPlaying = false;
  function syncMusicLabel() {
    var on = musicBtn.getAttribute('aria-pressed') === 'true';
    $('[data-music-label]').textContent = t(on ? 'musicOff' : 'musicOn');
    musicBtn.title = t(on ? 'musicOff' : 'musicOn');
  }
  function setPlaying(on) { musicBtn.setAttribute('aria-pressed', String(on)); syncMusicLabel(); }
  function playMusic() {
    if (musicBroken) return;
    if (!audio.src) { audio.src = C.music.src; audio.volume = C.music.volume || .5; }
    var p = audio.play();
    if (p && p.then) p.then(function () { setPlaying(true); }).catch(function () {
      setPlaying(false);
      if (audio.error) { musicBroken = true; musicBtn.hidden = true; } // missing or unsupported file
    });
    else setPlaying(true);
  }
  audio.addEventListener('error', function () { musicBroken = true; musicBtn.hidden = true; });
  musicBtn.addEventListener('click', function () {
    if (audio.paused) playMusic(); else { audio.pause(); setPlaying(false); }
  });
  document.addEventListener('visibilitychange', function () { // pause when Zalo/Messenger goes to background
    if (document.hidden) { wasPlaying = !audio.paused; audio.pause(); }
    else if (wasPlaying) { audio.play().catch(function () {}); }
  });

  /* ---------- Petals (cover only) ---------- */
  var petals = (function () {
    var canvas = $('#petals');
    if (!C.effects || !C.effects.petals || reduced || !canvas.getContext) return { stop: function () {} };
    var ctx = canvas.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2), w, h, raf, list = [];
    var colors = ['rgba(217,195,160,.55)', 'rgba(233,211,196,.6)', 'rgba(179,152,105,.35)'];
    function size() { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function spawn(p, top) {
      p.x = Math.random() * w; p.y = top ? -20 : Math.random() * h;
      p.r = 4 + Math.random() * 5; p.vy = .25 + Math.random() * .45; p.vx = -.2 + Math.random() * .4;
      p.a = Math.random() * 6.28; p.va = (-.5 + Math.random()) * .02; p.sway = Math.random() * 6.28;
      p.c = colors[(Math.random() * colors.length) | 0];
      return p;
    }
    size();
    for (var i = 0; i < 16; i++) list.push(spawn({}, false));
    function frame() {
      ctx.clearRect(0, 0, w, h);
      list.forEach(function (p) {
        p.sway += .012; p.y += p.vy; p.x += p.vx + Math.sin(p.sway) * .3; p.a += p.va;
        if (p.y > h + 20) spawn(p, true);
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, 6.283); ctx.fill(); ctx.restore();
      });
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', size);
    return { stop: function () { cancelAnimationFrame(raf); window.removeEventListener('resize', size); } };
  })();

  /* ---------- Cover: valance ----------
     A swagged pelmet across the top of the curtain, drawn line by line on load.
     Built for the real screen width so each swag keeps its shape. */
  function buildValance() {
    var el = $('#valance');
    if (!el || $('#cover').classList.contains('is-gone')) return;
    var w = Math.max(320, Math.round(window.innerWidth)), small = w < 600;
    var band = small ? 10 : 18, depth = small ? 26 : 62, n = Math.max(3, Math.round(w / (small ? 130 : 260)));
    var span = w / n, fill = '', lines = '';
    fill += '<path class="fill" d="M0 0 L' + w + ' 0 L' + w + ' ' + band + ' L0 ' + band + ' Z"/>';
    lines += '<path d="M0 ' + band + ' L' + w + ' ' + band + '"/>';
    for (var i = 0; i < n; i++) {
      var a = i * span, b = a + span, m = a + span / 2;
      fill += '<path class="fill" d="M' + a + ' ' + band + ' Q' + m + ' ' + (band + depth * 2) + ' ' + b + ' ' + band + ' Z"/>';
      [1, .74, .5].forEach(function (k) {
        lines += '<path d="M' + a + ' ' + band + ' Q' + m + ' ' + (band + depth * 2 * k) + ' ' + b + ' ' + band + '"/>';
      });
    }
    for (var j = 0; j <= n; j++) { // tassels at each join
      var x = Math.min(w - 4, Math.max(4, j * span)), top = band + 2, cord = depth * .55;
      lines += '<path d="M' + x + ' ' + top + ' L' + x + ' ' + (top + cord) + '"/>' +
        '<circle cx="' + x + '" cy="' + (top + cord + 3) + '" r="3"/>' +
        '<path d="M' + (x - 2) + ' ' + (top + cord + 6) + ' L' + (x - 4) + ' ' + (top + cord + 18) +
        ' M' + x + ' ' + (top + cord + 6) + ' L' + x + ' ' + (top + cord + 19) +
        ' M' + (x + 2) + ' ' + (top + cord + 6) + ' L' + (x + 4) + ' ' + (top + cord + 18) + '"/>';
    }
    var h = band + depth * 2 + 4;
    el.style.height = h + 'px';
    el.innerHTML = '<svg class="sketch sketch--valance" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">' +
      '<g class="valance__fill">' + fill + '</g>' +
      '<g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">' + lines + '</g></svg>';
    prepSketch(el);
    $$('.fill', el).forEach(function (p) { p.classList.remove('ln'); }); // fills fade in; only lines draw
  }
  buildValance();
  // Cover drawings: leaf wreath round the seal, mai branches in the corners, tiebacks for the drapes
  if (window.Sketches) {
    $('#wreath').innerHTML = Sketches.render('wreath');
    $$('.cover__flora').forEach(function (el) { el.innerHTML = Sketches.render('maiBranch'); });
    $$('.drape__tie').forEach(function (el) { el.innerHTML = Sketches.render('tieback'); });
    $$('#wreath, .cover__flora, .drape__tie').forEach(prepSketch); // not the valance: its fills must not draw
  }
  var valanceTimer;
  window.addEventListener('resize', function () { clearTimeout(valanceTimer); valanceTimer = setTimeout(buildValance, 200); });

  /* ---------- Cover: fabric curtain ----------
     The inner edge of each drape is a clip-path polygon. Closed, the edge is a
     straight line at the centre. Open, it sweeps out to a tie-back at 60% height.
     Both shapes use the same points, so the browser can morph one into the other. */
  var EDGE_Y = [0, 8, 16, 24, 32, 40, 48, 54, 60, 66, 74, 82, 91, 100];
  function tiedX(y) { // % of the drape's width, measured from its outer edge
    return y <= 60 ? 9 + 33 * Math.pow(1 - y / 60, 1.6) : 9 + 21 * Math.pow((y - 60) / 40, .7);
  }
  function drapeShape(side, open, extra) {
    var pts = EDGE_Y.map(function (y) {
      var x = open ? Math.min(100, tiedX(y) + extra) : 100;
      return (side === 'left' ? x : 100 - x).toFixed(2) + '% ' + y + '%';
    });
    var o = side === 'left' ? '0%' : '100%';
    return 'polygon(' + o + ' 0%, ' + pts.join(', ') + ', ' + o + ' 100%)';
  }
  ['left', 'right'].forEach(function (side) {
    var d = $('.drape--' + side);
    $('.drape__cloth', d).style.clipPath = drapeShape(side, false, 0);
    $('.drape__rim', d).style.clipPath = drapeShape(side, false, 0);
  });

  function revealHero() {
    $$('.hero .reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i * 120) + 'ms';
      el.classList.add('is-visible');
    });
  }

  var opened = false;
  function openInvite() {
    if (opened) return;
    opened = true;
    var cover = $('#cover');
    if (C.music && C.music.autoplayOnOpen) playMusic(); // needs this tap: browsers block autoplay
    cover.classList.add('is-opening');

    function unlock() {
      cover.classList.add('is-leaving');
      document.body.classList.remove('is-locked');
      $('#controls').hidden = false;
      musicBtn.hidden = musicBroken;
    }
    function finish() {
      cover.classList.add('is-gone');
      cover.setAttribute('aria-hidden', 'true');
      petals.stop();
      var h = $('#hero-names'); h.tabIndex = -1; h.focus({ preventScroll: true });
    }

    var canAnimate = !reduced && Element.prototype.animate;
    if (!canAnimate) { revealHero(); unlock(); setTimeout(finish, reduced ? 50 : 900); return; }

    var gather = { duration: 1700, delay: 200, easing: 'cubic-bezier(.65,.05,.25,1)', fill: 'forwards' };
    ['left', 'right'].forEach(function (side) {
      var d = $('.drape--' + side);
      $('.drape__cloth', d).animate([{ clipPath: drapeShape(side, false, 0) }, { clipPath: drapeShape(side, true, 0) }], gather);
      $('.drape__rim', d).animate([{ clipPath: drapeShape(side, false, 0) }, { clipPath: drapeShape(side, true, .7) }], gather);
      $('.drape__cloth', d).animate([{ backgroundSize: '47px 100%, 83px 100%, 191px 100%, 160px 160px' }, { backgroundSize: '19px 100%, 34px 100%, 78px 100%, 160px 160px' }], gather);
      d.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(' + (side === 'left' ? -100 : 100) + '%)', opacity: .4 }],
        { duration: 1100, delay: 2700, easing: 'cubic-bezier(.55,0,.2,1)', fill: 'forwards' }); // hold so the tiebacks are seen
    });
    setTimeout(function () { $$('.drape__tie').forEach(function (el) { el.classList.add('is-visible'); }); }, 1300);
    setTimeout(revealHero, 1000);
    setTimeout(unlock, 2700);
    setTimeout(finish, 3850);
  }
  $('#open-invite').addEventListener('click', openInvite);

  $$('.lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      lang = b.getAttribute('data-lang');
      store('wedding-lang', lang);
      applyText();
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var booted = false;
  // dir 'left' / 'right' slides the block in from that side. Re-renders (language switch) stay visible.
  function rv(dir) { return 'reveal' + (dir ? ' reveal--' + dir : '') + (booted ? ' is-visible' : ''); }
  function setupReveal() {
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    $$('.reveal').forEach(function (el) { if (!el.closest('.hero')) io.observe(el); }); // hero waits for the curtain
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }
  booted = true;
  }

  /* =====================================================================
     RSVP
     ===================================================================== */
  var form = $('#rsvp-form'), submitBtn = $('#rsvp-submit'), sending = false, lastReply = null;

  function renderRsvpEvents() {
    var box = $('#f-events');
    $('#events-field').hidden = C.events.length < 2; // one event: nothing to choose
    var checked = {};
    $$('input', box).forEach(function (i) { checked[i.value] = i.checked; });
    box.innerHTML = C.events.map(function (ev) {
      var on = checked[ev.id] === undefined ? true : checked[ev.id];
      return '<label class="choice"><input type="checkbox" name="events" value="' + esc(ev.id) + '"' + (on ? ' checked' : '') + '><span>' + esc(pick(ev.name)) + '</span></label>';
    }).join('');
  }

  function syncPills() { $$('.choice--pill', form).forEach(function (l) { l.classList.toggle('is-checked', l.querySelector('input').checked); }); }
  function value(name) { var el = form.querySelector('[name="' + name + '"]:checked'); return el ? el.value : ''; }

  form.addEventListener('change', function (e) {
    var n = e.target.name;
    if (n === 'attending') {
      var yes = value('attending') === 'yes';
      $('#attend-only').hidden = !yes;
      $('#diet-wrap').hidden = !yes;
      setErr('f-attending-err', '');
    }
    if (n === 'guests') $('#guests-other-wrap').hidden = value('guests') !== 'other';
    syncPills();
  });
  $$('#f-name').forEach(function (el) {
    el.addEventListener('input', function () { el.classList.remove('is-invalid'); setErr(el.id + '-err', ''); });
  });

  function setErr(id, msg) { document.getElementById(id).textContent = msg; }

  function validate() {
    var ok = true, first = null;
    function fail(field, errId, key) { ok = false; setErr(errId, t(key)); if (field) field.classList.add('is-invalid'); first = first || field || document.getElementById(errId); }
    ['f-name-err', 'f-attending-err', 'f-guests-err', 'f-events-err'].forEach(function (id) { setErr(id, ''); });

    var name = $('#f-name');
    name.value = name.value.trim().replace(/\s+/g, ' ');
    if (name.value.length < 2) fail(name, 'f-name-err', 'errName');
    var att = value('attending');
    if (!att) fail(form.querySelector('[name="attending"]'), 'f-attending-err', 'errAttending');
    if (att === 'yes') {
      if (value('guests') === 'other') {
        var n = parseInt($('#f-guests-other').value, 10);
        if (!(n >= 1 && n <= 20)) fail($('#f-guests-other'), 'f-guests-err', 'errGuests');
      }
      if (C.events.length > 1 && !$$('input[name="events"]:checked', form).length) fail(null, 'f-events-err', 'errEvents');
    }
    if (first && first.focus) first.focus();
    return ok;
  }

  function collect() {
    var yes = value('attending') === 'yes';
    var guests = yes ? (value('guests') === 'other' ? $('#f-guests-other').value : value('guests')) : '0';
    var evNames = yes ? $$('input[name="events"]:checked', form).map(function (i) {
      var ev = C.events.filter(function (e) { return e.id === i.value; })[0];
      return ev ? ev.name.vi : i.value;
    }).join(', ') : '';
    var side = { groom: 'Nhà trai', bride: 'Nhà gái', both: 'Cả hai' }[value('side')] || '';
    return {
      name: $('#f-name').value,
      attending: yes ? 'Có' : 'Không',
      guests: guests,
      events: evNames,
      side: side,
      dietary: yes ? $('#f-diet').value.trim() : '',
      message: $('#f-message').value.trim(),
      hp_check: $('#f-hp').value // honeypot
    };
  }

  function send(data) {
    var url = (C.rsvp.endpoint || '').trim();
    if (!url) { // demo mode: nothing is stored
      console.warn('[RSVP] No endpoint set in config.js (rsvp.endpoint). Reply not saved:', data);
      return new Promise(function (r) { setTimeout(function () { r({ result: 'success', demo: true }); }, 900); });
    }
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl && setTimeout(function () { ctrl.abort(); }, 20000);
    // URL-encoded body = "simple" request: no CORS preflight, Apps Script reads it via e.parameter.
    return fetch(url, {
      method: 'POST',
      body: new URLSearchParams(data),
      redirect: 'follow',
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      return res.json();
    }).then(function (json) {
      if (!json || json.result !== 'success') throw new Error(json && json.error || 'Bad response');
      return json;
    });
  }

  function showThanks(reply) {
    $('#thanks-text').textContent = t(reply.attending === 'Có' ? 'thanksYes' : 'thanksNo').replace('{name}', reply.name);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    $('#form-error').textContent = '';
    if (!validate()) return;
    var data = collect();

    sending = true;
    submitBtn.disabled = true;
    submitBtn.textContent = t('sending');

    var job = data.hp_check ? Promise.resolve({ result: 'success' }) : send(data); // bots get a silent "success"
    job.then(function () {
      lastReply = data;
      showThanks(data);
      form.hidden = true;
      var box = $('#rsvp-thanks');
      box.hidden = false;
      box.focus({ preventScroll: true });
      box.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }).catch(function (err) {
      console.error('[RSVP]', err);
      $('#form-error').textContent = t('errSubmit');
    }).then(function () {
      sending = false;
      submitBtn.disabled = false;
      submitBtn.textContent = t('submit');
    });
  });

  $('#rsvp-edit').addEventListener('click', function () {
    lastReply = null;
    $('#rsvp-thanks').hidden = true;
    form.hidden = false;
    $('#f-name').focus();
  });

  /* ---------- Boot ---------- */
  $('#form-demo').hidden = !!(C.rsvp.endpoint || '').trim();
  applyText();
  syncPills();
  setupReveal();
})();
