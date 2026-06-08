<script type="module">
(() => {
  // --- CONFIG ---
  const PAGE_A_SRC = "/";              // Page A (https://girl.tv/)
  const BASE_W = 1280;                 // logische Breite der eingebetteten Seite
  const BASE_H = 800;                  // logische Höhe der eingebetteten Seite

  // Grob passend zur gezeigten 2016-Foto-Ansicht (in % des Viewports).
  // Mit "E" jederzeit exakt einstellbar (wird gespeichert).
  const DEFAULT_PTS = {
    tl: [24.8, 58.0], // top-left
    tr: [37.6, 54.2], // top-right
    br: [64.6, 74.1], // bottom-right
    bl: [47.1, 78.7]  // bottom-left
  };

  // --- DOM ---
  const wrap = document.createElement('div');
  wrap.id = 'live-screen-overlay';
  Object.assign(wrap.style, {
    position: 'fixed',
    inset: '0 auto auto 0',
    width: BASE_W + 'px',
    height: BASE_H + 'px',
    transformOrigin: '0 0',
    zIndex: '999999',
    pointerEvents: 'auto'
  });

  const iframe = document.createElement('iframe');
  iframe.src = PAGE_A_SRC;
  iframe.setAttribute('loading','eager');
  iframe.setAttribute('referrerpolicy','no-referrer');
  Object.assign(iframe.style, {
    width: '100%',
    height: '100%',
    border: '0',
    display: 'block',
    background: '#000'
  });
  wrap.appendChild(iframe);
  document.body.appendChild(wrap);

  // --- STATE ---
  const loadPts = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('liveScreenPts_v1')||'{}');
      return ['tl','tr','br','bl'].reduce((acc,k)=>{
        acc[k] = Array.isArray(saved[k]) ? saved[k] : DEFAULT_PTS[k];
        return acc;
      },{});
    } catch { return structuredClone(DEFAULT_PTS); }
  };
  const savePts = (pts) => localStorage.setItem('liveScreenPts_v1', JSON.stringify(pts));

  let PTS = loadPts();

  // --- MATH: quad -> CSS matrix3d ---
  function quadToMatrix4x4CSS(p, w, h) {
    // p = [{x,y}*4] order: tl,tr,br,bl (viewport px)
    const [TL, TR, BR, BL] = p;
    const x1=TL.x, y1=TL.y, x2=TR.x, y2=TR.y, x3=BR.x, y3=BR.y, x4=BL.x, y4=BL.y;

    const dx1 = x2 - x3, dy1 = y2 - y3;
    const dx2 = x4 - x3, dy2 = y4 - y3;
    const dx3 = x1 - x2 + x3 - x4, dy3 = y1 - y2 + y3 - y4;

    const denom = (dx1*dy2 - dx2*dy1) || 1e-6;
    const g = (dx3*dy2 - dx2*dy3) / denom;
    const h2 = (dx1*dy3 - dx3*dy1) / denom;

    // H (3x3) for unit square; pre-scale inputs by S = diag(1/w,1/h,1): H' = H*S
    const a11 = x1 / w;
    const a12 = (x2 - x1) / h;
    const a13 = x4 - x1;

    const a21 = y1 / w;
    const a22 = (y2 - y1) / h;
    const a23 = y4 - y1;

    const a31 = 1 / w;
    const a32 = g / h;
    const a33 = h2;

    // CSS matrix3d order (column-major):
    // [a1,b1,c1,d1, a2,b2,c2,d2, a3,b3,c3,d3, a4,b4,c4,d4]
    return [
      a11, a21, 0, a31,
      a12, a22, 0, a32,
      0,   0,   1, 0,
      a13, a23, 0, a33
    ];
  }

  // --- APPLY TRANSFORM ---
  function apply() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const ptsPx = ['tl','tr','br','bl'].map(k => {
      const [xp, yp] = PTS[k];
      return { x: xp/100*vw, y: yp/100*vh };
    });

    const m = quadToMatrix4x4CSS(ptsPx, BASE_W, BASE_H);
    wrap.style.transform = `matrix3d(${m.map(n => Number.isFinite(n)? n : 0).join(',')})`;

    // Clip to the screen polygon so nur der “Screen” sichtbar ist
    const poly = ptsPx.map(pt => `${(pt.x/vw*100).toFixed(4)}% ${(pt.y/vh*100).toFixed(4)}%`).join(',');
    wrap.style.clipPath = `polygon(${poly})`;
  }

  // --- DEBUG HANDLES (toggle: key "E") ---
  let dbgOn = false, handles;
  function toggleDbg() {
    dbgOn = !dbgOn;
    if (!dbgOn) {
      handles?.remove();
      handles = null;
      return;
    }
    const vw = innerWidth, vh = innerHeight;
    handles = document.createElement('div');
    handles.id = 'live-screen-handles';
    Object.assign(handles.style, { position:'fixed', inset:0, zIndex: '1000000', pointerEvents:'none' });

    const makeDot = (key,color='#00e1ff') => {
      const dot = document.createElement('div');
      dot.dataset.key = key;
      Object.assign(dot.style, {
        position:'absolute',
        width:'16px', height:'16px', margin:'-8px 0 0 -8px',
        border:'2px solid #fff', borderRadius:'50%',
        background: color, boxShadow:'0 0 0 2px rgba(0,0,0,.35)',
        cursor:'move', pointerEvents:'auto'
      });
      handles.appendChild(dot);
      return dot;
    };

    const dots = {
      tl: makeDot('tl','#ff3b30'),
      tr: makeDot('tr','#34c759'),
      br: makeDot('br','#007aff'),
      bl: makeDot('bl','#ffcc00')
    };

    const place = () => {
      for (const k of ['tl','tr','br','bl']) {
        const [xp,yp] = PTS[k];
        const dot = dots[k];
        dot.style.left = (xp/100*vw)+'px';
        dot.style.top  = (yp/100*vh)+'px';
      }
    };
    place();

    let dragKey=null;
    const onDown = (e) => {
      if (!(e.target instanceof HTMLElement)) return;
      if (!e.target.dataset.key) return;
      dragKey = e.target.dataset.key;
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragKey) return;
      const x = (e.touches? e.touches[0].clientX : e.clientX);
      const y = (e.touches? e.touches[0].clientY : e.clientY);
      PTS[dragKey] = [ x/vw*100, y/vh*100 ];
      savePts(PTS);
      place();
      apply();
    };
    const onUp = () => dragKey=null;

    handles.addEventListener('mousedown', onDown);
    handles.addEventListener('touchstart', onDown, {passive:false});
    window.addEventListener('mousemove', onMove, {passive:false});
    window.addEventListener('touchmove', onMove, {passive:false});
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    document.body.appendChild(handles);
  }

  // --- INIT ---
  apply();
  addEventListener('resize', apply);
  addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e') toggleDbg();
    if (e.key.toLowerCase() === 'r') { localStorage.removeItem('liveScreenPts_v1'); PTS = loadPts(); apply(); }
  });
})();
</script>