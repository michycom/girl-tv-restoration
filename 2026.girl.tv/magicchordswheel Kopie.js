"use strict";

(function(){
  const svgns = "http://www.w3.org/2000/svg";
  const svg   = document.getElementById("chordWheelSvg");

  const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  const ROOTS = NOTES.slice(); // 12 Halbtöne

  // Tonname -> Pitchclass
  const PITCH_MAP = {
    "C":0,"B#":0,
    "C#":1,"Db":1,
    "D":2,
    "D#":3,"Eb":3,
    "E":4,"Fb":4,
    "F":5,"E#":5,
    "F#":6,"Gb":6,
    "G":7,
    "G#":8,"Ab":8,
    "A":9,
    "A#":10,"Bb":10,
    "B":11,"Cb":11
  };

  // Quintenzirkel (außerer Ring) mit Paralleltonarten
  const CIRCLE_KEYS = [
    { maj:"C",  min:"Am" },
    { maj:"G",  min:"Em" },
    { maj:"D",  min:"Bm" },
    { maj:"A",  min:"F#m" },
    { maj:"E",  min:"C#m" },
    { maj:"B",  min:"G#m" },
    { maj:"F#", min:"D#m" },
    { maj:"Db", min:"Bbm" },
    { maj:"Ab", min:"Fm" },
    { maj:"Eb", min:"Cm" },
    { maj:"Bb", min:"Gm" },
    { maj:"F",  min:"Dm" }
  ];

  // Triaden mit Solfège
  const TRIADS = [
    { id:"maj",  label:"mi",  title:"mi – große Terz (+4 HT, Dur-Dreiklang)" },
    { id:"min",  label:"me",  title:"me – kleine Terz (+3 HT, Moll-Dreiklang)" },
    { id:"aug",  label:"si",  title:"si – übermäßige Quinte (+8 HT, Augmented)" },
    { id:"dim",  label:"se",  title:"se – verminderte Quinte (+6 HT, Dim)" },
    { id:"sus2", label:"re",  title:"re – sus2 (+2 HT, Sekunde statt Terz)" },
    { id:"sus4", label:"fa",  title:"fa – sus4 (+5 HT, Quarte statt Terz)" }
  ];

  const POWER_DOT = {
    id:"5",
    label:"sol",
    title:"sol – Powerchord (1 + reine Quinte)"
  };

  // Extensions mit Solfège
  const EXTS = [
    { id:"6",    label:"la",  title:"la – hinzugefügte 6 (+9 HT, add6 / 13 ohne 7)" },
    { id:"7",    label:"te",  title:"te – kleine Septime (+10 HT, Dominant-7)" },
    { id:"maj7", label:"ti",  title:"ti – große Septime (+11 HT, maj7)" },
    { id:"9",    label:"re",  title:"re – 9 (+14 HT, add9)" },
    { id:"11",   label:"fa",  title:"fa – 11 (+17 HT, add11)" },
    { id:"13",   label:"la",  title:"la – 13 (+21 HT, 6 eine Oktave höher)" }
  ];

  // chromatische Solmisation 0..11 HT
  const DEG_SOLFEGE = ["do","di","re","me","mi","fa","fi","sol","si","la","te","ti"];

  // --- State ---
  let currentRootIndex = 0;      // aktuell gewählter Grundton (Akkord)
  let triadQuality = "maj";
  let power5 = false;
  let ext = {
    "6":false,
    "7":false,
    "maj7":false,
    "9":false,
    "11":false,
    "13":false
  };

  let currentKeyIndex = 0;       // Index im CIRCLE_KEYS (Tonart)
  let lastNormIntervals = [];    // 0..11 HT normalisiert (für Stern-Highlight)

  // DOM refs
  const statusChord     = document.getElementById("statusChord");
  const statusNotes     = document.getElementById("statusNotes");
  const statusIntervals = document.getElementById("statusIntervals");
  const statusKey       = document.getElementById("statusKey");

  // Geometrie
  const centerX = 260;
  const centerY = 260;
  const rootRadius = 180;
  const rootCircleRadius = 45;
  const keyRadius = 230; // äußerer Ring

  function makeEl(tag, attrs){
    const el = document.createElementNS(svgns, tag);
    if(attrs){
      for(const k in attrs){
        el.setAttribute(k, attrs[k]);
      }
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

  const starGroups = [];
  const starNodes = {};

  const keyGroups = [];

  // --- Aufbau ---
  function buildWheel(){
    svg.innerHTML = "";

    // Hintergrund
    svg.appendChild(makeEl("circle",{
      cx:centerX, cy:centerY, r:245, class:"bg-circle"
    }));

    // Quintenzirkel-Ring (Key-Ring)
    for(let i=0;i<CIRCLE_KEYS.length;i++){
      const angleDeg = -90 + i*30;
      const keyG = makeEl("g",{
        class:"key-group",
        "data-key-index": String(i),
        transform:`translate(${centerX},${centerY}) rotate(${angleDeg}) translate(${keyRadius},0) rotate(${-angleDeg})`
      });

      keyG.addEventListener("click", ()=>setKey(i));

      const rect = makeEl("rect",{
        x:-25, y:-9,
        width:50, height:18,
        class:"key-segment-rect"
      });
      keyG.appendChild(rect);

      const label = makeEl("text",{
        x:0, y:0,
        class:"key-segment-label"
      });
      label.textContent = CIRCLE_KEYS[i].maj + " / " + CIRCLE_KEYS[i].min;
      keyG.appendChild(label);

      svg.appendChild(keyG);
      keyGroups[i] = keyG;
    }

    // Center Texte
    centerRootText = makeEl("text",{
      x:centerX, y:centerY-4, class:"center-root"
    });
    svg.appendChild(centerRootText);

    centerChordText = makeEl("text",{
      x:centerX, y:centerY+26, class:"center-chord"
    });
    svg.appendChild(centerChordText);

    centerCaption = makeEl("text",{
      x:centerX, y:centerY+44, class:"center-caption"
    });
    centerCaption.textContent = "Stern: do–ti; leuchtende Punkte = Intervalle des Akkords";
    svg.appendChild(centerCaption);

    // Maps initialisieren
    TRIADS.forEach(t=>{
      triadDots[t.id] = {};
      triadLabels[t.id] = {};
    });
    EXTS.forEach(e=>{
      extDots[e.id] = {};
      extLabels[e.id] = {};
    });

    // Root-Kreise + Dots + Stern
    for(let i=0;i<ROOTS.length;i++){
      const angleDeg = -90 + i*30;
      const group = makeEl("g",{
        class:"root-group",
        "data-root-index": String(i),
        transform:`translate(${centerX},${centerY}) rotate(${angleDeg}) translate(${rootRadius},0) rotate(${-angleDeg})`
      });

      const rootCircle = makeEl("circle",{
        cx:0, cy:0, r:rootCircleRadius,
        class:"root-circle",
        "data-root-index": String(i)
      });
      rootCircle.addEventListener("click", ()=>setRoot(i));
      group.appendChild(rootCircle);

      const label = makeEl("text",{
        x:0, y:2, class:"root-label"
      });
      label.textContent = ROOTS[i];
      group.appendChild(label);

      // Top row: TRIADS + Power
      const topCount = TRIADS.length + 1;
      const topY = -28;
      const topSpacing = 14;
      const topTotal = (topCount-1)*topSpacing;
      const topStart = -topTotal/2;

      TRIADS.forEach((t, idx)=>{
        const x = topStart + idx*topSpacing;
        const c = makeEl("circle",{
          cx:x, cy:topY,
          class:"dot-circle triad-dot",
          "data-root-index": String(i),
          "data-role":"triad",
          "data-id":t.id
        });
        const tt = makeEl("title",{});
        tt.textContent = t.title;
        c.appendChild(tt);
        c.addEventListener("click", onDotClick);
        group.appendChild(c);

        const tl = makeEl("text",{
          x:x, y:topY-9,
          class:"dot-label dot-label-muted"
        });
        tl.textContent = t.label;
        group.appendChild(tl);

        triadDots[t.id][i] = c;
        triadLabels[t.id][i] = tl;
      });

      // Powerchord-Dot
      const powerX = topStart + (topCount-1)*topSpacing;
      const pc = makeEl("circle",{
        cx:powerX, cy:topY,
        class:"dot-circle power-dot",
        "data-root-index": String(i),
        "data-role":"power",
        "data-id":"5"
      });
      const pcTitle = makeEl("title",{});
      pcTitle.textContent = POWER_DOT.title;
      pc.appendChild(pcTitle);
      pc.addEventListener("click", onDotClick);
      group.appendChild(pc);

      const pl = makeEl("text",{
        x:powerX, y:topY-9,
        class:"dot-label dot-label-muted"
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
        const c = makeEl("circle",{
          cx:x, cy:bottomY,
          class:"dot-circle ext-dot",
          "data-root-index": String(i),
          "data-role":"ext",
          "data-id":e.id
        });
        const tt = makeEl("title",{});
        tt.textContent = e.title;
        c.appendChild(tt);
        c.addEventListener("click", onDotClick);
        group.appendChild(c);

        const tl = makeEl("text",{
          x:x, y:bottomY+9,
          class:"dot-label dot-label-muted"
        });
        tl.textContent = e.label;
        group.appendChild(tl);

        extDots[e.id][i] = c;
        extLabels[e.id][i] = tl;
      });

      // Root-star (chromatische Solmisation)
      const starGroup = makeEl("g",{
        class:"root-star-group",
        "data-root-index": String(i)
      });
      const rayLen = rootCircleRadius * 1.35;

      for(let d=0; d<12; d++){
        const angDeg2 = -90 + d*30;
        const angRad = angDeg2 * Math.PI / 180;
        const x = Math.cos(angRad) * rayLen;
        const y = Math.sin(angRad) * rayLen;

        const ray = makeEl("line",{
          x1:0, y1:0,
          x2:x, y2:y,
          class:"root-star-ray",
          "data-degree": String(d)
        });
        starGroup.appendChild(ray);

        const node = makeEl("circle",{
          cx:x, cy:y,
          r:4,
          class:"root-star-node",
          "data-degree": String(d),
          "data-root-index": String(i)
        });
        const nodeTitle = makeEl("title",{});
        nodeTitle.textContent = DEG_SOLFEGE[d] + " – +" + d + " HT";
        node.appendChild(nodeTitle);
        starGroup.appendChild(node);

        const label2 = makeEl("text",{
          x:x, y:y-7,
          class:"root-star-label"
        });
        label2.textContent = DEG_SOLFEGE[d];
        starGroup.appendChild(label2);

        if(!starNodes[i]) starNodes[i] = {};
        starNodes[i][d] = node;
      }

      group.appendChild(starGroup);
      starGroups[i] = starGroup;

      svg.appendChild(group);
      rootGroups[i] = group;
      rootCircles[i] = rootCircle;
    }

    updateAll();
  }

  // --- Events ---
  function onDotClick(evt){
    const role = evt.currentTarget.getAttribute("data-role");
    const id   = evt.currentTarget.getAttribute("data-id");
    const idx  = parseInt(evt.currentTarget.getAttribute("data-root-index"),10);

    if(!Number.isNaN(idx) && idx !== currentRootIndex){
      setRoot(idx,false);
    }

    if(role === "triad"){
      if(triadQuality === id){
        triadQuality = null;
      }else{
        triadQuality = id;
      }
      power5 = false;
    }else if(role === "power"){
      power5 = !power5;
    }else if(role === "ext"){
      if(id === "7"){
        ext["7"] = !ext["7"];
        if(ext["7"]) ext["maj7"] = false;
      }else if(id === "maj7"){
        ext["maj7"] = !ext["maj7"];
        if(ext["maj7"]) ext["7"] = false;
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

  function setKey(keyIdx){
    currentKeyIndex = keyIdx;

    const majName = CIRCLE_KEYS[keyIdx].maj;
    const rootIndex = PITCH_MAP[majName];

    if(rootIndex !== undefined){
      currentRootIndex = rootIndex;
    }

    // Standard: Tonika-Dur, ohne Extensions
    triadQuality = "maj";
    power5 = false;
    for(const k in ext){
      ext[k] = false;
    }

    updateAll();
  }

  // --- Intervalle / Akkordaufbau ---
  function intervalsFromTriad(q, powerMode){
    if(powerMode){
      return [0,7]; // 1 + 5
    }
    if(!q){
      return [0];
    }
    switch(q){
      case "maj":  return [0,4,7];
      case "min":  return [0,3,7];
      case "aug":  return [0,4,8];
      case "dim":  return [0,3,6];
      case "sus2": return [0,2,7];
      case "sus4": return [0,5,7];
      default:     return [0];
    }
  }

  function buildChordIntervals(){
    let intervals = intervalsFromTriad(triadQuality, power5);

    if(!power5){
      if(ext["6"])    intervals.push(9);
      if(ext["7"])    intervals.push(10);
      if(ext["maj7"]) intervals.push(11);
    }

    if(ext["9"])  intervals.push(14);
    if(ext["11"]) intervals.push(17);
    if(ext["13"]) intervals.push(21);

    const norm = Array.from(
      new Set(intervals.map(i => ((i % 12) + 12) % 12))
    ).sort((a,b)=>a-b);

    return { all: intervals, norm };
  }

  function buildChordSymbol(){
    const root = ROOTS[currentRootIndex];
    let symbol = root;

    if(power5){
      symbol += "5";
    }else{
      if(triadQuality === "min")      symbol += "m";
      else if(triadQuality === "aug") symbol += "+";
      else if(triadQuality === "dim") symbol += "°";
      else if(triadQuality === "sus2" || triadQuality === "sus4"){
        symbol += triadQuality;
      }
    }

    let coreTag = "";
    if(!power5){
      if(ext["6"]) coreTag = "6";
      if(ext["7"]) coreTag = "7";
      if(ext["maj7"]) coreTag = "maj7";
    }
    if(coreTag){
      symbol += coreTag;
    }

    const tensList = [];
    if(ext["9"])  tensList.push("9");
    if(ext["11"]) tensList.push("11");
    if(ext["13"]) tensList.push("13");

    if(tensList.length){
      symbol += "(" + tensList.join(",") + ")";
    }

    if(symbol === root){
      symbol += " (nur Grundton)";
    }
    return symbol;
  }

  function buildChordNotes(normIntervals){
    return normIntervals.map(off=>{
      const idx = (currentRootIndex + off + 1200) % 12;
      return NOTES[idx];
    });
  }

  // --- Anzeigen aktualisieren ---
  function updateVisuals(){
    // Root-Gruppen
    rootGroups.forEach((g, idx)=>{
      if(!g) return;
      const isActive = idx === currentRootIndex;
      g.classList.toggle("active-root", isActive);
    });

    rootCircles.forEach((c, idx)=>{
      if(!c) return;
      c.classList.toggle("active-root-circle", idx === currentRootIndex);
    });

    // Triads
    TRIADS.forEach(t=>{
      const id = t.id;
      for(const idx in triadDots[id]){
        const c = triadDots[id][idx];
        const l = triadLabels[id][idx];
        const isActiveRoot = Number(idx) === currentRootIndex;
        const isActive = isActiveRoot && !power5 && triadQuality === id;

        c.classList.toggle("active-dot", isActive);
        c.classList.toggle("disabled", !isActiveRoot);
        if(l){
          l.classList.toggle("dot-label-muted", !isActive);
        }
      }
    });

    // Power
    for(const idx in powerDots){
      const c = powerDots[idx];
      const l = powerLabels[idx];
      const isActiveRoot = Number(idx) === currentRootIndex;
      const isActive = isActiveRoot && power5;

      c.classList.toggle("active-dot", isActive);
      c.classList.toggle("disabled", !isActiveRoot);
      if(l){
        l.classList.toggle("dot-label-muted", !isActive);
      }
    }

    // Extensions
    EXTS.forEach(e=>{
      const id = e.id;
      for(const idx in extDots[id]){
        const c = extDots[id][idx];
        const l = extLabels[id][idx];
        const isActiveRoot = Number(idx) === currentRootIndex;
        const isActive = isActiveRoot && !!ext[id];

        c.classList.toggle("active-dot", isActive);
        c.classList.toggle("disabled", !isActiveRoot);
        if(l){
          l.classList.toggle("dot-label-muted", !isActive);
        }
      }
    });

    // Root-Star
    starGroups.forEach((g, idx)=>{
      if(!g) return;
      const isActiveRoot = idx === currentRootIndex;
      g.classList.toggle("inactive", !isActiveRoot);
    });

    for(const rootIdx in starNodes){
      const idxNum = Number(rootIdx);
      const nodesForRoot = starNodes[rootIdx];
      const isActiveRoot = idxNum === currentRootIndex;
      for(let d=0; d<12; d++){
        const node = nodesForRoot[d];
        if(!node) continue;
        const on = isActiveRoot && lastNormIntervals.includes(d);
        node.classList.toggle("active-interval", on);
      }
    }

    // Quintenzirkel: aktive Tonart + Dominante/Subdominante
    const domIndex = (currentKeyIndex + 1) % 12;
    const subIndex = (currentKeyIndex + 11) % 12;

    keyGroups.forEach((g, idx)=>{
      if(!g) return;
      g.classList.remove("active-key","dominant-key","subdominant-key");
      if(idx === currentKeyIndex)      g.classList.add("active-key");
      else if(idx === domIndex)        g.classList.add("dominant-key");
      else if(idx === subIndex)        g.classList.add("subdominant-key");
    });
  }

  function updateKeyStatus(){
    const key = CIRCLE_KEYS[currentKeyIndex];
    const tonic = key.maj;
    const relMin = key.min;

    const domIndex = (currentKeyIndex + 1) % 12;
    const subIndex = (currentKeyIndex + 11) % 12;

    const chordIV = CIRCLE_KEYS[subIndex].maj;
    const chordV  = CIRCLE_KEYS[domIndex].maj;

    statusKey.textContent = `${tonic} / ${relMin} · I–IV–V: ${tonic}–${chordIV}–${chordV}`;
  }

  function updateAll(){
    const { norm } = buildChordIntervals();
    const notes = buildChordNotes(norm);
    const symbol = buildChordSymbol();

    lastNormIntervals = norm;

    centerRootText.textContent = ROOTS[currentRootIndex];
    centerChordText.textContent = symbol;
    statusChord.textContent = symbol;
    statusNotes.textContent = notes.length ? notes.join(" – ") : "–";
    statusIntervals.textContent = norm.length ? norm.map(i=>i + " HT").join(", ") : "–";

    updateKeyStatus();
    updateVisuals();
  }

  // Init
  buildWheel();
})();