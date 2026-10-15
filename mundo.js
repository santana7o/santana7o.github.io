(function () {
  'use strict';

  /* ---------- base ---------- */
  var W = 1400, H = 900, SQ = 0.72;
  var $ = function (s) { return document.querySelector(s); };
  var cv = $('#sea'), ctx = cv.getContext('2d');
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COARSE = matchMedia('(pointer: coarse)').matches;

  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function hash(x, y) { var h = (x * 374761393 + y * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return (h ^ (h >>> 16)) >>> 0; }
  function mk(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  var P = {
    k: '#2b2238', G: '#7cc95a', g: '#4f9a43', d: '#2f6b3a', w: '#8a5a33', W: '#b07a45',
    r: '#c8483d', R: '#8f2f2a', o: '#9a5b33', O: '#6b3d22', e: '#f3e7cc', E: '#d8c6a3',
    b: '#4aa3c9', B: '#2d6f99', n: '#6b4226', x: '#c08a4b', X: '#8e5f2f', y: '#f2c94c', Y: '#c99a2e',
    s: '#9aa3ad', S: '#6b7480', p: '#e86a8a', P: '#8a63c9', c: '#49c2c9', u: '#3b6fd1',
    f: '#f7f3e8', F: '#cfd6dd', m: '#b9c4cc', M: '#7d8a95', q: '#233a66', Q: '#4d79c4', l: '#e0574b'
  };
  function spr(rows) {
    var h = rows.length, w = 0, i;
    for (i = 0; i < h; i++) w = Math.max(w, rows[i].length);
    var c = mk(w, h), g = c.getContext('2d');
    rows.forEach(function (r, y) {
      for (var x = 0; x < r.length; x++) { var ch = r[x]; if (ch !== '.' && P[ch]) { g.fillStyle = P[ch]; g.fillRect(x, y, 1, 1); } }
    });
    return c;
  }
  function draw(w, h, fn) {
    var c = mk(w, h), g = c.getContext('2d');
    fn(function (col, x, y, ww, hh) { g.fillStyle = P[col] || col; g.fillRect(x, y, ww || 1, hh || 1); }, g);
    return c;
  }

  /* ---------- sprites ---------- */
  var SPR = {};
  SPR.palm = spr([
    '...gGG.GGg...',
    '.gGGGgGgGGGg.',
    'gGg..dGd..gGg',
    'g...dgwgd...g',
    '....d.w.d....',
    '......w......',
    '......wW.....',
    '.....wW......',
    '.....wW......',
    '.....wW......',
    '......wW.....',
    '......wW.....',
    '......wW.....',
    '.....wwWW....'
  ]);
  SPR.pine = spr([
    '....d....',
    '...dGd...',
    '..dGgGd..',
    '...dgd...',
    '..dGggd..',
    '.dGgggGd.',
    '..dgggd..',
    '.dGggggd.',
    'dGgggggGd',
    '.ddgggdd.',
    'dGggggggd',
    'ddddddddd',
    '....w....',
    '....n....'
  ]);
  SPR.pine2 = spr([
    '.....d.....',
    '....dGd....',
    '...dGgGd...',
    '....dgd....',
    '...dGggd...',
    '..dGgggGd..',
    '...dgggd...',
    '..dGggggd..',
    '.dGgggggGd.',
    '..ddgggdd..',
    '.dGggggggd.',
    'dGgggggggGd',
    'ddddgggdddd',
    '.....w.....',
    '.....n.....'
  ]);
  SPR.oak = spr([
    '...dddd....',
    '..dgGGgdd..',
    '.dgGGgggGd.',
    'dgGGggggggd',
    'dgGgggggGgd',
    'dggggGggggd',
    '.dgggggggd.',
    '..ddgggdd..',
    '....dwd....',
    '.....w.....',
    '.....w.....',
    '....wWw....'
  ]);
  SPR.bush = spr([
    '..dGGd.',
    '.dGggGd',
    'dGggggd',
    'dgggggd',
    '.ddddd.'
  ]);
  SPR.house = spr([
    '.......R.......',
    '......RrR......',
    '.....RrrrR.....',
    '....RrrrrrR....',
    '...RrrrrrrrR...',
    '..RrrrrrrrrrR..',
    '.RRRRRRRRRRRRR.',
    '..eeeeeeeeeee..',
    '..ebbeeeeebbe..',
    '..eBbeennebBe..',
    '..eeeeennEeee..',
    '..EEEEEnnEEEE..',
    '..EEEEEEEEEEE..'
  ]);
  SPR.cabin = spr([
    '..........SS...',
    '.....OOOO.SS...',
    '....OooooOSS...',
    '...OooooooO....',
    '..OoooooooooO..',
    '.OOOOOOOOOOOOO.',
    '..wwwwwwwwwww..',
    '..wWwbbwWnnWw..',
    '..wWwBbwWnnWw..',
    '..wwwwwwwnnww..',
    '..WWWWWWWnnWW..'
  ]);
  SPR.ware = draw(26, 18, function (p) {
    for (var i = 0; i < 6; i++) { p(i % 2 ? 'O' : 'o', 5 - i, i, 16 + 2 * i, 1); }
    p('O', 0, 6, 26, 1);
    p('e', 1, 7, 24, 10); p('E', 1, 15, 24, 2);
    p('n', 9, 9, 8, 8); for (var j = 0; j < 4; j++) p('O', 9, 10 + j * 2, 8, 1);
    p('b', 3, 9, 3, 3); p('B', 3, 11, 3, 1); p('b', 20, 9, 3, 3); p('B', 20, 11, 3, 1);
    p('y', 9, 7, 8, 1);
  });
  SPR.lh = draw(14, 38, function (p) {
    p('R', 4, 0, 6, 1); p('R', 3, 1, 8, 2);
    p('k', 4, 3, 6, 1);
    p('y', 4, 4, 6, 4); p('Y', 4, 7, 6, 1); p('k', 4, 4, 1, 4); p('k', 9, 4, 1, 4);
    p('k', 2, 8, 10, 1); p('M', 3, 9, 8, 1);
    for (var y = 10; y < 34; y++) {
      var t = (y - 10) / 24, w = Math.round(6 + t * 4), x0 = 7 - Math.ceil(w / 2), band = Math.floor((y - 10) / 6) % 2;
      p(band ? 'r' : 'f', x0, y, w, 1); p(band ? 'R' : 'F', x0 + w - 2, y, 2, 1);
    }
    p('n', 6, 29, 2, 5);
    p('s', 1, 34, 12, 3); p('S', 1, 37, 12, 1);
  });
  SPR.crate = draw(7, 7, function (p) {
    p('x', 0, 0, 7, 7); p('X', 0, 0, 7, 1); p('X', 0, 6, 7, 1); p('X', 0, 0, 1, 7); p('X', 6, 0, 1, 7);
    for (var i = 1; i < 6; i++) p('X', i, i);
  });
  SPR.crates = draw(14, 13, function (p, g) {
    g.drawImage(SPR.crate, 0, 6); g.drawImage(SPR.crate, 7, 6); g.drawImage(SPR.crate, 3, 0);
  });
  SPR.van = draw(16, 10, function (p) {
    p('f', 0, 1, 10, 6); p('F', 0, 6, 10, 1); p('l', 0, 3, 10, 1);
    p('u', 10, 3, 5, 4); p('b', 11, 3, 3, 2); p('B', 10, 6, 5, 1);
    p('k', 2, 7, 3, 3); p('k', 11, 7, 3, 3); p('M', 3, 8); p('M', 12, 8);
  });
  SPR.solar = draw(15, 8, function (p) {
    p('M', 0, 0, 15, 6); p('q', 1, 1, 13, 4);
    p('Q', 1, 1, 13, 1); p('M', 5, 1, 1, 4); p('M', 9, 1, 1, 4); p('Q', 2, 3, 2, 1); p('Q', 10, 2, 2, 1);
    p('M', 3, 6, 1, 2); p('M', 11, 6, 1, 2);
  });
  SPR.tur = draw(7, 34, function (p) {
    for (var y = 4; y < 32; y++) { p('f', 3, y); if (y > 14) p('F', 4, y); if (y > 24) p('f', 2, y); }
    p('f', 1, 1, 5, 3); p('F', 1, 3, 5, 1);
    p('s', 0, 32, 7, 2);
  });
  function stall(c) {
    return draw(18, 15, function (p) {
      for (var i = 0; i < 6; i++) p(i % 2 ? 'f' : c, i * 3, 0, 3, 4);
      for (var j = 0; j < 9; j++) p(j % 2 ? 'f' : c, j * 2, 4, 2, 1);
      p('w', 1, 5, 1, 10); p('w', 16, 5, 1, 10);
      p('x', 0, 10, 18, 4); p('X', 0, 13, 18, 1); p('X', 0, 10, 18, 1);
      p('y', 2, 8, 2, 2); p('p', 5, 8, 2, 2); p('c', 8, 8, 2, 2); p('l', 11, 8, 2, 2); p('G', 14, 8, 2, 2);
    });
  }
  SPR.stallP = stall('p'); SPR.stallC = stall('c'); SPR.stallY = stall('y');
  function gift(c) {
    return draw(6, 6, function (p) { p(c, 0, 1, 6, 5); p('y', 2, 1, 2, 5); p('y', 0, 3, 6, 1); p('y', 1, 0); p('y', 4, 0); });
  }
  SPR.giftP = gift('P'); SPR.giftC = gift('u'); SPR.giftR = gift('l');
  SPR.umb = spr([
    '...rfrf...',
    '.rfrfrfrf.',
    'rfrfrfrfrf',
    '....W.....',
    '....W.....',
    '....W.....',
    '....W.....',
    '...WWW....'
  ]);
  SPR.sign = draw(9, 10, function (p) { p('w', 4, 5, 1, 5); p('x', 0, 0, 9, 5); p('X', 0, 4, 9, 1); p('X', 2, 1, 5, 1); p('X', 2, 2, 3, 1); });
  function node(c) { return draw(7, 7, function (p) { p('k', 0, 0, 7, 7); p(c, 1, 1, 5, 5); p('f', 2, 2); }); }
  SPR.nodeY = node('y'); SPR.nodeC = node('c'); SPR.nodeG = node('G'); SPR.nodeP = node('p');
  // Ilha do Lakehouse: laguinho, tanques, bombas e as camadas bronze/prata/ouro
  SPR.lake = draw(22, 9, function (p) {
    for (var y = 0; y < 9; y++) {
      var dy = (y - 4) / 4.5, half = Math.floor(11 * Math.sqrt(Math.max(0, 1 - dy * dy)));
      if (half < 1) continue;
      p(y === 0 || y === 8 ? 'B' : 'b', 11 - half, y, half * 2, 1);
      p('B', 11 - half, y); p('B', 10 + half, y);
    }
    p('f', 6, 3, 3, 1); p('f', 13, 5, 2, 1); p('c', 8, 4, 4, 1);
  });
  SPR.tank = draw(12, 13, function (p) {
    p('F', 2, 0, 8, 1); p('f', 1, 1, 10, 2);
    p('f', 1, 3, 10, 9); p('F', 9, 3, 2, 9);
    p('l', 1, 6, 10, 2); p('R', 9, 6, 2, 2);
    p('S', 0, 12, 12, 1);
  });
  SPR.pump = draw(6, 10, function (p) {
    p('R', 0, 0, 5, 1); p('l', 0, 1, 5, 8); p('R', 4, 1, 1, 8);
    p('f', 1, 2, 3, 2); p('k', 5, 3, 1, 4);
    p('S', 0, 9, 6, 1);
  });
  SPR.flare = draw(3, 22, function (p) { p('S', 1, 0, 1, 22); p('M', 0, 0, 3, 1); p('S', 0, 20, 3, 2); });
  SPR.layers = draw(14, 9, function (p) {
    p('x', 0, 6, 14, 3); p('X', 0, 8, 14, 1); p('X', 12, 6, 2, 3);
    p('m', 2, 3, 10, 3); p('M', 2, 5, 10, 1); p('M', 10, 3, 2, 3);
    p('y', 4, 0, 6, 3); p('Y', 4, 2, 6, 1); p('Y', 8, 0, 2, 3);
  });

  // Ilha do Terminal: onibus, ponto de parada e marcador de GPS
  SPR.bus = draw(22, 11, function (p) {
    p('f', 0, 1, 22, 7); p('F', 0, 7, 22, 1); p('P', 0, 5, 22, 1); p('M', 0, 0, 22, 1);
    p('b', 1, 2, 3, 2); p('b', 5, 2, 3, 2); p('b', 9, 2, 3, 2); p('b', 13, 2, 3, 2); p('B', 18, 2, 3, 3);
    p('y', 21, 6, 1, 1); p('k', 3, 8, 4, 3); p('k', 15, 8, 4, 3); p('M', 4, 9); p('M', 16, 9);
  });
  SPR.stop = draw(8, 15, function (p) {
    p('S', 3, 4, 1, 11); p('u', 0, 0, 8, 5); p('f', 1, 1, 6, 3); p('u', 3, 2, 2, 1); p('k', 2, 14, 3, 1);
  });
  SPR.pin = draw(7, 11, function (p) {
    p('R', 1, 0, 5, 1); p('r', 0, 1, 7, 5); p('R', 1, 6, 5, 1); p('r', 2, 6, 3, 2); p('r', 3, 8, 1, 2);
    p('f', 2, 2, 3, 3); p('k', 3, 3, 1, 1);
  });

  /* ---------- world ---------- */
  var ISL = [
    { id: 'sobre', name: 'Ilha do Farol', sub: 'Sobre mim', x: 300, y: 520, R: 46, seed: 1.3, dock: 0.3, col: '#f2c94c', ly: -48 },
    { id: 'olist', name: 'Porto Olist', sub: 'Atraso x satisfação', x: 720, y: 270, R: 72, seed: 2.1, dock: Math.PI * 0.75, col: '#e8743b', ly: -66 },
    { id: 'knime', name: 'Floresta Aleatória', sub: 'Nota ruim e RFM no KNIME', x: 250, y: 190, R: 62, seed: 3.7, dock: Math.PI * 0.42, col: '#4f9a43', ly: -58 },
    { id: 'energia', name: 'Ilha dos Ventos', sub: 'Preço da energia', x: 1110, y: 500, R: 76, seed: 4.4, dock: Math.PI * 0.88, col: '#49c2c9', ly: -72 },
    { id: 'varejo', name: 'Ilha do Mercado', sub: 'Varejo online em SQL', x: 720, y: 700, R: 66, seed: 5.9, dock: -Math.PI * 0.62, col: '#e86a8a', ly: -58 },
    { id: 'lakehouse', name: 'Ilha do Lakehouse', sub: 'Combustíveis no Databricks', x: 1140, y: 215, R: 62, seed: 6.6, dock: Math.PI * 0.72, col: '#e0574b', ly: -60 },
    { id: 'sptrans', name: 'Ilha do Terminal', sub: 'Ônibus de SP em tempo real', x: 440, y: 770, R: 62, seed: 8.2, dock: -Math.PI * 0.3, col: '#8a63c9', ly: -60 }
  ];
  var ROCKS = [
    { x: 980, y: 140, R: 16, seed: 7 }, { x: 470, y: 410, R: 11, seed: 8 }, { x: 1290, y: 820, R: 18, seed: 9 },
    { x: 110, y: 790, R: 14, seed: 10 }, { x: 1300, y: 130, R: 22, seed: 11 }, { x: 60, y: 420, R: 12, seed: 12 },
    { x: 1000, y: 820, R: 10, seed: 13 }
  ];
  ROCKS.forEach(function (r) { r.rock = true; });
  var ALL = ISL.concat(ROCKS);
  var BYID = {}; ISL.forEach(function (I) { BYID[I.id] = I; });

  function rad(I, a) { return I.R * (1 + 0.10 * Math.sin(3 * a + I.seed) + 0.07 * Math.sin(5 * a + I.seed * 2.3) + 0.04 * Math.sin(9 * a + I.seed * 1.7)); }
  function edge(I, dx, dy) { var ny = dy / SQ; return Math.hypot(dx, ny) - rad(I, Math.atan2(ny, dx)); }

  var DECOR = {
    sobre: [
      { s: 'palm', x: -28, y: 6 }, { s: 'lh', x: -8, y: 8 }, { s: 'house', x: 16, y: 12 }, { s: 'palm', x: 26, y: -6 },
      { s: 'bush', x: -14, y: 18 }, { s: 'sign', x: 4, y: 22 }, { s: 'umb', x: -24, y: 26 }
    ],
    olist: [
      { s: 'palm', x: -46, y: -4 }, { s: 'palm', x: -26, y: -26 }, { s: 'ware', x: -6, y: 4 }, { s: 'house', x: 34, y: -12 },
      { s: 'crates', x: 26, y: 14 }, { s: 'crate', x: 38, y: 16 }, { s: 'crate', x: 12, y: 20 }, { s: 'van', x: -30, y: 20 },
      { s: 'palm', x: 48, y: 4 }, { s: 'bush', x: -10, y: 28 }, { s: 'palm', x: 2, y: -30 }, { s: 'bush', x: 52, y: 20 }
    ],
    energia: [
      { s: 'oak', x: -52, y: 12 }, { s: 'tur', x: -36, y: -4 }, { s: 'tur', x: -8, y: -14 }, { s: 'tur', x: 22, y: -6 },
      { s: 'palm', x: 48, y: -10 }, { s: 'solar', x: -26, y: 22 }, { s: 'solar', x: -8, y: 24 }, { s: 'solar', x: 10, y: 26 },
      { s: 'solar', x: 28, y: 22 }, { s: 'bush', x: 46, y: 20 }, { s: 'palm', x: 40, y: -34 }, { s: 'bush', x: -50, y: -12 }
    ],
    varejo: [
      { s: 'palm', x: -44, y: -2 }, { s: 'palm', x: 42, y: -8 }, { s: 'oak', x: -24, y: -14 }, { s: 'sign', x: 16, y: -14 },
      { s: 'stallP', x: -24, y: 12 }, { s: 'stallC', x: 0, y: 6 }, { s: 'stallY', x: 24, y: 12 },
      { s: 'giftP', x: -12, y: 24 }, { s: 'giftC', x: 12, y: 26 }, { s: 'giftR', x: 30, y: 24 }, { s: 'bush', x: -38, y: 20 }
    ],
    knime: [
      { fn: 'wires', y: -999 },
      { s: 'pine2', x: -34, y: -12 }, { s: 'pine', x: -22, y: -20 }, { s: 'pine2', x: -8, y: -22 }, { s: 'pine', x: 6, y: -24 },
      { s: 'pine2', x: 20, y: -18 }, { s: 'pine', x: 32, y: -10 }, { s: 'pine', x: -44, y: 2 }, { s: 'pine2', x: 42, y: 4 },
      { s: 'pine', x: -28, y: 2 }, { s: 'pine', x: -14, y: -6 }, { s: 'oak', x: 30, y: 14 }, { s: 'cabin', x: 6, y: 8 },
      { s: 'nodeY', x: -38, y: 24 }, { s: 'nodeC', x: -24, y: 28 }, { s: 'nodeG', x: -10, y: 24 }, { s: 'nodeP', x: -24, y: 16 }
    ],
    lakehouse: [
      { s: 'palm', x: -46, y: -2 }, { s: 'lake', x: -20, y: -6 }, { s: 'house', x: 4, y: -14 }, { s: 'flare', x: 22, y: -18 },
      { s: 'tank', x: 32, y: -8 }, { s: 'tank', x: 44, y: 4 }, { s: 'palm', x: -28, y: -24 },
      { s: 'pump', x: -32, y: 16 }, { s: 'pump', x: -22, y: 19 }, { s: 'layers', x: 8, y: 16 },
      { s: 'bush', x: 30, y: 22 }, { s: 'bush', x: -8, y: 27 }
    ],
    sptrans: [
      { s: 'palm', x: -46, y: -2 }, { s: 'palm', x: 44, y: -8 }, { s: 'house', x: -2, y: -16 }, { s: 'stop', x: -30, y: 8 },
      { s: 'bus', x: -8, y: 10 }, { s: 'bus', x: 22, y: 18 }, { s: 'pin', x: -34, y: -18 }, { s: 'pin', x: 28, y: -6 },
      { s: 'pin', x: 10, y: 28 }, { s: 'nodeP', x: -22, y: 26 }, { s: 'nodeC', x: -8, y: 28 }, { s: 'bush', x: 40, y: 10 }
    ]
  };
  var WIRES = [[-38, 24, -24, 28], [-38, 24, -24, 16], [-24, 28, -10, 24], [-24, 16, -10, 24]];

  var K = {
    sand: hex('#f1d79c'), sand2: hex('#e3c283'), sandL: hex('#fae9bd'),
    grass: hex('#5fae4c'), grass2: hex('#4f9a43'), grassL: hex('#86cc62'), grassD: hex('#3f8340'),
    cliff: hex('#c08b55'), cliffD: hex('#94653b'), cliffDD: hex('#664328'),
    peb: hex('#8d8f99'), pebL: hex('#c4c6cc'), foam: hex('#eaf7f7'), sh: hex('#5fb7d4'), sh2: hex('#4b9fcc'),
    fl: [hex('#f2c94c'), hex('#f7f3e8'), hex('#e86a8a'), hex('#8a63c9')]
  };

  function buildIsland(I) {
    var pad = 18, hw = Math.ceil(I.R * 1.25) + pad, hh = Math.ceil(I.R * 1.25 * SQ) + pad + 6, top = I.rock ? 16 : 52;
    var cw = hw * 2, ch = hh * 2;
    I.hw = hw; I.hh = hh; I.top = top;
    var base = mk(cw, ch), g = base.getContext('2d'), im = g.createImageData(cw, ch), d = im.data;
    var sd = Math.floor(I.seed * 999);
    function put(x, y, c, a) { var o = (y * cw + x) * 4; d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = a; }
    for (var y = 0; y < ch; y++) {
      for (var x = 0; x < cw; x++) {
        var dx = x - hw + 0.5, dy = y - hh + 0.5, e = edge(I, dx, dy), h = hash(x + sd, y);
        if (e < 0) {
          var dep = -e;
          if (dep > 7 || (dep > 5 && ((x + y) & 1))) {
            var c = K.grass, up = -edge(I, dx, dy - 3), dn = -edge(I, dx, dy + 3);
            if (up <= 7) c = K.grassL; else if (dn <= 7) c = K.grassD; else if (h % 17 === 0) c = K.grass2; else if (h % 13 === 0) c = K.grassL;
            if (h % 151 === 0) c = K.fl[h % 4];
            put(x, y, c, 255);
          } else {
            put(x, y, dep < 1.6 ? K.sandL : (h % 9 === 0 ? K.sand2 : (h % 97 === 0 ? K.peb : (h % 97 === 1 ? K.pebL : K.sand))), 255);
          }
        } else if (e < 26) {
          var k = 0;
          for (var j = 1; j <= 5; j++) { if (edge(I, dx, dy - j) < 0) { k = j; break; } }
          if (k) put(x, y, k === 1 ? K.cliff : (k <= 3 ? K.cliffD : K.cliffDD), 255);
          else if (edge(I, dx, dy - 6) < 0 || edge(I, dx, dy - 7) < 0) { if (h % 3) put(x, y, K.foam, 230); else put(x, y, K.sh, 200); }
          else if (e < 2.4) { if (h % 4) put(x, y, K.foam, 235); else put(x, y, K.sh, 190); }
          else if (e < 8) put(x, y, K.sh, 170);
          else if (e < 14 && ((x + y) & 1)) put(x, y, K.sh2, 120);
        }
      }
    }
    g.putImageData(im, 0, 0);

    if (!I.rock) {
      var a = I.dock, r0 = rad(I, a) - 6, r1 = rad(I, a) + 22;
      var ca = Math.cos(a), sa = Math.sin(a) * SQ, len = Math.hypot(ca, sa), nx = -sa / len, ny = ca / len, ux = ca / len, uy = sa / len;
      for (var r = r0; r <= r1; r += 0.5) {
        var px = hw + ux * r * len, py = hh + uy * r * len;
        for (var s = -2.5; s <= 2.5; s += 0.5) {
          g.fillStyle = (Math.floor(r) % 3 === 0) ? '#6b4226' : (s > 1.5 ? '#8a5a33' : '#a26b3a');
          g.fillRect(Math.round(px + nx * s), Math.round(py + ny * s), 1, 1);
        }
      }
      [-3, 3].forEach(function (s) {
        var px = hw + ux * r1 * len + nx * s, py = hh + uy * r1 * len + ny * s;
        g.fillStyle = '#4a2b17'; g.fillRect(Math.round(px), Math.round(py), 1, 3);
      });
      I.dockX = I.x + ux * (r1 + 12) * len; I.dockY = I.y + uy * (r1 + 12) * len;
    }

    var dec = mk(cw, ch + top), dg = dec.getContext('2d');
    var items = (DECOR[I.id] || (I.R >= 18 ? [{ s: 'palm', x: 0, y: 0 }] : (I.R >= 14 ? [{ s: 'bush', x: 0, y: 2 }] : []))).slice().sort(function (p, q) { return p.y - q.y; });
    var oy = hh + top;
    I.dyn = { hubs: [], balloons: [] };
    items.forEach(function (it) {
      if (it.fn === 'wires') {
        dg.fillStyle = P.k;
        WIRES.forEach(function (w) {
          var x1 = Math.round(hw + w[0] + 3), y1 = Math.round(oy + w[1] - 4), x2 = Math.round(hw + w[2] - 3), y2 = Math.round(oy + w[3] - 4), mx = Math.round((x1 + x2) / 2);
          dg.fillRect(Math.min(x1, mx), y1, Math.abs(mx - x1) + 1, 1);
          dg.fillRect(mx, Math.min(y1, y2), 1, Math.abs(y2 - y1) + 1);
          dg.fillRect(Math.min(mx, x2), y2, Math.abs(x2 - mx) + 1, 1);
        });
        return;
      }
      var sp = SPR[it.s];
      dg.drawImage(sp, Math.round(hw + it.x - sp.width / 2), Math.round(oy + it.y - sp.height));
      var bx = I.x + it.x, by = I.y + it.y;
      if (it.s === 'tur') I.dyn.hubs.push({ x: Math.round(bx - sp.width / 2) + 3, y: Math.round(by - sp.height) + 2 });
      if (it.s === 'lh') I.dyn.lamp = { x: Math.round(bx - sp.width / 2) + 7, y: Math.round(by - sp.height) + 6 };
      if (it.s === 'cabin') I.dyn.chim = { x: Math.round(bx - sp.width / 2) + 11, y: Math.round(by - sp.height) - 1 };
      if (it.s === 'ware') I.dyn.flag = { x: Math.round(bx), y: Math.round(by - sp.height) };
      if (it.s === 'flare') I.dyn.flame = { x: Math.round(bx), y: Math.round(by - sp.height) };
      if (it.s.indexOf('stall') === 0) I.dyn.balloons.push({ x: Math.round(bx + 6), y: Math.round(by - sp.height) - 2, c: P[it.s === 'stallP' ? 'p' : it.s === 'stallC' ? 'c' : 'y'] });
    });
    I.base = base; I.dec = dec;
    I.shore = [];
    for (var q = 0; q < Math.PI * 2; q += 0.045) { var rr = rad(I, q); I.shore.push([Math.cos(q), Math.sin(q) * SQ, rr, q]); }
  }

  /* ---------- water texture ---------- */
  var waterCv = mk(W, H);
  (function () {
    var g = waterCv.getContext('2d'), im = g.createImageData(W, H), d = im.data;
    var B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    var cols = [hex('#1d4a80'), hex('#245a96'), hex('#2a67a6'), hex('#3274b3')];
    for (var y = 0; y < H; y++) {
      for (var x = 0; x < W; x++) {
        var n = 0.55 + 0.2 * Math.sin(x * 0.011 + y * 0.007) + 0.16 * Math.sin(x * 0.006 - y * 0.015 + 1.3) + 0.08 * Math.sin(x * 0.031 + y * 0.027 + 2.1);
        var ex = Math.min(x, W - x) / 140, ey = Math.min(y, H - y) / 140;
        n -= Math.max(0, 1 - Math.min(ex, ey)) * 0.45;
        var v = Math.max(0, Math.min(0.999, n)) * 3, i = Math.floor(v), f = v - i;
        if (f * 16 > B[(y & 3) * 4 + (x & 3)] + 0.5 && i < 3) i++;
        var c = cols[i], o = (y * W + x) * 4;
        d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255;
      }
    }
    g.putImageData(im, 0, 0);
  })();

  ALL.forEach(buildIsland);

  /* ---------- clouds, gulls ---------- */
  function cloudSprite(w, h, seed) {
    var c = mk(w, h), g = c.getContext('2d');
    var blobs = [[0.3, 0.6, 0.28], [0.55, 0.45, 0.34], [0.78, 0.62, 0.24], [0.45, 0.68, 0.3]];
    var sh = mk(w, h), sg = sh.getContext('2d');
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var inside = blobs.some(function (b) { var dx = (x / w - b[0]) * w, dy = (y / h - b[1]) * h * 1.6; return Math.hypot(dx, dy) < b[2] * w; });
      if (inside) {
        g.fillStyle = y > h * 0.66 ? '#dbe6ee' : (y < h * 0.4 && hash(x + seed, y) % 5 === 0 ? '#ffffff' : '#f4f8fb');
        g.fillRect(x, y, 1, 1);
        sg.fillStyle = '#0d2340'; sg.fillRect(x, y, 1, 1);
      }
    }
    return { c: c, s: sh };
  }
  var CLOUDS = [
    { x: 200, y: 90, w: 64, h: 22, v: 5 }, { x: 760, y: 470, w: 80, h: 26, v: 4 }, { x: 1150, y: 230, w: 56, h: 20, v: 6 },
    { x: 420, y: 760, w: 70, h: 24, v: 4.5 }, { x: 980, y: 760, w: 50, h: 18, v: 5.5 }
  ].map(function (c, i) { var s = cloudSprite(c.w, c.h, i * 77); c.img = s.c; c.sh = s.s; return c; });
  var GULLS = [
    { cx: 520, cy: 300, r: 90, v: 0.35, ph: 0 }, { cx: 900, cy: 600, r: 120, v: -0.28, ph: 2 },
    { cx: 300, cy: 420, r: 70, v: 0.4, ph: 4 }, { cx: 1150, cy: 300, r: 80, v: 0.3, ph: 1 }
  ];

  /* ---------- state ---------- */
  var S = 3, vw = 0, vh = 0, camX = 0, camY = 0;
  var boat = { x: 396, y: 560, vx: 0, vy: 0, dir: 1, tx: null, ty: null, goal: null, fast: false };
  var moved = false, keys = {}, wake = [], smoke = [], marker = null, T = 0, wakeT = 0, smokeT = 0, isOpen = false, near = null;

  function resize() {
    var iw = innerWidth, ih = innerHeight;
    S = Math.max(2, Math.min(6, Math.floor(Math.min(iw / 440, ih / 280))));
    vw = Math.ceil(iw / S); vh = Math.ceil(ih / S);
    cv.width = vw; cv.height = vh;
    cv.style.width = vw * S + 'px'; cv.style.height = vh * S + 'px';
    ctx.imageSmoothingEnabled = false;
    snapCam();
  }
  function camTarget() {
    var tx = boat.x - vw / 2 - (moved ? 0 : Math.max(0, (320 - vw) / 2)), ty = boat.y - vh / 2;
    tx = vw >= W ? (W - vw) / 2 : Math.max(0, Math.min(W - vw, tx));
    ty = vh >= H ? (H - vh) / 2 : Math.max(0, Math.min(H - vh, ty));
    return [tx, ty];
  }
  function snapCam() { var t = camTarget(); camX = t[0]; camY = t[1]; }

  /* ---------- UI hooks ---------- */
  var labelsEl = $('#labels'), dockBtn = $('#dock'), hint = $('#hint');
  if (COARSE && hint) hint.textContent = 'Toque no mar para navegar. Toque numa ilha para atracar e ver o projeto.';
  var labelEls = ISL.map(function (I) {
    var b = document.createElement('button');
    b.className = 'isl pbox'; b.type = 'button';
    b.style.setProperty('--c', I.col);
    b.setAttribute('aria-label', 'Navegar até ' + I.name + ': ' + I.sub);
    b.innerHTML = '<b><i></i>' + I.name + '</b><small>' + I.sub + '</small>';
    b.addEventListener('click', function () { sailTo(I.id, false); });
    labelsEl.appendChild(b);
    return b;
  });
  function dismissHint() { moved = true; if (hint) hint.classList.add('gone'); }
  function setTarget(x, y, goal, fast) { boat.tx = x; boat.ty = y; boat.goal = goal || null; boat.fast = !!fast; marker = { x: x, y: y, t: 0 }; dismissHint(); }
  function sailTo(id, fast) { var I = BYID[id]; if (!I) return; window.SITE.close(true); setTarget(I.dockX, I.dockY, id, fast); }
  function jumpTo(id) { var I = BYID[id]; if (!I) return; boat.x = I.dockX; boat.y = I.dockY; boat.vx = boat.vy = 0; boat.tx = null; boat.goal = null; snapCam(); }

  /* ---------- update ---------- */
  function update(dt) {
    var dx = 0, dy = 0;
    if (!isOpen) { if (keys.l) dx -= 1; if (keys.r) dx += 1; if (keys.u) dy -= 1; if (keys.d) dy += 1; }
    var desX = 0, desY = 0, spd = 0;
    if (dx || dy) { boat.tx = null; boat.goal = null; var l = Math.hypot(dx, dy); desX = dx / l; desY = dy / l; spd = 115; dismissHint(); }
    else if (boat.tx !== null) {
      var ex = boat.tx - boat.x, ey = boat.ty - boat.y, dist = Math.hypot(ex, ey);
      if (dist < (boat.goal ? 8 : 3)) { var gl = boat.goal; boat.tx = null; boat.goal = null; marker = null; if (gl) window.SITE.open(gl); }
      else { desX = ex / dist; desY = ey / dist; spd = Math.min(boat.fast ? 250 : 125, 30 + dist * 2.2); }
    }
    var kk = 1 - Math.exp(-dt * (spd ? 3 : 1.6));
    boat.vx += (desX * spd - boat.vx) * kk; boat.vy += (desY * spd - boat.vy) * kk;
    boat.x += boat.vx * dt; boat.y += boat.vy * dt;

    for (var i = 0; i < ALL.length; i++) {
      var I = ALL[i], ox = boat.x - I.x, oy = boat.y - I.y, nyy = oy / SQ, nd = Math.hypot(ox, nyy);
      if (nd > I.R * 1.6) continue;
      var lim = rad(I, Math.atan2(nyy, ox)) + 7;
      if (nd < lim && nd > 0.001) {
        var ux = ox / nd, uy = nyy / nd;
        boat.x = I.x + ux * lim; boat.y = I.y + uy * lim * SQ;
        var nX = ux, nY = uy * SQ, nl = Math.hypot(nX, nY); nX /= nl; nY /= nl;
        var vn = boat.vx * nX + boat.vy * nY;
        if (vn < 0) { boat.vx -= vn * nX; boat.vy -= vn * nY; }
        if (boat.tx !== null) {
          var tX = -nY, tY = nX, gx = boat.tx - boat.x, gy = boat.ty - boat.y;
          if (tX * gx + tY * gy < 0) { tX = -tX; tY = -tY; }
          boat.vx += tX * 260 * dt; boat.vy += tY * 260 * dt;
        }
      }
    }
    boat.x = Math.max(10, Math.min(W - 10, boat.x)); boat.y = Math.max(14, Math.min(H - 8, boat.y));
    if (Math.abs(boat.vx) > 8) boat.dir = boat.vx > 0 ? 1 : -1;

    var sp = Math.hypot(boat.vx, boat.vy);
    wakeT += dt;
    if (sp > 20 && wakeT > 0.05) { wakeT = 0; wake.push({ x: boat.x - boat.dir * 7, y: boat.y + 1, t: 0 }); }
    wake.forEach(function (w) { w.t += dt; }); while (wake.length && wake[0].t > 1.3) wake.shift();

    var K2 = BYID.knime;
    smokeT += dt;
    if (K2 && K2.dyn.chim && smokeT > 0.4) { smokeT = 0; smoke.push({ x: K2.dyn.chim.x, y: K2.dyn.chim.y, t: 0 }); }
    smoke.forEach(function (s) { s.t += dt; s.y -= 7 * dt; s.x += 3 * dt; }); while (smoke.length && smoke[0].t > 3) smoke.shift();
    CLOUDS.forEach(function (c) { if (!RM) c.x += c.v * dt; if (c.x > W + 120) c.x = -120; });
    if (marker) marker.t += dt;

    var t = camTarget(), cf = 1 - Math.exp(-dt * 4);
    camX += (t[0] - camX) * cf; camY += (t[1] - camY) * cf;

    var best = null, bd = 40;
    if (!isOpen && !boat.goal && moved) ISL.forEach(function (I) { var dd = Math.hypot(boat.x - I.dockX, boat.y - I.dockY); if (dd < bd) { bd = dd; best = I; } });
    if (best !== near) {
      near = best;
      if (near) { dismissHint(); dockBtn.hidden = false; dockBtn.style.setProperty('--c', near.col); dockBtn.querySelector('span').textContent = 'Atracar: ' + near.name; }
      else dockBtn.hidden = true;
    }
  }

  /* ---------- render helpers ---------- */
  function px(g, c, x, y, w, h) { g.fillStyle = c; g.fillRect(x, y, w || 1, h || 1); }
  function line(g, c, x0, y0, x1, y1) {
    var n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0; g.fillStyle = c;
    for (var i = 0; i <= n; i++) { var t = n ? i / n : 0; g.fillRect(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t), 1, 1); }
  }
  function drawDyn(g, I, t, ox, oy) {
    var D = I.dyn;
    D.hubs.forEach(function (h, i) {
      var a0 = t * 2.4 + i * 1.3, hx = h.x - ox, hy = h.y - oy;
      for (var k = 0; k < 3; k++) {
        var a = a0 + k * 2.094, ex = hx + Math.cos(a) * 11, ey = hy + Math.sin(a) * 11;
        line(g, '#f7f3e8', hx, hy, ex, ey);
        line(g, '#cfd6dd', hx + Math.cos(a + 1.57), hy + Math.sin(a + 1.57), hx + Math.cos(a + 1.57) + Math.cos(a) * 5, hy + Math.sin(a + 1.57) + Math.sin(a) * 5);
      }
      px(g, '#7d8a95', hx - 1, hy - 1, 2, 2);
    });
    if (D.lamp) {
      var lx = D.lamp.x - ox, ly = D.lamp.y - oy, a = t * 0.9;
      g.save(); g.globalAlpha = 0.2; g.fillStyle = '#ffe58a';
      [a, a + Math.PI].forEach(function (b) {
        g.beginPath(); g.moveTo(lx, ly);
        g.lineTo(lx + Math.cos(b - 0.16) * 90, ly + Math.sin(b - 0.16) * 90 * SQ);
        g.lineTo(lx + Math.cos(b + 0.16) * 90, ly + Math.sin(b + 0.16) * 90 * SQ);
        g.closePath(); g.fill();
      });
      g.restore();
      px(g, (Math.floor(t * 3) % 2) ? '#fff6c2' : '#ffe58a', lx - 2, ly - 1, 4, 3);
    }
    if (D.flag) {
      var fx = D.flag.x - ox, fy = D.flag.y - oy;
      px(g, '#7d8a95', fx, fy - 10, 1, 10);
      for (var c = 0; c < 6; c++) { var off = Math.round(Math.sin(t * 6 - c * 0.8) * 0.8); px(g, c < 3 ? '#e8743b' : '#f2c94c', fx + 1 + c, fy - 10 + off, 1, 4); }
    }
    if (D.flame) {
      var qx = D.flame.x - ox, qy = D.flame.y - oy, fk = Math.floor(t * 8) % 3;
      px(g, '#e0574b', qx - 1, qy - 4, 3, 4);
      px(g, '#f2c94c', qx - (fk === 1 ? 1 : 0), qy - 6 - fk, 2, 3 + fk);
      px(g, '#fff6c2', qx, qy - 3, 1, 2);
    }
    D.balloons.forEach(function (b, i) {
      var bx = b.x - ox, by = b.y - oy - 6 + Math.round(Math.sin(t * 2 + i) * 1.2);
      px(g, '#7d8a95', bx + 1, by + 4, 1, (b.y - oy) - (by + 4));
      px(g, b.c, bx, by, 3, 4); px(g, '#ffffff', bx, by, 1, 1);
    });
  }

  function drawBoat(x, y, dir, t) {
    var bob = Math.round(Math.sin(t * 3) * 0.7), y0 = y + bob;
    px(ctx, 'rgba(10,30,60,.35)', x - 8, y0 + 4, 17, 1);
    px(ctx, '#f3e7cc', x - 8, y0, 17, 1);
    px(ctx, '#a8693a', x - 7, y0 + 1, 15, 1);
    px(ctx, '#8a5530', x - 6, y0 + 2, 13, 1);
    px(ctx, '#5e3a1a', x - 4, y0 + 3, 9, 1);
    px(ctx, '#f2c94c', x + dir * 5, y0 + 1, 1, 1);
    var mx = x;
    px(ctx, '#5e3a1a', mx, y0 - 17, 1, 17);
    for (var i = 0; i < 13; i++) {
      var w = Math.floor(i * 0.62) + 1, row = y0 - 15 + i;
      var c = (i === 7 || i === 8) ? '#e0574b' : '#f7f3e8';
      if (dir > 0) px(ctx, c, mx - w, row, w, 1); else px(ctx, c, mx + 1, row, w, 1);
      if (i > 2) px(ctx, '#cfd6dd', dir > 0 ? mx - w : mx + w, row, 1, 1);
    }
    var fl = Math.floor(t * 6) % 2;
    px(ctx, '#e0574b', dir > 0 ? mx + 1 : mx - 3, y0 - 17 + fl, 3, 2);
  }

  function drawGull(x, y, f) {
    var c = '#f7f3e8';
    if (f) { px(ctx, c, x, y); px(ctx, c, x + 1, y + 1); px(ctx, c, x + 2, y + 1); px(ctx, c, x + 3, y + 1); px(ctx, c, x + 4, y); }
    else { px(ctx, c, x, y + 1); px(ctx, c, x + 1, y); px(ctx, c, x + 2, y + 1); px(ctx, c, x + 3, y); px(ctx, c, x + 4, y + 1); }
  }

  /* ---------- render ---------- */
  function render() {
    var cx = Math.round(camX), cy = Math.round(camY), t = T;
    ctx.fillStyle = '#1d4a80'; ctx.fillRect(0, 0, vw, vh);
    ctx.drawImage(waterCv, -cx, -cy);

    var cw = 14, chh = 10;
    var c0 = Math.floor(cx / cw) - 1, c1 = Math.ceil((cx + vw) / cw) + 1, r0 = Math.floor(cy / chh) - 1, r1 = Math.ceil((cy + vh) / chh) + 1;
    for (var ry = r0; ry <= r1; ry++) {
      for (var rx = c0; rx <= c1; rx++) {
        var h = hash(rx + 5000, ry + 5000);
        if (h % 3 === 0) {
          var ph = t * 1.6 + (h % 100) * 0.07, ww = 2 + Math.round((Math.sin(ph) + 1) * 1.5);
          var ox = rx * cw + (h % 8) + ((ry & 1) ? 7 : 0) + Math.round(Math.sin(ph * 0.5) * 2) - cx, oy = ry * chh + ((h >> 3) % 6) - cy;
          px(ctx, '#4b8bc9', ox, oy, ww, 1);
          if (ww >= 5) px(ctx, '#8cc8ec', ox + 2, oy, 1, 1);
        } else if (h % 47 === 1 && Math.sin(t * 4 + h) > 0.9) {
          var gx = rx * cw + 5 - cx, gy = ry * chh + 4 - cy;
          px(ctx, '#ffffff', gx, gy); px(ctx, '#cfe9f7', gx - 1, gy); px(ctx, '#cfe9f7', gx + 1, gy); px(ctx, '#cfe9f7', gx, gy - 1); px(ctx, '#cfe9f7', gx, gy + 1);
        }
      }
    }

    ALL.forEach(function (I) {
      var x = I.x - I.hw - cx, y = I.y - I.hh - cy;
      if (x > vw || y > vh || x + I.hw * 2 < 0 || y + I.hh * 2 < 0) return;
      ctx.drawImage(I.base, x, y);
      if (!RM) {
        ctx.fillStyle = '#f4fbfb';
        for (var q = 0; q < I.shore.length; q++) {
          var sp = I.shore[q], wv = Math.sin(t * 1.8 + q * 0.9);
          if (wv < 0.15 || sp[1] > 0.2) continue;
          var rr = sp[2] + 3.5 + Math.sin(t * 1.3 + q * 0.37) * 1.5;
          ctx.fillRect(Math.round(I.x + sp[0] * rr - cx), Math.round(I.y + sp[1] * rr - cy), wv > 0.75 ? 2 : 1, 1);
        }
        for (var q2 = 0; q2 < I.shore.length; q2++) {
          var sp2 = I.shore[q2];
          if (sp2[1] <= 0.2) continue;
          var wv2 = Math.sin(t * 1.8 + q2 * 0.9);
          if (wv2 < 0.15) continue;
          var r2 = sp2[2] + 3.5 + Math.sin(t * 1.3 + q2 * 0.37) * 1.5;
          ctx.fillRect(Math.round(I.x + sp2[0] * r2 - cx), Math.round(I.y + sp2[1] * r2 - cy) + 7, wv2 > 0.75 ? 2 : 1, 1);
        }
      }
    });

    if (marker && boat.tx !== null) {
      var mx = Math.round(marker.x - cx), my = Math.round(marker.y - cy), on = Math.floor(marker.t * 4) % 2;
      var mc = on ? '#f7f3e8' : '#f2c94c';
      px(ctx, mc, mx - 3, my - 3); px(ctx, mc, mx - 2, my - 2); px(ctx, mc, mx + 2, my - 2); px(ctx, mc, mx + 3, my - 3);
      px(ctx, mc, mx - 3, my + 3); px(ctx, mc, mx - 2, my + 2); px(ctx, mc, mx + 2, my + 2); px(ctx, mc, mx + 3, my + 3);
    }

    wake.forEach(function (w) {
      var a = 1 - w.t / 1.3, spread = Math.round(w.t * 7);
      ctx.globalAlpha = a * 0.85;
      px(ctx, '#eaf7f7', Math.round(w.x - cx) - spread, Math.round(w.y - cy) + 2, 2, 1);
      px(ctx, '#eaf7f7', Math.round(w.x - cx) + spread, Math.round(w.y - cy) + 2, 2, 1);
      ctx.globalAlpha = 1;
    });
    drawBoat(Math.round(boat.x - cx), Math.round(boat.y - cy), boat.dir, t);

    ALL.forEach(function (I) {
      var x = I.x - I.hw - cx, y = I.y - I.hh - I.top - cy;
      if (x > vw || y > vh || x + I.hw * 2 < 0 || y + I.hh * 2 + I.top < 0) return;
      ctx.drawImage(I.dec, x, y);
      if (I.dyn && !I.rock) drawDyn(ctx, I, t, cx, cy);
    });

    smoke.forEach(function (s) {
      ctx.globalAlpha = Math.max(0, 0.75 - s.t / 4);
      px(ctx, s.t > 1.5 ? '#cfd6dd' : '#9aa3ad', Math.round(s.x - cx), Math.round(s.y - cy), s.t > 1 ? 3 : 2, 2);
    });
    ctx.globalAlpha = 1;

    GULLS.forEach(function (gl) {
      var a = t * gl.v + gl.ph, x = Math.round(gl.cx + Math.cos(a) * gl.r - cx), y = Math.round(gl.cy + Math.sin(a) * gl.r * 0.6 - cy);
      drawGull(x, y, Math.floor(t * 5 + gl.ph) % 2);
    });

    CLOUDS.forEach(function (c) {
      var x = Math.round(c.x - cx), y = Math.round(c.y - cy);
      if (x > vw + 60 || x + c.w + 60 < 0 || y > vh + 60 || y + c.h + 70 < 0) return;
      ctx.globalAlpha = 0.14; ctx.drawImage(c.sh, x + 22, y + 48);
      ctx.globalAlpha = 0.95; ctx.drawImage(c.img, x, y);
      ctx.globalAlpha = 1;
    });

    ISL.forEach(function (I, i) {
      var sx = (I.x - camX) * S, sy = (I.y + I.ly - camY) * S, el = labelEls[i];
      var off = sx < -200 || sy < -100 || sx > innerWidth + 200 || sy > innerHeight + 150;
      el.style.visibility = off ? 'hidden' : 'visible';
      if (!off) el.style.transform = 'translate(' + Math.round(sx) + 'px,' + Math.round(sy) + 'px) translate(-50%,-100%)';
    });

    drawMini();
  }

  /* ---------- minimap ---------- */
  var mini = $('#mini'), mg = mini ? mini.getContext('2d') : null, MS = 0.12;
  var miniBase = mk(Math.round(W * MS), Math.round(H * MS));
  (function () {
    var g = miniBase.getContext('2d');
    g.imageSmoothingEnabled = false; g.drawImage(waterCv, 0, 0, miniBase.width, miniBase.height);
    ALL.forEach(function (I) {
      for (var y = -I.R; y <= I.R; y++) for (var x = -I.R * 1.3; x <= I.R * 1.3; x++) {
        if (edge(I, x, y) < 0 && hash(Math.round(x), Math.round(y)) % 2 === 0) { g.fillStyle = I.rock ? '#e3c283' : '#5fae4c'; g.fillRect(Math.round((I.x + x) * MS), Math.round((I.y + y) * MS), 1, 1); }
      }
      if (!I.rock) { g.fillStyle = '#2b2238'; g.fillRect(Math.round(I.x * MS) - 2, Math.round(I.y * MS) - 2, 5, 5); g.fillStyle = I.col; g.fillRect(Math.round(I.x * MS) - 1, Math.round(I.y * MS) - 1, 3, 3); }
    });
  })();
  if (mini) { mini.width = miniBase.width; mini.height = miniBase.height; mg.imageSmoothingEnabled = false; }
  function drawMini() {
    if (!mg || !mini.getClientRects().length) return;
    mg.drawImage(miniBase, 0, 0);
    mg.strokeStyle = 'rgba(247,243,232,.8)'; mg.lineWidth = 1;
    mg.strokeRect(Math.round(camX * MS) + 0.5, Math.round(camY * MS) + 0.5, Math.round(vw * MS), Math.round(vh * MS));
    mg.fillStyle = '#2b2238'; mg.fillRect(Math.round(boat.x * MS) - 2, Math.round(boat.y * MS) - 2, 4, 4);
    mg.fillStyle = '#ffffff'; mg.fillRect(Math.round(boat.x * MS) - 1, Math.round(boat.y * MS) - 1, 2, 2);
  }
  if (mini) mini.addEventListener('pointerdown', function (e) {
    var r = mini.getBoundingClientRect(), wx = (e.clientX - r.left) / r.width * W, wy = (e.clientY - r.top) / r.height * H;
    var hit = hitIsland(wx, wy, 1.6); if (hit) sailTo(hit.id, true); else setTarget(wx, wy, null, true);
  });

  /* ---------- input ---------- */
  function hitIsland(wx, wy, k) {
    for (var i = 0; i < ISL.length; i++) {
      var I = ISL[i], dx = wx - I.x, dy = wy - I.y;
      if (edge(I, dx, dy) < 6 * (k || 1) || (Math.abs(dx) < I.R * 0.8 && dy < 0 && dy > I.ly)) return I;
    }
    return null;
  }
  function inRock(wx, wy) { return ROCKS.some(function (I) { return edge(I, wx - I.x, wy - I.y) < 4; }); }
  cv.addEventListener('pointerdown', function (e) {
    var wx = camX + e.clientX / S, wy = camY + e.clientY / S, I = hitIsland(wx, wy);
    if (I) { sailTo(I.id, false); return; }
    if (!inRock(wx, wy)) setTarget(wx, wy, null, false);
  });
  cv.addEventListener('pointermove', function (e) {
    var wx = camX + e.clientX / S, wy = camY + e.clientY / S;
    cv.style.cursor = hitIsland(wx, wy) ? 'pointer' : 'crosshair';
  });
  var KEYMAP = { ArrowLeft: 'l', a: 'l', A: 'l', ArrowRight: 'r', d: 'r', D: 'r', ArrowUp: 'u', w: 'u', W: 'u', ArrowDown: 'd', s: 's', S: 'd' };
  KEYMAP.s = 'd';
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) { window.SITE.close(); return; }
    if (isOpen) return;
    var tg = e.target && e.target.tagName;
    if (tg === 'INPUT' || tg === 'TEXTAREA') return;
    if ((e.key === 'e' || e.key === 'E' || e.key === 'Enter') && near && (tg !== 'BUTTON' && tg !== 'A')) { window.SITE.open(near.id); return; }
    var k = KEYMAP[e.key]; if (k) { keys[k] = true; if (e.key.indexOf('Arrow') === 0) e.preventDefault(); }
  });
  addEventListener('keyup', function (e) { var k = KEYMAP[e.key]; if (k) keys[k] = false; });
  addEventListener('blur', function () { keys = {}; });
  dockBtn.addEventListener('click', function () { if (near) window.SITE.open(near.id); });
  addEventListener('resize', resize);

  /* ---------- postcards for panels ---------- */
  function postcard(I) {
    var x0 = Math.round(I.hw - I.R * 1.2), x1 = Math.round(I.hw + I.R * 1.2);
    var y0 = Math.round(I.top + I.hh + I.ly + 6), y1 = Math.round(I.top + I.hh + I.R * SQ * 1.25 + 10);
    var c = mk(x1 - x0, y1 - y0), g = c.getContext('2d');
    var wx = Math.round(I.x - I.hw + x0), wy = Math.round(I.y - I.hh - I.top + y0);
    g.drawImage(waterCv, -wx, -wy);
    for (var ry = 0; ry < c.height; ry += 10) for (var rx = -14; rx < c.width; rx += 14) {
      var h = hash(rx + wx, ry + wy);
      if (h % 3 === 0) { g.fillStyle = '#4b8bc9'; g.fillRect(rx + (h % 8) + ((ry / 10) & 1 ? 7 : 0), ry + ((h >> 3) % 6), 2 + (h % 3), 1); }
    }
    g.drawImage(I.base, -x0, -y0 + I.top);
    g.drawImage(I.dec, -x0, -y0);
    drawDyn(g, I, 0.6, I.x - I.hw + x0, I.y - I.hh - I.top + y0);
    return c;
  }
  ISL.forEach(function (I) {
    var slot = document.querySelector('[data-postcard="' + I.id + '"]');
    if (slot) { var c = postcard(I); c.setAttribute('aria-hidden', 'true'); slot.appendChild(c); slot.style.setProperty('--pw', c.width + 'px'); }
  });

  /* ---------- loop ---------- */
  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    T += RM ? dt * 0.25 : dt;
    update(dt); render();
    requestAnimationFrame(frame);
  }

  window.WORLD = {
    setOpen: function (v) { isOpen = v; if (v) { keys = {}; dockBtn.hidden = true; near = null; } },
    sailTo: sailTo, jumpTo: jumpTo, islands: ISL
  };

  resize();
  requestAnimationFrame(frame);
})();
