/* =====================================================================
   Album: self-contained gallery + full-screen viewer.
   Public API:  Album.mount(container, options)
     options.items              [{ src, orientation, caption }]   from config
     options.placeholderLayout  ['portrait' | 'landscape', ...]   used when items is empty
     options.monogram           'P · L'
     options.lang               'vi' | 'en'
     options.text               { albumSoon, close, prev, next }
   Redesigning the album only touches this file and the .album / .lightbox CSS.
   ===================================================================== */
(function () {
  'use strict';

  var ICONS = {
    close: '<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    prev: '<svg viewBox="0 0 24 24"><path d="M15 4l-8 8 8 8"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M9 4l8 8-8 8"/></svg>'
  };

  var state = { items: [], opts: null, index: 0, box: null, lastFocus: null };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function caption(item) {
    var c = item.caption;
    if (!c) return '';
    return typeof c === 'string' ? c : (c[state.opts.lang] || c.vi || '');
  }

  function placeholder(i, withLabel) {
    // Alternate the Song Hỷ mark and the monogram so the grid has rhythm.
    var mark = i % 3 === 1
      ? '<span class="ph__mono">' + esc(state.opts.monogram) + '</span>'
      : '<span class="hy" aria-hidden="true">囍</span>';
    var label = withLabel ? '<span class="ph__label">' + esc(state.opts.text.albumSoon) + '</span>' : '';
    return '<div class="ph">' + mark + label + '</div>';
  }

  function mount(container, opts) {
    state.opts = opts;
    var real = (opts.items || []).filter(function (x) { return x && x.src; });
    state.items = real.length
      ? real.map(function (x) { return { src: x.src, orientation: x.orientation || 'portrait', caption: x.caption, failed: false }; })
      : (opts.placeholderLayout || []).map(function (o) { return { src: '', orientation: o, placeholder: true }; });

    var total = state.items.length;
    // Rows are formed by CSS (flex-wrap), so the order here is the order on the page.
    container.innerHTML = state.items.map(function (it, i) {
      var kind = it.orientation === 'landscape' ? 'landscape' : 'portrait';
      var label = caption(it) || (opts.lang === 'en' ? 'Photo ' : 'Ảnh ') + (i + 1) + '/' + total;
      var inner = it.placeholder
        ? placeholder(i, false)
        : '<img src="' + esc(it.src) + '" alt="' + esc(caption(it)) + '" loading="lazy" decoding="async" class="is-loading">';
      return '<button type="button" class="album__item album__item--' + kind + '" data-i="' + i + '" aria-label="' + esc(label) + '">' + inner + '</button>';
    }).join('');

    Array.prototype.forEach.call(container.querySelectorAll('img'), function (img) {
      var i = +img.parentNode.getAttribute('data-i');
      img.addEventListener('load', function () { img.classList.remove('is-loading'); });
      img.addEventListener('error', function () {
        state.items[i].failed = true;
        img.parentNode.innerHTML = placeholder(i, false);
      });
    });

    container.onclick = function (e) {
      var btn = e.target.closest('.album__item');
      if (btn) open(+btn.getAttribute('data-i'));
    };
  }

  /* ---------- Viewer ---------- */
  function build() {
    var t = state.opts.text;
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.hidden = true;
    box.innerHTML =
      '<div class="lightbox__bar"><span class="lightbox__count" aria-live="polite"></span>' +
      '<button type="button" class="lightbox__btn" data-act="close"></button></div>' +
      '<div class="lightbox__stage">' +
      '<button type="button" class="lightbox__btn lightbox__nav lightbox__nav--prev" data-act="prev"></button>' +
      '<figure class="lightbox__figure"></figure>' +
      '<button type="button" class="lightbox__btn lightbox__nav lightbox__nav--next" data-act="next"></button>' +
      '</div><p class="lightbox__caption"></p>';
    document.body.appendChild(box);

    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) { if (e.target.classList.contains('lightbox__stage')) close(); return; }
      var act = b.getAttribute('data-act');
      if (act === 'close') close(); else go(act === 'next' ? 1 : -1);
    });

    var x0 = null, y0 = null;
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close();
      x0 = y0 = null;
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') { // keep focus inside the viewer
        var f = box.querySelectorAll('button:not([hidden])');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    return box;
  }

  function labels() {
    var t = state.opts.text, box = state.box;
    var map = { close: t.close, prev: t.prev, next: t.next };
    Array.prototype.forEach.call(box.querySelectorAll('[data-act]'), function (b) {
      var a = b.getAttribute('data-act');
      b.innerHTML = ICONS[a];
      b.setAttribute('aria-label', map[a]);
    });
    var single = state.items.length < 2;
    box.querySelector('[data-act="prev"]').hidden = single;
    box.querySelector('[data-act="next"]').hidden = single;
  }

  function render() {
    var box = state.box, it = state.items[state.index];
    var fig = box.querySelector('.lightbox__figure');
    var cap = caption(it);
    if (it.placeholder || it.failed) {
      fig.innerHTML = placeholder(state.index, true);
      fig.firstChild.style.setProperty('--ratio', it.orientation === 'landscape' ? '3 / 2' : '3 / 4');
    } else {
      fig.innerHTML = '<img src="' + esc(it.src) + '" alt="' + esc(cap) + '">';
    }
    box.querySelector('.lightbox__caption').textContent = cap;
    box.querySelector('.lightbox__count').textContent = (state.index + 1) + ' / ' + state.items.length;
    box.setAttribute('aria-label', cap || box.querySelector('.lightbox__count').textContent);
    // Warm the neighbours so swiping feels instant.
    [1, -1].forEach(function (d) {
      var n = state.items[(state.index + d + state.items.length) % state.items.length];
      if (n && n.src && !n.failed) { var im = new Image(); im.src = n.src; }
    });
  }

  function open(i) {
    if (!state.box) state.box = build();
    labels();
    state.lastFocus = document.activeElement;
    state.index = i;
    render();
    state.box.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(function () { state.box.classList.add('is-open'); });
    state.box.querySelector('[data-act="close"]').focus();
  }

  function close() {
    var box = state.box;
    box.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(function () { box.hidden = true; }, 450);
    if (state.lastFocus) state.lastFocus.focus({ preventScroll: true });
  }

  function go(d) {
    var fig = state.box.querySelector('.lightbox__figure');
    state.index = (state.index + d + state.items.length) % state.items.length;
    fig.style.opacity = '0';
    fig.style.transform = 'translateX(' + (d * 12) + 'px)';
    setTimeout(function () {
      render();
      fig.style.transform = 'translateX(' + (-d * 12) + 'px)';
      requestAnimationFrame(function () { fig.style.opacity = '1'; fig.style.transform = 'none'; });
    }, 180);
  }

  window.Album = { mount: mount };
})();
