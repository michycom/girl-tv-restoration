<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <title>Magic Chords – SVG Chord Wheel</title>
  <style>
    :root{
      color-scheme:dark;
      --bg:#05060a;
      --panel:#10131c;
      --panel-soft:#141829;
      --text:#f5f7fd;
      --muted:#9aa3b8;
      --accent:#4fd1ff;
      --accent-soft:rgba(79,209,255,.16);
      --radius:16px;
      --shadow:0 18px 40px rgba(0,0,0,.7);
    }
    *{box-sizing:border-box;}
    body{
      margin:0;
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      background:radial-gradient(circle at top,#181a26 0,#05060a 55%,#000 100%);
      color:var(--text);
      font-family:system-ui,-apple-system,Segoe UI,sans-serif;
    }
    .app{
      background:var(--panel);
      border-radius:var(--radius);
      box-shadow:var(--shadow);
      padding:16px 18px 14px;
      max-width:980px;
      width:96vw;
      display:flex;
      flex-direction:column;
      gap:10px;
    }
    .header{
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:16px;
      margin-bottom:4px;
    }
    .title-block h1{
      margin:0;
      font-size:18px;
      letter-spacing:.08em;
      text-transform:uppercase;
      color:var(--muted);
    }
    .title-block .subtitle{
      margin-top:2px;
      font-size:11px;
      color:var(--muted);
    }

    .status-bar{
      display:flex;
      justify-content:space-between;
      gap:12px;
      background:#0c0f18;
      border-radius:10px;
      padding:8px 10px;
      font-size:11px;
      color:var(--muted);
    }
    .status-label{
      text-transform:uppercase;
      letter-spacing:.1em;
      font-size:10px;
      margin-bottom:2px;
    }
    .status-value{
      font-family:SFMono-Regular,ui-monospace,Menlo,Monaco,Consolas,"Courier New",monospace;
      font-size:12px;
      color:var(--text);
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .game-shell{
      margin-top:4px;
      background:#050710;
      border-radius:14px;
      padding:8px;
      display:flex;
      gap:12px;
      align-items:center;
      justify-content:center;
    }
    svg{
      display:block;
      background:radial-gradient(circle at top,#181c30 0,#05060b 70%);
      border-radius:50%;
    }

    .legend{
      font-size:11px;
      color:var(--muted);
      max-width:260px;
      line-height:1.4;
    }
    .legend b{
      color:var(--text);
      font-weight:600;
    }

    /* SVG styling */
    .bg-circle{
      fill:#05060b;
    }
    .root-group{
      transition:transform .16s ease, filter .16s ease, opacity .15s ease;
      transform-origin:center;
    }
    .root-group.active-root{
      filter:drop-shadow(0 10px 18px rgba(0,0,0,.6));
    }
    /* alle anderen Roots ausblenden, wenn einer im Hover-Fokus ist */
    .root-group.hidden-root{
      opacity:0;
      pointer-events:none;
    }

    .root-circle{
      fill:#252c3f;
      stroke:rgba(255,255,255,0.4);
      stroke-width:2;
      cursor:pointer;
    }
    .root-circle.active-root-circle{
      stroke:#ffffff;
      stroke-width:2.4;
    }

    .root-label{
      font-size:14px;
      fill:#f7f9ff;
      text-anchor:middle;
      dominant-baseline:middle;
      font-weight:800;
      pointer-events:none;
    }

    .dot-circle{
      r:5.5;
      fill:#15192a;
      stroke:#2c3350;
      stroke-width:1;
      cursor:pointer;
      transition:fill .15s,stroke .15s,transform .1s,opacity .12s;
    }
    .dot-circle:hover{
      fill:#20283c;
      stroke:var(--accent);
      transform:scale(1.12);
    }
    .dot-circle.disabled{
      opacity:0.15;
      cursor:default;
    }
    .dot-circle.active-dot{
      fill:var(--accent);
      stroke:#ffffff;
      transform:scale(1.2);
    }
    .dot-label{
      font-size:8.5px;
      fill:#d4d7e2;
      text-anchor:middle;
      dominant-baseline:middle;
      pointer-events:none;
    }
    .dot-label-muted{
      fill:var(--muted);
    }

    .center-root{
      font-size:32px;
      fill:#ffffff;
      text-anchor:middle;
      dominant-baseline:central;
      font-weight:700;
      pointer-events:none;
    }
    .center-chord{
      font-size:13px;
      fill:var(--muted);
      text-anchor:middle;
      dominant-baseline:hanging;
      pointer-events:none;
    }
    .center-caption{
      font-size:10px;
      fill:var(--muted);
      text-anchor:middle;
      dominant-baseline:baseline;
      pointer-events:none;
    }

    @media (max-width:900px){
      .header{
        flex-direction:column;
        align-items:flex-start;
      }
      .status-bar{
        flex-direction:column;
      }
      .game-shell{
        flex-direction:column;
      }
    }
  </style>
</head>
<body>
<div class="app">

  <div class="header">
    <div class="title-block">
      <h1>Magic Chords – Wheel</h1>
      <div class="subtitle">Root wählen · Dots klicken · Akkord wächst wie ein Spiel</div>
    </div>
  </div>

  <div class="status-bar">
    <div>
      <div class="status-label">Akkord</div>
      <div id="statusChord" class="status-value">–</div>
    </div>
    <div>
      <div class="status-label">Noten (eine Oktave)</div>
      <div id="statusNotes" class="status-value">–</div>
    </div>
    <div>
      <div class="status-label">Intervalle (HT)</div>
      <div id="statusIntervals" class="status-value">–</div>
    </div>
  </div>

  <div class="game-shell">
    <svg id="chordWheelSvg" viewBox="0 0 520 520" width="420" height="420"></svg>
    <div class="legend">
      <p><b>How to play:</b></p>
      <p>
        · Klick auf einen <b>Root-Kreis</b> → Grundton wählen.<br>
        · Obere Dots: <b>me / mi / se / si / re / fa / sol</b> (Triad-Typen + 5).<br>
        · Untere Dots: <b>la / te / ti / re / fa / la</b> (6,7,maj7,9,11,13).<br>
      </p>
      <p>
        Hover über einem Dot zeigt dir eine Sprechblase mit Solmisation + Akkordinfo.
      </p>
    </div>
  </div>

</div>

<script>
(function(){
  const svgns = "http://www.w3.org/2000/svg";
  const svg   = document.getElementById('chordWheelSvg');

  const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

  const ROOTS = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

  // Triaden mit Solfège
  const TRIADS = [
    { id:'maj',  label:'mi', title:'mi – große Terz (+4 HT, Dur-Dreiklang)' },
    { id:'min',  label:'me', title:'me – kleine Terz (+3 HT, Moll-Dreiklang)' },
    { id:'aug',  label:'si', title:'si – übermäßige Quinte (+8 HT, Augmented-Dreiklang)' },
    { id:'dim',  label:'se', title:'se – verminderte Quinte (+6 HT, verminderter Dreiklang)' },
    { id:'sus2', label:'re', title:'re – sus2 (+2 HT, Sekunde ersetzt die Terz)' },
    { id:'sus4', label:'fa', title:'fa – sus4 (+5 HT, Quarte ersetzt die Terz)' }
  ];
  const POWER_DOT = {
    id:'5',
    label:'sol',
    title:'sol – Powerchord (1 + reine Quinte)'
  };

  // Extensions mit Solfège (7 vs maj7: te vs ti)
  const EXTS = [
    { id:'6',    label:'la',  title:'la – hinzugefügte 6 (+9 HT, add6 / 13 ohne 7)' },
    { id:'7',    label:'te',  title:'te – kleine Septime (+10 HT, Dominant-7, „Blues/Spannung“)' },
    { id:'maj7', label:'ti',  title:'ti – große Septime (+11 HT, maj7, Leitton-Charakter)' },
    { id:'9',    label:'re',  title:'re – 9 (+14 HT, Sekunde eine Oktave höher, add9)' },
    { id:'11',   label:'fa',  title:'fa – 11 (+17 HT, Quarte eine Oktave höher, add11)' },
    { id:'13',   label:'la',  title:'la – 13 (+21 HT, 6 eine Oktave höher, add13 / 7(13))' }
  ];

  // State
  let currentRootIndex = 0;
  let triadQuality = 'maj';   // 'maj' | 'min' | 'aug' | 'dim' | 'sus2' | 'sus4'
  let power5 = false;
  let ext = {
    '6':false,
    '7':false,
    'maj7':false,
    '9':false,
    '11':false,
    '13':false
  };
  let hoverRootIndex = null;  // Root im Hover-Fokus (für Solo-Anzeige)

  const statusChord     = document.getElementById('statusChord');
  const statusNotes     = document.getElementById('statusNotes');
  const statusIntervals = document.getElementById('statusIntervals');

  const centerX = 260;
  const centerY = 260;
  const rootRadius = 180;
  const rootCircleRadius = 45;

  function makeEl(tag, attrs){
    const el = document.createElementNS(svgns, tag);
    for(const k in attrs){
      el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  let centerRootText, centerChordText, centerCaption;

  const rootGroups = [];
  const rootCircles = [];

  const triadDots = {};
  const triadLabels = {};
  const powerDots = [];
  const powerLabels = [];

  const extDots = {};
  const extLabels = {};

  function buildWheel(){
    svg.innerHTML = '';

    svg.appendChild(makeEl('circle',{
      cx:centerX, cy:centerY, r:245, class:'bg-circle'
    }));

    centerRootText = makeEl('text',{
      x:centerX, y:centerY-4, class:'center-root'
    });
    svg.appendChild(centerRootText);

    centerChordText = makeEl('text',{
      x:centerX, y:centerY+26, class:'center-chord'
    });
    svg.appendChild(centerChordText);

    centerCaption = makeEl('text',{
      x:centerX, y:centerY+44, class:'center-caption'
    });
    centerCaption.textContent = 'Dots = Solmisation der hinzugefügten Töne';
    svg.appendChild(centerCaption);

    TRIADS.forEach(t=>{
      triadDots[t.id] = {};
      triadLabels[t.id] = {};
    });
    EXTS.forEach(e=>{
      extDots[e.id] = {};
      extLabels[e.id] = {};
    });

    for(let i=0;i<ROOTS.length;i++){
      const angleDeg = -90 + i*30;
      const group = makeEl('g',{
        class:'root-group',
        'data-root-index': String(i),
        transform:`translate(${centerX},${centerY}) rotate(${angleDeg}) translate(${rootRadius},0) rotate(${-angleDeg})`
      });

      // Hover: Solo-Modus für diesen Root
      group.addEventListener('mouseenter', ()=>{
        hoverRootIndex = i;
        updateVisuals();
      });
      group.addEventListener('mouseleave', ()=>{
        hoverRootIndex = null;
        updateVisuals();
      });

      const rootCircle = makeEl('circle',{
        cx:0, cy:0, r:rootCircleRadius,
        class:'root-circle',
        'data-root-index': String(i)
      });
      rootCircle.addEventListener('click', ()=>setRoot(i));
      group.appendChild(rootCircle);

      const label = makeEl('text',{
        x:0, y:2,
        class:'root-label'
      });
      label.textContent = ROOTS[i];
      group.appendChild(label);

      // Top row: TRIADS + Power
      const topCount = TRIADS.length + 1;
      const topY = -28;
      const topSpacing = 14;
      const topTotal = (topCount-1)*topSpacing;
      const topStart = -topTotal/2;

      // Triaden
      TRIADS.forEach((t, idx)=>{
        const x = topStart + idx*topSpacing;
        const c = makeEl('circle',{
          cx:x, cy:topY,
          class:'dot-circle triad-dot',
          'data-root-index': String(i),
          'data-role':'triad',
          'data-id':t.id
        });
        const tt = makeEl('title',{});
        tt.textContent = t.title;
        c.appendChild(tt);

        c.addEventListener('click', onDotClick);
        group.appendChild(c);

        const tl = makeEl('text',{
          x:x, y:topY-9,
          class:'dot-label dot-label-muted'
        });
        tl.textContent = t.label;
        group.appendChild(tl);

        triadDots[t.id][i] = c;
        triadLabels[t.id][i] = tl;
      });

      // Powerchord-Dot
      const powerX = topStart + (topCount-1)*topSpacing;
      const pc = makeEl('circle',{
        cx:powerX, cy:topY,
        class:'dot-circle power-dot',
        'data-root-index': String(i),
        'data-role':'power',
        'data-id':'5'
      });
      const pcTitle = makeEl('title',{});
      pcTitle.textContent = POWER_DOT.title;
      pc.appendChild(pcTitle);

      pc.addEventListener('click', onDotClick);
      group.appendChild(pc);
      const pl = makeEl('text',{
        x:powerX, y:topY-9,
        class:'dot-label dot-label-muted'
      });
      pl.textContent = POWER_DOT.label;
      group.appendChild(pl);

      powerDots[i] = pc;
      powerLabels[i] = pl;

      // Bottom row: Extensions
      const bottomCount = EXTS.length;
      const bottomY = 28;
      const bottomSpacing = 14;
      const bottomTotal = (bottomCount-1)*bottomSpacing;
      const bottomStart = -bottomTotal/2;

      EXTS.forEach((e, idx)=>{
        const x = bottomStart + idx*bottomSpacing;
        const c = makeEl('circle',{
          cx:x, cy:bottomY,
          class:'dot-circle ext-dot',
          'data-root-index': String(i),
          'data-role':'ext',
          'data-id':e.id
        });
        const tt = makeEl('title',{});
        tt.textContent = e.title;
        c.appendChild(tt);

        c.addEventListener('click', onDotClick);
        group.appendChild(c);

        const tl = makeEl('text',{
          x:x, y:bottomY+9,
          class:'dot-label dot-label-muted'
        });
        tl.textContent = e.label;
        group.appendChild(tl);

        extDots[e.id][i] = c;
        extLabels[e.id][i] = tl;
      });

      svg.appendChild(group);
      rootGroups[i] = group;
      rootCircles[i] = rootCircle;
    }

    updateAll();
  }

  function onDotClick(evt){
    const role = evt.currentTarget.getAttribute('data-role');
    const id   = evt.currentTarget.getAttribute('data-id');
    const idx  = parseInt(evt.currentTarget.getAttribute('data-root-index'),10);
    if(!Number.isNaN(idx) && idx !== currentRootIndex){
      setRoot(idx,false);
    }

    if(role === 'triad'){
      if(triadQuality === id){
        triadQuality = null;
      }else{
        triadQuality = id;
      }
      power5 = false;
    }else if(role === 'power'){
      power5 = !power5;
    }else if(role === 'ext'){
      if(id === '7'){
        ext['7'] = !ext['7'];
        if(ext['7']) ext['maj7'] = false;
      }else if(id === 'maj7'){
        ext['maj7'] = !ext['maj7'];
        if(ext['maj7']) ext['7'] = false;
      }else{
        ext[id] = !ext[id];
      }
    }

    updateAll();
  }

  function setRoot(idx, redraw = true){
    currentRootIndex = idx;
    if(redraw) updateAll();
  }

  function intervalsFromTriad(q, powerMode){
    if(powerMode){
      return [0,7]; // 1 + 5
    }
    if(!q){
      return [0];
    }
    switch(q){
      case 'maj':  return [0,4,7];
      case 'min':  return [0,3,7];
      case 'aug':  return [0,4,8];
      case 'dim':  return [0,3,6];
      case 'sus2': return [0,2,7];
      case 'sus4': return [0,5,7];
      default:     return [0];
    }
  }

  function buildChordIntervals(){
    let intervals = intervalsFromTriad(triadQuality, power5);

    if(!power5){
      if(ext['6'])    intervals.push(9);
      if(ext['7'])    intervals.push(10);
      if(ext['maj7']) intervals.push(11);
    }

    if(ext['9'])  intervals.push(14);
    if(ext['11']) intervals.push(17);
    if(ext['13']) intervals.push(21);

    const norm = Array.from(new Set(intervals.map(i=>((i%12)+12)%12))).sort((a,b)=>a-b);
    return { all: intervals, norm };
  }

  function buildChordSymbol(){
    const root = ROOTS[currentRootIndex];
    let symbol = root;

    if(power5){
      symbol += '5';
    }else{
      if(triadQuality === 'min')      symbol += 'm';
      else if(triadQuality === 'aug') symbol += '+';
      else if(triadQuality === 'dim') symbol += '°';
      else if(triadQuality === 'sus2' || triadQuality === 'sus4'){
        symbol += triadQuality;
      }
    }

    let coreTag = '';
    if(!power5){
      if(ext['6']) coreTag = '6';
      if(ext['7']) coreTag = '7';
      if(ext['maj7']) coreTag = 'maj7';
    }

    if(coreTag){
      symbol += coreTag;
    }

    const tensList = [];
    if(ext['9'])  tensList.push('9');
    if(ext['11']) tensList.push('11');
    if(ext['13']) tensList.push('13');

    if(tensList.length){
      symbol += '(' + tensList.join(',') + ')';
    }

    if(symbol === root){
      symbol += ' (nur Grundton)';
    }

    return symbol;
  }

  function buildChordNotes(normIntervals){
    return normIntervals.map(off=>{
      const idx = (currentRootIndex + off + 1200) % 12;
      return NOTES[idx];
    });
  }

  function updateVisuals(){
    const focusIndex = (hoverRootIndex !== null ? hoverRootIndex : null);

    rootGroups.forEach((g,idx)=>{
      if(!g) return;
      const isActive = idx === currentRootIndex;
      const isHidden = (focusIndex !== null && idx !== focusIndex);

      g.classList.toggle('active-root', isActive);
      g.classList.toggle('hidden-root', isHidden);
    });

    rootCircles.forEach((c,idx)=>{
      if(!c) return;
      c.classList.toggle('active-root-circle', idx === currentRootIndex);
    });

    TRIADS.forEach(t=>{
      const id = t.id;
      for(const idx in triadDots[id]){
        const c = triadDots[id][idx];
        const l = triadLabels[id][idx];
        const isActiveRoot = Number(idx) === currentRootIndex;
        const isActive = isActiveRoot && !power5 && triadQuality === id;

        c.classList.toggle('active-dot', isActive);
        c.classList.toggle('disabled', !isActiveRoot);
        if(l){
          l.classList.toggle('dot-label-muted', !isActive);
        }
      }
    });

    for(const idx in powerDots){
      const c = powerDots[idx];
      const l = powerLabels[idx];
      const isActiveRoot = Number(idx) === currentRootIndex;
      const isActive = isActiveRoot && power5;

      c.classList.toggle('active-dot', isActive);
      c.classList.toggle('disabled', !isActiveRoot);
      if(l){
        l.classList.toggle('dot-label-muted', !isActive);
      }
    }

    EXTS.forEach(e=>{
      const id = e.id;
      for(const idx in extDots[id]){
        const c = extDots[id][idx];
        const l = extLabels[id][idx];
        const isActiveRoot = Number(idx) === currentRootIndex;
        const isActive = isActiveRoot && !!ext[id];

        c.classList.toggle('active-dot', isActive);
        c.classList.toggle('disabled', !isActiveRoot);
        if(l){
          l.classList.toggle('dot-label-muted', !isActive);
        }
      }
    });
  }

  function updateAll(){
    const { norm } = buildChordIntervals();
    const notes = buildChordNotes(norm);
    const symbol = buildChordSymbol();

    centerRootText.textContent = ROOTS[currentRootIndex];
    centerChordText.textContent = symbol;
    statusChord.textContent = symbol;
    statusNotes.textContent = notes.length ? notes.join(' – ') : '–';
    statusIntervals.textContent = norm.length ? norm.map(i=>i+' HT').join(', ') : '–';

    updateVisuals();
  }

  buildWheel();
})();
</script>
</body>
</html>