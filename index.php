<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Ukulele Tool – Tuner · Klavier · MIDI</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
</head>
<body class="desktop-shell">
    <div class="desktop-wallpaper"></div>
    <div class="desktop-menubar">
        <div class="menu-left">
            <span class="menu-logo" aria-hidden="true"></span>
            <span class="menu-title">Ukulele Studio</span>
            <button class="menu-link" type="button" data-target="#aboutWindow">About</button>
            <button class="menu-link" type="button" data-target="#tunerWindow">Tuner</button>
            <button class="menu-link" type="button" data-target="#micWindow">Mic</button>
            <button class="menu-link" type="button" data-target="#fretboardWindow">Ukulele</button>
            <button class="menu-link" type="button" data-target="#tapWindow">Tap</button>
            <button class="menu-link" type="button" data-target="#chordWindow">Akkorde</button>
            <button class="menu-link" type="button" data-target="#pianoWindow">Piano</button>
            <button class="menu-link" type="button" data-target="#playbackWindow">Playback</button>
            <button class="menu-link" type="button" data-target="#staffWindow">Noten</button>
        </div>
        <div class="menu-right">
            <span class="menu-chip">Akkord Studio</span>
            <span class="menu-chip subtle">Mic</span>
            <span id="menuClock" class="menu-clock">--:--</span>
        </div>
    </div>

    <div class="desktop-stage desktop-canvas" role="main">
        <header class="app-header desktop-window window-slot window-hidden" id="aboutWindow" data-draggable="true" data-drag-handle=".window-handle">
            <div class="window-handle">
                <h2>About</h2>
            </div>
            <div class="window-body">
                <h1>Ukulele Tool – Tuner · Klavier · MIDI</h1>
                <div class="layout-buttons">
                    <button type="button" class="ghost-btn" id="layoutLeft">Links</button>
                    <button type="button" class="ghost-btn" id="layoutCenter">Mitte</button>
                    <button type="button" class="ghost-btn" id="layoutRight">Rechts</button>
                </div>
            </div>
        </header>

        <!-- Tuner -->
        <section class="desktop-window window-slot window-tuner" id="tunerWindow" data-draggable="true" data-drag-handle=".widget-handle">
            <div class="widget-card">
                <div class="widget-handle">
                    <h2>Tuner (Referenztöne)</h2>
                    <div class="widget-controls">
                        <button type="button" class="collapse-icon" aria-label="einklappen">▸</button>
                        <button type="button" class="dock-button" aria-label="anheften">⤢</button>
                        <button type="button" id="chordPenButton" class="icon-btn small" title="Stiftmodus">✎</button>
                    </div>
                </div>
                <div class="widget-body">
                    <div class="tuner" id="tunerButtons">
                        <button data-note="G" data-freq="392">
                            <span class="note">G</span>
                            <span class="info">G4 · 392 Hz · 4. Saite</span>
                        </button>
                        <button data-note="C" data-freq="261.63">
                            <span class="note">C</span>
                            <span class="info">C4 · 261.63 Hz · 3. Saite</span>
                        </button>
                        <button data-note="E" data-freq="329.63">
                            <span class="note">E</span>
                            <span class="info">E4 · 329.63 Hz · 2. Saite</span>
                        </button>
                        <button data-note="A" data-freq="440">
                            <span class="note">A</span>
                            <span class="info">A4 · 440 Hz · 1. Saite</span>
                        </button>
                    </div>
                    <div class="stop-wrap">
                        <button id="stopTunerButton">Stop</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Mic + Monitoring -->
        <section class="desktop-window window-stack align-right window-top window-mic" id="micWindow" data-draggable="true" data-drag-handle=".widget-handle">
            <div class="widget-card">
                <div class="widget-handle">
                    <h2>Stimmgerät (Mikro)</h2>
                    <div class="widget-controls">
                        <button type="button" class="collapse-icon" aria-label="einklappen">▸</button>
                        <button type="button" class="dock-button" aria-label="anheften">⤢</button>
                        <button type="button" class="icon-btn small ghost-btn" id="chordWheelFullscreen" title="Vollbild">⛶</button>
                    </div>
                </div>
                <div class="widget-body">
                    <div class="mic-tuner" id="micTuner">
                        <div class="mic-tuner-header">
                            <h3>Stimmgerät (Mikro)</h3>
                            <div class="mic-actions">
                                <button id="micToggleButton" type="button">Mic an</button>
                            </div>
                        </div>
                        <div class="mic-readout">
                            <div class="mic-note" id="micNoteDisplay">–</div>
                            <div class="mic-detune" id="micDetuneDisplay">Bereit</div>
                        </div>
                        <div class="mic-wave-wrap">
                            <canvas id="micWaveCanvas" aria-label="Stimmgerät-Wellenform"></canvas>
                            <button type="button" id="waveFullscreenButton" class="icon-btn small ghost-btn">⤢</button>
                        </div>
                        <div class="mic-settings-toggle">
                            <button id="micSettingsCollapse" type="button" class="ghost-btn small">Einstellungen ausblenden</button>
                        </div>
                        <div class="mic-settings">
                            <div class="mic-row">
                                <button id="intervalToggleButton" type="button">Intervalle: aus</button>
                                <label>
                                    Haltedauer (ms)
                                    <div class="dual-input">
                                        <input type="range" id="intervalHoldSlider" min="50" max="2000" step="10" value="200">
                                        <input type="number" id="intervalHoldInput" min="50" max="2000" step="10" value="200">
                                    </div>
                                </label>
                                <label>
                                    Wechsel (ms)
                                    <div class="dual-input">
                                        <input type="range" id="intervalChangeSlider" min="80" max="2000" step="20" value="350">
                                        <input type="number" id="intervalChangeInput" min="80" max="2000" step="20" value="350">
                                    </div>
                                </label>
                                <label>
                                    Stille (ms)
                                    <div class="dual-input">
                                        <input type="range" id="intervalSilenceSlider" min="80" max="4000" step="20" value="500">
                                        <input type="number" id="intervalSilenceInput" min="80" max="4000" step="20" value="500">
                                    </div>
                                </label>
                                <button type="button" id="waveMirrorButton" class="ghost-btn small">Spiegeln: aus</button>
                                <label>
                                    Retrigger (¢)
                                    <input type="range" class="knob-input" id="sineRetriggerCents" min="0" max="100" step="2" value="20">
                                </label>
                                <label>
                                    Retrigger Zeit (ms)
                                    <input type="range" class="knob-input" id="sineRetriggerMs" min="0" max="2000" step="20" value="350">
                                </label>
                                <label>
                                    Drop-Schwelle (¢)
                                    <input type="range" class="knob-input" id="sineDropCents" min="0" max="120" step="2" value="30">
                                </label>
                                <label class="inline-checkbox">
                                    <input type="checkbox" id="sineRetriggerToggle" checked>
                                    Retrigger aktiv
                                </label>
                                <label class="inline-checkbox">
                                    <input type="checkbox" id="sineExactToggle">
                                    Exakte Tonhöhe halten
                                </label>
                            </div>
                            <div class="mic-row">
                                <label>
                                    Filter Freq
                                    <input type="range" class="knob-input" id="filterFreqInput" min="200" max="2000" step="50" value="600">
                                </label>
                                <label>
                                    Filter Q
                                    <input type="range" class="knob-input" id="filterQInput" min="0.1" max="5" step="0.1" value="0.9">
                                </label>
                                <label>
                                    Pre Gain
                                    <input type="range" class="knob-input" id="preGainInput" min="0" max="3" step="0.05" value="1.5">
                                </label>
                                <label>
                                    Noise Gate
                                    <input type="range" class="knob-input" id="noiseGateInput" min="0.001" max="0.05" step="0.001" value="0.006">
                                </label>
                                <label>
                                    Toleranz (¢)
                                    <div class="dual-input">
                                        <input type="range" id="micToleranceSlider" min="2" max="50" step="1" value="12">
                                        <input type="number" id="micToleranceInput" min="2" max="50" step="1" value="12">
                                    </div>
                                </label>
                                <label>
                                    High Cut (Hz)
                                    <input type="range" class="knob-input" id="highCutInput" min="400" max="3200" step="50" value="1600">
                                </label>
                                <label>
                                    Messzeit (ms)
                                    <input type="range" class="knob-input" id="measurementWindowInput" min="20" max="120" step="2" value="48">
                                </label>
                                <button id="micPreviewButton" type="button">Mic-Preview: aus</button>
                                <button id="micSineButton" type="button">Sinus: aus</button>
                                <div class="sine-buttons sine-offset-row">
                                    <button type="button" class="ghost-btn small" data-sine-offset="0">0</button>
                                    <button type="button" class="ghost-btn small" data-sine-offset="-24">−24</button>
                                    <button type="button" class="ghost-btn small" data-sine-offset="-12">−12</button>
                                    <button type="button" class="ghost-btn small" data-sine-offset="+12">+12</button>
                                    <button type="button" class="ghost-btn small" data-sine-offset="+24">+24</button>
                                </div>
                                <label>
                                    Sinus Gain
                                    <input type="range" class="knob-input" id="sineGainInput" min="0.01" max="0.2" step="0.005" value="0.07">
                                </label>
                                <label>
                                    Sinus Glide (ms)
                                    <input type="range" class="knob-input" id="sineGlideInput" min="5" max="200" step="5" value="40">
                                </label>
                                <div class="sine-advanced">
                                    <label>Attack (ms)
                                        <input type="range" class="knob-input" id="sineAttackInput" min="1" max="200" step="1" value="12">
                                    </label>
                                    <label>Release (ms)
                                        <input type="range" class="knob-input" id="sineReleaseInput" min="20" max="800" step="10" value="160">
                                    </label>
                                    <label>Hold (ms)
                                        <input type="range" class="knob-input" id="sineHoldInput" min="50" max="1000" step="10" value="350">
                                    </label>
                                    <label>Wellenform
                                        <select id="sineWaveInput">
                                            <option value="sine" selected>Sinus</option>
                                            <option value="triangle">Dreieck</option>
                                            <option value="square">Rechteck</option>
                                            <option value="sawtooth">Sägezahn</option>
                                        </select>
                                    </label>
                                </div>
                                <button id="phaseModeButton" type="button">Phasenvergleich: aus</button>
                                <button id="tunerResetButton" type="button">Reset</button>
                            </div>
                            <div class="mic-advanced">
                                <div class="knob-grid">
                                    <label class="knob-field">Breite
                                        <input type="range" class="knob-input" id="waveScaleX" min="0.5" max="3" step="0.1" value="1">
                                    </label>
                                    <label class="knob-field">Höhen
                                        <input type="range" class="knob-input" id="waveScaleY" min="0.5" max="3" step="0.1" value="1">
                                    </label>
                                    <label class="knob-field">Linienstärke
                                        <input type="range" class="knob-input" id="waveLineWidth" min="1" max="8" step="0.5" value="2.5">
                                    </label>
                                    <label class="knob-field">Tiefpass (Sine)
                                        <input type="range" class="knob-input" id="sineLowpassInput" min="200" max="5000" step="50" value="1800">
                                    </label>
                                </div>
                                <div class="monitor-row">
                                    <button id="monitorPreButton" type="button">Monitor: vor FX aus</button>
                                    <button id="monitorPostButton" type="button">Monitor: nach FX aus</button>
                                    <label class="knob-field small">Monitor Gain
                                        <input type="range" class="knob-input" id="monitorGainInput" min="0" max="1" step="0.05" value="0.6">
                                    </label>
                                </div>
                                <div class="mic-adv-row">
                                    <button id="multiToneButton" type="button" class="ghost-btn small">Multi-Tone: aus</button>
                                    <button id="harmonicFilterButton" type="button" class="ghost-btn small">Timbre-Filter: aus</button>
                                    <button id="overtoneOverlayButton" type="button" class="ghost-btn small">Obertöne anzeigen</button>
                                </div>
                                <div class="knob-grid">
                                    <label class="knob-field">Multi-Sensitivität
                                        <input type="range" class="knob-input" id="multiToneSensitivity" min="0" max="1" step="0.05" value="0.35">
                                    </label>
                                    <label class="knob-field">Harmonic Notch
                                        <input type="range" class="knob-input" id="harmonicNotch" min="0" max="1" step="0.05" value="0.5">
                                    </label>
                                    <label class="knob-field">Overtone Blend
                                        <input type="range" class="knob-input" id="overtoneBlend" min="0" max="1" step="0.05" value="0.4">
                                    </label>
                                </div>
                                <div class="signal-flow">
                                    <span class="node">Mic In</span>
                                    <span class="arrow">→</span>
                                    <span class="node">Gate/Notch</span>
                                    <span class="arrow">→</span>
                                    <span class="node">Multi-Tone</span>
                                    <span class="arrow">→</span>
                                    <span class="node">Analyser</span>
                                    <span class="arrow">→</span>
                                    <span class="node">Overlay</span>
                                </div>
                                <div class="sound-status">
                                    <span id="headphoneStatus">Headset: unbekannt</span>
                                    <button id="checkHeadphoneButton" type="button" class="ghost-btn small">Erneut prüfen</button>
                                </div>
                            </div>
                        </div>
                        <div class="interval-widget">
                            <div class="interval-header">
                                <h4>Letzte Intervalle</h4>
                            </div>
                            <div id="intervalList" class="interval-list">Noch keine Intervalle.</div>
                        </div>
                    </div>
                </div>
            </div>

        </section>

        <!-- Notenanzeige -->
        <section class="desktop-window window-slot window-staff" id="staffWindow" data-draggable="true" data-drag-handle=".widget-handle">
            <div class="widget-card" data-start-collapsed="true">
                <div class="widget-handle">
                    <h2>Notenanzeige</h2>
                    <div class="widget-controls">
                        <button type="button" class="collapse-icon" aria-label="einklappen">▸</button>
                        <button type="button" class="dock-button" aria-label="anheften">⤢</button>
                    </div>
                </div>
                <div class="widget-body">
                    <div class="staff-display">
                        <div class="staff-header">
                            <h3>Notenanzeige</h3>
                            <span id="recordBadge">Aufnahme aktiv</span>
                            <button id="clearStaffButton" type="button" class="icon-btn small">Leeren</button>
                        </div>
                        <div id="staffNoteContainer"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Ukulele Tab -->
        <section class="desktop-window window-wide window-middle window-fretboard" id="fretboardWindow" data-draggable="true" data-drag-handle=".fretboard-header">
            <div class="fretboard-inline" id="fretboardWrapper">
                <div class="fretboard-header">
                    <h3>Ukulele-Tabulatur</h3>
                    <button id="toggleFretboardOrientation" type="button" class="icon-btn" aria-label="Tabulatur drehen">↻</button>
                    <button id="toggleFretScroll" type="button" class="icon-btn" aria-label="Scroll zum Treffer">⇵</button>
                    <button id="penToggleButton" type="button" class="icon-btn pen-btn" aria-label="Stiftmodus">✎</button>
                </div>
                <div class="fretboard-container">
                    <table class="fretboard-table" id="fretboardTable"></table>
                </div>
            </div>
        </section>

        <!-- Tap View -->
        <section class="desktop-window window-slot window-tap" id="tapWindow" data-draggable="true" data-drag-handle=".widget-handle">
            <div class="widget-card tap-widget">
                <div class="widget-handle">
                    <h3>Tap View (Pro)</h3><span class="collapse-icon">▸</span>
                </div>
                <div class="widget-body">
                    <p class="subtitle">Step markiert? Aufnahme aus? Dann „ADD A TAP“ für ein kleines Tab-Diagramm.</p>
                    <div class="tap-actions">
                        <button id="addTapButton" type="button">ADD A TAP</button>
                    </div>
                    <div id="tapDiagram" class="tap-diagram">Keine Auswahl.</div>
                    <div id="tapInfo" class="tap-info"></div>
                    <div id="tapHistory" class="tap-history"></div>
                </div>
            </div>
        </section>

        <!-- Chord Wheel -->
        <section class="desktop-window window-wide align-right window-middle window-chord" id="chordWindow" data-draggable="true" data-drag-handle=".widget-handle">
            <div class="widget-card chord-widget">
                <div class="widget-handle">
                    <h3>Ukulele Akkorde</h3>
                    <div class="widget-controls">
                        <button type="button" class="collapse-icon" aria-label="einklappen">▸</button>
                        <button type="button" class="dock-button" aria-label="anheften">⤢</button>
                    </div>
                </div>
                <div class="widget-body">
                    <div class="chord-tool" id="chordTool">
                        <div class="chord-controls">
                            <div class="chord-wheel" id="chordRootWheel">
                                <!-- chord segments -->
                                <!-- (existing buttons remain unchanged) -->
                                <button type="button" class="chord-segment active" data-root="C" style="--i:0;--tone-hue:120">
                                    <div class="chord-dots dot-top">
                                        <span class="dot" data-triad="maj" title="Dur"></span>
                                        <span class="dot" data-triad="min" title="Moll"></span>
                                        <span class="dot" data-triad="aug" title="Überm."></span>
                                        <span class="dot" data-triad="dim" title="Verm."></span>
                                        <span class="dot" data-triad="sus2" title="sus2"></span>
                                        <span class="dot" data-triad="sus4" title="sus4"></span>
                                        <span class="dot" data-ext="5" title="5" data-label="5"></span>
                                    </div>
                                    <div class="chord-root-label">C</div>
                                    <div class="chord-dots dot-bottom">
                                        <span class="dot" data-ext="6" title="6"></span>
                                        <span class="dot" data-ext="7" title="7"></span>
                                        <span class="dot" data-ext="maj7" title="maj7"></span>
                                        <span class="dot" data-ext="9" title="9"></span>
                                        <span class="dot" data-ext="11" title="11"></span>
                                        <span class="dot" data-ext="13" title="13"></span>
                                    </div>
                                </button>
                                <!-- remaining segments copied verbatim -->
                                <button type="button" class="chord-segment" data-root="C#" style="--i:1;--tone-hue:90">
                                    <div class="chord-dots dot-top">
                                        <span class="dot" data-triad="maj" title="Dur"></span>
                                        <span class="dot" data-triad="min" title="Moll"></span>
                                        <span class="dot" data-triad="aug" title="Überm."></span>
                                        <span class="dot" data-triad="dim" title="Verm."></span>
                                        <span class="dot" data-triad="sus2" title="sus2"></span>
                                        <span class="dot" data-triad="sus4" title="sus4"></span>
                                        <span class="dot" data-ext="5" title="5" data-label="5"></span>
                                    </div>
                                    <div class="chord-root-label">C#</div>
                                    <div class="chord-dots dot-bottom">
                                        <span class="dot" data-ext="6" title="6"></span>
                                        <span class="dot" data-ext="7" title="7"></span>
                                        <span class="dot" data-ext="maj7" title="maj7"></span>
                                        <span class="dot" data-ext="9" title="9"></span>
                                        <span class="dot" data-ext="11" title="11"></span>
                                        <span class="dot" data-ext="13" title="13"></span>
                                    </div>
                                </button>
                                <button type="button" class="chord-segment" data-root="D" style="--i:2;--tone-hue:60">
                                    <div class="chord-dots dot-top">
                                        <span class="dot" data-triad="maj" title="Dur"></span>
                                        <span class="dot" data-triad="min" title="Moll"></span>
                                        <span class="dot" data-triad="aug" title="Überm."></span>
                                        <span class="dot" data-triad="dim" title="Verm."></span>
                                        <span class="dot" data-triad="sus2" title="sus2"></span>
                                        <span class="dot" data-triad="sus4" title="sus4"></span>
                                        <span class="dot" data-ext="5" title="5" data-label="5"></span>
                                    </div>
                                    <div class="chord-root-label">D</div>
                                    <div class="chord-dots dot-bottom">
                                        <span class="dot" data-ext="6" title="6"></span>
                                        <span class="dot" data-ext="7" title="7"></span>
                                        <span class="dot" data-ext="maj7" title="maj7"></span>
                                        <span class="dot" data-ext="9" title="9"></span>
                                        <span class="dot" data-ext="11" title="11"></span>
                                        <span class="dot" data-ext="13" title="13"></span>
                                    </div>
                                </button>
                                <button type="button" class="chord-segment" data-root="D#" style="--i:3;--tone-hue:30">
                                    <div class="chord-dots dot-top">
                                        <span class="dot" data-triad="maj" title="Dur"></span>
                                        <span class="dot" data-triad="min" title="Moll"></span>
                                        <span class="dot" data-triad="aug" title="Überm."></span>
                                        <span class="dot" data-triad="dim" title="Verm."></span>
                                        <span class="dot" data-triad="sus2" title="sus2"></span>
                                        <span class="dot" data-triad="sus4" title="sus4"></span>
                                        <span class="dot" data-ext="5" title="5" data-label="5"></span>
                                    </div>
                                    <div class="chord-root-label">D#</div>
                                    <div class="chord-dots dot-bottom">
                                        <span class="dot" data-ext="6" title="6"></span>
                                        <span class="dot" data-ext="7" title="7"></span>
                                        <span class="dot" data-ext="maj7" title="maj7"></span>
                                        <span class="dot" data-ext="9" title="9"></span>
                                        <span class="dot" data-ext="11" title="11"></span>
                                        <span class="dot" data-ext="13" title="13"></span>
                                    </div>
                                </button>
                                <button type="button" class="chord-segment" data-root="E" style="--i:4;--tone-hue:0">
                                    <div class="chord-dots dot-top">
                                        <span class="dot" data-triad="maj" title="Dur"></span>
                                        <span class="dot" data-triad="min" title="Moll"></span>
                                        <span class="dot" data-triad="aug" title="Überm."></span>
                                        <span class="dot" data-triad="dim" title="Verm."></span>
                                        <span class="dot" data-triad="sus2" title="sus2"></span>
                                        <span class="dot" data-triad="sus4" title="sus4"></span>
                                        <span class="dot" data-ext="5" title="5" data-label="5"></span>
                                    </div>
                                    <div class="chord-root-label">E</div>
                                    <div class="chord-dots dot-bottom">
                                        <span class="dot" data-ext="6" title="6"></span>
                                        <span class="dot" data-ext="7" title="7"></span>
                                        <span class="dot" data-ext="maj7" title="maj7"></span>
                                        <span class="dot" data-ext="9" title="9"></span>
                                        <span class="dot" data-ext="11" title="11"></span>
                                        <span class="dot" data-ext="13" title="13"></span>
                                    </div>
                                </button>
                                <button type="button" class="chord-segment" data-root="F" style="--i:5;--tone-hue:330">
                                    <div class="chord-dots dot-top">
                                        <span class="dot" data-triad="maj" title="Dur"></span>
                                        <span class="dot" data-triad="min" title="Moll"></span>
                                        <span class="dot" data-triad="aug" title="Überm."></span>
                                        <span class="dot" data-triad="dim" title="Verm."></span>
                                        <span class="dot" data-triad="sus2" title="sus2"></span>
                                        <span class="dot" data-triad="sus4" title="sus4"></span>
                                        <span class="dot" data-ext="5" title="5" data-label="5"></span>
                                    </div>
                                    <div class="chord-root-label">F</div>
                                    <div class="chord-dots dot-bottom">
                                        <span class="dot" data-ext="6" title="6"></span>
                                        <span class="dot" data-ext="7" title="7"></span>
                                        <span class="dot" data-ext="maj7" title="maj7"></span>
                                        <span class="dot" data-ext="9" title="9"></span>
                                        <span class="dot" data-ext="11" title="11"></span>
                                        <span class="dot" data-ext="13" title="13"></span>
                                    </div>
                                </button>
                                <button type="button" class="chord-segment" data-root="F#" style="--i:6;--tone-hue:300">
                                    <div class="chord-dots dot-top">
                                        <span class="dot" data-triad="maj" title="Dur"></span>
                                        <span class="dot" data-triad="min" title="Moll"></span>
                                        <span class="dot" data-triad="aug" title="Überm."></span>
                                        <span class="dot" data-triad="dim" title="Verm."></span>
                                        <span class="dot" data-triad="sus2" title="sus2"></span>
                                        <span class="dot" data-triad="sus4" title="sus4"></span>
                                        <span class="dot" data-ext="5" title="5" data-label="5"></span>
                                    </div>
                                    <div class="chord-root-label">F#</div>
                                    <div class="chord-dots dot-bottom">
                                        <span class="dot" data-ext="6" title="6"></span>
                                        <span class="dot" data-ext="7" title="7"></span>
                                        <span class="dot" data-ext="maj7" title="maj7"></span>
                                        <span class="dot" data-ext="9" title="9"></span>
                                        <span class="dot" data-ext="11" title="11"></span>
                                        <span class="dot" data-ext="13" title="13"></span>
                                    </div>
                                </button>
                                <button type="button" class="chord-segment" data-root="G" style="--i:7;--tone-hue:270">
                                    <div class="chord-dots dot-top">
                                        <span class="dot" data-triad="maj" title="Dur"></span>
                                        <span class="dot" data-triad="min" title="Moll"></span>
                                        <span class="dot" data-triad="aug" title="Überm."></span>
                                        <span class="dot" data-triad="dim" title="Verm."></span>
                                        <span class="dot" data-triad="sus2" title="sus2"></span>
                                        <span class="dot" data-triad="sus4" title="sus4"></span>
                                        <span class="dot" data-ext="5" title="5" data-label="5"></span>
                                    </div>
                                    <div class="chord-root-label">G</div>
                                    <div class="chord-dots dot-bottom">
                                        <span class="dot" data-ext="6" title="6"></span>
                                        <span class="dot" data-ext="7" title="7"></span>
                                        <span class="dot" data-ext="maj7" title="maj7"></span>
                                        <span class="dot" data-ext="9" title="9"></span>
                                        <span class="dot" data-ext="11" title="11"></span>
                                        <span class="dot" data-ext="13" title="13"></span>
                                    </div>
                                </button>
                                <button type="button" class="chord-segment" data-root="G#" style="--i:8;--tone-hue:240">
                                    <div class="chord-dots dot-top">
                                        <span class="dot" data-triad="maj" title="Dur"></span>
                                        <span class="dot" data-triad="min" title="Moll"></span>
                                        <span class="dot" data-triad="aug" title="Überm."></span>
                                        <span class="dot" data-triad="dim" title="Verm."></span>
                                        <span class="dot" data-triad="sus2" title="sus2"></span>
                                        <span class="dot" data-triad="sus4" title="sus4"></span>
                                        <span class="dot" data-ext="5" title="5" data-label="5"></span>
                                    </div>
                                    <div class="chord-root-label">G#</div>
                                    <div class="chord-dots dot-bottom">
                                        <span class="dot" data-ext="6" title="6"></span>
                                        <span class="dot" data-ext="7" title="7"></span>
                                        <span class="dot" data-ext="maj7" title="maj7"></span>
                                        <span class="dot" data-ext="9" title="9"></span>
                                        <span class="dot" data-ext="11" title="11"></span>
                                        <span class="dot" data-ext="13" title="13"></span>
                                    </div>
                                </button>
                                <button type="button" class="chord-segment" data-root="A" style="--i:9;--tone-hue:210">
                                    <div class="chord-dots dot-top">
                                        <span class="dot" data-triad="maj" title="Dur"></span>
                                        <span class="dot" data-triad="min" title="Moll"></span>
                                        <span class="dot" data-triad="aug" title="Überm."></span>
                                        <span class="dot" data-triad="dim" title="Verm."></span>
                                        <span class="dot" data-triad="sus2" title="sus2"></span>
                                        <span class="dot" data-triad="sus4" title="sus4"></span>
                                        <span class="dot" data-ext="5" title="5" data-label="5"></span>
                                    </div>
                                    <div class="chord-root-label">A</div>
                                    <div class="chord-dots dot-bottom">
                                        <span class="dot" data-ext="6" title="6"></span>
                                        <span class="dot" data-ext="7" title="7"></span>
                                        <span class="dot" data-ext="maj7" title="maj7"></span>
                                        <span class="dot" data-ext="9" title="9"></span>
                                        <span class="dot" data-ext="11" title="11"></span>
                                        <span class="dot" data-ext="13" title="13"></span>
                                    </div>
                                </button>
                                <button type="button" class="chord-segment" data-root="A#" style="--i:10;--tone-hue:180">
                                    <div class="chord-dots dot-top">
                                        <span class="dot" data-triad="maj" title="Dur"></span>
                                        <span class="dot" data-triad="min" title="Moll"></span>
                                        <span class="dot" data-triad="aug" title="Überm."></span>
                                        <span class="dot" data-triad="dim" title="Verm."></span>
                                        <span class="dot" data-triad="sus2" title="sus2"></span>
                                        <span class="dot" data-triad="sus4" title="sus4"></span>
                                        <span class="dot" data-ext="5" title="5" data-label="5"></span>
                                    </div>
                                    <div class="chord-root-label">A#</div>
                                    <div class="chord-dots dot-bottom">
                                        <span class="dot" data-ext="6" title="6"></span>
                                        <span class="dot" data-ext="7" title="7"></span>
                                        <span class="dot" data-ext="maj7" title="maj7"></span>
                                        <span class="dot" data-ext="9" title="9"></span>
                                        <span class="dot" data-ext="11" title="11"></span>
                                        <span class="dot" data-ext="13" title="13"></span>
                                    </div>
                                </button>
                                <button type="button" class="chord-segment" data-root="H" style="--i:11;--tone-hue:150">
                                    <div class="chord-dots dot-top">
                                        <span class="dot" data-triad="maj" title="Dur"></span>
                                        <span class="dot" data-triad="min" title="Moll"></span>
                                        <span class="dot" data-triad="aug" title="Überm."></span>
                                        <span class="dot" data-triad="dim" title="Verm."></span>
                                        <span class="dot" data-triad="sus2" title="sus2"></span>
                                        <span class="dot" data-triad="sus4" title="sus4"></span>
                                        <span class="dot" data-ext="5" title="5" data-label="5"></span>
                                    </div>
                                    <div class="chord-root-label">H</div>
                                    <div class="chord-dots dot-bottom">
                                        <span class="dot" data-ext="6" title="6"></span>
                                        <span class="dot" data-ext="7" title="7"></span>
                                        <span class="dot" data-ext="maj7" title="maj7"></span>
                                        <span class="dot" data-ext="9" title="9"></span>
                                        <span class="dot" data-ext="11" title="11"></span>
                                        <span class="dot" data-ext="13" title="13"></span>
                                    </div>
                                </button>
                                <button type="button" id="chordMuteGlobal" class="chord-mute chord-mute-global" title="Nächsten Akkord stummschalten">🔇</button>
                            </div>
                            <select id="chordRoot" class="hidden-select" aria-label="Grundton">
                                <option value="C" selected>C</option>
                                <option value="C#">C#</option>
                                <option value="Db">Db</option>
                                <option value="D">D</option>
                                <option value="D#">D#</option>
                                <option value="Eb">Eb</option>
                                <option value="E">E</option>
                                <option value="F">F</option>
                                <option value="F#">F#</option>
                                <option value="Gb">Gb</option>
                                <option value="G">G</option>
                                <option value="G#">G#</option>
                                <option value="Ab">Ab</option>
                                <option value="A">A</option>
                                <option value="A#">A#</option>
                                <option value="Bb">Bb</option>
                                <option value="H">H</option>
                            </select>
                            <button id="showChordButton" type="button">Diagramm anzeigen</button>
                        </div>
                        <pre id="chordDiagram" class="chord-diagram">A|-- -- -- --|
E|-- -- -- --|
C|-- -- -- --|
G|-- -- -- --|</pre>
                        <div class="chord-tab" id="chordTabText">Wähle Grundton & Typ.</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Piano -->
        <section class="desktop-window window-wide window-bottom window-piano" id="pianoWindow" data-draggable="true" data-drag-handle=".window-handle">
            <div class="window-handle">
                <h2>Klaviatur</h2>
            </div>
            <div class="window-body">
                <div class="piano" id="pianoKeys">
                    <div class="track-tabs" id="trackTabs"></div>
                </div>
            </div>
        </section>

        <!-- Playback & Timeline -->
        <section class="desktop-window window-full window-bottom window-playback" id="playbackWindow" data-draggable="true" data-drag-handle=".window-handle">
            <div class="window-handle">
                <h2>Playback & Timeline</h2>
            </div>
            <div class="window-body">
                <button id="showMelodyFormButton" type="button" class="ghost-btn">Melodie einfügen …</button>
                <div class="melody-import hidden" id="melodyImportBlock">
                    <div class="melody-import-row">
                        <label for="melodyInputTrack0">Spur 1</label>
                        <input type="text" class="melody-track-input" id="melodyInputTrack0" data-track="0" placeholder="C4 D4 E4 …">
                        <button class="melody-import-btn" data-track="0">Einfügen</button>
                    </div>
                    <div class="melody-import-row">
                        <label for="melodyInputTrack1">Spur 2</label>
                        <input type="text" class="melody-track-input" id="melodyInputTrack1" data-track="1" placeholder="C4 D4 E4 …">
                        <button class="melody-import-btn" data-track="1">Einfügen</button>
                    </div>
                    <div class="melody-import-row">
                        <label for="melodyInputTrack2">Spur 3</label>
                        <input type="text" class="melody-track-input" id="melodyInputTrack2" data-track="2" placeholder="C4 D4 E4 …">
                        <button class="melody-import-btn" data-track="2">Einfügen</button>
                    </div>
                    <div class="melody-import-row">
                        <label for="melodyInputTrack3">Spur 4</label>
                        <input type="text" class="melody-track-input" id="melodyInputTrack3" data-track="3" placeholder="C4 D4 E4 …">
                        <button class="melody-import-btn" data-track="3">Einfügen</button>
                    </div>
                </div>

                <div class="widget-card transport-widget">
                    <div class="widget-handle">
                        <h3>Aufnehmen & Speichern</h3><span class="collapse-icon">▸</span>
                    </div>
                    <div class="widget-body">
                        <div class="record-controls">
                            <button id="recordToggleButton" type="button">Aufnahme aktiv</button>
                        </div>

                        <div class="piano-controls">
                            <button id="saveMelodyJsonButton">Melodie als JSON speichern</button>
                            <button id="loadMelodyJsonButton">Melodie aus JSON laden</button>
                            <button id="exportMelodyMidiButton">Melodie als MIDI exportieren</button>
                        </div>

                        <div class="tempo-controls">
                            <div class="tempo-and-transpose">
                                <div class="tempo-block">
                                    <div class="tempo-label">Tempo</div>
                                    <div class="tempo-inputs">
                                        <button id="tempoSlowerButton" type="button" aria-label="langsamer">−</button>
                                        <input type="number" id="tempoInput" min="1" max="220" step="1" value="120" aria-label="BPM">
                                        <button id="tempoFasterButton" type="button" aria-label="schneller">+</button>
                                        <button id="tempoTapButton" type="button">Tap</button>
                                    </div>
                                    <div class="tempo-display" id="tempoDisplay">120 BPM</div>
                                </div>
                                <div class="transpose-controls inline" id="transposeControls">
                                    <span class="transpose-label">Transpose:</span>
                                    <button type="button" id="transposeDownButton">-</button>
                                    <span id="transposeDisplay">0</span>
                                    <button type="button" id="transposeUpButton">+</button>
                                    <button type="button" id="transposeResetButton">Reset</button>
                                </div>
                            </div>
                        </div>

                        <div class="piano-controls">
                            <button id="playMelodyButton">Play</button>
                            <button id="pauseMelodyButton">Pause</button>
                            <button id="loopToggleButton">Loop: aus</button>
                            <button id="clearMelodyButton">Melodie löschen</button>
                            <button id="sustainToggleButton">Sustain: kurz</button>
                            <button id="arpeggioToggleButton">Arpeggio: aus</button>
                        </div>

                        <div class="step-row step-row-below">
                            <button id="stepBackButton" class="step-btn">Step ◀</button>
                            <button id="stepStayButton" class="step-btn">Step •</button>
                            <button id="stepForwardButton" class="step-btn">Step ▶</button>
                        </div>

                        <div class="melody-track" id="melodyTrack">
                            <div class="track-row bulk-row">
                                <div class="track-row-title">Step</div>
                                <div class="track-notes bulk-controls">
                                    <span class="bulk-hint">Klick ins Raster: aktuelles Step löschen (alle Spuren)</span>
                                </div>
                            </div>
                            <div class="playhead" id="melodyPlayhead"></div>
                            <div class="track-list" id="melodyTrackList"></div>
                        </div>

                        <div class="piano-status" id="melodyStatus">Keine Noten aufgenommen.</div>

                        <div class="piano-controls play-controls-below">
                            <button id="playMelodyButton-dup" type="button" data-link="#playMelodyButton">Play</button>
                            <button id="pauseMelodyButton-dup" type="button" data-link="#pauseMelodyButton">Pause</button>
                            <button id="loopToggleButton-dup" type="button" data-link="#loopToggleButton">Loop</button>
                            <button id="clearMelodyButton-dup" type="button" data-link="#clearMelodyButton">Melodie löschen</button>
                            <button id="sustainToggleButton-dup" type="button" data-link="#sustainToggleButton">Sustain</button>
                            <button id="arpeggioToggleButton-dup" type="button" data-link="#arpeggioToggleButton">Arpeggio</button>
                            <button id="stepBackButton-dup" type="button" data-link="#stepBackButton">Step ◀</button>
                            <button id="stepStayButton-dup" type="button" data-link="#stepStayButton">Step •</button>
                            <button id="stepForwardButton-dup" type="button" data-link="#stepForwardButton">Step ▶</button>
                        </div>
                    </div>
                </div>
                <input type="file" id="melodyJsonFileInput" accept="application/json" style="display:none;">
            </div>
        </section>
    </div>

    <script type="module" src="main.js"></script>
</body>
</html>
