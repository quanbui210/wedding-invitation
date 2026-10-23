/* =====================================================================
   Sketches: hand-drawn line illustrations as inline SVG.
   Each path draws itself when its block scrolls into view (see .sketch in style.css).
   Sketches.render(name, monogram) returns an <svg> string.
   To use an illustrator's artwork instead, replace a function's return value
   with your own <svg> markup (strokes only, fill="none", stroke="currentColor").
   ===================================================================== */
(function () {
  'use strict';

  function heart(x, y, s) {
    return '<path d="M' + x + ' ' + (y + 3 * s) + ' C' + (x - 1 * s) + ' ' + y + ' ' + (x - 6 * s) + ' ' + (y - 1 * s) + ' ' + (x - 6 * s) + ' ' + (y + 3 * s) +
      ' C' + (x - 6 * s) + ' ' + (y + 6 * s) + ' ' + (x - 2 * s) + ' ' + (y + 8 * s) + ' ' + x + ' ' + (y + 11 * s) +
      ' C' + (x + 2 * s) + ' ' + (y + 8 * s) + ' ' + (x + 6 * s) + ' ' + (y + 6 * s) + ' ' + (x + 6 * s) + ' ' + (y + 3 * s) +
      ' C' + (x + 6 * s) + ' ' + (y - 1 * s) + ' ' + (x + 1 * s) + ' ' + y + ' ' + x + ' ' + (y + 3 * s) + '"/>';
  }
  function sparkle(x, y, r) {
    return '<path d="M' + x + ' ' + (y - r) + ' Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y + r) +
      ' Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + '"/>';
  }
  function blossom(x, y, r) { // five-petal hoa mai
    var p = '';
    for (var i = 0; i < 5; i++) {
      var a = (i * 72 - 90) * Math.PI / 180;
      p += '<circle cx="' + (x + Math.cos(a) * r).toFixed(1) + '" cy="' + (y + Math.sin(a) * r).toFixed(1) + '" r="' + (r * .62).toFixed(1) + '"/>';
    }
    return p + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * .3).toFixed(1) + '"/>';
  }
  function hy(x, y, size) { // filled glyph: fades in after the lines
    return '<text class="sketch__ink" x="' + x + '" y="' + y + '" font-size="' + size + '" text-anchor="middle">囍</text>';
  }

  function lantern(cx, top, s) {
    function X(v) { return (cx + v * s).toFixed(1); }
    function Y(v) { return (top + v * s).toFixed(1); }
    return '<path d="M' + X(0) + ' ' + Y(-12) + ' L' + X(0) + ' ' + Y(0) + '"/>' +
      '<path d="M' + X(-5) + ' ' + Y(3) + ' L' + X(-5) + ' ' + Y(0) + ' L' + X(5) + ' ' + Y(0) + ' L' + X(5) + ' ' + Y(3) + '"/>' +
      '<path d="M' + X(-6) + ' ' + Y(3) + ' C' + X(-22) + ' ' + Y(16) + ' ' + X(-22) + ' ' + Y(40) + ' ' + X(-6) + ' ' + Y(52) +
        ' L' + X(6) + ' ' + Y(52) + ' C' + X(22) + ' ' + Y(40) + ' ' + X(22) + ' ' + Y(16) + ' ' + X(6) + ' ' + Y(3) + ' Z"/>' +
      '<path d="M' + X(-3) + ' ' + Y(3) + ' C' + X(-13) + ' ' + Y(18) + ' ' + X(-13) + ' ' + Y(38) + ' ' + X(-3) + ' ' + Y(52) + '"/>' +
      '<path d="M' + X(3) + ' ' + Y(3) + ' C' + X(13) + ' ' + Y(18) + ' ' + X(13) + ' ' + Y(38) + ' ' + X(3) + ' ' + Y(52) + '"/>' +
      '<path d="M' + X(-5) + ' ' + Y(52) + ' L' + X(-5) + ' ' + Y(55) + ' L' + X(5) + ' ' + Y(55) + ' L' + X(5) + ' ' + Y(52) + '"/>' +
      '<path d="M' + X(0) + ' ' + Y(55) + ' L' + X(0) + ' ' + Y(60) + ' M' + X(-2) + ' ' + Y(60) + ' L' + X(-3) + ' ' + Y(72) +
        ' M' + X(0) + ' ' + Y(60) + ' L' + X(0) + ' ' + Y(73) + ' M' + X(2) + ' ' + Y(60) + ' L' + X(3) + ' ' + Y(72) + '"/>' +
      hy(X(0), Y(32), (11 * s).toFixed(1));
  }

  function leaf(x, y, angle, len) { // almond leaf with a centre vein
    var w = len * .3;
    return '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + angle.toFixed(1) + ')">' +
      '<path d="M0 0 C' + (len * .3) + ' ' + (-w) + ' ' + (len * .7) + ' ' + (-w) + ' ' + len + ' 0 C' + (len * .7) + ' ' + w + ' ' + (len * .3) + ' ' + w + ' 0 0 Z"/>' +
      '<path d="M' + (len * .15) + ' 0 L' + (len * .8) + ' 0"/></g>';
  }
  function petalBlossom(x, y, r) { // hoa mai with petals that fill with gold once drawn
    var p = '';
    for (var i = 0; i < 5; i++) {
      var a = (i * 72 - 90 + (x % 30)) * Math.PI / 180;
      p += '<circle class="petal" cx="' + (x + Math.cos(a) * r).toFixed(1) + '" cy="' + (y + Math.sin(a) * r).toFixed(1) + '" r="' + (r * .7).toFixed(1) + '"/>';
    }
    return p + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * .28).toFixed(1) + '"/>' +
      '<path d="M' + x + ' ' + y + ' L' + (x + r * .5) + ' ' + (y - r * .55) + ' M' + x + ' ' + y + ' L' + (x - r * .55) + ' ' + (y - r * .4) + '"/>';
  }

  function house(treeSide) {
    var d = '';
    function L(x1, y1, x2, y2) { return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '"/>'; }
    d += L(6, 108, 154, 108);
    // platform and step
    d += '<path d="M30 108 L30 102 L130 102 L130 108"/><path d="M66 108 L66 105 L94 105 L94 108"/>';
    // walls and the columns between three bays
    d += L(38, 102, 38, 64) + L(122, 102, 122, 64) + L(58, 102, 58, 64) + L(102, 102, 102, 64);
    // centre double door with 囍, side windows with bars
    d += '<path d="M70 102 L70 76 L90 76 L90 102"/>' + L(80, 77, 80, 102) + hy(80, 92, 8);
    [44, 106].forEach(function (x) {
      d += '<path d="M' + x + ' 90 L' + x + ' 76 L' + (x + 10) + ' 76 L' + (x + 10) + ' 90 Z"/>' + L(x + 3.3, 76, x + 3.3, 90) + L(x + 6.7, 76, x + 6.7, 90);
    });
    // roof: curved eaves with upturned tips, sloped sides, ridge with curled ends
    d += '<path d="M24 64 C44 67 116 67 136 64"/>';
    d += '<path d="M24 64 C19 62 17 58 19 55"/><path d="M136 64 C141 62 143 58 141 55"/>';
    d += L(26, 62, 48, 40) + L(134, 62, 112, 40) + L(46, 40, 114, 40);
    d += '<path d="M46 40 C42 38 40 34 42 31"/><path d="M114 40 C118 38 120 34 118 31"/>';
    for (var x = 56; x <= 104; x += 8) d += L(x, 42, x + (x - 80) * .12, 63);
    // ridge ornament: a moon between two small curls
    d += '<circle cx="80" cy="35" r="3"/><path d="M72 39 C70 35 73 33 75 35 M88 39 C90 35 87 33 85 35"/>';
    // lanterns under the eaves
    [31, 129].forEach(function (x) {
      d += L(x, 65, x, 70) + '<path d="M' + (x - 3) + ' 71 C' + (x - 6) + ' 74 ' + (x - 6) + ' 79 ' + (x - 3) + ' 82 L' + (x + 3) + ' 82 C' + (x + 6) + ' 79 ' + (x + 6) + ' 74 ' + (x + 3) + ' 71 Z"/>' + L(x, 82, x, 86);
    });
    // areca palm on the outer side
    var t = treeSide === 'left' ? 14 : 146, k = treeSide === 'left' ? 1 : -1;
    d += '<path d="M' + t + ' 108 C' + (t - 1) + ' 80 ' + (t + 1) + ' 50 ' + t + ' 22"/>';
    for (var y = 34; y <= 98; y += 9) d += L(t - 1.6, y, t + 1.6, y - .6);
    d += '<path d="M' + t + ' 22 C' + (t + 8 * k) + ' 15 ' + (t + 15 * k) + ' 17 ' + (t + 20 * k) + ' 23"/>';
    d += '<path d="M' + t + ' 22 C' + (t + 6 * k) + ' 12 ' + (t + 12 * k) + ' 9 ' + (t + 18 * k) + ' 11"/>';
    d += '<path d="M' + t + ' 22 C' + (t - 4 * k) + ' 13 ' + (t - 9 * k) + ' 11 ' + (t - 12 * k) + ' 14"/>';
    d += '<path d="M' + t + ' 22 C' + (t - 6 * k) + ' 17 ' + (t - 11 * k) + ' 20 ' + (t - 12 * k) + ' 27"/>';
    d += '<path d="M' + t + ' 22 C' + (t + 1) + ' 14 ' + (t - 1) + ' 9 ' + t + ' 5"/>';
    d += '<circle cx="' + (t + 2.5 * k) + '" cy="27" r="1.6"/><circle cx="' + (t + 4.5 * k) + '" cy="29.5" r="1.6"/><circle cx="' + (t + 1.5 * k) + '" cy="30.5" r="1.6"/>';
    d += sparkle(treeSide === 'left' ? 140 : 20, 20, 3.5);
    return d;
  }

  var ART = {
    // Đón khách: two Hội An silk lanterns on a ribbon
    lanterns: function () {
      return '<path d="M8 16 C50 30 110 30 152 10"/>' +
        lantern(56, 38, 1) + lantern(110, 34, .82) +
        blossom(18, 20, 3) + blossom(144, 13, 2.6) +
        sparkle(84, 18, 4) + sparkle(138, 44, 3);
    },

    // Lễ thành hôn: teapot and two cups for the tea ceremony
    tea: function () {
      return '<path d="M40 64 C36 86 48 97 60 97 C72 97 84 86 80 64"/>' +
        '<path d="M40 64 C47 60 73 60 80 64"/>' +
        '<path d="M48 62 C50 55 70 55 72 62"/><circle cx="60" cy="52" r="3"/>' +
        '<path d="M41 80 C31 78 26 64 20 54 L24 54 C28 61 33 68 40 70"/>' +
        '<path d="M80 68 C96 65 97 89 78 87"/>' +
        '<path d="M51 97 L53 101 L67 101 L69 97"/>' +
        hy(60, 84, 11) +
        '<path d="M96 84 L118 84 C117 95 113 100 107 100 C101 100 97 95 96 84 Z"/><path d="M103 100 L102 103 L112 103 L111 100"/>' +
        '<path d="M122 84 L144 84 C143 95 139 100 133 100 C127 100 123 95 122 84 Z"/><path d="M129 100 L128 103 L138 103 L137 100"/>' +
        '<path d="M107 78 C103 72 111 68 107 61"/><path d="M133 78 C129 72 137 68 133 61"/>' +
        '<path d="M86 108 C108 112 132 112 152 107"/>' +
        sparkle(30, 30, 4) + sparkle(142, 40, 3);
    },

    // Khai tiệc: three-tier cake with apricot blossoms
    cake: function () {
      function scallop(x0, x1, y) {
        var d = 'M' + x0 + ' ' + y;
        for (var x = x0; x < x1; x += 8) d += ' Q' + (x + 4) + ' ' + (y + 5) + ' ' + (x + 8) + ' ' + y;
        return '<path d="' + d + '"/>';
      }
      return '<path d="M36 104 L124 104"/><path d="M42 107 L118 107"/>' +
        '<path d="M44 104 L44 80 L116 80 L116 104"/>' + scallop(44, 116, 80) +
        '<path d="M54 80 L54 62 L106 62 L106 80"/>' + scallop(54, 102, 62) +
        '<path d="M64 62 L64 46 L96 46 L96 62"/>' + scallop(64, 96, 46) +
        heart(80, 28, 1.2) + '<path d="M80 41 L80 46"/>' +
        blossom(50, 92, 3) + blossom(110, 90, 2.6) + blossom(60, 71, 2.4) + blossom(100, 72, 2.4) +
        sparkle(30, 40, 4) + sparkle(130, 30, 3.5);
    },

    // Nâng ly: two flutes clinking
    toast: function () {
      function flute(cx, angle) {
        return '<g transform="rotate(' + angle + ' ' + cx + ' 96)">' +
          '<path d="M' + (cx - 7) + ' 34 L' + (cx + 7) + ' 34 C' + (cx + 7) + ' 54 ' + (cx + 5) + ' 66 ' + cx + ' 70 C' + (cx - 5) + ' 66 ' + (cx - 7) + ' 54 ' + (cx - 7) + ' 34 Z"/>' +
          '<path d="M' + (cx - 6) + ' 44 L' + (cx + 6) + ' 44"/>' +
          '<circle cx="' + (cx - 2) + '" cy="52" r="1"/><circle cx="' + (cx + 2) + '" cy="58" r=".9"/><circle cx="' + cx + '" cy="48" r=".8"/>' +
          '<path d="M' + cx + ' 70 L' + cx + ' 96"/><path d="M' + (cx - 10) + ' 98 C' + (cx - 4) + ' 95 ' + (cx + 4) + ' 95 ' + (cx + 10) + ' 98"/></g>';
      }
      return flute(66, -16) + flute(94, 16) +
        '<path d="M74 24 L70 16 M80 22 L80 12 M86 24 L90 16"/>' +
        sparkle(56, 14, 4) + sparkle(106, 18, 3.5) + sparkle(124, 46, 3) +
        heart(36, 30, .8) + '<circle cx="128" cy="70" r="1.2"/><circle cx="30" cy="62" r="1"/>';
    },

    // Tiễn khách: a Saigon scooter with heart balloons and a P & L plate
    scooter: function (mono) {
      return '<circle cx="46" cy="96" r="11"/><circle cx="46" cy="96" r="3.5"/>' +
        '<circle cx="122" cy="96" r="11"/><circle cx="122" cy="96" r="3.5"/>' +
        '<path d="M30 88 C27 72 40 63 60 64 C74 65 82 74 82 90 L104 90"/>' +
        '<path d="M30 88 C33 91 36 91 37 90"/>' +
        '<path d="M42 64 C44 57 70 56 75 61 L73 65"/>' +
        '<path d="M104 90 C107 76 109 61 111 46"/><path d="M98 90 C101 77 104 62 107 48"/>' +
        '<path d="M110 86 C114 77 130 77 134 88"/>' +
        '<path d="M100 44 L120 41"/><circle cx="123" cy="45" r="4"/>' +
        '<path d="M103 42 L99 33"/><circle cx="99" cy="30" r="2.5"/>' +
        '<path d="M20 72 L34 72 L34 82 L20 82 Z"/>' +
        '<text class="sketch__ink" x="27" y="79.5" font-size="5.5" text-anchor="middle">' + (mono || 'P & L') + '</text>' +
        '<path d="M33 66 C30 52 25 42 22 34"/><path d="M36 66 C37 50 40 38 42 28"/>' +
        heart(22, 22, 1) + heart(42, 16, 1.1) +
        '<path d="M28 92 L14 104"/><path d="M10 102 L16 99 L19 105 L13 108 Z"/>' +
        '<path d="M4 64 L16 64 M2 74 L12 74"/>' +
        sparkle(140, 24, 4) + sparkle(76, 30, 3);
    },

    // The One, 2 Chương Dương Độ: low hall, dark roof band, peaked entrance,
    // striped awning, tall windows, white pillars and palms (drawn from the facade).
    venue: function () {
      var d = '';
      function L(x1, y1, x2, y2) { return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '"/>'; }
      function palm(x, top, s) {
        function P(dx, dy) { return (x + dx * s).toFixed(1) + ' ' + (top + dy * s).toFixed(1); }
        return '<path d="M' + P(0, 58) + ' C' + P(-3, 40) + ' ' + P(2, 20) + ' ' + P(0, 0) + '"/>' +
          '<path d="M' + P(0, 0) + ' C' + P(-8, -6) + ' ' + P(-17, -4) + ' ' + P(-23, 3) + '"/>' +
          '<path d="M' + P(0, 0) + ' C' + P(-6, -10) + ' ' + P(-14, -12) + ' ' + P(-20, -10) + '"/>' +
          '<path d="M' + P(0, 0) + ' C' + P(6, -10) + ' ' + P(14, -12) + ' ' + P(20, -9) + '"/>' +
          '<path d="M' + P(0, 0) + ' C' + P(8, -6) + ' ' + P(17, -4) + ' ' + P(22, 3) + '"/>' +
          '<path d="M' + P(0, 0) + ' C' + P(1, -8) + ' ' + P(-1, -14) + ' ' + P(-3, -18) + '"/>';
      }
      function pillar(x) {
        return '<path d="M' + x + ' 136 L' + x + ' 100 M' + (x + 4) + ' 136 L' + (x + 4) + ' 100"/>' +
          '<circle cx="' + (x + 2) + '" cy="96.5" r="3.2"/>' + L(x - 1.5, 136, x + 5.5, 136);
      }
      // ground and hall
      d += L(6, 136, 314, 136);
      d += '<path d="M62 136 L62 64 L258 64 L258 136"/>';
      // roof: hip outline, band and a little ribbing
      d += '<path d="M54 64 L54 50 L78 38 L242 38 L266 50 L266 64"/>' + L(54, 50, 266, 50);
      for (var x = 86; x <= 234; x += 10) d += L(x, 39.5, x - 3, 49);
      d += '<text class="sketch__ink sketch__ink--sign" x="160" y="60" font-size="7.5" text-anchor="middle">THE ONE</text>';
      // peaked entrance and glass door
      d += '<path d="M142 72 L160 62 L178 72"/><path d="M146 72 L146 136 M174 72 L174 136"/>';
      d += L(160, 74, 160, 136) + L(153, 76, 153, 92) + L(167, 76, 167, 92);
      // striped awning on two posts
      d += '<path d="M126 104 L130 94 L190 94 L194 104"/>';
      var sc = 'M126 104';
      for (var a = 126; a < 194; a += 6.8) sc += ' Q' + (a + 3.4) + ' 108 ' + (a + 6.8) + ' 104';
      d += '<path d="' + sc + '"/>';
      for (var b = 136; b <= 184; b += 8) d += L(b, 94.5, b - 1.2, 104);
      d += L(129, 106, 129, 136) + L(191, 106, 191, 136);
      // tall windows on the left, a strip on the right
      [70, 82, 94, 106].forEach(function (wx) {
        d += '<path d="M' + wx + ' 120 L' + wx + ' 74 L' + (wx + 9) + ' 74 L' + (wx + 9) + ' 120 Z"/>' + L(wx, 84, wx + 9, 84);
      });
      [200, 220, 240].forEach(function (wx) {
        d += '<path d="M' + wx + ' 84 L' + wx + ' 74 L' + (wx + 13) + ' 74 L' + (wx + 13) + ' 84 Z"/>';
      });
      d += L(196, 96, 254, 96);
      // white pillars along the forecourt
      d += pillar(117) + pillar(198);
      // palms, low hedge, birds
      d += palm(30, 78, 1) + palm(46, 92, .72) + palm(290, 82, .9);
      d += '<path d="M222 136 C226 129 232 129 236 136 C240 129 246 129 250 136"/>';
      d += '<path d="M70 136 C73 130 78 130 81 136"/>';
      d += '<path d="M132 20 q4 -4 8 0 q4 -4 8 0"/><path d="M154 14 q3 -3 6 0 q3 -3 6 0"/>';
      d += sparkle(98, 22, 4) + sparkle(222, 18, 3.5);
      return d;
    },

    // Nhà trai / Nhà gái: a three-bay Vietnamese house with upturned eaves,
    // lanterns under the roof and an areca palm (cây cau) on the outer side.
    houseGroom: function () { return house('left'); },
    houseBride: function () { return house('right'); },

    // Tơ hồng: two threads from the families, tied in a heart between the couple.
    thread: function () {
      return '<path d="M100 0 C100 34 150 30 189 50"/>' +
        '<path d="M300 0 C300 34 250 30 211 50"/>' +
        heart(200, 40, 1.8) +
        '<path d="M200 62 C178 70 104 66 100 110"/>' +
        '<path d="M200 62 C222 70 296 66 300 110"/>' +
        sparkle(160, 20, 4) + sparkle(242, 24, 3.5);
    },

    // Cover: a wreath of leaves around the seal, open at the top, tied at the bottom
    wreath: function () {
      var d = '', R = 82;
      function pt(a) { var r = a * Math.PI / 180; return [100 + R * Math.cos(r), 100 + R * Math.sin(r)]; }
      function vine(from, to) {
        var a = pt(from), b = pt(to), sweep = to > from ? 1 : 0;
        d += '<path d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' A' + R + ' ' + R + ' 0 0 ' + sweep + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + '"/>';
        var step = to > from ? 14 : -14, k = 0;
        for (var ang = from + step; Math.abs(ang - from) < Math.abs(to - from); ang += step, k++) {
          var q = pt(ang), tangent = ang + (to > from ? 90 : -90);
          d += leaf(q[0], q[1], tangent + (k % 2 ? 38 : -38), 15 - Math.abs(ang - from) / 40);
        }
      }
      vine(98, 238); vine(82, -58);
      d += '<path d="M100 182 C92 176 86 184 94 188 C98 190 100 186 100 182 C100 186 102 190 106 188 C114 184 108 176 100 182"/>';
      d += '<path d="M98 186 L92 198 M102 186 L108 198"/>';
      return d;
    },

    // Cover: a hồng mai branch growing in from a bottom corner
    maiBranch: function () {
      return '<path d="M0 262 C40 232 70 202 96 170 C120 140 150 122 190 106 C220 94 250 72 268 50"/>' +
        '<path d="M96 170 C110 142 112 112 104 84"/>' +
        '<path d="M190 106 C202 122 224 130 248 128"/>' +
        '<path d="M150 124 C160 112 170 102 172 88"/>' +
        '<path d="M58 212 C80 208 96 200 110 188"/>' +
        '<path d="M232 84 C238 76 240 68 238 60"/>' +
        petalBlossom(268, 50, 8) + petalBlossom(104, 84, 7) + petalBlossom(248, 128, 7.5) +
        petalBlossom(172, 88, 6) + petalBlossom(130, 134, 5.5) + petalBlossom(110, 188, 5.5) +
        '<circle cx="238" cy="58" r="2.6"/><circle cx="60" cy="210" r="2.4"/><circle cx="214" cy="98" r="2.2"/>' +
        sparkle(206, 40, 4) + sparkle(60, 150, 3);
    },

    // Cover: rope tieback with a tassel, shown on each drape once it is gathered
    tieback: function () {
      return '<path d="M0 22 C28 10 66 12 88 24 C70 34 32 36 0 30"/>' +
        '<path d="M0 26 C30 18 62 20 84 27"/>' +
        '<circle cx="90" cy="27" r="4.5"/>' +
        '<path d="M86 31 C84 38 84 44 82 56 M88 32 L87 58 M90 32 L90 59 M92 32 L93 58 M94 31 C96 38 96 44 98 56"/>' +
        '<path d="M81 52 L99 52"/>';
    },

    // Mừng cưới: envelope with a wax seal
    envelope: function () {
      return '<path d="M30 46 L130 46 L130 104 L30 104 Z"/>' +
        '<path d="M30 46 L80 82 L130 46"/><path d="M30 104 L68 74 M130 104 L92 74"/>' +
        '<circle cx="80" cy="82" r="9"/>' + hy(80, 86, 10) +
        heart(48, 18, .9) + sparkle(116, 24, 4) + sparkle(140, 70, 3) + blossom(24, 34, 3);
    }
  };

  var VIEWBOX = { venue: '0 0 320 150', thread: '0 0 400 110', wreath: '0 0 200 200', maiBranch: '0 0 300 264', tieback: '0 0 100 62' }; // wide drawings; the rest are 160 × 120

  window.Sketches = {
    has: function (name) { return !!ART[name]; },
    render: function (name, monogram) {
      if (!ART[name]) return '';
      var vb = VIEWBOX[name] || '0 0 160 120';
      return '<svg class="sketch sketch--' + name + '" viewBox="' + vb + '" aria-hidden="true" focusable="false">' +
        '<g filter="url(#hand)" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">' +
        ART[name](monogram) + '</g></svg>';
    }
  };
})();
