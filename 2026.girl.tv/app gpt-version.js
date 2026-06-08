
/*


*/


import {
    ensureAudioContext,
    resumeAudioContextIfNeeded
} from "./audioContextManager.js";

import {
    startContinuousSine,
    stopContinuousTone,
    midiToFrequency,
    playPluckedUkulele
} from "./tonePlayer.js";

import {
    buildUkuleleFretboard,
    highlightUkuleleForMidi,
    highlightUkuleleForMidis,
    clearFretHighlights,
    midiToNote,
    midiToHue,
    midiToColor,
    setColorPreset,
    getColorPresetName,
    refreshFretboardColors,
    UKULELE_STRINGS,
    updateCustomPalette,
    resetCustomPalette
} from "./ukuleleFretboard.js";

import {
    addNote,
    clearMelody,
    setMelody,
    setTracks,
    getMelody,
    getMelodyLength,
    hasMelody,
    setNoteDuration,
    getNoteAt,
    removeNoteAt,
    insertNoteAt,
    insertRestAt,
    setActiveTrack,
    getActiveTrack,
    getTracks,
    getTrackDurations,
    getMaxTracks
} from "./melody.js";


document.addEventListener("DOMContentLoaded", () => {
    setupCollapsibleModules();
    detectMobile();
    setupTuner();
    setupMicTuner();
    setupFretboard();
    setupPianoAndMelody();
    setupVisibilityHandling();
    setupChordTool();
    setupTapView();
    setupDraggables();
    renderIntervalHistory();
    bindGlobalShortcuts();
    syncChordWheelSize();
    window.addEventListener("resize", debounce(syncChordWheelSize, 140));
    setupColorPresetSelector();
    setupFileMenu();
    setupMenuChips();
});

const GAP_FACTOR = 4.0; // Basis: 1 Einheit = Ganze Note (4 Schläge bei 4/4)
const CLICK_SEQUENCE = [1, 0.5, 1 / 3, 0.25, 1 / 6, 0.125, 1 / 16, 1 / 16, 1 / 32];
const UNIT_PX = 52;
const NOTE_GAP = 0;
const ARPEGGIO_MODES = ["off", "up", "down", "updown"];
const COLOR_PRESET_KEY = "ukulele_color_preset";
const PIANO_ACTIVE_ONLY_KEY = "piano_active_only";
const PIANO_ACTIVE_INVERT_KEY = "piano_active_invert";
const LUMA_CONFIG_KEY = "piano_luma_config";
const OCTAVE_SPREAD_CONFIG_KEY = "piano_octave_spread_config";
const CUSTOM_PRESET_KEY = "ukulele_custom_palette";

const pianoKeyMap = new Map();
const trackCursors = [0, 0, 0, 0];
let tempoBPM = 120;
let timeSignature = "4/4";
let pianoLumaNormalized = true; // legacy toggle retained for storage compatibility
let pianoColorActiveOnly = false;
let pianoActiveInvert = false;
let octaveSpreadEnabled = true;
let octaveBase = 4;
let octaveDarkRange = 4;
let octaveLightRange = 4;
let octaveLowColor = "#000000";
let octaveHighColor = "#ffffff";
let octaveSatLow = 1;
let octaveSatHigh = 1;
let octaveContrast = 0;
let tapTimes = [];
let recordingEnabled = false;
let sustainLong = false;
let arpeggioMode = "off";
let transposeSemitones = 0;
let staffNotes = [];
let staffAllNotes = [];
let pendingNoteScroll = null;
let defaultDuration = 1;
let lastMicNote = { midi: null, time: 0, idx: 0 };
let lastIntervalMidi = null;
let intervalHistory = [];
let intervalTrackingEnabled = false;
let intervalOneShot = false;
let penMode = false;
let fretScrollEnabled = true;
const manualStepSelections = new Map(); // timeKey -> Map<stringNumber,midi>
let lastManualTimeKey = null;
const uiRefs = {
    trackList: null,
    playhead: null,
    status: null
};
const STRING_SHORT = ["A", "E", "C", "G"];
const chordShapes = {
    "C:maj": [3, 0, 0, 0],
    "C:min": [3, 3, 3, 0],
    "C:7": [1, 0, 0, 0],
    "C:maj7": [2, 0, 0, 0],
    "C:m7": [3, 3, 3, 3],
    "C:sus4": [3, 1, 0, 0],

    "G:maj": [2, 3, 2, 0],
    "G:min": [1, 3, 2, 0],
    "G:7": [2, 1, 2, 0],
    "G:maj7": [2, 2, 2, 0],
    "G:m7": [1, 1, 1, 1],
    "G:sus4": [3, 3, 2, 0],

    "F:maj": [0, 1, 0, 2],
    "F:min": [3, 1, 0, 1],
    "F:7": [0, 1, 3, 2],
    "F:maj7": [0, 1, 0, 1],
    "F:m7": [0, 1, 1, 1],
    "F:sus4": [1, 1, 0, 3],

    "A:maj": [0, 0, 1, 2],
    "A:min": [0, 0, 0, 2],
    "A:7": [0, 1, 0, 2],
    "A:maj7": [0, 0, 1, 1],
    "A:m7": [0, 0, 0, 0],
    "A:sus4": [0, 0, 2, 2],

    "D:maj": [0, 2, 2, 2],
    "D:min": [0, 1, 2, 2],
    "D:7": [2, 2, 2, 2],
    "D:maj7": [2, 2, 2, 4],
    "D:m7": [1, 1, 1, 1],
    "D:sus4": [3, 3, 2, 0],

    "E:maj": [2, 4, 4, 4],
    "E:min": [2, 3, 4, 0],
    "E:7": [2, 0, 2, 1],
    "E:maj7": [1, 3, 0, 2],
    "E:m7": [2, 3, 2, 0],
    "E:sus4": [2, 5, 4, 0],

    "B:maj": [1, 1, 2, 3],
    "B:min": [2, 2, 2, 4],
    "B:7": [2, 2, 2, 3],
    "B:maj7": [2, 2, 2, 3],
    "B:m7": [2, 2, 2, 2],
    "B:sus4": [2, 2, 4, 4],

    "Bb:maj": [1, 1, 2, 3],
    "Bb:min": [1, 1, 1, 3],
    "Bb:7": [1, 1, 1, 1],
    "Bb:maj7": [1, 1, 1, 2],
    "Bb:m7": [1, 1, 1, 1],
    "Bb:sus4": [1, 1, 3, 3],

    "Ab:maj": [3, 4, 3, 5],
    "Ab:min": [3, 4, 3, 4],
    "Ab:7": [3, 4, 3, 3],
    "Ab:maj7": [3, 4, 3, 4],
    "Ab:m7": [3, 4, 3, 3],
    "Ab:sus4": [4, 4, 3, 1],

    "Db:maj": [4, 1, 1, 1],
    "Db:min": [4, 4, 4, 6],
    "Db:7": [4, 4, 4, 4],
    "Db:maj7": [3, 3, 3, 3],
    "Db:m7": [4, 4, 4, 4],
    "Db:sus4": [4, 4, 2, 1],

    "Eb:maj": [1, 3, 3, 3],
    "Eb:min": [3, 3, 2, 1],
    "Eb:7": [1, 3, 1, 1],
    "Eb:maj7": [3, 3, 3, 3],
    "Eb:m7": [3, 3, 2, 1],
    "Eb:sus4": [1, 1, 1, 3],

    "F#:maj": [1, 2, 1, 3],
    "F#:min": [0, 2, 1, 2],
    "F#:7": [1, 2, 1, 1],
    "F#:maj7": [1, 2, 1, 2],
    "F#:m7": [1, 1, 1, 1],
    "F#:sus4": [2, 2, 1, 3]
};
const chordSelections = {};
const chordChips = new Set();
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "H"];

function updateKnobVisual(input) {
    if (!input) return;
    const min = Number(input.min) || 0;
    const max = Number(input.max) || 1;
    const val = Number(input.value) || min;
    const pct = Math.max(0, Math.min(1, (val - min) / (max - min)));
    const deg = 45 + pct * 270;
    input.style.setProperty("--knob-deg", `${deg}deg`);
}

function attachKnob(input) {
    if (!input) return;
    if (input.closest && input.closest(".mic-settings")) {
        updateKnobVisual(input);
        return;
    }
    let startY = 0;
    let startVal = Number(input.value) || Number(input.min) || 0;
    const min = Number(input.min) || 0;
    const max = Number(input.max) || 1;
    const step = Number(input.step) || (max - min) / 100 || 0.01;
    const maxRot = 140;
    const speed = Number(input.dataset.knobSpeed) || 1.5;

    const applyVal = (val, fireEvent = true) => {
        const snapped = Math.round(val / step) * step;
        const clamped = Math.max(min, Math.min(max, snapped));
        input.value = clamped;
        updateKnobVisual(input);
        if (fireEvent) input.dispatchEvent(new Event("input", { bubbles: true }));
    };

    const onMove = ev => {
        const delta = startY - ev.clientY;
        const rot = Math.max(-maxRot, Math.min(maxRot, delta * speed));
        const pct = (rot + maxRot) / (2 * maxRot);
        const val = min + pct * (max - min);
        applyVal(val);
    };
    const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        startVal = Number(input.value) || startVal;
    };

    input.addEventListener("pointerdown", ev => {
        startY = ev.clientY;
        startVal = Number(input.value) || startVal;
        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
    });

    updateKnobVisual(input);
}

const valueBadges = new Map();

function setupValueBadge(input, formatter = v => v, extraInputs = []) {
    if (!input) return;
    const badge = document.querySelector(`.value-pill[data-value-for="${input.id}"]`);
    if (!badge) return;
    const render = () => {
        const val = Number(input.value);
        badge.textContent = formatter(Number.isFinite(val) ? val : input.value || "");
    };
    valueBadges.set(input.id, { badge, formatter, render });
    [input, ...extraInputs].forEach(el => {
        if (!el) return;
        el.addEventListener("input", render);
    });
    render();
}

function setInputDisabled(el, disabled) {
    if (!el) return;
    el.disabled = disabled;
    el.classList.toggle("is-disabled", disabled);
}

function refreshValueBadge(id) {
    const entry = valueBadges.get(id);
    entry?.render?.();
}

function setupCollapsibleModules() {
    const cards = document.querySelectorAll(".widget-card");
    cards.forEach(card => {
        if (card.dataset.startCollapsed === "true") {
            card.classList.add("collapsed");
        } else {
            card.classList.remove("collapsed");
        }
    });
    const handles = document.querySelectorAll(".widget-handle");
    handles.forEach(handle => {
        const icon = handle.querySelector(".collapse-icon");
        if (icon) {
            icon.style.display = "";
            const card = handle.closest(".widget-card");
            if (card && !card.classList.contains("collapsed")) {
                icon.textContent = "▾";
            }
            if (!icon.dataset.boundCollapse) {
                icon.dataset.boundCollapse = "1";
                icon.addEventListener("click", event => {
                    event.stopPropagation();
                    const card = handle.closest(".widget-card");
                    if (!card) return;
                    card.classList.toggle("collapsed");
                    icon.textContent = card.classList.contains("collapsed") ? "▸" : "▾";
                });
            }
        }
        if (!handle.dataset.boundDblCollapse) {
            handle.dataset.boundDblCollapse = "1";
            handle.addEventListener("dblclick", event => {
                event.stopPropagation();
                const card = handle.closest(".widget-card");
                if (!card) return;
                card.classList.toggle("collapsed");
                const ic = card.querySelector(".collapse-icon");
                if (ic) ic.textContent = card.classList.contains("collapsed") ? "▸" : "▾";
            });
            handle.addEventListener("click", event => {
                if (!deviceInfo.isMobile) return;
                if (event.detail !== 1) return;
                const card = handle.closest(".widget-card");
                if (!card) return;
                card.classList.toggle("collapsed");
                const ic = card.querySelector(".collapse-icon");
                if (ic) ic.textContent = card.classList.contains("collapsed") ? "▸" : "▾";
            });
        }
        let dockBtn = handle.querySelector(".dock-button");
        if (!dockBtn) {
            dockBtn = document.createElement("button");
            dockBtn.type = "button";
            dockBtn.className = "dock-button";
            dockBtn.textContent = "⤢";
            (handle.querySelector(".widget-controls") || handle).appendChild(dockBtn);
        }
        if (dockBtn && !dockBtn.dataset.boundDock) {
            dockBtn.dataset.boundDock = "1";
            dockBtn.addEventListener("click", event => {
                event.stopPropagation();
                const card = handle.closest(".widget-card");
                if (!card) return;
                frontZIndex += 1;
                card.style.zIndex = String(frontZIndex);
                card.style.position = "";
                card.style.left = "";
                card.style.top = "";
                card.style.zIndex = "";
                saveWidgetState(card);
            });
        }
    });

    // Standardmäßig geöffnete Module, damit wichtige Anzeigen sichtbar sind
    ["micTuner", "tapDiagram", "fretboardWrapper"].forEach(id => {
        const el = document.getElementById(id);
        const card = el?.closest(".widget-card");
        if (card) {
            card.classList.remove("collapsed");
            const icon = card.querySelector(".collapse-icon");
            if (icon) icon.textContent = "▾";
        }
    });

    // Bring widget forward on interaction
    document.querySelectorAll(".widget-card").forEach(card => {
        card.addEventListener("mousedown", () => {
            frontZIndex += 1;
            card.style.zIndex = String(frontZIndex);
        });
    });
}

let deviceInfo = {
    isMobile: false,
    isTablet: false,
    isAndroid: false,
    isIOS: false,
    osVersion: "",
    ua: ""
};
let micState = {
    preAnalyser: null,
    analyser: null,
    filter: null,
    lowpass: null,
    notch: null,
    notchGain: null,
    source: null,
    stream: null,
    canvas: null,
    ctx: null,
    pitchBuffer: null,
    buffer: null,
    freqBuffer: null,
    running: false,
    lastUpdate: 0,
    bgHue: 200,
    gainNode: null
};
let intervalHoldMs = 200;
let lastIntervalTime = 0;
let micNoiseGate = 0.006;
let micPreGain = 1.5;
let micToleranceCents = 12;
let micHighCut = 1600;
let lastDetectedMidi = null;
let loopMode = 0; // 0=aus, 1=alles, 2=aktueller Step
const tapHistory = [];
let fretboardOrientation = 0; // 0=normal,1=hochkant,2=zurück
let intervalMode = "manual"; // off, manual (per tap), auto
let intervalChangeMs = 350;
let intervalSilenceMs = 500;
let lastSilenceTime = 0;
let micPreviewEnabled = false;
let micSineEnabled = false;
let micSineVoices = new Map(); // offset -> voice handle
let micSineFreq = null;
let waveStyle = { lineWidth: 2.5, scaleY: 1, scaleX: 1, mirror: false };
let waveAccuracy = 0.5;
let sineLowpassHz = 1800;
let activeSineOffsets = new Set();
let micSineGain = 0.07;
let micSineGlideMs = 40;
let sineHoldMs = 350;
let lastSineValidTime = 0;
let sineRetriggerEnabled = true;
let sineRetriggerCents = 20;
let sineRetriggerMs = 350;
let sineDropCents = 30;
let lastSineTriggerMidi = null;
let lastSineTriggerTime = 0;
let multiToneEnabled = false;
let harmonicFilterEnabled = false;
let overtoneOverlayEnabled = false;
let multiToneSensitivity = 0.35;
let harmonicNotch = 0.5;
let overtoneBlend = 0.4;
let sineExactHold = false;
let micPreviewGain = 0.08;
let fftSmoothing = 0.8;
let multiToneListEl = null;
let notchEnabled = false;
let notchMode = "loudest";
let notchFilterType = "notch";
let notchCutDb = -30;
let notchQ = 12;
let notchManualFreq = 440;
let lastDetectedFreq = null;
let notchFreqInputEl = null;
const NOTCH_MIN_DB = -80;
const triadDotLabels = { maj: "3", min: "b3", aug: "a", dim: "d", sus2: "s2", sus4: "s4" };
const sineParams = {
    attackMs: 12,
    releaseMs: 160,
    wave: "sine"
};
let autoFilterEnabled = false;
let monitorPreActive = false;
let monitorPostActive = false;
let monitorNodes = {
    pre: null,
    post: null,
    gain: null
};
let measurementWindowMs = 48;
const micBypassState = {
    filterFreqInput: false,
    filterQInput: false,
    preGainInput: false,
    noiseGateInput: false,
    highCutInput: false,
    measurementWindowInput: false,
    sineRetriggerCents: false,
    sineRetriggerMs: false,
    sineDropCents: false,
    micToleranceSlider: false
};
const micBypassMemory = {};
let phaseDetectionEnabled = false;
let frontZIndex = 50;
let chordMuteSelectOnce = false;
let chordMuteTimestamp = 0;
const widgetStateKey = "ukulele_widget_positions_v1";
const triadShort = { maj: "", min: "m", dim: "dim", aug: "aug", sus2: "sus2", sus4: "sus4" };
const extShort = { "": "", "5": "5", "6": "6", "7": "7", "maj7": "maj7", "9": "9", "11": "11", "13": "13" };
let chordRenderCallback = null;
let monitorGainLevel = 0.6;
function updateDesktopBounds() {
    const stage = document.querySelector(".desktop-stage");
    const wins = document.querySelectorAll(".desktop-window");
    let maxBottom = window.innerHeight;
    wins.forEach(w => {
        const rect = w.getBoundingClientRect();
        const bottom = rect.bottom + window.scrollY;
        if (bottom > maxBottom) maxBottom = bottom;
    });
    const target = stage || document.body;
    target.style.minHeight = `${Math.ceil(Math.max(maxBottom + 120, window.innerHeight * 2))}px`;
}

function playChordWithMute(shape) {
    const now = performance.now();
    if (chordMuteSelectOnce && now - chordMuteTimestamp < 8000) {
        chordMuteSelectOnce = false;
        return;
    }
    chordMuteSelectOnce = false;
    playChordShape(shape);
}

function preserveViewport(fn) {
    const doc = document.scrollingElement || document.documentElement;
    const x = window.scrollX || doc.scrollLeft || 0;
    const y = window.scrollY || doc.scrollTop || 0;
    const result = fn();
    queueMicrotask(() => {
        if (Math.abs((window.scrollX || 0) - x) > 1 || Math.abs((window.scrollY || 0) - y) > 1) {
            window.scrollTo(x, y);
        }
    });
    return result;
}

function getUnitMs() {
    return (60000 / tempoBPM) * GAP_FACTOR;
}

function syncCursorsToTracks() {
    const tracks = getTracks();
    tracks.forEach((track, idx) => {
        trackCursors[idx] = track.length;
    });
    while (trackCursors.length < getMaxTracks()) {
        trackCursors.push(0);
    }
}

const playbackState = {
    isPlaying: false,
    timeline: null,
    timeouts: [],
    playheadRAF: null,
    startTimestamp: null,
    pausedElapsed: 0,
    currentTimeIndex: 0,
    loopStepMs: null
};

function calculateTotalUnits(melody) {
    return melody.reduce((sum, n) => sum + (n.durationMultiplier || 1), 0) || 1;
}

function clampMidi(value) {
    return Math.max(0, Math.min(127, Math.round(value)));
}

function consumedUnitsUntil(melody, index) {
    let sum = 0;
    for (let i = 0; i < index && i < melody.length; i++) {
        sum += melody[i].durationMultiplier || 1;
    }
    return sum;
}

function insertNoteAtCursor(midi) {
    stopPlayback(false);
    const track = getActiveTrack();
    const currentCursor = trackCursors[track] || 0;
    const insertIndex = Math.max(0, Math.min(currentCursor, getMelodyLength(track)));
    insertNoteAt(insertIndex, midi, 1, track);
    trackCursors[track] = insertIndex + 1;
    pendingNoteScroll = { track, index: insertIndex };
}

function insertNoteAtCursorForTrack(midi, trackIndex) {
    stopPlayback(false);
    const track = Math.max(0, Math.min(trackIndex, getMaxTracks() - 1));
    const currentCursor = trackCursors[track] || 0;
    const insertIndex = Math.max(0, Math.min(currentCursor, getMelodyLength(track)));
    insertNoteAt(insertIndex, midi, 1, track);
    trackCursors[track] = insertIndex + 1;
    pendingNoteScroll = { track, index: insertIndex };
}

function setPenMode(active) {
    penMode = !!active;
    const penBtn = document.getElementById("penToggleButton");
    if (penBtn) {
        penBtn.classList.toggle("active", penMode);
    }
    document.body.classList.toggle("pen-mode", penMode);
}

function insertLabelIntoInput(input, label) {
    if (!input) return;
    const value = input.value || "";
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? start;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const spaceBefore = before.length === 0 || /\s$/.test(before) ? "" : " ";
    const spaceAfter = after.length === 0 || /^\s/.test(after) ? "" : " ";
    const insertText = spaceBefore + label + spaceAfter;
    const newValue = before + insertText + after;
    const caret = (before + insertText).length;
    input.value = newValue;
    input.focus();
    input.setSelectionRange(caret, caret);
}

function bindDualInput(numberEl, sliderEl, clampFn, onChange) {
    const apply = value => {
        const clamped = clampFn(value);
        if (!Number.isFinite(clamped)) return;
        if (numberEl && numberEl.value !== String(clamped)) numberEl.value = String(clamped);
        if (sliderEl && sliderEl.value !== String(clamped)) sliderEl.value = String(clamped);
        onChange(clamped);
    };
    const initial = Number(numberEl?.value ?? sliderEl?.value);
    if (Number.isFinite(initial)) apply(initial);
    if (numberEl) {
        numberEl.addEventListener("change", () => apply(Number(numberEl.value)));
    }
    if (sliderEl) {
        sliderEl.addEventListener("input", () => apply(Number(sliderEl.value)));
    }
}

/* ---------- Tuner ---------- */

let currentTunerHandle = null;
let currentTunerButton = null;

function setupTuner() {
    const tunerContainer = document.getElementById("tunerButtons");
    const stopButton = document.getElementById("stopTunerButton");
    if (!tunerContainer || !stopButton) return;

    const buttons = tunerContainer.querySelectorAll("button[data-freq]");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const freq = parseFloat(button.dataset.freq);
            if (!Number.isFinite(freq)) return;

            // Toggle: wenn derselbe Button gerade spielt, dann stoppen
            if (button === currentTunerButton && currentTunerHandle) {
                stopTunerTone();
                return;
            }

            playTunerTone(freq, button);
        });
    });

    stopButton.addEventListener("click", () => {
        stopTunerTone();
    });
}

/* ---------- Mikrofon-Stimmgerät ---------- */

function setupMicTuner() {
    const permBtn = null; // Button existiert nicht mehr, aber für API-Kompatibilität
    const toggleBtn = document.getElementById("micToggleButton");
    const noteEl = document.getElementById("micNoteDisplay");
    const detuneEl = document.getElementById("micDetuneDisplay");
    const freqEl = document.getElementById("micFreqDisplay");
    const canvas = document.getElementById("micWaveCanvas");
    const intervalBtn = document.getElementById("intervalToggleButton");
    const intervalHoldInput = document.getElementById("intervalHoldInput");
    const intervalHoldSlider = document.getElementById("intervalHoldSlider");
    const intervalChangeInput = document.getElementById("intervalChangeInput");
    const intervalChangeSlider = document.getElementById("intervalChangeSlider");
    const intervalSilenceInput = document.getElementById("intervalSilenceInput");
    const intervalSilenceSlider = document.getElementById("intervalSilenceSlider");
    const micToleranceInput = document.getElementById("micToleranceInput");
    const micToleranceSlider = document.getElementById("micToleranceSlider");
    const micPreviewButton = document.getElementById("micPreviewButton");
    const micPreviewGainInput = document.getElementById("micPreviewGainInput");
    const micSineButton = document.getElementById("micSineButton");
    const chipMic = document.getElementById("chipMic");
    const monitorGainInput = document.getElementById("monitorGainInput");
    const waveFullscreenBtn = document.getElementById("waveFullscreenButton");
    const waveLineWidthInput = document.getElementById("waveLineWidth");
    const waveScaleXInput = document.getElementById("waveScaleX");
    const waveScaleYInput = document.getElementById("waveScaleY");
    const sineLowpassInput = document.getElementById("sineLowpassInput");
    const sineGainInput = document.getElementById("sineGainInput");
    const sineGlideInput = document.getElementById("sineGlideInput");
    const sineAttackInput = document.getElementById("sineAttackInput");
    const sineReleaseInput = document.getElementById("sineReleaseInput");
    const sineWaveInput = document.getElementById("sineWaveInput");
    const sineHoldInput = document.getElementById("sineHoldInput");
    const waveMirrorButton = document.getElementById("waveMirrorButton");
    const sineRetriggerCentsInput = document.getElementById("sineRetriggerCents");
    const sineRetriggerMsInput = document.getElementById("sineRetriggerMs");
    const sineDropCentsInput = document.getElementById("sineDropCents");
    const sineRetriggerToggle = document.getElementById("sineRetriggerToggle");
    const sineExactToggle = document.getElementById("sineExactToggle");
    const sineButtons = document.querySelectorAll("[data-sine-offset]");
    const measurementWindowInput = document.getElementById("measurementWindowInput");
    const phaseModeButton = document.getElementById("phaseModeButton");
    const micSettingsCollapse = document.getElementById("micSettingsCollapse");
    const multiToneButton = document.getElementById("multiToneButton");
    const harmonicFilterButton = document.getElementById("harmonicFilterButton");
    const overtoneOverlayButton = document.getElementById("overtoneOverlayButton");
    const multiToneSensitivityInput = document.getElementById("multiToneSensitivity");
    const harmonicNotchInput = document.getElementById("harmonicNotch");
    const overtoneBlendInput = document.getElementById("overtoneBlend");
    const fftSmoothingInput = document.getElementById("fftSmoothingInput");
    const multiToneList = document.getElementById("multiToneList");
    const notchRemoveToggle = document.getElementById("notchRemoveToggle");
    const notchModeSelect = document.getElementById("notchMode");
    const notchFilterTypeSelect = document.getElementById("notchFilterType");
    const notchFreqInput = document.getElementById("notchFreqInput");
    const notchQInput = document.getElementById("notchQInput");
    const notchCutInput = document.getElementById("notchCutInput");
    const updateSineUI = () => {
        const suffix = activeSineOffsets.size ? ` (${[...activeSineOffsets].sort((a,b)=>a-b).join(",")})` : "";
        if (micSineButton) micSineButton.textContent = micSineEnabled ? `Sinus: an${suffix}` : "Sinus: aus";
        sineButtons.forEach(btn => {
            const off = Number(btn.dataset.sineOffset);
            btn.classList.toggle("active", activeSineOffsets.has(off) && micSineEnabled);
        });
    };
    const toggleSineOffset = value => {
        if (activeSineOffsets.has(value)) {
            activeSineOffsets.delete(value);
        } else {
            activeSineOffsets.add(value);
            micSineEnabled = true;
        }
        if (!activeSineOffsets.size) micSineEnabled = false;
        updateSineUI();
        if (micSineEnabled && Number.isFinite(lastDetectedMidi)) {
            updateMicSine(midiToFrequency(lastDetectedMidi), lastDetectedMidi);
        } else {
            stopMicSine();
        }
    };
    multiToneListEl = multiToneList;
    updateMultiToneList([]);
    const filterFreqInput = document.getElementById("filterFreqInput");
    const filterQInput = document.getElementById("filterQInput");
    const preGainInput = document.getElementById("preGainInput");
    const noiseGateInput = document.getElementById("noiseGateInput");
    const highCutInput = document.getElementById("highCutInput");
    const tunerResetButton = document.getElementById("tunerResetButton");
    const monitorPreButton = document.getElementById("monitorPreButton");
    const monitorPostButton = document.getElementById("monitorPostButton");
    const headphoneStatus = document.getElementById("headphoneStatus");
    const checkHeadphoneButton = document.getElementById("checkHeadphoneButton");
    const bypassToggles = {
        filterFreqInput: document.querySelector('[data-bypass-target="filterFreqInput"]'),
        filterQInput: document.querySelector('[data-bypass-target="filterQInput"]'),
        preGainInput: document.querySelector('[data-bypass-target="preGainInput"]'),
        noiseGateInput: document.querySelector('[data-bypass-target="noiseGateInput"]'),
        highCutInput: document.querySelector('[data-bypass-target="highCutInput"]'),
        measurementWindowInput: document.querySelector('[data-bypass-target="measurementWindowInput"]'),
        sineRetriggerCents: document.querySelector('[data-bypass-target="sineRetriggerCents"]'),
        sineRetriggerMs: document.querySelector('[data-bypass-target="sineRetriggerMs"]'),
        sineDropCents: document.querySelector('[data-bypass-target="sineDropCents"]'),
        micToleranceSlider: document.querySelector('[data-bypass-target="micToleranceSlider"]')
    };
    const micValueFormatters = {
        sineRetriggerCents: v => `${Math.round(v)} ¢`,
        sineRetriggerMs: v => `${Math.round(v)} ms`,
        sineDropCents: v => `${Math.round(v)} ¢`,
        micToleranceSlider: v => `${Math.round(v)} ¢`,
        filterFreqInput: v => `${Math.round(v)} Hz`,
        filterQInput: v => v.toFixed(2),
        preGainInput: v => `${v.toFixed(2)}×`,
        noiseGateInput: v => v.toFixed(3),
        highCutInput: v => `${Math.round(v)} Hz`,
        measurementWindowInput: v => `${Math.round(v)} ms`,
        micPreviewGainInput: v => v.toFixed(3),
        fftSmoothingInput: v => v.toFixed(2),
        notchQInput: v => Math.round(v),
        notchCutInput: v => (v <= NOTCH_MIN_DB + 0.5 ? "−∞ dB" : `${Math.round(v)} dB`)
    };
    Object.entries(micValueFormatters).forEach(([id, formatter]) => {
        const input = document.getElementById(id);
        const extras = id === "micToleranceSlider" ? [micToleranceInput] : [];
        setupValueBadge(input, formatter, extras);
    });
    const syncFilterBypass = () => {
        const bypass = micBypassState.filterFreqInput || micBypassState.filterQInput;
        setInputDisabled(filterFreqInput, micBypassState.filterFreqInput);
        setInputDisabled(filterQInput, micBypassState.filterQInput);
        if (micState.filter) {
            micState.filter.type = bypass ? "allpass" : "bandpass";
            if (!bypass) {
                if (filterFreqInput) micState.filter.frequency.value = Number(filterFreqInput.value) || micState.filter.frequency.value;
                if (filterQInput) micState.filter.Q.value = Number(filterQInput.value) || micState.filter.Q.value;
            }
        }
        refreshValueBadge("filterFreqInput");
        refreshValueBadge("filterQInput");
    };
    const syncPreGainBypass = () => {
        setInputDisabled(preGainInput, micBypassState.preGainInput);
        if (micBypassState.preGainInput) {
            micBypassMemory.preGainInput = Number(preGainInput?.value) || micPreGain;
        } else if (micBypassMemory.preGainInput != null && preGainInput) {
            preGainInput.value = micBypassMemory.preGainInput;
            micPreGain = micBypassMemory.preGainInput;
        }
        const val = micBypassState.preGainInput ? 1 : (Number(preGainInput?.value) || micPreGain);
        micPreGain = val;
        if (micState.gainNode) micState.gainNode.gain.value = val;
        refreshValueBadge("preGainInput");
    };
    const syncNoiseGateBypass = () => {
        setInputDisabled(noiseGateInput, micBypassState.noiseGateInput);
        if (micBypassState.noiseGateInput) {
            micBypassMemory.noiseGateInput = Number(noiseGateInput?.value) || micNoiseGate;
            micNoiseGate = 0;
        } else {
            const mem = micBypassMemory.noiseGateInput;
            if (mem != null && noiseGateInput) noiseGateInput.value = mem;
            micNoiseGate = Number(noiseGateInput?.value) || micNoiseGate;
        }
        refreshValueBadge("noiseGateInput");
    };
    const syncHighCutBypass = () => {
        setInputDisabled(highCutInput, micBypassState.highCutInput);
        if (micBypassState.highCutInput) {
            micBypassMemory.highCutInput = Number(highCutInput?.value) || micHighCut;
        } else if (micBypassMemory.highCutInput != null && highCutInput) {
            highCutInput.value = micBypassMemory.highCutInput;
        }
        micHighCut = Number(highCutInput?.value) || micHighCut;
        if (micState.lowpass) {
            micState.lowpass.type = micBypassState.highCutInput ? "allpass" : "lowpass";
            micState.lowpass.frequency.value = micHighCut;
        }
        refreshValueBadge("highCutInput");
    };
    const syncMeasurementBypass = () => {
        setInputDisabled(measurementWindowInput, micBypassState.measurementWindowInput);
        if (micBypassState.measurementWindowInput) {
            micBypassMemory.measurementWindowInput = Number(measurementWindowInput?.value) || measurementWindowMs;
            measurementWindowMs = 48;
        } else {
            const mem = micBypassMemory.measurementWindowInput;
            if (mem != null && measurementWindowInput) measurementWindowInput.value = mem;
            measurementWindowMs = Number(measurementWindowInput?.value) || measurementWindowMs;
        }
        resizeMicBuffer();
        refreshValueBadge("measurementWindowInput");
    };
    const syncToleranceBypass = () => {
        setInputDisabled(micToleranceSlider, micBypassState.micToleranceSlider);
        setInputDisabled(micToleranceInput, micBypassState.micToleranceSlider);
        refreshValueBadge("micToleranceSlider");
    };
    const syncRetriggerBypass = id => {
        const input = document.getElementById(id);
        setInputDisabled(input, micBypassState[id]);
        refreshValueBadge(id);
    };
    const bypassHandlers = {
        filterFreqInput: syncFilterBypass,
        filterQInput: syncFilterBypass,
        preGainInput: syncPreGainBypass,
        noiseGateInput: syncNoiseGateBypass,
        highCutInput: syncHighCutBypass,
        measurementWindowInput: syncMeasurementBypass,
        sineRetriggerCents: () => syncRetriggerBypass("sineRetriggerCents"),
        sineRetriggerMs: () => syncRetriggerBypass("sineRetriggerMs"),
        sineDropCents: () => syncRetriggerBypass("sineDropCents"),
        micToleranceSlider: syncToleranceBypass
    };
    Object.entries(bypassHandlers).forEach(([id, fn]) => {
        const toggle = bypassToggles[id];
        if (toggle) {
            micBypassState[id] = !toggle.checked;
            toggle.addEventListener("change", () => {
                micBypassState[id] = !toggle.checked;
                fn();
            });
        }
        fn();
    });
    micState.syncMicBypass = () => {
        syncFilterBypass();
        syncPreGainBypass();
        syncNoiseGateBypass();
        syncHighCutBypass();
        syncMeasurementBypass();
        syncToleranceBypass();
        syncRetriggerBypass("sineRetriggerCents");
        syncRetriggerBypass("sineRetriggerMs");
        syncRetriggerBypass("sineDropCents");
    };
    micState.syncMicBypass();
    if (!toggleBtn || !noteEl || !detuneEl || !canvas) return;

    micState.canvas = canvas;
    micState.ctx = canvas.getContext("2d");
    micState.pitchBuffer = new Float32Array(2048);
    micState.buffer = new Float32Array(2048);
    resizeMicCanvas();
    window.addEventListener("resize", resizeMicCanvas);

    canvas.addEventListener("click", () => {
        intervalTrackingEnabled = true;
        intervalOneShot = true;
        intervalHistory = [];
        renderIntervalHistory();
    });

    toggleBtn.addEventListener("click", async () => {
        if (micState.running) {
            stopMicTuner(noteEl, detuneEl, toggleBtn, freqEl);
            chipMic?.classList.remove("on");
        } else {
            const ok = await startMicTuner(noteEl, detuneEl, toggleBtn, permBtn, freqEl);
            if (!ok && detuneEl) {
                detuneEl.textContent = "Mic blockiert";
                chipMic?.classList.remove("on");
            }
            if (ok) chipMic?.classList.add("on");
        }
    });

    if (intervalBtn) {
        intervalBtn.textContent = "Letzte Intervalle";
        intervalBtn.addEventListener("click", () => {
            const modes = ["off", "manual", "auto"];
            const next = modes[(modes.indexOf(intervalMode) + 1) % modes.length];
            intervalMode = next;
            intervalTrackingEnabled = intervalMode !== "off";
            intervalOneShot = intervalMode === "manual";
            intervalHistory = [];
            lastIntervalMidi = null;
            lastIntervalTime = 0;
            const labels = { off: "Intervalle: aus", manual: "Intervalle: Klick", auto: "Intervalle: auto" };
            intervalBtn.textContent = labels[intervalMode] || "Intervalle";
            renderIntervalHistory();
        });
    }

    bindDualInput(intervalHoldInput, intervalHoldSlider,
        v => Math.max(50, Math.min(2000, v || 0)),
        v => { intervalHoldMs = v; });

    bindDualInput(intervalChangeInput, intervalChangeSlider,
        v => Math.max(80, Math.min(2000, v || 0)),
        v => { intervalChangeMs = v; });

    bindDualInput(intervalSilenceInput, intervalSilenceSlider,
        v => Math.max(80, Math.min(4000, v || 0)),
        v => { intervalSilenceMs = v; });

    if (filterFreqInput) {
        filterFreqInput.addEventListener("input", () => {
            const v = Number(filterFreqInput.value);
            if (micState.filter && Number.isFinite(v)) micState.filter.frequency.value = v;
            updateKnobVisual(filterFreqInput);
        });
        filterFreqInput.value = filterFreqInput.value || 600;
        attachKnob(filterFreqInput);
    }
    if (filterQInput) {
        filterQInput.addEventListener("input", () => {
            const v = Number(filterQInput.value);
            if (micState.filter && Number.isFinite(v)) micState.filter.Q.value = v;
            updateKnobVisual(filterQInput);
        });
        filterQInput.value = filterQInput.value || 0.9;
        attachKnob(filterQInput);
    }
    if (preGainInput) {
        preGainInput.addEventListener("input", () => {
            const v = Number(preGainInput.value);
            if (micState.gainNode && Number.isFinite(v)) {
                micPreGain = Math.max(0, Math.min(3, v));
                micState.gainNode.gain.value = micPreGain;
            }
            updateKnobVisual(preGainInput);
        });
        attachKnob(preGainInput);
    }
    if (noiseGateInput) {
        noiseGateInput.addEventListener("input", () => {
            const v = Number(noiseGateInput.value);
            if (Number.isFinite(v)) micNoiseGate = Math.max(0.001, Math.min(0.1, v));
            updateKnobVisual(noiseGateInput);
        });
        noiseGateInput.value = noiseGateInput.value || micNoiseGate;
        attachKnob(noiseGateInput);
    }
    bindDualInput(micToleranceInput, micToleranceSlider,
        v => Math.max(2, Math.min(50, v || 0)),
        v => { micToleranceCents = v; });

    if (micPreviewButton) {
        micPreviewButton.addEventListener("click", () => {
            micPreviewEnabled = !micPreviewEnabled;
            micPreviewButton.textContent = micPreviewEnabled ? "Mic-Preview: an" : "Mic-Preview: aus";
        });
        micPreviewButton.textContent = micPreviewEnabled ? "Mic-Preview: an" : "Mic-Preview: aus";
    }
    if (micPreviewGainInput) {
        micPreviewGain = Number(micPreviewGainInput.value) || micPreviewGain;
        micPreviewGainInput.addEventListener("input", () => {
            const v = Number(micPreviewGainInput.value);
            if (Number.isFinite(v)) micPreviewGain = Math.max(0.005, Math.min(0.3, v));
            updateKnobVisual(micPreviewGainInput);
            refreshValueBadge("micPreviewGainInput");
        });
        attachKnob(micPreviewGainInput);
        refreshValueBadge("micPreviewGainInput");
    }
    if (micSineButton) {
        micSineButton.addEventListener("click", () => {
            micSineEnabled = !micSineEnabled;
            if (!micSineEnabled) {
                stopMicSine();
            } else if (Number.isFinite(lastDetectedMidi) && activeSineOffsets.size) {
                updateMicSine(midiToFrequency(lastDetectedMidi), lastDetectedMidi);
            }
            updateSineUI();
        });
        updateSineUI();
    }
    if (tunerResetButton) {
        tunerResetButton.addEventListener("click", () => {
            if (filterFreqInput) filterFreqInput.value = 1000;
            if (filterQInput) filterQInput.value = 1;
            if (preGainInput) preGainInput.value = micPreGain;
            if (noiseGateInput) noiseGateInput.value = micNoiseGate;
            if (intervalHoldInput) intervalHoldInput.value = 200;
            if (intervalHoldSlider) intervalHoldSlider.value = 200;
            if (intervalChangeInput) intervalChangeInput.value = 350;
            if (intervalChangeSlider) intervalChangeSlider.value = 350;
            if (intervalSilenceInput) intervalSilenceInput.value = 500;
            if (intervalSilenceSlider) intervalSilenceSlider.value = 500;
            if (micToleranceInput) micToleranceInput.value = 12;
            if (micToleranceSlider) micToleranceSlider.value = 12;
            if (highCutInput) highCutInput.value = 1600;
            if (measurementWindowInput) measurementWindowInput.value = 48;
            micPreGain = 1.5;
            micNoiseGate = 0.006;
            intervalHoldMs = 200;
            intervalChangeMs = 350;
            intervalSilenceMs = 500;
            micToleranceCents = 12;
            micHighCut = 1600;
            measurementWindowMs = 48;
            micSineEnabled = false;
            activeSineOffsets.clear();
            lastSineValidTime = 0;
            monitorPreActive = false;
            monitorPostActive = false;
            updateMonitorButtons(monitorPreButton, monitorPostButton);
            stopMicSine();
            if (micState.filter) {
                micState.filter.frequency.value = 600;
                micState.filter.Q.value = 0.9;
            }
            if (micState.lowpass) micState.lowpass.frequency.value = micHighCut;
            if (micState.gainNode) micState.gainNode.gain.value = micPreGain;
            intervalMode = "manual";
            intervalTrackingEnabled = true;
            intervalOneShot = true;
            intervalHistory = [];
            renderIntervalHistory();
            if (intervalBtn) intervalBtn.textContent = "Intervalle: Klick";
            if (micPreviewButton) micPreviewButton.textContent = micPreviewEnabled ? "Mic-Preview: an" : "Mic-Preview: aus";
            ["filterFreqInput","filterQInput","preGainInput","noiseGateInput","highCutInput","measurementWindowInput","micToleranceSlider","sineRetriggerCents","sineRetriggerMs","sineDropCents"].forEach(refreshValueBadge);
            updateSineUI();
        });
    }

    if (highCutInput) {
        if (Number.isFinite(Number(highCutInput.value))) {
            micHighCut = Math.max(400, Math.min(3200, Number(highCutInput.value)));
        }
        highCutInput.addEventListener("input", () => {
            const v = Number(highCutInput.value);
            if (Number.isFinite(v)) {
                micHighCut = Math.max(400, Math.min(3200, v));
                if (micState.lowpass) micState.lowpass.frequency.value = micHighCut;
            }
        });
        attachKnob(highCutInput);
    }

    if (monitorPreButton) {
        monitorPreButton.addEventListener("click", () => {
            monitorPreActive = !monitorPreActive;
            updateMonitorRouting();
            updateMonitorButtons(monitorPreButton, monitorPostButton);
        });
    }
    if (monitorPostButton) {
        monitorPostButton.addEventListener("click", () => {
            monitorPostActive = !monitorPostActive;
            updateMonitorRouting();
            updateMonitorButtons(monitorPreButton, monitorPostButton);
        });
    }
    if (monitorGainInput) {
        monitorGainLevel = Number(monitorGainInput.value) || 0.6;
        monitorGainInput.addEventListener("input", () => {
            const v = Number(monitorGainInput.value);
            if (Number.isFinite(v)) {
                monitorGainLevel = Math.max(0, Math.min(1, v));
                if (micState.monitorGain) micState.monitorGain.gain.value = monitorGainLevel;
            }
            updateKnobVisual(monitorGainInput);
        });
        updateKnobVisual(monitorGainInput);
    }
    if (multiToneButton) {
        const sync = () => { multiToneButton.textContent = multiToneEnabled ? "Multi-Tone: an" : "Multi-Tone: aus"; };
        multiToneButton.addEventListener("click", () => {
            multiToneEnabled = !multiToneEnabled;
            sync();
            updateMultiToneList([]);
        });
        sync();
    }
    if (harmonicFilterButton) {
        const sync = () => { harmonicFilterButton.textContent = harmonicFilterEnabled ? "Timbre-Filter: an" : "Timbre-Filter: aus"; };
        harmonicFilterButton.addEventListener("click", () => { harmonicFilterEnabled = !harmonicFilterEnabled; sync(); });
        sync();
    }
    if (overtoneOverlayButton) {
        const sync = () => { overtoneOverlayButton.textContent = overtoneOverlayEnabled ? "Obertöne sichtbar" : "Obertöne anzeigen"; };
        overtoneOverlayButton.addEventListener("click", () => { overtoneOverlayEnabled = !overtoneOverlayEnabled; sync(); });
        sync();
    }
    if (multiToneSensitivityInput) {
        multiToneSensitivity = Number(multiToneSensitivityInput.value) || multiToneSensitivity;
        multiToneSensitivityInput.addEventListener("input", () => {
            const v = Number(multiToneSensitivityInput.value);
            if (Number.isFinite(v)) multiToneSensitivity = Math.max(0, Math.min(1, v));
            updateKnobVisual(multiToneSensitivityInput);
        });
        updateKnobVisual(multiToneSensitivityInput);
    }
    if (harmonicNotchInput) {
        harmonicNotch = Number(harmonicNotchInput.value) || harmonicNotch;
        harmonicNotchInput.addEventListener("input", () => {
            const v = Number(harmonicNotchInput.value);
            if (Number.isFinite(v)) harmonicNotch = Math.max(0, Math.min(1, v));
            updateKnobVisual(harmonicNotchInput);
        });
        updateKnobVisual(harmonicNotchInput);
    }
    if (overtoneBlendInput) {
        overtoneBlend = Number(overtoneBlendInput.value) || overtoneBlend;
        overtoneBlendInput.addEventListener("input", () => {
            const v = Number(overtoneBlendInput.value);
            if (Number.isFinite(v)) overtoneBlend = Math.max(0, Math.min(1, v));
            updateKnobVisual(overtoneBlendInput);
        });
        updateKnobVisual(overtoneBlendInput);
    }
    if (notchRemoveToggle) {
        notchEnabled = !!notchRemoveToggle.checked;
        notchRemoveToggle.addEventListener("change", () => {
            notchEnabled = !!notchRemoveToggle.checked;
            updateNotchFilter(notchMode === "manual" ? notchManualFreq : lastDetectedFreq);
        });
    }
    notchFreqInputEl = notchFreqInput;
    if (notchModeSelect) {
        notchMode = notchModeSelect.value || notchMode;
        notchModeSelect.addEventListener("change", () => {
            notchMode = notchModeSelect.value || notchMode;
            updateNotchFilter(notchMode === "manual" ? notchManualFreq : lastDetectedFreq);
        });
    }
    if (notchFilterTypeSelect) {
        notchFilterType = notchFilterTypeSelect.value || notchFilterType;
        notchFilterTypeSelect.addEventListener("change", () => {
            notchFilterType = notchFilterTypeSelect.value || notchFilterType;
            updateNotchFilter(notchMode === "manual" ? notchManualFreq : lastDetectedFreq);
        });
    }
    if (notchFreqInput) {
        notchManualFreq = Number(notchFreqInput.value) || notchManualFreq;
        notchFreqInput.addEventListener("input", () => {
            const v = Number(notchFreqInput.value);
            if (Number.isFinite(v)) notchManualFreq = Math.max(20, Math.min(5000, v));
            if (notchMode === "manual") updateNotchFilter(notchManualFreq);
        });
    }
    if (notchQInput) {
        notchQ = Number(notchQInput.value) || notchQ;
        notchQInput.addEventListener("input", () => {
            const v = Number(notchQInput.value);
            if (Number.isFinite(v)) notchQ = Math.max(1, Math.min(50, v));
            updateNotchFilter(notchMode === "manual" ? notchManualFreq : lastDetectedFreq);
        });
    }
    if (notchCutInput) {
        notchCutDb = Number(notchCutInput.value) || notchCutDb;
        notchCutInput.addEventListener("input", () => {
            const v = Number(notchCutInput.value);
            if (Number.isFinite(v)) notchCutDb = Math.max(NOTCH_MIN_DB, Math.min(0, v));
            updateNotchFilter(notchMode === "manual" ? notchManualFreq : lastDetectedFreq);
        });
    }
    if (waveFullscreenBtn) {
        waveFullscreenBtn.addEventListener("click", evt => {
            evt.stopPropagation();
            const tuner = waveFullscreenBtn.closest(".mic-tuner") || document.getElementById("micTuner");
            if (!tuner) return;
            const inFullscreen = tuner.classList.contains("fullscreen");
            const graphOnly = tuner.classList.contains("graph-only");
            if (!inFullscreen) {
                tuner.classList.add("fullscreen");
                tuner.classList.remove("graph-only");
            } else if (!graphOnly) {
                tuner.classList.add("graph-only");
            } else {
                tuner.classList.remove("fullscreen");
                tuner.classList.remove("graph-only");
            }
            resizeMicCanvas();
        });
    }
    if (waveLineWidthInput) {
        waveLineWidthInput.addEventListener("input", () => {
            const v = Number(waveLineWidthInput.value);
            if (Number.isFinite(v)) waveStyle.lineWidth = Math.max(1, Math.min(8, v));
            updateKnobVisual(waveLineWidthInput);
        });
        attachKnob(waveLineWidthInput);
    }
    if (waveScaleXInput) {
        waveScaleXInput.addEventListener("input", () => {
            const v = Number(waveScaleXInput.value);
            if (Number.isFinite(v)) waveStyle.scaleX = Math.max(0.5, Math.min(3, v));
            updateKnobVisual(waveScaleXInput);
        });
        attachKnob(waveScaleXInput);
    }
    if (waveScaleYInput) {
        waveScaleYInput.addEventListener("input", () => {
            const v = Number(waveScaleYInput.value);
            if (Number.isFinite(v)) waveStyle.scaleY = Math.max(0.5, Math.min(3, v));
            updateKnobVisual(waveScaleYInput);
        });
        attachKnob(waveScaleYInput);
    }
    if (fftSmoothingInput) {
        const clampSmoothing = v => Math.max(0, Math.min(0.95, v));
        fftSmoothing = clampSmoothing(Number(fftSmoothingInput.value) || fftSmoothing);
        const apply = () => {
            if (micState.preAnalyser) micState.preAnalyser.smoothingTimeConstant = fftSmoothing;
            if (micState.analyser) micState.analyser.smoothingTimeConstant = fftSmoothing;
        };
        fftSmoothingInput.addEventListener("input", () => {
            const v = Number(fftSmoothingInput.value);
            if (Number.isFinite(v)) fftSmoothing = clampSmoothing(v);
            apply();
            updateKnobVisual(fftSmoothingInput);
        });
        apply();
        updateKnobVisual(fftSmoothingInput);
    }
    if (sineLowpassInput) {
        sineLowpassHz = Number(sineLowpassInput.value) || 1800;
        sineLowpassInput.addEventListener("input", () => {
            const v = Number(sineLowpassInput.value);
            if (Number.isFinite(v)) {
                sineLowpassHz = Math.max(200, Math.min(5000, v));
                updateSineVoiceParams();
            }
        });
        attachKnob(sineLowpassInput);
    }
    if (measurementWindowInput) {
        measurementWindowMs = Number(measurementWindowInput.value) || measurementWindowMs;
        measurementWindowInput.addEventListener("input", () => {
            const v = Number(measurementWindowInput.value);
            if (Number.isFinite(v)) {
                measurementWindowMs = Math.max(20, Math.min(200, v));
                resizeMicBuffer();
            }
        });
        attachKnob(measurementWindowInput);
    }
    if (sineGainInput) {
        micSineGain = Number(sineGainInput.value) || micSineGain;
        sineGainInput.addEventListener("input", () => {
            const v = Number(sineGainInput.value);
            if (Number.isFinite(v)) {
                micSineGain = Math.max(0.005, Math.min(0.3, v));
                updateSineVoiceParams();
            }
        });
        attachKnob(sineGainInput);
    }
    if (sineGlideInput) {
        micSineGlideMs = Number(sineGlideInput.value) || micSineGlideMs;
        sineGlideInput.addEventListener("input", () => {
            const v = Number(sineGlideInput.value);
            if (Number.isFinite(v)) micSineGlideMs = Math.max(2, Math.min(400, v));
        });
        attachKnob(sineGlideInput);
    }
    if (sineHoldInput) {
        sineHoldMs = Number(sineHoldInput.value) || sineHoldMs;
        sineHoldInput.addEventListener("input", () => {
            const v = Number(sineHoldInput.value);
            if (Number.isFinite(v)) sineHoldMs = Math.max(50, Math.min(1200, v));
        });
        attachKnob(sineHoldInput);
    }
    if (sineRetriggerCentsInput) {
        sineRetriggerCents = Number(sineRetriggerCentsInput.value) || sineRetriggerCents;
        sineRetriggerCentsInput.addEventListener("input", () => {
            const v = Number(sineRetriggerCentsInput.value);
            if (Number.isFinite(v)) sineRetriggerCents = Math.max(0, Math.min(200, v));
        });
        attachKnob(sineRetriggerCentsInput);
    }
    if (sineRetriggerMsInput) {
        sineRetriggerMs = Number(sineRetriggerMsInput.value) || sineRetriggerMs;
        sineRetriggerMsInput.addEventListener("input", () => {
            const v = Number(sineRetriggerMsInput.value);
            if (Number.isFinite(v)) sineRetriggerMs = Math.max(0, Math.min(4000, v));
        });
        attachKnob(sineRetriggerMsInput);
    }
    if (sineDropCentsInput) {
        sineDropCents = Number(sineDropCentsInput.value) || sineDropCents;
        sineDropCentsInput.addEventListener("input", () => {
            const v = Number(sineDropCentsInput.value);
            if (Number.isFinite(v)) sineDropCents = Math.max(0, Math.min(200, v));
        });
        attachKnob(sineDropCentsInput);
    }
    if (sineRetriggerToggle) {
        sineRetriggerEnabled = !!sineRetriggerToggle.checked;
        sineRetriggerToggle.addEventListener("change", () => {
            sineRetriggerEnabled = !!sineRetriggerToggle.checked;
        });
    }
    if (sineExactToggle) {
        sineExactHold = !!sineExactToggle.checked;
        sineExactToggle.addEventListener("change", () => {
            sineExactHold = !!sineExactToggle.checked;
        });
    }
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    if (sineAttackInput) {
        sineParams.attackMs = Number(sineAttackInput.value) || sineParams.attackMs;
        sineAttackInput.addEventListener("input", () => {
            const v = Number(sineAttackInput.value);
            if (Number.isFinite(v)) sineParams.attackMs = clamp(v, 1, 400);
        });
        attachKnob(sineAttackInput);
    }
    if (sineReleaseInput) {
        sineParams.releaseMs = Number(sineReleaseInput.value) || sineParams.releaseMs;
        sineReleaseInput.addEventListener("input", () => {
            const v = Number(sineReleaseInput.value);
            if (Number.isFinite(v)) sineParams.releaseMs = clamp(v, 10, 1200);
        });
        attachKnob(sineReleaseInput);
    }
    if (sineWaveInput) {
        sineParams.wave = sineWaveInput.value || "sine";
        sineWaveInput.addEventListener("change", () => {
            sineParams.wave = sineWaveInput.value || "sine";
            updateSineVoiceParams(true);
        });
    }
    if (phaseModeButton) {
        phaseModeButton.style.display = "none";
        phaseDetectionEnabled = false;
    }
    if (waveMirrorButton) {
        const syncMirror = () => waveMirrorButton.textContent = waveStyle.mirror ? "Spiegeln: an" : "Spiegeln: aus";
        waveMirrorButton.addEventListener("click", () => {
            waveStyle.mirror = !waveStyle.mirror;
            syncMirror();
        });
        syncMirror();
    }
    const chordCard = document.querySelector(".chord-widget");
    if (chordCard) {
        frontZIndex += 5;
        chordCard.style.zIndex = String(frontZIndex);
    }
    sineButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const offset = Number(btn.dataset.sineOffset);
            toggleSineOffset(offset);
        });
    });
    if (micSettingsCollapse) {
        const tuner = micSettingsCollapse.closest(".mic-tuner");
        const sync = () => {
            const collapsed = tuner?.classList.contains("collapsed-settings");
            micSettingsCollapse.textContent = collapsed ? "Einstellungen einblenden" : "Einstellungen ausblenden";
        };
        if (tuner && !tuner.classList.contains("collapsed-settings")) {
            tuner.classList.add("collapsed-settings");
        }
        micSettingsCollapse.addEventListener("click", () => {
            if (!tuner) return;
            tuner.classList.toggle("collapsed-settings");
            sync();
        });
        sync();
    }
    if (checkHeadphoneButton) {
        checkHeadphoneButton.addEventListener("click", () => checkHeadphones(headphoneStatus));
    }
    checkHeadphones(headphoneStatus);
}

function resizeMicCanvas() {
    if (!micState.canvas) return;
    micState.canvas.width = micState.canvas.clientWidth;
    micState.canvas.height = micState.canvas.clientHeight;
}

function resizeMicBuffer() {
    if (!micState.preAnalyser && !micState.analyser) return;
    const ctx = ensureAudioContext();
    const bufSize = bufferSizeFromMs(measurementWindowMs, ctx.sampleRate);
    if (micState.preAnalyser) {
        micState.preAnalyser.fftSize = bufSize;
        micState.preAnalyser.smoothingTimeConstant = fftSmoothing;
        micState.pitchBuffer = new Float32Array(bufSize);
        micState.freqBuffer = new Float32Array(micState.preAnalyser.frequencyBinCount);
    }
    if (micState.analyser) {
        micState.analyser.fftSize = bufSize;
        micState.analyser.smoothingTimeConstant = fftSmoothing;
        micState.buffer = new Float32Array(bufSize);
        if (!micState.preAnalyser) {
            micState.freqBuffer = new Float32Array(micState.analyser.frequencyBinCount);
        }
    }
}

async function startMicTuner(noteEl, detuneEl, toggleBtn, permBtn, freqEl) {
    try {
        const ctx = ensureAudioContext();
        await resumeAudioContextIfNeeded();
        const permOk = await requestMicPermission(detuneEl, permBtn);
        if (permOk === false) return false;

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            }
        });
        const preAnalyser = ctx.createAnalyser();
        const analyser = ctx.createAnalyser();
        const bufSize = bufferSizeFromMs(measurementWindowMs, ctx.sampleRate);
        [preAnalyser, analyser].forEach(node => {
            node.fftSize = bufSize;
            node.minDecibels = -90;
            node.maxDecibels = -10;
            node.smoothingTimeConstant = fftSmoothing;
        });

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 600;
        filter.Q.value = 0.9;

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.value = micHighCut;

        const notch = ctx.createBiquadFilter();
        notch.type = "allpass";
        notch.frequency.value = notchManualFreq;
        notch.Q.value = notchQ;
        notch.gain.value = notchCutDb;

        const notchGain = ctx.createGain();
        notchGain.gain.value = 1;

        const gainNode = ctx.createGain();
        gainNode.gain.value = micPreGain;

        const monitorPre = ctx.createGain();   // raw mic
        monitorPre.gain.value = monitorPreActive ? 0.4 : 0;
        const monitorPost = ctx.createGain();  // post FX
        monitorPost.gain.value = monitorPostActive ? 0.4 : 0;
        const monitorGain = ctx.createGain();  // shared headphone gain
        monitorGain.gain.value = monitorGainLevel;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(monitorPre);
        source.connect(gainNode);

        gainNode.connect(filter);
        filter.connect(lowpass);
        lowpass.connect(preAnalyser);
        lowpass.connect(notch);
        notch.connect(notchGain);
        notchGain.connect(analyser);
        notchGain.connect(monitorPost);
        monitorPre.connect(monitorGain);
        monitorPost.connect(monitorGain);
        monitorGain.connect(ctx.destination);

        micState = {
            ...micState,
            preAnalyser,
            analyser,
            filter,
            lowpass,
            notch,
            notchGain,
            gainNode,
            monitorPre,
            monitorPost,
            monitorGain,
            source,
            stream,
            running: true,
            lastUpdate: 0,
            pitchBuffer: new Float32Array(bufSize),
            buffer: new Float32Array(bufSize),
            freqBuffer: new Float32Array(preAnalyser.frequencyBinCount)
        };

        micState.syncMicBypass?.();
        updateNotchFilter(notchMode === "manual" ? notchManualFreq : lastDetectedFreq);

        toggleBtn.textContent = "Mic aus";
        detuneEl.textContent = "Höre zu …";
        if (freqEl) freqEl.textContent = "– Hz";
        permBtn?.setAttribute("disabled", "disabled");
        requestAnimationFrame(time => updateMicPitch(time, noteEl, detuneEl, freqEl));
        return true;
    } catch (err) {
        console.error("Mic error", err);
        if (detuneEl) {
            detuneEl.textContent = "Mic blockiert";
        }
        permBtn?.removeAttribute("disabled");
        micState.running = false;
        return false;
    }
}

function stopMicTuner(noteEl, detuneEl, toggleBtn, freqEl) {
    micState.running = false;
    if (micState.source) micState.source.disconnect();
    if (micState.filter) micState.filter.disconnect();
    if (micState.lowpass) micState.lowpass.disconnect();
    if (micState.notch) micState.notch.disconnect();
    if (micState.notchGain) micState.notchGain.disconnect();
    if (micState.preAnalyser) micState.preAnalyser.disconnect();
    if (micState.analyser) micState.analyser.disconnect();
    if (micState.monitorPre) micState.monitorPre.disconnect();
    if (micState.monitorPost) micState.monitorPost.disconnect();
    if (micState.monitorGain) micState.monitorGain.disconnect();
    if (micState.stream) {
        micState.stream.getTracks().forEach(t => t.stop());
    }
    micState.stream = null;
    micState.source = null;
    micState.filter = null;
    micState.lowpass = null;
    micState.notch = null;
    micState.notchGain = null;
    micState.monitorPre = null;
    micState.monitorPost = null;
    micState.monitorGain = null;
    micState.preAnalyser = null;
    micState.analyser = null;
    micState.pitchBuffer = null;
    micState.freqBuffer = null;
    toggleBtn.textContent = "Mic an";
    noteEl.textContent = "–";
    detuneEl.textContent = "Bereit";
    if (freqEl) freqEl.textContent = "– Hz";
    clearMicCanvas();
    stopMicSine();
    lastDetectedMidi = null;
    lastDetectedFreq = null;
}

function stopMicSine() {
    if (micSineVoices.size) {
        micSineVoices.forEach(handle => {
            const { gain, osc, ctx, lfoVib, lfoTrem } = handle;
            const now = ctx.currentTime;
            const rel = Math.max(0.01, (sineParams.releaseMs || 120) / 1000);
            try { lfoVib?.stop(now + rel); } catch (e) { /* ignore */ }
            try { lfoTrem?.stop(now + rel); } catch (e) { /* ignore */ }
            try {
                gain.gain.setTargetAtTime(0.0001, now, rel / 3);
                osc.stop(now + rel);
            } catch (e) {
                // ignore
            }
        });
    }
    micSineVoices.clear();
    micSineFreq = null;
}

function updateMicSine(freq, midiOverride = null) {
    if (!micSineEnabled) {
        stopMicSine();
        return;
    }
    if ((!Number.isFinite(freq) || freq <= 0) && !Number.isFinite(midiOverride)) {
        stopMicSine();
        return;
    }
    const freqVal = Number.isFinite(freq) && freq > 0 ? freq : NaN;
    if (!activeSineOffsets.size) {
        stopMicSine();
        return;
    }
    const baseMidi = Number.isFinite(midiOverride) ? midiOverride : (Number.isFinite(freqVal) ? noteFromPitch(freqVal) : NaN);
    if (!Number.isFinite(baseMidi)) {
        stopMicSine();
        return;
    }
    const ctx = ensureAudioContext();
    const glide = Math.max(0.002, (micSineGlideMs || 40) / 1000);
    activeSineOffsets.forEach(offset => {
        const targetMidi = clampMidi(baseMidi + offset);
        const target = Math.max(20, Math.min(4000, midiToFrequency(targetMidi)));
        let handle = micSineVoices.get(offset);
        if (handle) {
            applyVoiceParams(handle, target, glide);
            return;
        }
        handle = buildSineVoice(ctx, target);
        micSineVoices.set(offset, handle);
    });
    micSineFreq = freqVal;
}

function updateMonitorRouting() {
    const ctx = ensureAudioContext();
    if (!micState || !micState.monitorPre || !micState.monitorPost) return;
    micState.monitorPre.gain.value = monitorPreActive ? 0.4 : 0;
    micState.monitorPost.gain.value = monitorPostActive ? 0.4 : 0;
    // keep connections stable; just adjust gain
}

function updateMonitorButtons(preBtn, postBtn) {
    if (preBtn) preBtn.textContent = monitorPreActive ? "Monitor: vor FX an" : "Monitor: vor FX aus";
    if (postBtn) postBtn.textContent = monitorPostActive ? "Monitor: nach FX an" : "Monitor: nach FX aus";
}

function formatPeakLabel(freq) {
    if (!Number.isFinite(freq) || freq <= 0) return "–";
    const midi = noteFromPitch(freq);
    if (!Number.isFinite(midi)) return `${freq.toFixed(1)} Hz`;
    const note = midiToNote(midi);
    if (!note) return `${freq.toFixed(1)} Hz`;
    return `${note.name}${note.octave}`;
}

function updateMultiToneList(peaks = []) {
    if (!multiToneListEl) return;
    if (!multiToneEnabled) {
        multiToneListEl.textContent = "Multi-Tone aus.";
        return;
    }
    if (!peaks.length) {
        multiToneListEl.textContent = "Keine Peaks erkannt.";
        return;
    }
    multiToneListEl.innerHTML = "";
    peaks.forEach(peak => {
        const row = document.createElement("div");
        const noteLabel = formatPeakLabel(peak.freq);
        const hz = Number.isFinite(peak.freq) ? peak.freq.toFixed(1) : "–";
        const db = Number.isFinite(peak.db) ? peak.db.toFixed(1) : "–";
        row.textContent = `${noteLabel} · ${hz} Hz · ${db} dB`;
        multiToneListEl.appendChild(row);
    });
}

function collectTonePeaks() {
    if (!micState.preAnalyser && !micState.analyser) return [];
    const analyser = micState.preAnalyser || micState.analyser;
    if (!micState.freqBuffer || micState.freqBuffer.length !== analyser.frequencyBinCount) {
        micState.freqBuffer = new Float32Array(analyser.frequencyBinCount);
    }
    const data = micState.freqBuffer;
    analyser.getFloatFrequencyData(data);
    let maxDb = -Infinity;
    for (let i = 0; i < data.length; i++) {
        if (data[i] > maxDb) maxDb = data[i];
    }
    if (!Number.isFinite(maxDb)) return [];
    const thresholdDb = maxDb - (12 + (1 - multiToneSensitivity) * 38);
    const nyquist = analyser.context.sampleRate / 2;
    const binHz = nyquist / data.length;
    const peaks = [];
    for (let i = 1; i < data.length - 1; i++) {
        const db = data[i];
        if (db < thresholdDb || db < data[i - 1] || db < data[i + 1]) continue;
        const freq = i * binHz;
        if (freq < 30 || freq > 5000) continue;
        peaks.push({ freq, db });
    }
    peaks.sort((a, b) => b.db - a.db);
    const harmonicStrength = Math.max(0, Math.min(1, harmonicNotch || 0));
    if (harmonicStrength > 0 && peaks.length) {
        const baseFreq = peaks[0].freq;
        peaks.forEach(peak => {
            let score = peak.db;
            if (baseFreq && peak.freq !== baseFreq) {
                const ratio = peak.freq / baseFreq;
                const nearest = Math.round(ratio);
                const detune = Math.abs(ratio - nearest);
                if (nearest >= 2 && nearest <= 8 && detune < 0.035) {
                    const depth = (1 - detune / 0.035) * harmonicStrength;
                    score -= depth * 18;
                }
            }
            peak.scoreDb = score;
        });
        peaks.sort((a, b) => b.scoreDb - a.scoreDb);
    } else {
        peaks.forEach(peak => {
            peak.scoreDb = peak.db;
        });
    }
    const filtered = [];
    peaks.forEach(peak => {
        if (filtered.some(existing => Math.abs(existing.freq - peak.freq) < 18)) return;
        filtered.push(peak);
    });
    return filtered.slice(0, 6);
}

function pickNotchTarget(peaks = []) {
    if (!peaks.length) return null;
    if (notchMode === "lowest") {
        return peaks.reduce((best, cur) => (cur.freq < best.freq ? cur : best), peaks[0]);
    }
    if (notchMode === "highest") {
        return peaks.reduce((best, cur) => (cur.freq > best.freq ? cur : best), peaks[0]);
    }
    return peaks[0];
}

function updateNotchFilter(targetFreq) {
    const notch = micState.notch;
    const notchGain = micState.notchGain;
    if (!notch) return;
    const freq = Number.isFinite(targetFreq) ? targetFreq : notchManualFreq;
    const clampedFreq = Math.max(20, Math.min(5000, freq));
    if (notchFreqInputEl && notchMode !== "manual" && Number.isFinite(clampedFreq)) {
        const next = String(Math.round(clampedFreq));
        if (notchFreqInputEl.value !== next) notchFreqInputEl.value = next;
    }
    if (!notchEnabled) {
        notch.type = "allpass";
        if (notchGain) notchGain.gain.value = 1;
        return;
    }
    if (notchFilterType === "bandpass") {
        notch.type = "bandpass";
        notch.frequency.value = clampedFreq;
        notch.Q.value = notchQ;
        if (notchGain) {
            const gain = Math.pow(10, notchCutDb / 20);
            notchGain.gain.value = Math.max(0.0001, gain);
        }
    } else {
        notch.type = "peaking";
        notch.frequency.value = clampedFreq;
        notch.Q.value = notchQ;
        notch.gain.value = notchCutDb;
        if (notchGain) notchGain.gain.value = 1;
    }
}

function updateMicPitch(time, noteEl, detuneEl, freqEl) {
    const pitchAnalyser = micState.preAnalyser || micState.analyser;
    const pitchBuffer = micState.pitchBuffer || micState.buffer;
    if (!micState.running || !pitchAnalyser || !pitchBuffer) return;
    const UPDATE_MS = 90;
    if (time - micState.lastUpdate < UPDATE_MS) {
        requestAnimationFrame(t => updateMicPitch(t, noteEl, detuneEl, freqEl));
        return;
    }
    micState.lastUpdate = time;

    pitchAnalyser.getFloatTimeDomainData(pitchBuffer);
    const rms = Math.sqrt(pitchBuffer.reduce((acc, v) => acc + v * v, 0) / pitchBuffer.length);
    const gate = micBypassState.noiseGateInput ? 0 : micNoiseGate;
    if (rms < gate) {
        noteEl.textContent = "–";
        detuneEl.textContent = "Zu leise";
        if (freqEl) freqEl.textContent = "– Hz";
        if (multiToneEnabled) updateMultiToneList([]);
        const now = performance.now();
        if (now - lastSineValidTime > sineHoldMs) {
            stopMicSine();
        }
        if (intervalMode === "auto") {
            const now = performance.now();
            if (now - lastIntervalTime >= intervalSilenceMs) {
                lastIntervalMidi = null;
                intervalOneShot = true;
                lastSilenceTime = now;
            }
        }
        clearMicCanvas();
        requestAnimationFrame(t => updateMicPitch(t, noteEl, detuneEl, freqEl));
        return;
    }

    const sampleRate = ensureAudioContext().sampleRate;
    let rawFreq = phaseDetectionEnabled
        ? estimatePitchPhase(pitchBuffer, sampleRate)
        : autoCorrelate(pitchBuffer, sampleRate);
    if (rawFreq <= 0 || !Number.isFinite(rawFreq)) {
        rawFreq = autoCorrelate(pitchBuffer, sampleRate); // fallback
    }
    const { freq, midi: correctedMidi } = chooseStableMidi(rawFreq, lastDetectedMidi);

    if (freq <= 0 || !Number.isFinite(freq)) {
        noteEl.textContent = "–";
        detuneEl.textContent = "Erkenne…";
        if (freqEl) freqEl.textContent = "– Hz";
        waveAccuracy = Math.max(0, waveAccuracy - 0.02);
        if (multiToneEnabled) updateMultiToneList([]);
        const now = performance.now();
        if (now - lastSineValidTime > sineHoldMs) {
            stopMicSine();
        }
    } else {
        const midi = correctedMidi;
        lastSineValidTime = performance.now();
        const cents = centsOffFromPitch(freq, midi);
        const tol = micBypassState.micToleranceSlider ? 1200 : micToleranceCents;
        const arrow = Math.abs(cents) <= tol ? "✓" : cents > 0 ? "↑" : "↓";
        const { name, octave } = midiToNote(midi);
        noteEl.textContent = name + octave;
        detuneEl.textContent = arrow + " " + cents.toFixed(1) + "¢";
        if (freqEl) freqEl.textContent = `${freq.toFixed(1)} Hz`;
        const dev = Math.min(60, Math.abs(cents));
        waveAccuracy = Math.max(0, 1 - dev / 60);
        micState.bgHue = Number(midiToHue(midi)) || 200;
        lastDetectedMidi = midi;
        lastDetectedFreq = freq;
        if (intervalMode === "auto") {
            const now = performance.now();
            if (lastIntervalMidi === null || midi !== lastIntervalMidi) {
                if (now - lastIntervalTime >= intervalChangeMs) {
                    intervalOneShot = true;
                }
            }
        }
        if (shouldRetriggerSine(midi, cents)) {
            updateMicSine(freq, midi);
            lastSineTriggerMidi = midi;
            lastSineTriggerTime = performance.now();
        }
        recordInterval(midi, "mic");
        highlightUkuleleForMidi(midi, { scroll: false });
        pressPianoKey(midi, 180);
        if (recordingEnabled) {
            addMicNoteToTracks(midi, { source: "mic" });
            if (micPreviewEnabled) {
                ensureAudioContext();
                playPluckedUkulele(midiToFrequency(midi), getUnitMs() * 0.6, { peakGain: micPreviewGain, attackMs: 12 });
            }
        } else {
            renderStaffPreview(midi, getActiveTrack());
        }
    }

    if (multiToneEnabled || (notchEnabled && notchMode !== "manual")) {
        const peaks = collectTonePeaks();
        if (multiToneEnabled) updateMultiToneList(peaks);
        if (notchMode !== "manual" && (notchEnabled || notchFreqInputEl)) {
            const target = pickNotchTarget(peaks);
            const fallback = Number.isFinite(lastDetectedFreq) ? lastDetectedFreq : notchManualFreq;
            updateNotchFilter(target ? target.freq : fallback);
        }
    }

    if (micState.analyser && micState.buffer) {
        micState.analyser.getFloatTimeDomainData(micState.buffer);
    }
    drawMicWaveform();
    requestAnimationFrame(t => updateMicPitch(t, noteEl, detuneEl, freqEl));
}

function drawMicWaveform() {
    if (!micState.canvas || !micState.ctx || !micState.buffer) return;
    const ctx = micState.ctx;
    const { width, height } = micState.canvas;
    const baseMidi = Number.isFinite(lastDetectedMidi) ? lastDetectedMidi : 60;
    const baseColor = midiToColor(baseMidi) || "#1c2438";
    const toRgba = (hex, alpha = 1) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return `rgba(28,36,56,${alpha})`;
        return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
    };
    const mixWithWhite = (hex, mix = 0.35, alpha = 0.4) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return `rgba(255,255,255,${alpha})`;
        const r = Math.round(rgb.r + (255 - rgb.r) * mix);
        const g = Math.round(rgb.g + (255 - rgb.g) * mix);
        const b = Math.round(rgb.b + (255 - rgb.b) * mix);
        return `rgba(${r},${g},${b},${alpha})`;
    };
    ctx.fillStyle = toRgba(baseColor, 0.65);
    ctx.fillRect(0, 0, width, height);
    const baseWidth = waveStyle.lineWidth || 2.5;
    ctx.lineWidth = (document.getElementById("micTuner")?.classList.contains("fullscreen")) ? Math.max(baseWidth, baseWidth + 1.5) : baseWidth;
    const alpha = 0.5 + 0.5 * (waveAccuracy || 0);
    ctx.strokeStyle = `hsla(0, 0%, 100%, ${alpha})`;
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 10 * (1 - (waveAccuracy || 0.5));
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.beginPath();
    const buf = micState.buffer;
    const scaleX = waveStyle.scaleX || 1;
    const step = (buf.length / width) / scaleX;
    for (let i = 0; i < width; i++) {
        const idx = Math.min(buf.length - 1, Math.max(0, Math.floor(i * step)));
        const raw = buf[idx] || 0;
        const v = waveStyle.mirror ? -raw : raw;
        const y = (0.5 + (v * (waveStyle.scaleY || 1)) / 2) * height;
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
    }
    ctx.stroke();

    if (overtoneOverlayEnabled) {
        const overlays = [0.55, 0.35, 0.2];
        overlays.forEach((mix, idx) => {
            ctx.beginPath();
            ctx.strokeStyle = mixWithWhite(baseColor, 0.1 + idx * 0.08, 0.12 + overtoneBlend * 0.4);
            ctx.lineWidth = Math.max(1, (waveStyle.lineWidth || 2) * (0.6 - idx * 0.1));
            ctx.shadowBlur = 6;
            for (let i = 0; i < width; i++) {
                const idxBuf = Math.min(buf.length - 1, Math.max(0, Math.floor(i * step)));
                const raw = buf[idxBuf] || 0;
                const v = waveStyle.mirror ? -raw : raw;
                const y = (0.5 + (v * (waveStyle.scaleY || 1) * mix) / 2) * height;
                if (i === 0) ctx.moveTo(i, y);
                else ctx.lineTo(i, y);
            }
            ctx.stroke();
        });
    }
}

function clearMicCanvas() {
    if (!micState.ctx || !micState.canvas) return;
    micState.ctx.clearRect(0, 0, micState.canvas.width, micState.canvas.height);
}

function bufferSizeFromMs(ms, sampleRate) {
    const samples = Math.max(256, Math.min(8192, Math.round((sampleRate || 44100) * (ms / 1000))));
    const pow = Math.pow(2, Math.round(Math.log2(samples)));
    return Math.max(256, Math.min(8192, pow));
}

function noteFromPitch(frequency) {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69;
}

function frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}

function centsOffFromPitch(frequency, note) {
    return (1200 * Math.log(frequency / frequencyFromNoteNumber(note))) / Math.log(2);
}

function autoCorrelate(buf, sampleRate) {
    let SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
        const val = buf[i];
        rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < SIZE / 2; i++) {
        if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }
    }

    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    const c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE - i; j++) {
            c[i] += buf[j] * buf[j + i];
        }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
        if (c[i] > maxval) {
            maxval = c[i];
            maxpos = i;
        }
    }
    let T0 = maxpos;
    const x1 = c[T0 - 1];
    const x2 = c[T0];
    const x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
}

function estimatePitchPhase(buf, sampleRate) {
    let crossings = [];
    let lastSign = Math.sign(buf[0] || 0);
    for (let i = 1; i < buf.length; i++) {
        const s = Math.sign(buf[i]);
        if (s === 0 || s === lastSign) continue;
        crossings.push(i);
        lastSign = s;
    }
    if (crossings.length < 2) return -1;
    let periods = 0;
    for (let i = 1; i < crossings.length; i++) {
        periods += crossings[i] - crossings[i - 1];
    }
    const avg = periods / (crossings.length - 1);
    if (avg <= 0) return -1;
    return sampleRate / (avg * 2);
}

function buildSineVoice(ctx, targetFreq) {
    const osc = ctx.createOscillator();
    osc.type = sineParams.wave || "sine";
    osc.frequency.value = targetFreq;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = sineLowpassHz || 1800;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    osc.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    const attack = Math.max(0.002, (sineParams.attackMs || 12) / 1000);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(micSineGain, now + attack);

    osc.start(now);

    return { osc, gain, lp, ctx, freq: targetFreq };
}

function applyVoiceParams(handle, targetFreq, glide) {
    const { osc, gain, lp, ctx } = handle;
    const now = ctx.currentTime;
    try {
        osc.type = sineParams.wave || "sine";
        osc.frequency.cancelScheduledValues(now);
        osc.frequency.linearRampToValueAtTime(targetFreq, now + glide);
        lp.frequency.value = sineLowpassHz || 1800;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(micSineGain, now, 0.02);
        handle.freq = targetFreq;
    } catch (e) {
        // ignore
    }
}

function averageHue(hues = []) {
    if (!hues.length) return 0;
    let x = 0, y = 0;
    hues.forEach(h => {
        const rad = (h * Math.PI) / 180;
        x += Math.cos(rad);
        y += Math.sin(rad);
    });
    const avg = Math.atan2(y / hues.length, x / hues.length) * (180 / Math.PI);
    return (avg + 360) % 360;
}

function debounce(fn, wait = 120) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
}

function syncChordWheelSize(forceFull = false) {
    const wheel = document.getElementById("chordRootWheel");
    if (!wheel) return;
    const card = wheel.closest(".chord-widget");
    const vw = window.innerWidth || 0;
    const vh = window.innerHeight || 0;
    const isFull = forceFull || card?.classList.contains("fullscreen");
    const maxSize = isFull ? Math.min(vw - 40, vh - 80) : Math.min(vw * 0.9, 420);
    const minSize = isFull ? 320 : 260;
    const size = Math.max(minSize, Math.min(maxSize, 520));
    const seg = Math.max(90, Math.min(130, size * 0.28));
    const radius = Math.max(size * 0.35, seg * 1.25);
    wheel.style.setProperty("--chord-wheel-size", `${size}px`);
    wheel.style.setProperty("--chord-seg-size", `${seg}px`);
    wheel.style.setProperty("--chord-wheel-radius", `${radius}px`);
}

function bindGlobalShortcuts() {
    document.addEventListener("keydown", e => {
        const target = e.target;
        const tag = target && target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON") return;
        if ((e.code === "Space" || e.key === " ") && !e.repeat) {
            e.preventDefault();
            const statusEl = uiRefs.status || document.getElementById("melodyStatus");
            const trackListEl = uiRefs.trackList || document.getElementById("melodyTrackList");
            const playheadEl = uiRefs.playhead || document.getElementById("melodyPlayhead");
            if (playbackState.isPlaying) pausePlayback(trackListEl, playheadEl, statusEl);
            else startPlayback(statusEl, trackListEl, playheadEl);
        }
    });
}

function applyColorPaletteToUI() {
    if (typeof refreshFretboardColors === "function") {
        refreshFretboardColors();
    }
    document.querySelectorAll(".piano-key[data-midi]").forEach(key => {
        const midi = Number(key.dataset.midi);
        if (!Number.isFinite(midi)) return;
        key.style.setProperty("--note-hue", midiToHue(midi));
        applyPianoLumaToKey(key, midi);
    });
    const trackListEl = uiRefs.trackList || document.getElementById("melodyTrackList");
    const playheadEl = uiRefs.playhead || document.getElementById("melodyPlayhead");
    const statusEl = uiRefs.status || document.getElementById("melodyStatus");
    if (trackListEl && playheadEl) {
        renderMelodyTracks(trackListEl, playheadEl, null, statusEl);
    }
    renderStaffHistory();
    const hueMidi = Number.isFinite(lastDetectedMidi) ? lastDetectedMidi : 60;
    micState.bgHue = Number(midiToHue(hueMidi)) || micState.bgHue;
    drawMicWaveform();
    const rootSel = document.getElementById("chordRoot");
    if (rootSel) applyChordHue(rootSel.value);
    const wheel = document.getElementById("chordRootWheel");
    if (wheel) {
        wheel.querySelectorAll(".chord-segment").forEach(seg => {
            const root = seg.dataset.root || "C";
            const color = midiToColor(60 + (noteNameToPitchClass(root) ?? 0));
            seg.style.background = color;
            seg.style.color = getContrastColor(color);
        });
    }
}

function setupFileMenu() {
    const wrap = document.getElementById("fileMenu");
    if (!wrap) return;
    const toggle = wrap.querySelector(".menu-file-toggle");
    const panel = wrap.querySelector(".menu-dropdown-panel");
    const saveBtn = document.getElementById("saveMelodyJsonButton");
    const loadBtn = document.getElementById("loadMelodyJsonButton");
    const exportBtn = document.getElementById("exportMelodyMidiButton");
    const actionMap = {
        save: () => saveBtn?.click(),
        load: () => loadBtn?.click(),
        export: () => exportBtn?.click()
    };
    const closePanel = () => {
        if (!panel) return;
        panel.hidden = true;
        toggle?.setAttribute("aria-expanded", "false");
    };
    toggle?.addEventListener("click", ev => {
        ev.stopPropagation();
        if (!panel) return;
        const nextHidden = !panel.hidden;
        panel.hidden = nextHidden ? true : false;
        toggle.setAttribute("aria-expanded", String(!panel.hidden));
    });
    panel?.addEventListener("click", ev => ev.stopPropagation());
    document.addEventListener("click", closePanel);
    panel?.querySelectorAll("[data-file-action]").forEach(btn => {
        btn.addEventListener("click", () => {
            const action = btn.dataset.fileAction || "";
            actionMap[action]?.();
            closePanel();
        });
    });
}

function setupMenuChips() {
    const micChip = document.getElementById("chipMic");
    const recChip = document.getElementById("chipRec");
    const micBtn = document.getElementById("micToggleButton");
    const recBtn = document.getElementById("recordToggleButton");
    micChip?.addEventListener("click", () => micBtn?.click());
    recChip?.addEventListener("click", () => recBtn?.click());
}

function setupColorPresetSelector() {
    const select = document.getElementById("colorPresetSelect");
    const octaveToggle = document.getElementById("octaveSpreadToggle");
    const pianoActiveToggle = document.getElementById("pianoActiveOnlyToggle");
    const pianoActiveInvertToggle = document.getElementById("pianoActiveInvertToggle");
    const baseInput = document.getElementById("octaveBaseInput");
    const darkInput = document.getElementById("octaveDarkRange");
    const lightInput = document.getElementById("octaveLightRange");
    const lowColorInput = document.getElementById("octaveLowColor");
    const highColorInput = document.getElementById("octaveHighColor");
    const satLowInput = document.getElementById("octaveSatLow");
    const satHighInput = document.getElementById("octaveSatHigh");
    const contrastInput = document.getElementById("octaveContrast");
    const octaveControls = document.getElementById("octaveControls");
    const customGrid = document.getElementById("customGrid");
    const copyPresetBtn = document.getElementById("copyPresetToCustom");
    const octaveResetBtn = document.getElementById("octaveResetButton");
    const customInputs = document.querySelectorAll("[data-note-color]");
    const paletteBtn = document.getElementById("paletteModalButton");
    const paletteClose = document.getElementById("paletteClose");
    const paletteRadios = document.querySelectorAll('input[name="palettePreset"]');
    const stored = (() => {
        try { return localStorage.getItem(COLOR_PRESET_KEY) || ""; } catch (_) { return ""; }
    })();
    if (stored) setColorPreset(stored);
    const storedActiveOnly = (() => {
        try { return localStorage.getItem(PIANO_ACTIVE_ONLY_KEY); } catch (_) { return null; }
    })();
    if (storedActiveOnly != null) pianoColorActiveOnly = storedActiveOnly === "1" || storedActiveOnly === "true";
    const storedActiveInvert = (() => {
        try { return localStorage.getItem(PIANO_ACTIVE_INVERT_KEY); } catch (_) { return null; }
    })();
    if (storedActiveInvert != null) pianoActiveInvert = storedActiveInvert === "1" || storedActiveInvert === "true";
    const loadCustomPalette = () => {
        try {
            const raw = localStorage.getItem(CUSTOM_PRESET_KEY);
            if (!raw) return null;
            const obj = JSON.parse(raw);
            if (obj && typeof obj === "object") {
                updateCustomPalette(obj);
                return obj;
            }
        } catch (_) { /* ignore */ }
        return null;
    };
    const persistCustomPalette = obj => {
        try { localStorage.setItem(CUSTOM_PRESET_KEY, JSON.stringify(obj)); } catch (_) { /* ignore */ }
    };
    const customPalette = loadCustomPalette() || {};
    if (Object.keys(customPalette).length) updateCustomPalette(customPalette);

    const loadOctaveConfig = () => {
        try {
            const raw = localStorage.getItem(OCTAVE_SPREAD_CONFIG_KEY) || localStorage.getItem(LUMA_CONFIG_KEY);
            if (!raw) return;
            const cfg = JSON.parse(raw);
            if (typeof cfg.normalized === "boolean") octaveSpreadEnabled = cfg.normalized;
            if (Number.isFinite(cfg.base)) octaveBase = cfg.base;
            if (Number.isFinite(cfg.dark)) octaveDarkRange = cfg.dark;
            if (Number.isFinite(cfg.light)) octaveLightRange = cfg.light;
            if (typeof cfg.lowColor === "string") octaveLowColor = cfg.lowColor;
            if (typeof cfg.highColor === "string") octaveHighColor = cfg.highColor;
            if (Number.isFinite(cfg.satLow)) octaveSatLow = cfg.satLow;
            if (Number.isFinite(cfg.satHigh)) octaveSatHigh = cfg.satHigh;
            if (Number.isFinite(cfg.contrast)) octaveContrast = cfg.contrast;
        } catch (_) { /* ignore */ }
    };
    const saveOctaveConfig = () => {
        try {
            localStorage.setItem(OCTAVE_SPREAD_CONFIG_KEY, JSON.stringify({
                normalized: octaveSpreadEnabled,
                base: octaveBase,
                dark: octaveDarkRange,
                light: octaveLightRange,
                lowColor: octaveLowColor,
                highColor: octaveHighColor,
                satLow: octaveSatLow,
                satHigh: octaveSatHigh,
                contrast: octaveContrast
            }));
        } catch (_) { /* ignore */ }
    };
    loadOctaveConfig();

    const refreshPreview = presetName => renderPalettePreview(presetName || getColorPresetName());
    const syncCustomGridVisibility = () => {
        const active = getColorPresetName();
        if (customGrid) customGrid.classList.toggle("is-hidden", active !== "custom");
        if (copyPresetBtn) copyPresetBtn.style.display = active === "custom" ? "" : "none";
    };
    const syncOctaveVisibility = () => {
        if (octaveControls) octaveControls.classList.toggle("is-hidden", !octaveSpreadEnabled);
        // Farben dürfen immer bearbeitet werden, unabhängig vom Toggle
        if (customGrid && getColorPresetName() === "custom") customGrid.classList.remove("is-hidden");
    };

    const syncOctaveInputs = () => {
        if (octaveToggle) octaveToggle.checked = octaveSpreadEnabled;
        if (pianoActiveToggle) pianoActiveToggle.checked = pianoColorActiveOnly;
        if (pianoActiveInvertToggle) pianoActiveInvertToggle.checked = pianoActiveInvert;
        if (baseInput) baseInput.value = String(octaveBase);
        if (darkInput) darkInput.value = String(octaveDarkRange);
        if (lightInput) lightInput.value = String(octaveLightRange);
        if (lowColorInput) lowColorInput.value = octaveLowColor;
        if (highColorInput) highColorInput.value = octaveHighColor;
        if (satLowInput) satLowInput.value = String(octaveSatLow);
        if (satHighInput) satHighInput.value = String(octaveSatHigh);
        if (contrastInput) contrastInput.value = String(octaveContrast);
    };
    syncOctaveInputs();
    syncOctaveVisibility();

    const applyAndRefresh = () => {
        saveOctaveConfig();
        updatePianoLuminance();
        refreshPreview();
    };

    const resetOctaveConfig = () => {
        octaveSpreadEnabled = false;
        octaveBase = 4;
        octaveDarkRange = 4;
        octaveLightRange = 4;
        octaveLowColor = "#000000";
        octaveHighColor = "#ffffff";
        octaveSatLow = 1;
        octaveSatHigh = 1;
        octaveContrast = 0;
        // Reset Custom-Farben auf aktuelles Preset
        copyPresetToCustom();
        syncOctaveInputs();
        syncOctaveVisibility();
        applyAndRefresh();
    };

    if (octaveResetBtn) {
        octaveResetBtn.addEventListener("click", resetOctaveConfig);
    }

    octaveToggle?.addEventListener("change", () => {
        octaveSpreadEnabled = !!octaveToggle.checked;
        syncOctaveVisibility();
        applyAndRefresh();
    });
    pianoActiveToggle?.addEventListener("change", () => {
        pianoColorActiveOnly = !!pianoActiveToggle.checked;
        try { localStorage.setItem(PIANO_ACTIVE_ONLY_KEY, pianoColorActiveOnly ? "1" : "0"); } catch (_) { /* ignore */ }
        updatePianoLuminance();
        refreshPreview();
    });
    pianoActiveInvertToggle?.addEventListener("change", () => {
        pianoActiveInvert = !!pianoActiveInvertToggle.checked;
        try { localStorage.setItem(PIANO_ACTIVE_INVERT_KEY, pianoActiveInvert ? "1" : "0"); } catch (_) { /* ignore */ }
        updatePianoLuminance();
        refreshPreview();
    });
    baseInput?.addEventListener("change", () => {
        const v = Number(baseInput.value);
        if (Number.isFinite(v)) octaveBase = Math.max(0, Math.min(10, v));
        applyAndRefresh();
    });
    darkInput?.addEventListener("change", () => {
        const v = Number(darkInput.value);
        if (Number.isFinite(v)) octaveDarkRange = Math.max(0, Math.min(8, v));
        applyAndRefresh();
    });
    lightInput?.addEventListener("change", () => {
        const v = Number(lightInput.value);
        if (Number.isFinite(v)) octaveLightRange = Math.max(0, Math.min(8, v));
        applyAndRefresh();
    });
    lowColorInput?.addEventListener("input", () => { octaveLowColor = lowColorInput.value || "#000000"; applyAndRefresh(); });
    highColorInput?.addEventListener("input", () => { octaveHighColor = highColorInput.value || "#ffffff"; applyAndRefresh(); });
    satLowInput?.addEventListener("change", () => {
        const v = Number(satLowInput.value);
        if (Number.isFinite(v)) octaveSatLow = Math.max(0, Math.min(2, v));
        applyAndRefresh();
    });
    satHighInput?.addEventListener("change", () => {
        const v = Number(satHighInput.value);
        if (Number.isFinite(v)) octaveSatHigh = Math.max(0, Math.min(2, v));
        applyAndRefresh();
    });
    contrastInput?.addEventListener("change", () => {
        const v = Number(contrastInput.value);
        if (Number.isFinite(v)) octaveContrast = Math.max(-1, Math.min(1, v));
        applyAndRefresh();
    });

    const syncCustomInputs = () => {
        customInputs.forEach(inp => {
            const note = inp.dataset.noteColor;
            if (!NOTE_NAMES.includes(note)) return;
            inp.value = (customPalette[note] || "#c0c0c0");
        });
    };
    syncCustomInputs();
    customInputs.forEach(inp => {
        inp.addEventListener("input", () => {
            const note = inp.dataset.noteColor;
            if (!NOTE_NAMES.includes(note)) return;
            customPalette[note] = inp.value;
            updateCustomPalette(customPalette);
            persistCustomPalette(customPalette);
            setColorPreset("custom");
            applyColorPaletteToUI();
            refreshPreview("custom");
            syncCustomGridVisibility();
        });
    });
    if (copyPresetBtn) {
        copyPresetBtn.addEventListener("click", () => {
            const presetName = getColorPresetName();
            const newPalette = {};
            NOTE_NAMES.forEach(name => {
                // midi for C4 + index
                const midi = 60 + NOTE_NAMES.indexOf(name);
                newPalette[name] = midiToColor(midi);
            });
            Object.assign(customPalette, newPalette);
            updateCustomPalette(customPalette);
            persistCustomPalette(customPalette);
            syncCustomInputs();
            setColorPreset("custom");
            applyColorPaletteToUI();
            refreshPreview("custom");
            syncCustomGridVisibility();
        });
    }
    if (paletteBtn) {
        paletteBtn.addEventListener("click", () => {
            const current = getColorPresetName();
            paletteRadios.forEach(r => { r.checked = r.value === current; });
            refreshPreview(current);
            openPaletteModal();
        });
    }
    if (paletteClose) {
        paletteClose.addEventListener("click", closePaletteModal);
    }
    paletteRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            if (!radio.checked) return;
            setColorPreset(radio.value);
            try { localStorage.setItem(COLOR_PRESET_KEY, radio.value); } catch (_) { /* ignore */ }
            applyColorPaletteToUI();
            refreshPreview(radio.value);
            syncCustomGridVisibility();
            if (radio.value === "custom") syncCustomInputs();
        });
    });
    if (select) {
        select.value = getColorPresetName();
        select.addEventListener("change", () => {
            setColorPreset(select.value);
            try { localStorage.setItem(COLOR_PRESET_KEY, select.value); } catch (_) { /* ignore */ }
            applyColorPaletteToUI();
            refreshPreview(select.value);
            syncCustomGridVisibility();
        });
    } else if (stored) {
        applyColorPaletteToUI();
        refreshPreview(stored);
        syncCustomGridVisibility();
    }
    const resetBtn = document.getElementById("layoutResetButton");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            try { localStorage.removeItem(widgetStateKey); } catch (_) { /* ignore */ }
            applyDefaultLayout(true);
            saveAllWidgetStates();
        });
    }
    const prefsBtn = document.getElementById("openPrefsButton");
    if (prefsBtn && select) {
        prefsBtn.addEventListener("click", () => {
            select.focus();
        });
    }
    applyColorPaletteToUI();
    refreshPreview(getColorPresetName());
    syncCustomGridVisibility();
}

function shouldRetriggerSine(midi, cents) {
    if (!sineRetriggerEnabled) return false;
    const now = performance.now();
    const diffCents = Math.abs((midi - (lastSineTriggerMidi ?? midi)) * 100);
    const centsEnabled = !micBypassState.sineRetriggerCents;
    const msEnabled = !micBypassState.sineRetriggerMs;
    const dropEnabled = !micBypassState.sineDropCents;
    const bigChange = centsEnabled ? diffCents >= sineRetriggerCents : true;
    const drop = dropEnabled ? Math.abs(cents) >= sineDropCents : true;
    const timeOk = msEnabled ? (now - (lastSineTriggerTime || 0)) >= sineRetriggerMs : true;
    if (!lastSineTriggerMidi) return true;
    if (sineExactHold && centsEnabled && !bigChange) return false;
    return (bigChange || drop) && timeOk;
}

function updateSineVoiceParams(forceRebuild = false) {
    if (!micSineVoices.size) return;
    const ctx = ensureAudioContext();
    const glide = Math.max(0.002, (micSineGlideMs || 40) / 1000);
    activeSineOffsets.forEach(offset => {
        const handle = micSineVoices.get(offset);
        if (!handle) return;
        if (forceRebuild) {
            try { handle.osc.stop(); handle.lfoVib?.stop(); handle.lfoTrem?.stop(); } catch (e) { /* ignore */ }
            micSineVoices.delete(offset);
            const freq = handle.freq || micSineFreq || 440;
            micSineVoices.set(offset, buildSineVoice(ctx, freq));
        } else {
            applyVoiceParams(handle, handle.freq || micSineFreq || 440, glide);
        }
    });
}
function chooseStableMidi(freq, lastMidi) {
    const clampFreq = f => Math.max(30, Math.min(5000, f));
    if (!Number.isFinite(freq) || freq <= 0) return { freq, midi: NaN };
    const candidates = [];
    [0.5, 1, 2].forEach(factor => {
        const f = clampFreq(freq * factor);
        if (!Number.isFinite(f)) return;
        const midi = noteFromPitch(f);
        const cents = Math.abs(centsOffFromPitch(f, midi));
        candidates.push({ freq: f, midi, cents });
    });
    const unique = [];
    candidates.forEach(c => {
        if (!unique.some(u => u.midi === c.midi)) unique.push(c);
    });
    if (!unique.length) return { freq, midi: noteFromPitch(freq) };

    let pick = unique[0];
    if (Number.isFinite(lastMidi)) {
        pick = unique.reduce((best, cur) => {
            const diffBest = Math.abs(best.midi - lastMidi);
            const diffCur = Math.abs(cur.midi - lastMidi);
            if (diffCur < diffBest - 0.01) return cur;
            if (Math.abs(diffCur - diffBest) < 0.01) return cur.cents < best.cents ? cur : best;
            return best;
        }, pick);
        // If jump is suspiciously large, prefer the one closest to concert range
        if (Math.abs(pick.midi - lastMidi) > 8) {
            pick = unique.reduce((best, cur) => {
                const inRange = cur.midi >= 48 && cur.midi <= 88;
                const bestRange = best.midi >= 48 && best.midi <= 88;
                if (inRange && !bestRange) return cur;
                if (inRange === bestRange) return cur.cents < best.cents ? cur : best;
                return best;
            }, pick);
        }
    } else {
        pick = unique.reduce((best, cur) => {
            const bestInRange = best.midi >= 48 && best.midi <= 88;
            const curInRange = cur.midi >= 48 && cur.midi <= 88;
            if (curInRange && !bestInRange) return cur;
            if (curInRange === bestInRange) return cur.cents < best.cents ? cur : best;
            return best;
        }, pick);
    }
    return pick;
}

function playTunerTone(freq, button) {
    ensureAudioContext();
    stopTunerTone();

    const handle = startContinuousSine(freq, { gainValue: 0.2, attackTime: 0.05 });
    currentTunerHandle = handle;
    currentTunerButton = button;
    button.classList.add("playing");
}

function stopTunerTone() {
    if (currentTunerHandle) {
        stopContinuousTone(currentTunerHandle, 0.08);
    }
    currentTunerHandle = null;

    if (currentTunerButton) {
        currentTunerButton.classList.remove("playing");
        currentTunerButton = null;
    }
}

/* ---------- Fretboard ---------- */

function setupFretboard() {
    const table = document.getElementById("fretboardTable");
    if (!table) return;
    buildUkuleleFretboard(table);
    const scrollBtn = document.getElementById("toggleFretScroll");
    const syncScroll = () => {
        if (scrollBtn) scrollBtn.textContent = fretScrollEnabled ? "Scroll: an" : "Scroll: aus";
        window.fretScrollEnabled = fretScrollEnabled;
    };
    if (scrollBtn) {
        scrollBtn.addEventListener("click", () => {
            fretScrollEnabled = !fretScrollEnabled;
            syncScroll();
        });
    }
    syncScroll();
}

/* ---------- Piano + Melodie ---------- */

function setupPianoAndMelody() {
    const pianoContainer = document.getElementById("pianoKeys");
    const statusElement = document.getElementById("melodyStatus");
    const fretboardElement = document.getElementById("fretboardTable");
    const fretboardWrapper = document.getElementById("fretboardWrapper");
    const fretboardToggleBtn = document.getElementById("toggleFretboardOrientation");

    const playButton = document.getElementById("playMelodyButton");
    const pauseButton = document.getElementById("pauseMelodyButton");
    const stopButton = document.getElementById("stopMelodyButton");
    const stepBackButton = document.getElementById("stepBackButton");
    const stepStayButton = document.getElementById("stepStayButton");
    const stepForwardButton = document.getElementById("stepForwardButton");
    const clearButton = document.getElementById("clearMelodyButton");
    const saveJsonButton = document.getElementById("saveMelodyJsonButton");
    const loadJsonButton = document.getElementById("loadMelodyJsonButton");
    const exportMidiButton = document.getElementById("exportMelodyMidiButton");
    const trackListElement = document.getElementById("melodyTrackList");
    const playheadElement = document.getElementById("melodyPlayhead");
    const trackContainer = document.getElementById("melodyTrack");
    const trackTabs = document.getElementById("trackTabs");
    const importButtons = document.querySelectorAll(".melody-import-btn");
    const importInputs = document.querySelectorAll(".melody-track-input");
    const importBlock = document.getElementById("melodyImportBlock");
    const showImportButton = document.getElementById("showMelodyFormButton");
    const clearStaffButton = document.getElementById("clearStaffButton");
    const fileInput = document.getElementById("melodyJsonFileInput");
    const tempoInput = document.getElementById("tempoInput");
    const tempoDisplay = document.getElementById("tempoDisplay");
    const tempoSlowerButton = document.getElementById("tempoSlowerButton");
    const tempoFasterButton = document.getElementById("tempoFasterButton");
    const tempoTapButton = document.getElementById("tempoTapButton");
    const recordToggleButton = document.getElementById("recordToggleButton");
    const recordBadge = document.getElementById("recordBadge");
    const sustainToggleButton = document.getElementById("sustainToggleButton");
    const arpeggioToggleButton = document.getElementById("arpeggioToggleButton");
    const loopToggleButton = document.getElementById("loopToggleButton");
    const penToggleButton = document.getElementById("penToggleButton");
    const linkedButtons = document.querySelectorAll("[data-link]");
    const importTextInput = importInputs[0] || null;
    const timeSigSelect = document.getElementById("timeSignatureSelect");
    const restButtons = document.getElementById("restButtons");
    const transposeControls = null;
    const bulkControls = document.querySelector(".bulk-controls");

    if (!pianoContainer || !statusElement || !playButton || !pauseButton ||
        !stepBackButton || !stepStayButton || !stepForwardButton || !clearButton ||
        !saveJsonButton || !loadJsonButton || !exportMidiButton ||
        !fileInput || !trackListElement || !playheadElement || !trackContainer ||
        importButtons.length === 0 || importInputs.length === 0 || !trackTabs) {
        return;
    }

    uiRefs.trackList = trackListElement;
    uiRefs.playhead = playheadElement;
    uiRefs.status = statusElement;

    if (penToggleButton) {
        penToggleButton.addEventListener("click", event => {
            event.stopPropagation();
            setPenMode(!penMode);
        });
    }

    buildPianoKeys(pianoContainer, statusElement, trackListElement, playheadElement, importTextInput);

    // Duplizierte Buttons unter dem Grid lösen die Originalaktionen aus
    linkedButtons.forEach(btn => {
        const targetSel = btn.getAttribute("data-link");
        const target = targetSel ? document.querySelector(targetSel) : null;
        if (target) {
            btn.addEventListener("click", () => target.click());
        }
    });

    if (timeSigSelect) {
        timeSigSelect.value = timeSignature;
        timeSigSelect.addEventListener("change", () => {
            timeSignature = timeSigSelect.value || "4/4";
            renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
        });
    }

    if (restButtons) {
        restButtons.querySelectorAll("button[data-rest]").forEach(btn => {
            btn.addEventListener("click", () => {
                const dur = Number(btn.dataset.rest);
                const track = getActiveTrack();
                const cursor = trackCursors[track] ?? 0;
                insertRestAt(cursor, dur, track);
                trackCursors[track] = cursor + 1;
                renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
                updateMelodyStatus(statusElement);
            });
        });
    }

    playButton.addEventListener("click", () => {
        startPlayback(statusElement, trackListElement, playheadElement);
    });

    pauseButton.addEventListener("click", () => {
        pausePlayback(trackListElement, playheadElement, statusElement);
    });
    if (stopButton) {
        stopButton.addEventListener("click", () => {
            pausePlayback(trackListElement, playheadElement, statusElement);
            trackCursors.fill(0);
            renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
            updatePlayheadPosition(playheadElement, playbackState.timeline?.totalUnits || 1, 0, trackListElement);
        });
    }

    if (loopToggleButton) {
        loopToggleButton.addEventListener("click", () => {
            loopMode = (loopMode + 1) % 3;
            const labels = ["aus", "alles", "Step"];
            loopToggleButton.textContent = "Loop: " + labels[loopMode];
        });
    }

    stepBackButton.addEventListener("click", () => {
        stepPlayback(-1, statusElement, trackListElement, playheadElement);
    });

    stepStayButton.addEventListener("click", () => {
        stepPlayback(0, statusElement, trackListElement, playheadElement);
    });

    stepForwardButton.addEventListener("click", () => {
        stepPlayback(1, statusElement, trackListElement, playheadElement);
    });

    if (bulkControls) {
        bulkControls.addEventListener("click", event => {
            const tracks = getTracks();
            if (!tracks.length) return;
            const firstRow = trackListElement.querySelector(".track-notes");
            const rect = (firstRow || bulkControls).getBoundingClientRect();
            const offset = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
            tracks.forEach((track, idx) => {
                const targetIdx = offsetToIndex(track, offset);
                const current = track[targetIdx];
                if (!current) return;
                if (current.rest) {
                    removeNoteAndFixState(targetIdx, idx);
                } else {
                    removeNoteAt(targetIdx, idx);
                    insertRestAt(targetIdx, current.durationMultiplier || 1, idx);
                }
            });
            renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
            if (statusElement) updateMelodyStatus(statusElement);
        });
    }

    clearButton.addEventListener("click", () => {
        stopPlayback(true);
        clearMelody();
        trackCursors.fill(0);
        clearFretHighlights();
        renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
        updateMelodyStatus(statusElement);
    });

    saveJsonButton.addEventListener("click", () => {
        const data = {
            version: 3,
            tempoBPM: 120,
            tracks: getTracks()
        };
        const blob = new Blob(
            [JSON.stringify(data, null, 2)],
            { type: "application/json" }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ukulele_melody.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    loadJsonButton.addEventListener("click", () => {
        fileInput.value = "";
        fileInput.click();
    });

    fileInput.addEventListener("change", event => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data.tracks)) {
                    setTracks(data.tracks);
                } else if (Array.isArray(data.melody)) {
                    setMelody(data.melody, getActiveTrack());
                }
                syncCursorsToTracks();
                stopPlayback(true);
                renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
                updateMelodyStatus(statusElement);
            } catch (err) {
                console.error("Fehler beim Lesen der Melodie-JSON:", err);
            }
        };
        reader.readAsText(file);
    });

    exportMidiButton.addEventListener("click", () => {
        const tracks = getTracks();
        const blob = createMergedMidiFromTracks(tracks, {
            ticksPerQuarter: 480,
            tempoBPM,
            noteDurationTicks: 480,
            channel: 0,
            velocity: 100
        });

        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ukulele_melody.mid";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    if (showImportButton && importBlock) {
        importBlock.classList.add("hidden");
        showImportButton.addEventListener("click", () => {
            importBlock.classList.remove("hidden");
            showImportButton.classList.add("hidden");
        });
    }

    importButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const track = Number(btn.dataset.track);
            const input = [...importInputs].find(inp => Number(inp.dataset.track) === track);
            if (!input) return;
            const text = input.value || "";
            const midiList = parseNoteList(text);
            if (midiList.length === 0) return;
            setActiveTrack(track);
            setMelody(midiList, track);
            trackCursors[track] = midiList.length;
            syncCursorsToTracks();
            stopPlayback(true);
            renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
            updateMelodyStatus(statusElement);
            renderTrackTabs(trackTabs, statusElement, trackListElement, playheadElement);
        });
    });

    syncCursorsToTracks();
    updateMelodyStatus(statusElement);
    renderTrackTabs(trackTabs, statusElement, trackListElement, playheadElement);
    renderMelodyTracks(trackListElement, playheadElement, null, statusElement);

    enableFretboardInput(fretboardElement, statusElement, trackListElement, playheadElement, importTextInput, trackTabs);
    setupTempoControls(tempoInput, tempoDisplay, tempoSlowerButton, tempoFasterButton, tempoTapButton);
    setupRecordToggle(recordToggleButton, recordBadge, statusElement, trackListElement, playheadElement);
    setupOptionToggles(sustainToggleButton, arpeggioToggleButton);
    setupTransposeControls(transposeControls, statusElement, trackListElement, playheadElement);
    renderStaffHistory();

    if (fretboardToggleBtn && fretboardWrapper) {
        fretboardToggleBtn.addEventListener("click", () => {
            fretboardOrientation = (fretboardOrientation + 1) % 3;
            if (fretboardOrientation === 1) {
                fretboardWrapper.classList.add("vertical");
            } else {
                fretboardWrapper.classList.remove("vertical");
            }
        });
    }

    clearStaffButton?.addEventListener("click", () => {
        staffNotes = [];
        staffAllNotes = [];
        renderStaffHistory();
    });
}

/**
 * Baut die Klaviatur (C4 bis C6) und verknüpft sie mit Audio & Ukulele-Highlight.
 */
function buildPianoKeys(container, statusElement, trackListElement, playheadElement, textInput) {
    pianoKeyMap.clear();
    const pianoNotes = [];
    const MIDI_START = 60; // C4
    const MIDI_END = 84;   // C6

    for (let midi = MIDI_START; midi <= MIDI_END; midi++) {
        const name = NOTE_NAMES[midi % 12];
        const octave = Math.floor(midi / 12) - 1;
        pianoNotes.push({
            midi,
            label: name + octave,
            isSharp: name.includes("#")
        });
    }

    container.innerHTML = "";

    const whiteKeyCount = pianoNotes.filter(n => !n.isSharp).length;
    const shell = document.createElement("div");
    shell.className = "piano-shell";
    shell.style.setProperty("--white-key-count", String(whiteKeyCount));

    const whiteLayer = document.createElement("div");
    whiteLayer.className = "white-keys";

    const blackLayer = document.createElement("div");
    blackLayer.className = "black-keys";

    shell.appendChild(whiteLayer);
    shell.appendChild(blackLayer);
    container.appendChild(shell);

    let currentWhiteIndex = -1;

    pianoNotes.forEach(note => {
        const key = document.createElement("button");
        key.type = "button";
        key.className = "piano-key" + (note.isSharp ? " sharp black-key" : " white-key");
        key.dataset.midi = String(note.midi);
        key.style.setProperty("--note-hue", midiToHue(note.midi));
        applyPianoLumaToKey(key, note.midi);

        const label = document.createElement("span");
        label.className = "note-name";
        label.textContent = note.label;
        key.appendChild(label);

        key.addEventListener("click", () => {
            const midi = note.midi;
            const freq = midiToFrequency(midi);
            const clickDur = getUnitMs() * (sustainLong ? 2.2 : 1);

            ensureAudioContext();
            playPluckedUkulele(freq, clickDur, { peakGain: 0.22, attackMs: 18 });

            highlightUkuleleForMidi(midi, { scroll: true });
            pressPianoKey(midi, 200);
            recordInterval(midi, "piano");
            if (recordingEnabled) {
                const track = chooseNearestTrack(midi);
                setActiveTrack(track);
                addStaffNote(midi, track);
                insertNoteAtCursorForTrack(midi, track);
                insertLabelIntoInput(textInput, note.label);
                updateMelodyStatus(statusElement);
                renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
                renderTrackTabs(document.getElementById("trackTabs"), statusElement, trackListElement, playheadElement);
            } else {
                renderStaffPreview(midi, getActiveTrack());
            }

            key.classList.add("active");
            setTimeout(() => key.classList.remove("active"), 150);
        });

        if (note.isSharp) {
            key.style.setProperty("--key-slot", String(currentWhiteIndex));
            blackLayer.appendChild(key);
        } else {
            currentWhiteIndex++;
            whiteLayer.appendChild(key);
        }

        pianoKeyMap.set(note.midi, key);
    });
}

function clamp01(v) {
    return Math.min(1, Math.max(0, v));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function parseColorToRgb(str) {
    if (!str) return { r: 0.5, g: 0.5, b: 0.5 };
    const s = str.trim();
    if (s.startsWith("#")) {
        const hex = s.slice(1);
        const full = hex.length === 3 ? hex.split("").map(c => c + c).join("") : hex;
        const r = parseInt(full.slice(0, 2), 16) / 255;
        const g = parseInt(full.slice(2, 4), 16) / 255;
        const b = parseInt(full.slice(4, 6), 16) / 255;
        if ([r, g, b].some(v => Number.isNaN(v))) return { r: 0.5, g: 0.5, b: 0.5 };
        return { r, g, b };
    }
    const hslMatch = /hsl\(\s*([-\d.]+)\s*(?:,|\s)\s*([-\d.]+)%\s*(?:,|\s)\s*([-\d.]+)%/i.exec(s);
    if (hslMatch) {
        const h = Number(hslMatch[1]);
        const sat = Number(hslMatch[2]) / 100;
        const l = Number(hslMatch[3]) / 100;
        if ([h, sat, l].some(v => !Number.isFinite(v))) return { r: 0.5, g: 0.5, b: 0.5 };
        return hslToRgb({ h, s: sat, l });
    }
    return { r: 0.5, g: 0.5, b: 0.5 };
}

function rgbToHsl({ r, g, b }) {
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            default: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: (h || 0), s: s || 0, l: l || 0 };
}

function hslToRgb({ h, s, l }) {
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r, g, b };
}

function mixRgb(a, b, t) {
    return {
        r: lerp(a.r, b.r, t),
        g: lerp(a.g, b.g, t),
        b: lerp(a.b, b.b, t)
    };
}

function rgbToCss({ r, g, b }) {
    const to255 = v => Math.round(clamp01(v) * 255);
    return `rgb(${to255(r)}, ${to255(g)}, ${to255(b)})`;
}

function getPianoDisplayColor(midi, { active = false } = {}) {
    if (pianoColorActiveOnly && !active) {
        const isSharp = (midi % 12) === 1 || (midi % 12) === 3 || (midi % 12) === 6 || (midi % 12) === 8 || (midi % 12) === 10;
        if (pianoActiveInvert) return isSharp ? "#f7f7f7" : "#0b0b0b";
        return isSharp ? "#0b0b0b" : "#f7f7f7";
    }
    const baseColor = midiToColor(midi);
    const baseRgb = parseColorToRgb(baseColor);
    if (!octaveSpreadEnabled) {
        return rgbToCss(baseRgb);
    }
    const diffOct = Math.floor(midi / 12) - octaveBase;
    let working = baseRgb;
    if (diffOct < 0 && octaveDarkRange > 0) {
        const t = clamp01(Math.abs(diffOct) / octaveDarkRange);
        working = mixRgb(working, parseColorToRgb(octaveLowColor), t);
    } else if (diffOct > 0 && octaveLightRange > 0) {
        const t = clamp01(Math.abs(diffOct) / octaveLightRange);
        working = mixRgb(working, parseColorToRgb(octaveHighColor), t);
    }
    const hsl = rgbToHsl(working);
    const totalRange = Math.max(0.0001, octaveDarkRange + octaveLightRange);
    const norm = clamp01((diffOct + octaveDarkRange) / totalRange);
    const satFactor = lerp(octaveSatLow, octaveSatHigh, norm);
    hsl.s = clamp01(hsl.s * satFactor);
    hsl.l = clamp01(0.5 + (hsl.l - 0.5) * (1 + octaveContrast));
    const finalRgb = hslToRgb(hsl);
    return rgbToCss(finalRgb);
}

function updatePianoPlayingState() {
    const shell = document.querySelector(".piano-shell");
    if (!shell) return;
    const anyPlaying = !!document.querySelector(".piano-key.playing");
    shell.classList.toggle("has-playing", anyPlaying);
}

function applyPianoLumaToKey(key, midi) {
    const color = getPianoDisplayColor(midi, { active: key.classList.contains("playing") });
    key.style.setProperty("background", color, "important");
    key.style.setProperty("background-image", "none", "important");
    key.style.setProperty("border", "none", "important");
    key.style.setProperty("border-bottom", "none", "important");
    key.style.setProperty("box-shadow", "none", "important");
    key.style.setProperty("filter", "none", "important");
    key.style.setProperty("opacity", "1", "important");
    key.style.setProperty("--label-color", pickTextColor(color));
}

function updatePianoLuminance() {
    document.querySelectorAll(".piano-key[data-midi]").forEach(key => {
        const midi = Number(key.dataset.midi);
        if (!Number.isFinite(midi)) return;
        applyPianoLumaToKey(key, midi);
    });
}

function openPaletteModal() {
    const modal = document.getElementById("paletteModal");
    if (modal) modal.classList.remove("hidden");
}

function closePaletteModal() {
    const modal = document.getElementById("paletteModal");
    if (modal) modal.classList.add("hidden");
}

function renderPalettePreview(preset = getColorPresetName()) {
    const wrap = document.getElementById("palettePreview");
    if (!wrap) return;
    wrap.innerHTML = "";
    const currentPreset = getColorPresetName();
    const needsSwitch = preset && preset !== currentPreset;
    if (needsSwitch) setColorPreset(preset);
    const below = octaveSpreadEnabled ? Math.ceil(Math.max(0, octaveDarkRange)) : 0;
    const above = octaveSpreadEnabled ? Math.ceil(Math.max(0, octaveLightRange)) : 0;
    const totalOctaves = Math.max(1, below + above + 1);
    const startOctave = Math.max(0, Math.floor(octaveBase - below));
    const notes = Array.from({ length: totalOctaves * 12 }, (_, i) => (startOctave * 12) + i);
    notes.forEach(midi => {
        const { name, octave } = midiToNote(midi);
        const color = getPianoDisplayColor(midi, { active: true });
        const isBlack = name.includes("#");
        const key = document.createElement("div");
        key.className = "preview-key" + (isBlack ? " black" : "");
        key.style.background = color;
        key.style.color = getContrastColor(color);
        key.title = `${name}${octave}`;
        key.textContent = `${name}${octave}`;
        wrap.appendChild(key);
    });
    if (needsSwitch) setColorPreset(currentPreset);
}

function getContrastColor(cssColor) {
    const hexMatch = /^#?([0-9a-f]{6})/i.exec(cssColor || "");
    if (!hexMatch) return "#0b0b0b";
    const hex = hexMatch[1];
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#0b0b0b" : "#f7f7f7";
}

/**
 * Macht das Griffbrett klickbar: Ton abspielen, aufnehmen und Cursor-Text füllen.
 */
function enableFretboardInput(table, statusElement, trackListElement, playheadElement, textInput, trackTabs) {
    if (!table) return;
    table.addEventListener("click", event => {
        const cell = event.target.closest("td[data-midi]");
        if (!cell || !table.contains(cell)) return;
        const midi = Number(cell.dataset.midi);
        if (!Number.isFinite(midi)) return;
        const stringNumber = Number(cell.dataset.string);
        if (Number.isInteger(stringNumber) && stringNumber >= 1) {
            const trackIndex = Math.min(getMaxTracks() - 1, stringNumber - 1);
            setActiveTrack(trackIndex);
            if (typeof trackCursors[trackIndex] !== "number") {
                trackCursors[trackIndex] = 0;
            }
            renderTrackTabs(trackTabs, statusElement, trackListElement, playheadElement);
        }

        ensureAudioContext();
        playPluckedUkulele(midiToFrequency(midi), getUnitMs(), { peakGain: 0.24, attackMs: 14 });
        highlightUkuleleForMidi(midi, { scroll: false });
        pressPianoKey(midi, getUnitMs());
        recordInterval(midi, "fretboard");
        if (penMode && !recordingEnabled && Number.isInteger(stringNumber)) {
            const trackIndex = Math.min(getMaxTracks() - 1, stringNumber - 1);
            addStaffNote(midi, trackIndex);
            insertNoteAtCursorForTrack(midi, trackIndex);
            updateMelodyStatus(statusElement);
            renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
        } else if (recordingEnabled) {
            addStaffNote(midi, getActiveTrack());
            insertNoteAtCursor(midi);
            insertLabelIntoInput(textInput, midiToLabel(midi));
            updateMelodyStatus(statusElement);
            renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
        } else {
            // Manual Step-Markierung (nur wenn Aufnahme aus)
            let timeKey = getCurrentTimeKey();
            if (timeKey === null) {
                timeKey = lastManualTimeKey !== null ? lastManualTimeKey : 0;
            }
            toggleManualSelection(timeKey, stringNumber, midi);
            updateManualFretHighlight(timeKey);
            renderStaffPreview(midi, getActiveTrack());
        }
    });
}

/**
 * Tempo-Steuerung: Eingabe, schneller/langsamer Buttons, Tap-Tempo.
 */
function setupTempoControls(tempoInput, tempoDisplay, slowerBtn, fasterBtn, tapBtn) {
    const clampBpm = bpm => Math.min(220, Math.max(1, Math.round(bpm)));
    const updateDisplay = () => {
        if (tempoInput) tempoInput.value = String(tempoBPM);
        if (tempoDisplay) tempoDisplay.textContent = tempoBPM + " BPM";
    };
    updateDisplay();

    const setTempo = bpm => {
        tempoBPM = clampBpm(bpm);
        updateDisplay();
    };

    // Place tempo display near time signature for better visibility
    const timeSigRow = document.querySelector(".time-sig-row");
    if (timeSigRow && tempoDisplay && !timeSigRow.contains(tempoDisplay)) {
        timeSigRow.appendChild(tempoDisplay);
    }

    if (tempoInput) {
        tempoInput.addEventListener("change", () => {
            const val = Number(tempoInput.value);
            if (Number.isFinite(val)) setTempo(val);
        });
    }
    if (slowerBtn) {
        slowerBtn.addEventListener("click", () => setTempo(tempoBPM - 5));
    }
    if (fasterBtn) {
        fasterBtn.addEventListener("click", () => setTempo(tempoBPM + 5));
    }
    if (tapBtn) {
        tapBtn.addEventListener("click", () => {
            const now = performance.now();
            tapTimes = tapTimes.filter(t => now - t < 2500);
            tapTimes.push(now);
            if (tapTimes.length >= 2) {
                const intervals = [];
                for (let i = 1; i < tapTimes.length; i++) {
                    intervals.push(tapTimes[i] - tapTimes[i - 1]);
                }
                const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
                const bpm = 60000 / avg;
                if (Number.isFinite(bpm)) setTempo(bpm);
            }
        });
    }
}

/**
 * Aktualisiert den Text zur Melodie-Länge.
 */
function updateMelodyStatus(statusElement) {
    if (!hasMelody()) {
        statusElement.textContent = "Keine Noten aufgenommen.";
    } else {
        const tracks = getTracks();
        const perTrack = tracks.map(t => calculateTotalUnits(t));
        const totalUnits = Math.max(...perTrack);
        const noteCounts = tracks.map(t => t.length).reduce((a, b) => a + b, 0);
        statusElement.textContent =
            "Spuren: " + tracks.length +
            " · Noten gesamt: " + noteCounts +
            " · längste Dauer-Einheiten: " + totalUnits.toFixed(2) +
            " · Tempo: " + tempoBPM + " BPM" +
            " · Aufnahme: " + (recordingEnabled ? "an" : "aus") +
            " · Transpose: " + transposeSemitones;
    }
}

/**
 * Wiedergabe-Logik mit Play/Pause/Step und Playhead.
 */
function startPlayback(statusElement, trackListElement, playheadElement) {
    stopPlayback(false);
    const tracks = getTracks();
    if (!tracks.some(t => t.length > 0)) return;

    ensureAudioContext();

    playbackState.timeline = buildTimeline(tracks);
    if (!playbackState.timeline.events.length) return;
    playbackState.isPlaying = true;
    const times = playbackState.timeline.times || [];
    const initialIndex = (loopMode === 2 && Number.isInteger(playbackState.currentTimeIndex))
        ? Math.min(times.length ? times.length - 1 : 0, Math.max(0, playbackState.currentTimeIndex || 0))
        : 0;
    playbackState.currentTimeIndex = initialIndex;
    playbackState.pausedElapsed = 0;
    playbackState.startTimestamp = performance.now();
    renderMelodyTracks(trackListElement, playheadElement, null, statusElement);

    scheduleTimeline(playheadElement, trackListElement, statusElement);
    runPlayheadLoop(playheadElement, trackListElement);
}

function pausePlayback(trackListElement, playheadElement, statusElement) {
    playbackState.isPlaying = false;
    if (playbackState.timeouts.length) {
        playbackState.timeouts.forEach(t => {
            clearTimeout(t);
            clearInterval(t);
        });
        playbackState.timeouts = [];
    }
    playbackState.loopStepMs = null;
    if (playbackState.playheadRAF) {
        cancelAnimationFrame(playbackState.playheadRAF);
        playbackState.playheadRAF = null;
    }
    if (playheadElement) {
        playheadElement.style.transition = "none";
    }
    renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
    clearFretHighlights();
}

function stopPlayback(resetCursor = false) {
    playbackState.isPlaying = false;
    if (playbackState.timeouts.length) {
        playbackState.timeouts.forEach(t => {
            clearTimeout(t);
            clearInterval(t);
        });
        playbackState.timeouts = [];
    }
    if (playbackState.playheadRAF) {
        cancelAnimationFrame(playbackState.playheadRAF);
        playbackState.playheadRAF = null;
    }
    playbackState.timeline = null;
    playbackState.startTimestamp = null;
    playbackState.pausedElapsed = 0;
    playbackState.loopStepMs = null;
    playbackState.currentTimeIndex = resetCursor ? 0 : playbackState.currentTimeIndex;
    clearFretHighlights();
    const globalTrackList = document.getElementById("melodyTrackList");
    if (globalTrackList) {
        markActiveNotes(globalTrackList, []);
    }
}

function scheduleTimeline(playheadElement, trackListElement, statusElement) {
    if (!playbackState.timeline || !playbackState.timeline.events.length) return;
    const unitMs = getUnitMs();
    if (loopMode === 2) {
        const idx = Math.max(0, Math.min(playbackState.currentTimeIndex || 0, playbackState.timeline.events.length - 1));
        const evt = playbackState.timeline.events[idx];
        const times = playbackState.timeline.times || [];
        const nextTime = times[idx + 1] ?? playbackState.timeline.totalUnits;
        const stepUnits = Math.max(0.25, (nextTime - evt.time) || 1);
        playbackState.loopStepMs = stepUnits * unitMs;
        playbackState.startTimestamp = performance.now();
        playbackState.pausedElapsed = 0;
        // play immediately once
        playTimelineEvent(evt, trackListElement, playheadElement, { scroll: false });
        // schedule repeat
        const intervalId = setInterval(() => {
            if (!playbackState.isPlaying) return;
            playbackState.startTimestamp = performance.now();
            playTimelineEvent(evt, trackListElement, playheadElement, { scroll: false });
        }, playbackState.loopStepMs);
        playbackState.timeouts = [intervalId];
        playbackState.currentTimeIndex = idx;
        return;
    }
    playbackState.loopStepMs = null;
    playbackState.timeouts = playbackState.timeline.events.map((evt, idx) => {
        const delay = evt.time * unitMs;
        return setTimeout(() => {
            if (!playbackState.isPlaying) return;
            playbackState.currentTimeIndex = idx;
            const evtDuration = getEventDurationMs(evt);
            playTimelineEvent(evt, trackListElement, playheadElement, { scroll: false });
            if (idx === playbackState.timeline.events.length - 1) {
                setTimeout(() => {
                    if (!playbackState.isPlaying) return;
                    if (loopMode === 1) { // loop all
                        playbackState.isPlaying = false;
                        stopPlayback(true);
                        startPlayback(statusElement, trackListElement, playheadElement);
                    } else if (loopMode === 2) { // loop current step
                        playbackState.isPlaying = true;
                        playbackState.currentTimeIndex = idx;
                        playbackState.startTimestamp = performance.now();
                        playTimelineEvent(evt, trackListElement, playheadElement, { scroll: false });
                        scheduleTimeline(playheadElement, trackListElement, statusElement);
                        runPlayheadLoop(playheadElement, trackListElement);
                    } else {
                        stopPlayback(true);
                    }
                }, evtDuration);
            }
        }, delay);
    });
}

function playTimelineEvent(evt, trackListElement, playheadElement, options = {}) {
    const { scroll = false } = options;
    const playable = evt.notes.filter(n => !n.rest && Number.isFinite(n.midi));
    const midis = playable.map(n => clampMidi(n.midi + transposeSemitones));
    const unitMs = getUnitMs();
    const arpeggiate = arpeggioMode !== "off";
    const order = arpeggiate ? buildArpeggioOrder(playable, arpeggioMode) : playable;
    const stepDelay = arpeggiate ? computeArpeggioStepDelay(order, unitMs) : 0;

    if (!arpeggiate) {
        highlightUkuleleForMidis(midis, { scroll });
    } else {
        clearFretHighlights();
    }

    markActiveNotes(trackListElement, playable);

    order.forEach((note, idx) => {
        const delay = arpeggiate ? idx * stepDelay : 0;
        const durationMs = Math.max(100, note.durationMultiplier * unitMs * (sustainLong ? 2.0 : 1));
        const timeoutId = setTimeout(() => {
            const playMidi = clampMidi(note.midi + transposeSemitones);
            playPluckedUkulele(midiToFrequency(playMidi), durationMs);
            pressPianoKey(playMidi, durationMs);
            if (arpeggiate) {
                highlightUkuleleForMidi(playMidi, { scroll: idx === 0 && scroll });
            }
        }, delay);
        playbackState.timeouts.push(timeoutId);
    });
    if (midis.length) {
        addStaffNote(midis[0], playable[0]?.trackIndex ?? getActiveTrack());
    }

    const totalUnits = playbackState.timeline?.totalUnits || 1;
    updatePlayheadPosition(playheadElement, totalUnits, evt.time, trackListElement);
    updateManualFretHighlight(evt.time);
}

function stepPlayback(direction, statusElement, trackListElement, playheadElement) {
    stopPlayback(false);
    const tracks = getTracks();
    if (!tracks.some(t => t.length > 0)) return;

    const timeline = buildTimeline(tracks);
    playbackState.timeline = timeline;
    if (!timeline.events.length) return;

    const times = timeline.times;
    if (!times.length) return;

    if (direction < 0) {
        playbackState.currentTimeIndex = playbackState.currentTimeIndex <= 0
            ? times.length - 1
            : playbackState.currentTimeIndex - 1;
    } else if (direction === 0) {
        // bleibt auf aktueller Position
    } else if (direction > 0) {
        playbackState.currentTimeIndex = Math.min(times.length - 1, playbackState.currentTimeIndex + 1);
    }

    const evt = timeline.events[playbackState.currentTimeIndex];
    playTimelineEvent(evt, trackListElement, playheadElement, { scroll: true });
    updateMelodyStatus(statusElement);
    updateManualFretHighlight(evt.time);
}

/* ---------- Melodie-Track & Playhead ---------- */

function renderTrackTabs(tabsElement, statusElement, trackListElement, playheadElement) {
    if (!tabsElement) return;
    const maxTracks = getMaxTracks();
    const tracks = getTracks();
    tabsElement.innerHTML = "";

    for (let i = 0; i < maxTracks; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "track-tab" + (i === getActiveTrack() ? " active" : "");
        btn.textContent = "Spur " + (i + 1);
        btn.dataset.track = String(i);
        btn.addEventListener("click", () => {
            setActiveTrack(i);
            if (typeof trackCursors[i] !== "number") {
                trackCursors[i] = 0;
            }
            renderTrackTabs(tabsElement, statusElement, trackListElement, playheadElement);
            renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
            updateMelodyStatus(statusElement);
        });
        tabsElement.appendChild(btn);
    }
}

function renderMelodyTracks(trackListElement, playheadElement, activeSpot, statusElement = null) {
    if (!trackListElement || !playheadElement) return;
    preserveViewport(() => {
    const tracks = getTracks();
    while (trackCursors.length < tracks.length) {
        trackCursors.push(0);
    }
    const durations = getTrackDurations();
    const totalUnits = Math.max(1, ...durations);

    trackListElement.innerHTML = "";
    const sigDisplay = document.getElementById("timeSignatureDisplay");
    if (sigDisplay) sigDisplay.textContent = timeSignature;

    tracks.forEach((track, trackIndex) => {
        const row = document.createElement("div");
        row.className = "track-row" + (trackIndex === getActiveTrack() ? " current" : "");

        const label = document.createElement("div");
        label.className = "track-row-title";
        label.textContent = "Spur " + (trackIndex + 1);
        row.appendChild(label);

        const notesWrap = document.createElement("div");
        notesWrap.className = "track-notes";
        notesWrap.dataset.track = String(trackIndex);
        notesWrap.style.setProperty("--unit-px", UNIT_PX + "px");
        notesWrap.style.setProperty("--note-gap", NOTE_GAP + "px");
        notesWrap.style.width = (totalUnits * UNIT_PX) + "px";
        notesWrap.addEventListener("click", event => {
            if (event.target.closest(".track-note")) return;
            if (playbackState.isPlaying) {
                pausePlayback(trackListElement, playheadElement, statusElement);
                const timeline = buildTimeline(getTracks());
                playbackState.timeline = timeline;
                const targetIndex = getClickIndexFromEvent(event, trackIndex);
                const targetUnits = consumedUnitsUntil(track, targetIndex);
                const times = timeline.times || [];
                let idx = times.findIndex(t => Math.abs(t - targetUnits) < 1e-6);
                if (idx < 0) {
                    idx = times.reduce((best, t, i) => (t <= targetUnits && i > best ? i : best), 0);
                }
                playbackState.currentTimeIndex = Math.max(0, idx);
                updatePlayheadPosition(playheadElement, timeline.totalUnits || 1, times[playbackState.currentTimeIndex] || 0, trackListElement);
                updateManualFretHighlight(times[playbackState.currentTimeIndex] || 0);
                return;
            }
            const targetIndex = getClickIndexFromEvent(event, trackIndex);
            const restCycle = [1, 0.5, 0.25];
            const duration = restCycle[((event.detail || 1) - 1) % restCycle.length];
            insertRestAt(targetIndex, duration, trackIndex);
            trackCursors[trackIndex] = targetIndex + 1;
            renderMelodyTracks(trackListElement, playheadElement, { track: trackIndex, index: targetIndex }, statusElement);
            if (statusElement) updateMelodyStatus(statusElement);
        });

        track.forEach((note, idx) => {
            const token = document.createElement("button");
            const isRest = !!note.rest;
            token.type = "button";
            token.className = "track-note" +
                (isRest ? " rest" : "") +
                ((activeSpot && activeSpot.track === trackIndex && activeSpot.index === idx) ? " active" : "");
            token.dataset.index = String(idx);
            token.dataset.track = String(trackIndex);
            token.style.setProperty("--duration", String(note.durationMultiplier || 1));
            token.style.width = ((note.durationMultiplier || 1) * UNIT_PX) + "px";
            token.style.flex = "0 0 " + token.style.width;
            token.title = (isRest
                ? "Pause: Klick zum Längenwechsel (1, 1/2, 1/3, 1/4, 1/6 ...). Shift+Klick: Länge verdoppeln. Nach unten ziehen: löschen."
                : "Klick-Reihenfolge: 1 → 1/2 → 1/3 → 1/4 → 1/6 → 1/8 → 1/16 → 1/16 → 1/32. Shift+Klick: Länge verdoppeln. Nach unten ziehen: löschen.");
            if (!isRest) {
                token.style.setProperty("--note-hue", midiToHue(note.midi));
            }

            if (!isRest) {
                const pos = getPositionForTrack(note.midi, trackIndex) || getNearestUkulelePosition(note.midi);
                if (pos) {
                    const posDiv = document.createElement("div");
                    posDiv.className = "note-pos";
                    posDiv.textContent = formatPositionLabel(pos);
                    token.appendChild(posDiv);
                }
            }

            const labelSpan = document.createElement("span");
            labelSpan.className = "track-label";
            labelSpan.textContent = isRest ? "Pause" : midiToLabel(note.midi);

            const duration = document.createElement("span");
            duration.className = "track-duration";
            duration.textContent = describeDuration(note.durationMultiplier);

            const deleteBtn = document.createElement("span");
            deleteBtn.className = "track-delete";
            deleteBtn.textContent = "✕";

            token.appendChild(labelSpan);
            token.appendChild(duration);
            token.appendChild(deleteBtn);

            let startY = null;
            let startX = null;
            let deleted = false;
            token.addEventListener("pointerdown", event => {
                startY = event.clientY;
                startX = event.clientX;
                token.setPointerCapture(event.pointerId);
                deleted = false;
            });

            token.addEventListener("pointerup", event => {
                if (startY !== null) {
                    const deltaY = event.clientY - startY;
                    const deltaX = event.clientX - (startX || event.clientX);
                    // nach unten: löschen
                    if (deltaY > 28) {
                        const original = getNoteAt(idx, trackIndex);
                        if (original && !original.rest) {
                            removeNoteAt(idx, trackIndex);
                            insertRestAt(idx, original.durationMultiplier, trackIndex);
                        } else {
                            removeNoteAndFixState(idx, trackIndex);
                        }
                        renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
                        if (statusElement) updateMelodyStatus(statusElement);
                        deleted = true;
                        startY = null;
                        return;
                    }
                    // nach oben: duplizieren
                    if (deltaY < -28) {
                        const original = getNoteAt(idx, trackIndex);
                        if (original) {
                            insertEntryAt(idx + 1, original, trackIndex);
                            trackCursors[trackIndex] = idx + 2;
                            renderMelodyTracks(trackListElement, playheadElement, { track: trackIndex, index: idx + 1 }, statusElement);
                            if (statusElement) updateMelodyStatus(statusElement);
                            deleted = true;
                        }
                        startY = null;
                        return;
                    }
                    // seitlich: umsortieren/umsortieren
                    if (Math.abs(deltaX) > 24) {
                        const container = notesWrap;
                        const rect = container.getBoundingClientRect();
                        const offset = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
                        const targetIndex = offsetToIndex(track, offset);
                        const original = getNoteAt(idx, trackIndex);
                        if (original) {
                            removeNoteAt(idx, trackIndex);
                            const insertAt = targetIndex >= idx ? Math.max(0, targetIndex - 1) : targetIndex;
                            insertEntryAt(insertAt, original, trackIndex);
                            trackCursors[trackIndex] = insertAt + 1;
                            renderMelodyTracks(trackListElement, playheadElement, { track: trackIndex, index: insertAt }, statusElement);
                            if (statusElement) updateMelodyStatus(statusElement);
                            deleted = true;
                        }
                        startY = null;
                        return;
                    }
                }
                startY = null;
            });

            token.addEventListener("pointercancel", () => {
                startY = null;
            });

            token.addEventListener("click", event => {
                if (event.target.classList.contains("track-delete")) {
                    const original = getNoteAt(idx, trackIndex);
                    if (original && !original.rest) {
                        removeNoteAt(idx, trackIndex);
                        insertRestAt(idx, original.durationMultiplier, trackIndex);
                    } else {
                        removeNoteAndFixState(idx, trackIndex);
                    }
                    renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
                    if (statusElement) updateMelodyStatus(statusElement);
                    return;
                }
                if (!isRest) {
                    ensureAudioContext();
                    const dur = Math.max(100, (note.durationMultiplier || 1) * getUnitMs());
                    playPluckedUkulele(midiToFrequency(note.midi), dur);
                    pressPianoKey(note.midi, dur);
                    highlightUkuleleForMidi(note.midi, { scroll: false });
                }
                if (deleted) return;
                handleDurationClick(idx, trackIndex, event, trackListElement, playheadElement, statusElement);
            });

            notesWrap.appendChild(token);
        });

        row.appendChild(notesWrap);
        trackListElement.appendChild(row);
    });

    // Kein automatisches Scrollen – Zielstelle wird nur markiert
    pendingNoteScroll = null;

    const cursorUnits = playbackState.timeline
        ? (playbackState.timeline.times?.[playbackState.currentTimeIndex] || 0)
        : 0;
    updatePlayheadPosition(playheadElement, totalUnits, cursorUnits, trackListElement);
    });
}

function markActiveNotes(trackListElement, notes = []) {
    if (!trackListElement) return;
    trackListElement.querySelectorAll(".track-note.playing").forEach(el => {
        el.classList.remove("playing");
        el.style.removeProperty("--play-ms");
    });
    const unitMs = getUnitMs();
    notes.forEach(n => {
        const sel = `.track-note[data-track="${n.trackIndex}"][data-index="${n.noteIndex}"]`;
        const el = trackListElement.querySelector(sel);
        if (el) {
            const dur = Math.max(80, (n.durationMultiplier || 1) * unitMs);
            el.style.setProperty("--play-ms", dur + "ms");
            el.classList.add("playing");
        }
    });
}

function updatePlayheadPosition(playheadElement, totalUnits, positionUnits, trackListElement) {
    if (!playheadElement) return;
    const trackContainer = playheadElement.parentElement;
    const noteRow = (trackListElement || trackContainer)?.querySelector(".track-notes");
    if (!noteRow || !trackContainer) return;
    const offset = noteRow.offsetLeft - (trackContainer.scrollLeft || 0);
    const fallbackWidth = totalUnits * UNIT_PX;
    const baseWidth = Math.max(fallbackWidth, noteRow.scrollWidth || noteRow.clientWidth || 0);
    const ratio = Math.min(1, Math.max(0, (totalUnits ? positionUnits / totalUnits : 0)));
    playheadElement.style.transition = "none";
    playheadElement.style.left = offset + baseWidth * ratio + "px";
}

function runPlayheadLoop(playheadElement, trackListElement) {
    if (!playbackState.isPlaying || !playbackState.timeline || !playbackState.startTimestamp) return;
    if (loopMode === 2) {
        const times = playbackState.timeline.times || [];
        const idx = Math.max(0, Math.min(playbackState.currentTimeIndex || 0, times.length - 1));
        const posUnits = times[idx] || 0;
        updatePlayheadPosition(playheadElement, playbackState.timeline.totalUnits, posUnits, trackListElement);
    } else {
        const totalMs = playbackState.loopStepMs ?? (playbackState.timeline.totalUnits * getUnitMs());
        const elapsed = performance.now() - playbackState.startTimestamp + playbackState.pausedElapsed;
        const ratio = Math.min(1, elapsed / totalMs);
        updatePlayheadPosition(playheadElement, playbackState.timeline.totalUnits, playbackState.timeline.totalUnits * ratio, trackListElement);

        if (ratio >= 1) {
            stopPlayback(true);
            return;
        }
    }
    playbackState.playheadRAF = requestAnimationFrame(() => runPlayheadLoop(playheadElement, trackListElement));
}

function getCurrentTimeKey() {
    const timeline = playbackState.timeline || buildTimeline(getTracks());
    if (!timeline || !timeline.times || !timeline.times.length) return null;
    const idx = playbackState.currentTimeIndex || 0;
    return timeline.times[Math.min(idx, timeline.times.length - 1)];
}

function getEventDurationMs(evt) {
    const unitMs = getUnitMs();
    const playable = (evt?.notes || []).filter(n => !n.rest && Number.isFinite(n.midi));
    const baseDurMs = playable.length
        ? Math.max(...playable.map(n => Math.max(100, (n.durationMultiplier || 1) * unitMs * (sustainLong ? 2.0 : 1))))
        : unitMs;
    const arpeggiate = arpeggioMode !== "off";
    if (!arpeggiate) return baseDurMs;
    const order = buildArpeggioOrder(playable, arpeggioMode);
    const stepDelay = computeArpeggioStepDelay(order, unitMs);
    const extra = stepDelay * Math.max(0, order.length - 1);
    return baseDurMs + extra;
}

function toggleManualSelection(timeKey, stringNumber, midi) {
    if (timeKey === null || !Number.isInteger(stringNumber)) return;
    let perTime = manualStepSelections.get(timeKey);
    if (!perTime) {
        perTime = new Map();
        manualStepSelections.set(timeKey, perTime);
    }
    lastManualTimeKey = timeKey;
    if (perTime.get(stringNumber) === midi) {
        perTime.delete(stringNumber);
    } else {
        perTime.set(stringNumber, midi);
    }
}

function updateManualFretHighlight(timeKey) {
    const cells = document.querySelectorAll("#fretboardTable td[data-midi][data-string]");
    cells.forEach(c => c.classList.remove("manual-selection"));
    if (timeKey === null) return;
    const perTime = manualStepSelections.get(timeKey);
    if (!perTime) return;
    cells.forEach(cell => {
        const str = Number(cell.dataset.string);
        const midi = Number(cell.dataset.midi);
        if (perTime.get(str) === midi) {
            cell.classList.add("manual-selection");
        }
    });
}

function midiToLabel(midi) {
    const { name, octave } = midiToNote(midi);
    return name + octave;
}

function hexToRgb(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec((hex || "").trim());
    if (!m) return null;
    const v = m[1];
    return {
        r: parseInt(v.slice(0, 2), 16),
        g: parseInt(v.slice(2, 4), 16),
        b: parseInt(v.slice(4, 6), 16)
    };
}
function srgbToLinear(c) {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function relativeLuminance(rgb) {
    if (!rgb) return 0;
    const R = srgbToLinear(rgb.r);
    const G = srgbToLinear(rgb.g);
    const B = srgbToLinear(rgb.b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function contrastRatio(rgb1, rgb2) {
    const L1 = relativeLuminance(rgb1);
    const L2 = relativeLuminance(rgb2);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
}
function pickTextColor(bgHex) {
    const bg = hexToRgb(bgHex);
    const black = { r: 0, g: 0, b: 0 };
    const white = { r: 255, g: 255, b: 255 };
    const cBlack = contrastRatio(bg, black);
    const cWhite = contrastRatio(bg, white);
    return cBlack >= cWhite ? "#000000" : "#FFFFFF";
}

const INTERVAL_NAMES = {
    0: "Prime",
    1: "kl.2",
    2: "gr.2",
    3: "kl.3",
    4: "gr.3",
    5: "Quarte",
    6: "Tritonus",
    7: "Quinte",
    8: "kl.6",
    9: "gr.6",
    10: "kl.7",
    11: "gr.7",
    12: "Oktave"
};

function describeInterval(semitones) {
    const dir = semitones >= 0 ? "+" : "-";
    const abs = Math.abs(semitones);
    const base = INTERVAL_NAMES[abs % 12] || `${abs % 12} HT`;
    const octaves = Math.floor(abs / 12);
    const octTxt = octaves > 0 ? ` +${octaves} Okt.` : "";
    return `${dir}${base}${octTxt} (${dir}${abs})`;
}

function recordInterval(midi, source = "") {
    if (!Number.isFinite(midi) || !intervalTrackingEnabled) return;
    if (!intervalOneShot) return;
    const now = performance.now();
    if (now - lastIntervalTime < intervalHoldMs) return;
    if (lastIntervalMidi === null) {
        intervalHistory.unshift({
            from: midi,
            to: midi,
            diff: 0,
            source: source || "Start"
        });
    } else {
        const diff = midi - lastIntervalMidi;
        intervalHistory.unshift({
            from: lastIntervalMidi,
            to: midi,
            diff,
            source
        });
    }
    intervalHistory = intervalHistory.slice(0, 4);
    lastIntervalMidi = midi;
    intervalOneShot = false;
    lastIntervalTime = now;
    renderIntervalHistory();
}

function renderIntervalHistory() {
    const list = document.getElementById("intervalList");
    if (!list) return;
    if (!intervalTrackingEnabled) {
        list.textContent = "Tippe auf den Graphen, um Intervalle zu starten.";
        return;
    }
    if (!intervalHistory.length) {
        list.textContent = "Noch keine Intervalle.";
        return;
    }
    list.innerHTML = "";
    intervalHistory.forEach((item, idx) => {
        const row = document.createElement("div");
        row.className = "interval-row";
        if (idx === 0) row.classList.add("latest");
        const fade = Math.max(0.3, 1 - idx * 0.15);
        const scale = Math.max(0.8, 1 - idx * 0.05);
        row.style.opacity = String(fade);
        row.style.transform = `scale(${scale})`;

        const notes = document.createElement("span");
        notes.className = "interval-notes";
        notes.textContent = `${midiToLabel(item.from)} → ${midiToLabel(item.to)}`;

        const name = document.createElement("span");
        name.className = "interval-name";
        name.textContent = describeInterval(item.diff);

        const src = document.createElement("span");
        src.className = "interval-source";
        src.textContent = sourceLabel(item.source);

        row.appendChild(notes);
        row.appendChild(name);
        row.appendChild(src);
        list.appendChild(row);
    });
}

function sourceLabel(source) {
    switch (source) {
        case "mic": return "Stimmgerät";
        case "piano": return "Klavier";
        case "fretboard": return "Griffbrett";
        case "chord": return "Akkord";
        default: return source || "Eingabe";
    }
}

function ensureStaffTrack(index) {
    while (staffNotes.length <= index) {
        staffNotes.push([]);
    }
    return index;
}

function renderStaffPreview(midi, trackIndex) {
    renderStaffHistory({ midi, trackIndex });
}

function addStaffNote(midi, trackIndex = getActiveTrack()) {
    if (!recordingEnabled) {
        renderStaffPreview(midi, trackIndex);
        return;
    }
    const idx = ensureStaffTrack(trackIndex);
    staffNotes[idx].push(midi);
    staffAllNotes.push(midi);
    renderStaffHistory();
}

function buildArpeggioOrder(notes, mode = "off") {
    if (!Array.isArray(notes) || mode === "off") return notes;
    const byTrack = [...notes].sort((a, b) => a.trackIndex - b.trackIndex);
    if (mode === "down") return byTrack.slice().reverse();
    if (mode === "updown") {
        const ascending = byTrack;
        const descending = byTrack.slice(0, -1).reverse(); // avoid duplicate endpoints
        return ascending.concat(descending);
    }
    return byTrack;
}

function computeArpeggioStepDelay(order, unitMs) {
    if (!order || !order.length) return 0;
    const maxDurMs = Math.max(...order.map(n => Math.max(80, (n.durationMultiplier || 1) * unitMs)));
    const budget = Math.max(120, maxDurMs);
    const perStep = budget / Math.max(1, order.length);
    return Math.max(45, Math.min(200, perStep));
}

function renderStaffHistory(preview = null) {
    const container = document.getElementById("staffNoteContainer");
    if (!container) return;
    preserveViewport(() => {
        container.innerHTML = "";
    const row = document.createElement("div");
    row.className = "staff-row";
    const label = document.createElement("div");
    label.className = "staff-label";
    label.textContent = "Leeren";
    row.appendChild(label);

    const notesWrap = document.createElement("div");
    notesWrap.className = "staff-notes";
    const recent = staffAllNotes.slice(-12).reverse(); // newest links
    if (recent.length === 0) {
        const empty = document.createElement("div");
        empty.className = "staff-empty";
        empty.textContent = "–";
        notesWrap.appendChild(empty);
    } else {
        let lastClef = null;
        recent.forEach(m => {
            const { name, octave } = midiToNote(m);
            const pos = getNearestUkulelePosition(m);
            const isBass = octave < 4 || (octave === 4 && ["A", "B"].includes(name.replace("#","").replace("b","")));
            const clef = isBass ? "bass" : "treble";
            const svg = buildStaffSVG(name, octave, pos, { showClef: clef !== lastClef });
            lastClef = clef;
            svg.style.marginRight = "4px";
            notesWrap.appendChild(svg);
        });
    }
    row.appendChild(notesWrap);
    container.appendChild(row);

    if (preview && Number.isFinite(preview.midi)) {
        const row = document.createElement("div");
        row.className = "staff-row";
        const label = document.createElement("div");
        label.className = "staff-label";
        label.textContent = "Vorschau";
        row.appendChild(label);
        const notesWrap = document.createElement("div");
        notesWrap.className = "staff-notes";
        const { name, octave } = midiToNote(preview.midi);
        const pos = getNearestUkulelePosition(preview.midi);
        const svg = buildStaffSVG(name, octave, pos, { showClef: true });
        notesWrap.appendChild(svg);
        row.appendChild(notesWrap);
        container.appendChild(row);
    }
    });
}

function buildStaffSVG(noteName, octave, posInfo = null, opts = {}) {
    const svgNS = "http://www.w3.org/2000/svg";
    const width = 220;
    const height = 180;
    const lineSpacing = 12;
    const c4Y = 140; // Referenzposition C4
    const notesOrder = ["C", "D", "E", "F", "G", "A", "B"];
    const baseIdx = notesOrder.indexOf("C");
    const noteBase = noteName.replace("#", "").replace("b", "");
    const noteIdx = notesOrder.indexOf(noteBase);
    const stepsFromC4 = (octave - 4) * 7 + (noteIdx - baseIdx);
    const yPos = c4Y - stepsFromC4 * (lineSpacing / 2);
    const staffBottom = c4Y - lineSpacing; // E4
    const staffTop = staffBottom - lineSpacing * 4; // F5
    const isBass = octave < 4 || (octave === 4 && ["A", "B"].includes(noteBase));

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    // Staff lines
    for (let i = 0; i < 5; i++) {
        const y = staffBottom - i * lineSpacing;
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", "10");
        line.setAttribute("y1", y);
        line.setAttribute("x2", String(width - 10));
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "#ffffff");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
    }

    // Clef (optional)
    if (opts.showClef !== false) {
        const clef = document.createElementNS(svgNS, "text");
        clef.setAttribute("x", "14");
        clef.setAttribute("y", isBass ? "123" : "137");
        clef.setAttribute("font-size", isBass ? "68" : "110");
        clef.setAttribute("fill", "#0b0b0b");
        clef.textContent = isBass ? "\uD834\uDD22" : "\uD834\uDD1E";
        clef.classList.add("notenschluessel");
        svg.appendChild(clef);
    }

    // Ledger lines
    const ledgerGroup = document.createElementNS(svgNS, "g");
    ledgerGroup.setAttribute("stroke", "#ffffff");
    ledgerGroup.setAttribute("stroke-width", "2");
    const addLedger = y => {
        const l = document.createElementNS(svgNS, "line");
        l.setAttribute("x1", "60");
        l.setAttribute("y1", y);
        l.setAttribute("x2", "120");
        l.setAttribute("y2", y);
        ledgerGroup.appendChild(l);
    };
    if (yPos < staffTop - lineSpacing / 2) {
        for (let y = staffTop - lineSpacing; y >= yPos; y -= lineSpacing) addLedger(y);
    }
    if (yPos > staffBottom + lineSpacing / 2) {
        for (let y = staffBottom + lineSpacing; y <= yPos; y += lineSpacing) addLedger(y);
    }
    svg.appendChild(ledgerGroup);

    // Note head
    const midi = midiFromNameOctave(noteName, octave);
    const headColor = midi !== null ? midiToColor(midi) : "#000000";
    const head = document.createElementNS(svgNS, "ellipse");
    head.setAttribute("cx", "80");
    head.setAttribute("cy", yPos);
    head.setAttribute("rx", "9");
    head.setAttribute("ry", "7");
    head.setAttribute("fill", "transparent");
    head.setAttribute("stroke", headColor);
    head.setAttribute("stroke-width", "4");
    head.setAttribute("vector-effect", "non-scaling-stroke");
    head.classList.add("notecircle");
    head.classList.add("length_1");
    svg.appendChild(head);

    // Small string label on the note
    if (posInfo && Number.isInteger(posInfo.stringIndex)) {
        const txt = document.createElementNS(svgNS, "text");
        txt.setAttribute("x", "80");
        txt.setAttribute("y", yPos + 1);
        txt.setAttribute("text-anchor", "middle");
        txt.setAttribute("fill", "#0b0b0b");
        txt.setAttribute("font-size", "9");
        txt.setAttribute("font-weight", "800");
        txt.textContent = `${posInfo.stringIndex + 1}.`;
        txt.classList.add("string", `string_${posInfo.stringIndex + 1}`);
        svg.appendChild(txt);
    }

    // Accidental
    const acc = noteName.includes("#") ? "\u266F" : noteName.includes("b") ? "\u266D" : "";
    if (acc) {
        const accText = document.createElementNS(svgNS, "text");
        accText.setAttribute("x", "54");
        accText.setAttribute("y", yPos + 8);
        accText.setAttribute("font-size", "22");
        accText.setAttribute("fill", "#0b0b0b");
        accText.textContent = acc;
        accText.classList.add("vorzeichen");
        svg.appendChild(accText);
    }

    // Label
    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", "10");
    label.setAttribute("y", "24");
    label.setAttribute("fill", "#0b0b0b");
    label.setAttribute("font-size", "16");
    label.textContent = noteName + octave;
    svg.appendChild(label);

    // Fret label under staff
    if (posInfo && Number.isFinite(posInfo.fret)) {
        const fretText = document.createElementNS(svgNS, "text");
        fretText.setAttribute("x", "80");
        fretText.setAttribute("y", "160");
        fretText.setAttribute("text-anchor", "middle");
        fretText.setAttribute("fill", "#ffffff");
        fretText.setAttribute("font-size", "11");
        fretText.textContent = `+${posInfo.fret}`;
        fretText.classList.add("bund");
        svg.appendChild(fretText);
    }

    return svg;
}

function describeDuration(multiplier = 1) {
    const FRACTIONS = [
        { value: 1, label: "1" },
        { value: 0.5, label: "1/2" },
        { value: 1 / 3, label: "1/3" },
        { value: 0.25, label: "1/4" },
        { value: 1 / 6, label: "1/6" },
        { value: 0.125, label: "1/8" },
        { value: 1 / 16, label: "1/16" },
        { value: 1 / 32, label: "1/32" }
    ];

    const match = FRACTIONS.find(f => Math.abs((f.value || 0) - multiplier) < 0.0001);
    if (match) return match.label;
    return "×" + multiplier.toFixed(2);
}

function parseNoteList(text) {
    const tokens = text.split(/[\s,;]+/).map(t => t.trim()).filter(Boolean);
    const result = [];
    tokens.forEach(tok => {
        const midi = noteNameToMidi(tok);
        if (Number.isFinite(midi)) {
            result.push(midi);
        }
    });
    return result;
}

function noteNameToMidi(token) {
    const match = /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(token.trim());
    if (!match) return null;
    const [, letterRaw, accidental, octaveStr] = match;
    const letter = letterRaw.toUpperCase();
    const octave = parseInt(octaveStr, 10);
    if (!Number.isInteger(octave)) return null;

    const offsets = {
        "C": 0, "C#": 1, "DB": 1,
        "D": 2, "D#": 3, "EB": 3,
        "E": 4,
        "F": 5, "F#": 6, "GB": 6,
        "G": 7, "G#": 8, "AB": 8,
        "A": 9, "A#": 10, "BB": 10,
        "B": 11, "H": 11
    };

    const key = (letter + (accidental || "")).toUpperCase();
    const offset = offsets[key];
    if (offset === undefined) return null;

    const midi = 12 * (octave + 1) + offset;
    if (midi < 0 || midi > 127) return null;
    return midi;
}

function setupRecordToggle(btn, badge, statusElement, trackListElement, playheadElement) {
    if (!btn) return;
    const chipRec = document.getElementById("chipRec");
    const syncUI = () => {
        if (recordingEnabled) {
            btn.textContent = "Aufnahme aktiv";
            btn.classList.remove("off");
            chipRec?.classList.add("on");
        } else {
            btn.textContent = "Aufnahme aus";
            btn.classList.add("off");
            chipRec?.classList.remove("on");
        }
    };
    btn.addEventListener("click", () => {
        recordingEnabled = !recordingEnabled;
        syncUI();
        if (statusElement) updateMelodyStatus(statusElement);
        renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
    });
    syncUI();
}

function setupOptionToggles(sustainBtn, arpeggioBtn) {
    const sync = () => {
        if (sustainBtn) {
            sustainBtn.textContent = "Sustain: " + (sustainLong ? "lang" : "kurz");
        }
        if (arpeggioBtn) {
            const label = arpeggioMode === "off" ? "aus"
                : arpeggioMode === "up" ? "aufwärts"
                : arpeggioMode === "down" ? "abwärts"
                : "auf/ab";
            arpeggioBtn.textContent = "Arpeggio: " + label;
        }
    };
    sustainBtn?.addEventListener("click", () => {
        sustainLong = !sustainLong;
        sync();
    });
    arpeggioBtn?.addEventListener("click", () => {
        const idx = ARPEGGIO_MODES.indexOf(arpeggioMode);
        arpeggioMode = ARPEGGIO_MODES[(idx + 1) % ARPEGGIO_MODES.length];
        sync();
    });
    sync();
}

function setupTransposeControls(controls, statusElement, trackListElement, playheadElement) {
    if (!controls) return;
    const { up, down, reset, display } = controls;
    const clamp = v => Math.max(-24, Math.min(24, Math.round(v)));
    const sync = () => {
        if (display) display.textContent = transposeSemitones > 0 ? "+" + transposeSemitones : String(transposeSemitones);
        if (statusElement) updateMelodyStatus(statusElement);
        renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
    };
    down?.addEventListener("click", () => {
        transposeSemitones = clamp(transposeSemitones - 1);
        sync();
    });
    up?.addEventListener("click", () => {
        transposeSemitones = clamp(transposeSemitones + 1);
        sync();
    });
    reset?.addEventListener("click", () => {
        transposeSemitones = 0;
        sync();
    });
    sync();
}

function handleDurationClick(idx, trackIndex, event, trackListElement, playheadElement, statusElement) {
    const current = (getNoteAt(idx, trackIndex)?.durationMultiplier) || 1;
    let next;
    if (event.detail >= 2) {
        openDurationMenu(event.currentTarget, value => {
            if (!value) return;
            setNoteDuration(idx, value, trackIndex);
            renderMelodyTracks(trackListElement, playheadElement, { track: trackIndex, index: idx }, statusElement);
            if (statusElement) updateMelodyStatus(statusElement);
        });
        return;
    } else if (event.shiftKey) {
        next = Math.min(current * 2, 16); // deckeln, damit es nicht ausufert
    } else {
        const sequenceIndex = Math.min(CLICK_SEQUENCE.length - 1, Math.max(0, (event.detail || 1) - 1));
        next = CLICK_SEQUENCE[sequenceIndex] || 1;
    }
    setNoteDuration(idx, next, trackIndex);

    renderMelodyTracks(trackListElement, playheadElement, { track: trackIndex, index: idx }, statusElement);
    if (statusElement) updateMelodyStatus(statusElement);
}

function openDurationMenu(target, onPick) {
    if (!target || typeof onPick !== "function") return;
    // remove existing
    document.querySelectorAll(".duration-menu").forEach(el => el.remove());
    const menu = document.createElement("div");
    menu.className = "duration-menu";
    const options = [
        { value: 1, label: "1" },
        { value: 0.5, label: "1/2" },
        { value: 1 / 3, label: "1/3" },
        { value: 0.25, label: "1/4" },
        { value: 1 / 6, label: "1/6" },
        { value: 0.125, label: "1/8" },
        { value: 1 / 16, label: "1/16" },
        { value: 1 / 32, label: "1/32" }
    ];
    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = opt.label;
        btn.addEventListener("click", () => {
            onPick(opt.value);
            menu.remove();
        });
        menu.appendChild(btn);
    });
    const rect = target.getBoundingClientRect();
    menu.style.position = "fixed";
    menu.style.left = rect.left + "px";
    menu.style.top = rect.bottom + 6 + "px";
    document.body.appendChild(menu);
    const close = e => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener("mousedown", close);
        }
    };
    document.addEventListener("mousedown", close);
}

function insertEntryAt(index, entry, trackIndex) {
    if (entry && entry.rest) {
        insertRestAt(index, entry.durationMultiplier, trackIndex);
    } else if (entry && Number.isFinite(entry.midi)) {
        insertNoteAt(index, entry.midi, entry.durationMultiplier, trackIndex);
    }
}

function removeNoteAndFixState(index, trackIndex) {
    stopPlayback(false);
    removeNoteAt(index, trackIndex);
    trackCursors[trackIndex] = Math.max(0, Math.min(trackCursors[trackIndex] || 0, getMelodyLength(trackIndex)));
}

function getClickIndexFromEvent(event, trackIndex) {
    const melody = getMelody(trackIndex);
    if (!melody.length) return 0;
    const rect = event.currentTarget.getBoundingClientRect();
    const offset = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
    return offsetToIndex(melody, offset);
}

function setCursorFromPosition(event, trackIndex, playheadElement, trackListElement, statusElement) {
    const targetIndex = getClickIndexFromEvent(event, trackIndex);
    trackCursors[trackIndex] = targetIndex;
    renderMelodyTracks(trackListElement, playheadElement, null, statusElement);
    if (statusElement) updateMelodyStatus(statusElement);
}

function ratioToIndex(melody, ratio) {
    const total = calculateTotalUnits(melody);
    let consumed = 0;
    for (let i = 0; i < melody.length; i++) {
        const width = melody[i].durationMultiplier || 1;
        const next = consumed + width;
        if (ratio <= next / total) {
            return i;
        }
        consumed = next;
    }
    return melody.length;
}

function offsetToIndex(melody, offsetPx) {
    if (!melody || !melody.length) return 0;
    let x = Math.max(0, offsetPx);
    for (let i = 0; i < melody.length; i++) {
        const widthPx = (melody[i].durationMultiplier || 1) * UNIT_PX;
        if (x <= widthPx) return i;
        x -= widthPx;
    }
    return melody.length;
}

function pressPianoKey(midi, durationMs = 220) {
    const el = pianoKeyMap.get(midi);
    if (!el) return;
    const token = String(performance.now() + Math.random());
    el.dataset.playToken = token;
    el.classList.add("playing");
    applyPianoLumaToKey(el, midi);
    updatePianoPlayingState();
    setTimeout(() => {
        if (el.dataset.playToken !== token) return;
        el.classList.remove("playing");
        applyPianoLumaToKey(el, midi);
        updatePianoPlayingState();
    }, Math.max(120, durationMs));
}

function buildTimeline(tracks) {
    const eventsMap = new Map();
    let totalUnits = 0;
    let lastNoteEnd = 0;
    tracks.forEach((track, trackIdx) => {
        let time = 0;
        track.forEach((note, noteIdx) => {
            const dur = note.durationMultiplier || 1;
            const isRest = note && (note.rest || note.type === "rest");
            if (!isRest) {
                const arr = eventsMap.get(time) || [];
                arr.push({ ...note, trackIndex: trackIdx, noteIndex: noteIdx });
                eventsMap.set(time, arr);
                lastNoteEnd = Math.max(lastNoteEnd, time + dur);
            }
            time += dur;
        });
        totalUnits = Math.max(totalUnits, time);
    });

    const times = Array.from(eventsMap.keys()).sort((a, b) => a - b);
    const events = times.map(time => ({ time, notes: eventsMap.get(time) || [] }));
    return { events, totalUnits: lastNoteEnd || totalUnits, times };
}

/* ---------- Akkord-Tool ---------- */
function setupChordTool() {
    const rootSel = document.getElementById("chordRoot");
    const rootWheel = document.getElementById("chordRootWheel");
    const triadSel = document.getElementById("chordTriad");
    const extMulti = document.getElementById("chordExtensions");
    const showBtn = document.getElementById("showChordButton");
    const diagramEl = document.getElementById("chordDiagram");
    const tabEl = document.getElementById("chordTabText");
    const muteBtn = document.getElementById("chordMuteGlobal");
    const penBtn = document.getElementById("chordPenButton");
    if (!rootSel || !showBtn || !diagramEl || !tabEl) return;

    const renderForRoot = (root, fromSelect = false) => {
        const sel = chordSelections[root] || { triad: "maj", extensions: [] };
        const key = normalizeChordKey(root, sel);
        const shape = chordShapes[key] || computeChordShape(root, sel);
        applyChordHue(rootSel.value);
        const labelText = root + chordLabelSuffix(sel);
        const activeSeg = rootWheel?.querySelector(`.chord-segment[data-root="${root}"] .chord-root-label`);
        if (activeSeg) activeSeg.textContent = labelText;
        const segEl = rootWheel?.querySelector(`.chord-segment[data-root="${root}"]`);
        applyChordColor(segEl, shape);
        if (!shape) {
            diagramEl.textContent = "Keine Form gespeichert.";
            tabEl.textContent = "–";
            return;
        }
        diagramEl.textContent = buildChordDiagram(shape);
        tabEl.textContent = buildChordTabText(shape, labelText, buildChordLabel(sel));
        playChordWithMute(shape);
        if (recordingEnabled) {
            addChordNotesToTracks(shape);
        }
        highlightUkuleleForMidis(shape.map((f, idx) => UKULELE_STRINGS[idx].openMidi + f), { scroll: true });
    };

    const renderForState = (root, sel) => {
        chordSelections[root] = {
            triad: sel.triad || "maj",
            extensions: sanitizeExtensions(sel.extensions || []),
            explicitExtensions: sel.explicitExtensions || (sel.extensions || [])
        };
        renderForRoot(root);
    };

    const syncActive = root => {
        rootWheel?.querySelectorAll(".chord-segment").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.root === root);
        });
        rootSel.value = root;
    };

    const bindSegment = btn => {
        const root = btn.dataset.root;
        if (!root) return;
        if (!chordSelections[root]) chordSelections[root] = { triad: "maj", extensions: [] };
        const triadDots = btn.querySelectorAll(".dot[data-triad]");
        const top = btn.querySelector(".dot-top");
        const bottom = btn.querySelector(".dot-bottom");
        // Ensure a single power-5 dot exists and place it immediately after the last triad dot (so it's visually grouped)
        let pow = btn.querySelector('[data-ext="5"]');
        const lastTriad = top?.querySelector('.dot[data-triad]:last-of-type');
        if (pow) {
            if (top && pow.parentElement !== top) {
                if (lastTriad) lastTriad.insertAdjacentElement('afterend', pow);
                else top.appendChild(pow);
            } else if (top && lastTriad && pow.parentElement === top) {
                // ensure correct position inside top
                if (lastTriad.nextElementSibling !== pow) lastTriad.insertAdjacentElement('afterend', pow);
            }
        } else if (top) {
            pow = document.createElement("span");
            pow.className = "dot";
            pow.dataset.ext = "5";
            pow.title = "5";
            pow.dataset.label = "5";
            if (lastTriad) lastTriad.insertAdjacentElement('afterend', pow);
            else top.appendChild(pow);
        }
        const extDots = btn.querySelectorAll(".dot[data-ext]");
        const rootLabel = btn.querySelector(".chord-root-label");
        const applyState = () => {
            const state = chordSelections[root];
            if (rootLabel) rootLabel.textContent = root + chordLabelSuffix(state);
            triadDots.forEach(d => d.classList.toggle("active", d.dataset.triad === state.triad));
            const explicit = (state.explicitExtensions || []).slice();
            extDots.forEach(d => {
                const has = state.extensions.includes(d.dataset.ext);
                d.classList.toggle("active", has);
                d.classList.toggle("implied", has && !explicit.includes(d.dataset.ext));
            });
        };
        triadDots.forEach(d => {
            const lab = triadDotLabels[d.dataset.triad] || d.dataset.triad || "";
            d.dataset.label = lab;
            d.classList.toggle("label-up", lab === "b3");
            d.classList.toggle("label-down", lab === "3");
        });
        extDots.forEach(d => {
            d.dataset.label = d.dataset.ext || "";
            d.classList.toggle("label-up", d.dataset.ext === "maj7");
            d.classList.toggle("label-down", d.dataset.ext === "13");
        });
        triadDots.forEach(dot => {
            dot.addEventListener("click", e => {
                e.stopPropagation();
                chordSelections[root].triad = dot.dataset.triad || "maj";
                applyState();
                syncActive(root);
                renderForRoot(root, true);
            });
            dot.addEventListener("dblclick", e => {
                e.stopPropagation();
                if (muteBtn) muteBtn.click();
            });
            dot.addEventListener("mouseenter", () => {
                const previewSel = { ...chordSelections[root], triad: dot.dataset.triad || "maj" };
                if (rootLabel) {
                    rootLabel.textContent = root + chordLabelSuffix(previewSel);
                    rootLabel.classList.add("preview");
                }
            });
            dot.addEventListener("mouseleave", () => {
                if (rootLabel) {
                    rootLabel.textContent = root + chordLabelSuffix(chordSelections[root]);
                    rootLabel.classList.remove("preview");
                }
            });
        });
        extDots.forEach(dot => {
            dot.addEventListener("click", e => {
                e.stopPropagation();
                const current = chordSelections[root].extensions[0] || "";
                const next = current === dot.dataset.ext ? "" : dot.dataset.ext;
                chordSelections[root].extensions = sanitizeExtensions(next ? [next] : []);
                chordSelections[root].explicitExtensions = next ? [next] : [];
                applyState();
                syncActive(root);
                renderForRoot(root, true);
            });
            dot.addEventListener("dblclick", e => {
                e.stopPropagation();
                if (muteBtn) muteBtn.click();
            });
            dot.addEventListener("mouseenter", () => {
                const previewSel = { ...chordSelections[root], extensions: dot.dataset.ext ? [dot.dataset.ext] : [] };
                if (rootLabel) {
                    rootLabel.textContent = root + chordLabelSuffix(previewSel);
                    rootLabel.classList.add("preview");
                }
            });
            dot.addEventListener("mouseleave", () => {
                if (rootLabel) {
                    rootLabel.textContent = root + chordLabelSuffix(chordSelections[root]);
                    rootLabel.classList.remove("preview");
                }
            });
        });
        btn.addEventListener("click", () => {
            syncActive(root);
            renderForRoot(root, false);
        });
        btn.addEventListener("pointerdown", e => startChordChipDrag(e, root, btn));
        applyState();
    };

    rootWheel?.querySelectorAll(".chord-segment").forEach(bindSegment);

    if (muteBtn) {
        muteBtn.addEventListener("click", e => {
            e.stopPropagation();
            chordMuteSelectOnce = true;
            chordMuteTimestamp = performance.now();
            muteBtn.classList.add("active");
            setTimeout(() => muteBtn.classList.remove("active"), 400);
        });
    }
    if (penBtn) {
        penBtn.addEventListener("click", () => setPenMode(!penMode));
    }

    const fullscreenBtn = document.getElementById("chordWheelFullscreen");
    const chordCard = document.querySelector(".chord-widget");
    if (fullscreenBtn && chordCard) {
        fullscreenBtn.addEventListener("click", () => {
            chordCard.classList.toggle("fullscreen");
            fullscreenBtn.textContent = chordCard.classList.contains("fullscreen") ? "⤢" : "⛶";
            syncChordWheelSize(true);
        });
    }

    showBtn.addEventListener("click", () => renderForRoot(rootSel.value));
    rootSel.addEventListener("change", () => {
        syncActive(rootSel.value);
        renderForRoot(rootSel.value);
    });
    if (rootWheel) {
        rootWheel.addEventListener("click", e => {
            const btn = e.target.closest("button[data-root]");
            if (!btn) return;
            const value = btn.dataset.root;
            rootSel.value = value;
            rootWheel.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
            renderForRoot(value);
        });
    }
    chordRenderCallback = renderForState;
    renderForRoot(rootSel.value || "C");
}

function startChordChipDrag(event, root, btn) {
    if (event.target.closest(".chord-triad-select, .chord-ext-select, .chord-mute")) return;
    const startX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
    const startY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0;
    let moved = false;
    let chip = null;
    const state = { ...(chordSelections[root] || { triad: "maj", extensions: [] }) };

    const onMove = ev => {
        const x = ev.clientX || (ev.touches && ev.touches[0]?.clientX) || 0;
        const y = ev.clientY || (ev.touches && ev.touches[0]?.clientY) || 0;
        if (!moved && Math.hypot(x - startX, y - startY) > 6) {
            moved = true;
            chip = createChordChip(root, state);
            document.body.appendChild(chip);
            chordChips.add(chip);
        }
        if (chip) {
            chip.style.left = x + "px";
            chip.style.top = y + "px";
        }
    };
    const onUp = ev => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        if (chip) {
            chip.style.cursor = "grab";
        }
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
}

function createChordChip(root, state) {
    const chip = document.createElement("div");
    chip.className = "chord-chip";
    chip.dataset.root = root;
    chip.dataset.triad = state.triad || "maj";
    chip.dataset.extensions = (state.extensions || []).join(",");
    const label = buildChordLabel(state);
    chip.style.transform = "none";
    chip.innerHTML = `
        <span class="chip-root">${root}</span>
        <span class="chip-label">${label || "Dur"}</span>
        <button class="chip-close" type="button">×</button>
    `;
    // match segment color if possible
    const seg = document.querySelector(`.chord-segment[data-root="${root}"]`);
    if (seg) {
        const style = window.getComputedStyle(seg);
        chip.style.background = style.background;
        chip.style.color = style.color;
        chip.style.borderColor = "rgba(0,0,0,0.2)";
    }
    const play = () => {
        if (typeof chordRenderCallback === "function") {
            chordRenderCallback(root, {
                triad: chip.dataset.triad || "maj",
                extensions: (chip.dataset.extensions || "").split(",").filter(Boolean)
            });
        } else {
            renderForState(root, {
                triad: chip.dataset.triad || "maj",
                extensions: (chip.dataset.extensions || "").split(",").filter(Boolean)
            });
        }
    };
    chip.addEventListener("click", e => {
        if (e.target.classList.contains("chip-close")) return;
        play();
    });
    chip.querySelector(".chip-close")?.addEventListener("click", e => {
        e.stopPropagation();
        chip.remove();
        chordChips.delete(chip);
    });
    // Drag chip itself
    chip.addEventListener("pointerdown", e => {
        e.stopPropagation();
        const rect = chip.getBoundingClientRect();
        let startX = e.clientX;
        let startY = e.clientY;
        const offsetX = startX - rect.left;
        const offsetY = startY - rect.top;
        const onMove = ev => {
            chip.style.left = ev.clientX - offsetX + "px";
            chip.style.top = ev.clientY - offsetY + "px";
        };
        const onUp = () => {
            document.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerup", onUp);
        };
        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
    });
    return chip;
}

function applyChordHue(root) {
    const pc = noteNameToPitchClass(root) ?? 0;
    const baseColor = midiToColor(60 + pc) || "#7aa0ff";
    const tool = document.getElementById("chordTool");
    if (tool) tool.style.setProperty("--chord-hue", 0);
    const wheel = document.getElementById("chordRootWheel");
    if (wheel) {
        wheel.querySelectorAll(".chord-segment").forEach(seg => {
            const segRoot = seg.dataset.root || seg.querySelector(".chord-root-label")?.textContent?.trim() || root;
            const segPc = noteNameToPitchClass(segRoot) ?? pc;
            const color = midiToColor(60 + segPc) || baseColor;
            seg.style.background = color;
            seg.style.color = getContrastColor(color);
        });
    }
}

function normalizeChordKey(root, options = {}) {
    const { triad = "maj", extensions = [] } = options;
    const cleanRoot = (root || "C").replace("H", "B").replace("h", "B");
    const map = { "Db": "C#", "EB": "D#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#" };
    const rootKey = map[cleanRoot] || cleanRoot;
    const extList = sanitizeExtensions(Array.isArray(extensions) ? extensions : [extensions].filter(Boolean));
    const extKey = extList.join("+");
    return extKey ? `${rootKey}:${triad}:${extKey}` : `${rootKey}:${triad}`;
}

function buildChordDiagram(shape) {
    const strings = ["A", "E", "C", "G"];
    return strings.map((name, idx) => {
        const fret = shape[idx] ?? 0;
        return `${name}|--${String(fret).padEnd(2, "-")}--|`;
    }).join("\n");
}

function chordShapeToNoteLabels(shape) {
    const labels = [];
    shape.forEach((f, idx) => {
        const midi = UKULELE_STRINGS[idx].openMidi + f;
        labels.push(midiToLabel(midi));
    });
    return labels;
}

function applyChordColor(btn, shape) {
    if (!btn || !shape) return;
    const hues = [];
    shape.forEach((f, idx) => {
        const midi = UKULELE_STRINGS[idx].openMidi + f;
        const h = Number(midiToHue(midi));
        if (Number.isFinite(h)) hues.push(h % 360);
    });
    if (!hues.length) return;
    const mix = averageHue(hues);
    btn.style.background = `linear-gradient(135deg, hsla(${mix}, 32%, 62%, 0.9), hsla(${mix}, 24%, 44%, 0.92))`;
}

function buildChordTabText(shape, root, base, add = "") {
    const strings = ["A", "E", "C", "G"];
    const notes = strings.map((name, idx) => `${name}:${shape[idx] ?? 0}`).join("  ");
    const baseLabel = base === "maj" ? "" : base;
    const addLabel = add ? " " + add : "";
    const toneList = chordShapeToNoteLabels(shape).join(" ");
    return `${root}${baseLabel ? " " + baseLabel : ""}${addLabel} · ${notes} (${toneList})`;
}

function buildChordLabel(opts = {}) {
    const { triad = "maj", extensions = [] } = opts;
    const extList = sanitizeExtensions(Array.isArray(extensions) ? extensions : [extensions].filter(Boolean));
    const parts = [];
    parts.push(triad);
    extList.forEach(ext => parts.push(ext));
    return parts.join(" ");
}

function chordLabelSuffix(sel = {}) {
    const tri = triadShort[sel.triad] ?? "";
    const ext = sanitizeExtensions(sel.extensions || [])[0] || "";
    const extTxt = extShort[ext] ?? ext;
    if (!tri && !extTxt) return "";
    if (tri && extTxt) return `${tri}\n${extTxt}`;
    return tri || extTxt;
}

function computeChordShape(root, options = {}) {
    const rootPc = noteNameToPitchClass(root);
    if (rootPc === null) return null;
    const targets = getChordPitchClasses(rootPc, options);
    if (!targets || !targets.size) return null;

    const tuningMidis = [69, 64, 60, 67]; // A4, E4, C4, G4 (strings A E C G)
    const maxFret = 5;
    let best = null;

    const extList = sanitizeExtensions(Array.isArray(options.extensions) ? options.extensions : [options.extensions].filter(Boolean));
    const hasPower = extList.includes("5");

    // Define a small "core" that should be present whenever possible
    const core = new Set([rootPc]);
    const addCore = i => core.add((rootPc + i + 12) % 12);
    const triad = options.triad || "maj";
    if (hasPower) {
        addCore(7); // root + fifth only
    } else if (triad === "sus2") { addCore(2); addCore(7); }
    else if (triad === "sus4") { addCore(5); addCore(7); }
    else if (triad === "min") { addCore(3); addCore(7); }
    else if (triad === "aug") { addCore(4); addCore(8); }
    else if (triad === "dim") { addCore(3); addCore(6); }
    else { addCore(4); addCore(7); }

    const candidates = [];
    for (let a = 0; a <= maxFret; a++) {
        for (let e = 0; e <= maxFret; e++) {
            for (let c = 0; c <= maxFret; c++) {
                for (let g = 0; g <= maxFret; g++) {
                    candidates.push([a, e, c, g]);
                }
            }
        }
    }

    candidates.forEach(shape => {
        const pcs = new Set();
        shape.forEach((fret, idx) => {
            const midi = tuningMidis[idx] + fret;
            pcs.add(midi % 12);
        });
        const missingTargets = [...targets].filter(pc => !pcs.has(pc)).length;
        const missingCore = [...core].filter(pc => !pcs.has(pc)).length;
        const extras = [...pcs].filter(pc => !targets.has(pc)).length;

        const max = Math.max(...shape);
        const min = Math.min(...shape);
        const span = max - min;
        // scoring: prioritize presence of core, then targets, then compactness
        const score =
            missingCore * 200 +
            missingTargets * 40 +
            extras * 8 +
            max * 3 +
            span * 2 +
            shape.reduce((a, b) => a + b, 0);
        if (!best || score < best.score) {
            best = { shape, score };
        }
    });

    return best ? best.shape : null;
}

function noteNameToPitchClass(name) {
    if (!name) return null;
    const n = name.trim().toUpperCase().replace("H", "B");
    const map = {
        "C": 0, "C#": 1, "DB": 1,
        "D": 2, "D#": 3, "EB": 3,
        "E": 4, "F": 5, "F#": 6, "GB": 6,
        "G": 7, "G#": 8, "AB": 8,
        "A": 9, "A#": 10, "BB": 10,
        "B": 11, "H": 11
    };
    return map[n] ?? map[n[0]] ?? null;
}

function midiFromNameOctave(name, octave) {
    const pc = noteNameToPitchClass(name);
    if (pc === null || typeof octave !== "number") return null;
    return (octave + 1) * 12 + pc;
}

function getChordPitchClasses(rootPc, options = {}) {
    const { triad = "maj", extensions = [] } = options;
    const extList = sanitizeExtensions(Array.isArray(extensions) ? extensions : [extensions].filter(Boolean));
    const pcs = new Set([rootPc]);
    const addInterval = interval => pcs.add((rootPc + interval + 12) % 12);

    if (extList.includes("5")) {
        addInterval(7);
        return pcs;
    }
    // triad/sus
    if (triad === "sus2") { addInterval(2); addInterval(7); }
    else if (triad === "sus4") { addInterval(5); addInterval(7); }
    else if (triad === "min") { addInterval(3); addInterval(7); }
    else if (triad === "aug") { addInterval(4); addInterval(8); }
    else if (triad === "dim") { addInterval(3); addInterval(6); }
    else { addInterval(4); addInterval(7); } // maj default

    // extensions
    extList.forEach(ext => {
        switch (ext) {
            case "6": addInterval(9); break;
            case "7": addInterval(10); break;
            case "maj7": addInterval(11); break;
            case "9": addInterval(2); break;
            case "11": addInterval(5); break;
            case "13": addInterval(9); break;
            default: break;
        }
    });
    return pcs;
}

function sanitizeExtensions(extList = []) {
    const list = extList.filter(Boolean);
    const has = v => list.includes(v);
    if (has("5")) {
        return ["5"]; // powerchord wins
    }
    // 7 vs maj7
    if (has("maj7")) {
        while (list.includes("7")) list.splice(list.indexOf("7"), 1);
    }
    // 6 vs 13
    if (has("13")) {
        while (list.includes("6")) list.splice(list.indexOf("6"), 1);
        if (!has("7") && !has("maj7")) list.push("7");
    }
    // remove duplicates
    return Array.from(new Set(list));
}

const NOTE_NAMES_PC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "H"];

function detectChordFromNotes(midiList = []) {
    if (!Array.isArray(midiList) || midiList.length === 0) return "";
    const pcs = Array.from(new Set(midiList.map(m => ((m % 12) + 12) % 12)));
    const bassPc = ((Math.min(...midiList) % 12) + 12) % 12;
    const candidates = pcs.slice();

    const scoreForRoot = rootPc => {
        const rel = i => (rootPc + i) % 12;
        const has = i => pcs.includes(rel(i));

        const hasMin3 = has(3);
        const hasMaj3 = has(4);
        const has5 = has(7);
        const has2 = has(2);
        const has4th = has(5);
        const has6 = has(9);
        const hasb9 = has(1);
        const has7 = has(10);
        const hasMaj7 = has(11);

        let quality = "sus/unk";
        if (hasMaj3 && has5) quality = "maj";
        else if (hasMin3 && has5) quality = "min";
        else if (has4th && has5) quality = "sus4";
        else if (has2 && has5) quality = "sus2";

        let score = 0;
        if ((quality === "maj" || quality === "min") && has5) score += 40;
        if (quality === "sus4" || quality === "sus2") score += 25;
        if (has7) score += 10;
        if (hasMaj7) score += 12;
        if (has6) score += 6;
        if (has2) score += 4;
        if (hasb9) score -= (quality.startsWith("sus") ? 6 : 14);
        if (!has5) score -= 8;
        if (rootPc === bassPc) score += 3;

        const ext = [];
        if (has7) ext.push("7");
        if (hasMaj7) ext.push("maj7");
        if (has6) ext.push("6");
        if (has2) ext.push("9");
        if (hasb9) ext.push("b9");

        return { rootPc, quality, ext, score };
    };

    let best = null;
    for (const rootPc of candidates) {
        const s = scoreForRoot(rootPc);
        if (!best || s.score > best.score) best = s;
    }
    if (!best) return "";
    const rootName = NOTE_NAMES_PC[best.rootPc] || "?";
    const extTxt = best.ext.length ? " " + best.ext.join(" ") : "";
    return `${rootName} ${best.quality}${extTxt}`.trim();
}

function playChordShape(shape) {
    const unitMs = getUnitMs();
    const midis = shape.map((f, idx) => UKULELE_STRINGS[idx].openMidi + f);
    midis.forEach((midi, i) => {
        const freq = midiToFrequency(midi);
        playPluckedUkulele(freq, Math.max(140, unitMs * (sustainLong ? 2 : 1)), { peakGain: 0.18, attackMs: 12 + i * 8 });
        pressPianoKey(midi, unitMs);
        recordInterval(midi, "chord");
    });
}

function addChordNotesToTracks(shape) {
    shape.forEach((fret, idx) => {
        const midi = UKULELE_STRINGS[idx].openMidi + fret;
        const insertAt = Math.max(0, Math.min(trackCursors[idx] || 0, getMelodyLength(idx)));
        insertNoteAt(insertAt, midi, 1, idx);
        trackCursors[idx] = insertAt + 1;
        addStaffNote(midi, idx);
    });
    if (uiRefs.trackList && uiRefs.playhead) {
        renderMelodyTracks(uiRefs.trackList, uiRefs.playhead, null, uiRefs.status);
        if (uiRefs.status) updateMelodyStatus(uiRefs.status);
    }
}

function getNearestUkulelePosition(midi) {
    let best = null;
    findAllStringFrets(midi).forEach(p => {
        if (!best || p.fret < best.fret || (p.fret === best.fret && p.stringIndex < best.stringIndex)) {
            best = p;
        }
    });
    if (!best) return null;
    return { ...best, string: STRING_SHORT[best.stringIndex] || String(best.stringIndex + 1) };
}

function getPositionForTrack(midi, trackIndex) {
    if (!Number.isInteger(trackIndex)) return null;
    const strings = UKULELE_STRINGS;
    if (trackIndex < 0 || trackIndex >= strings.length) return null;
    const open = strings[trackIndex].openMidi;
    const fret = midi - open;
    if (fret >= 0 && fret <= 24) {
        return { stringIndex: trackIndex, fret, string: STRING_SHORT[trackIndex] };
    }
    return null;
}

function chooseNearestTrack(midi) {
    const positions = findAllStringFrets(midi);
    if (!positions.length) return getActiveTrack();
    positions.sort((a, b) => a.fret - b.fret || a.stringIndex - b.stringIndex);
    return positions[0].stringIndex;
}

function formatPositionLabel(pos) {
    if (!pos) return "";
    const idx = pos.stringIndex ?? 0;
    const name = pos.string || STRING_SHORT[idx] || String(idx + 1);
    return pos.fret ? `${name}+${pos.fret}` : name;
}

/* ---------- MIDI Export (inline, statt externem Modul) ---------- */

function encodeVLQ(value) {
    let buffer = value & 0x7F;
    const bytes = [];
    while ((value >>= 7)) {
        buffer <<= 8;
        buffer |= ((value & 0x7F) | 0x80);
    }
    while (true) {
        bytes.push(buffer & 0xFF);
        if (buffer & 0x80) buffer >>= 8;
        else break;
    }
    return bytes;
}

function normalizeNote(entry) {
    if (typeof entry === "number") return { midi: entry, durationMultiplier: 1 };
    if (entry && entry.rest) {
        const d = Number(entry.durationMultiplier) || 1;
        return { rest: true, durationMultiplier: d > 0 ? d : 1 };
    }
    if (entry && typeof entry.midi === "number") {
        const midi = Number(entry.midi);
        const d = Number(entry.durationMultiplier) || 1;
        if (!Number.isFinite(midi)) return null;
        return { midi, durationMultiplier: d > 0 ? d : 1 };
    }
    return null;
}

function createMidiBlobFromMelody(melody, options = {}) {
    if (!Array.isArray(melody) || melody.length === 0) return null;
    const normalizedMelody = melody.map(normalizeNote).filter(Boolean);
    if (!normalizedMelody.length) return null;

    const {
        ticksPerQuarter = 480,
        tempoBPM = 120,
        noteDurationTicks = 480,
        channel = 0,
        velocity = 100
    } = options;

    const header = [0x4D,0x54,0x68,0x64, 0x00,0x00,0x00,0x06, 0x00,0x00, 0x00,0x01,
        (ticksPerQuarter >> 8) & 0xFF, ticksPerQuarter & 0xFF];

    const trackBytes = [];
    const microsPerQuarter = Math.round(60000000 / tempoBPM);
    trackBytes.push(0x00, 0xFF, 0x51, 0x03,
        (microsPerQuarter >> 16) & 0xFF,
        (microsPerQuarter >> 8) & 0xFF,
        microsPerQuarter & 0xFF);

    let pendingDelayTicks = 0;
    normalizedMelody.forEach(entry => {
        const durationTicks = Math.max(1, Math.round(noteDurationTicks * (entry.durationMultiplier || 1)));
        if (entry.rest) {
            pendingDelayTicks += durationTicks;
            return;
        }
        const pitch = entry.midi & 0x7F;
        const delta = encodeVLQ(pendingDelayTicks);
        trackBytes.push(...delta, 0x90 | (channel & 0x0F), pitch, velocity & 0x7F);
        const dt = encodeVLQ(durationTicks);
        trackBytes.push(...dt, 0x80 | (channel & 0x0F), pitch, 0x00);
        pendingDelayTicks = 0;
    });

    const endDelay = encodeVLQ(Math.max(0, pendingDelayTicks));
    trackBytes.push(...endDelay, 0xFF, 0x2F, 0x00);

    const trackLength = trackBytes.length;
    const trackHeader = [0x4D,0x54,0x72,0x6B,
        (trackLength >> 24) & 0xFF, (trackLength >> 16) & 0xFF,
        (trackLength >> 8) & 0xFF, trackLength & 0xFF];

    const allBytes = new Uint8Array(header.length + trackHeader.length + trackBytes.length);
    allBytes.set(header, 0);
    allBytes.set(trackHeader, header.length);
    allBytes.set(trackBytes, header.length + trackHeader.length);
    return new Blob([allBytes], { type: "audio/midi" });
}

/* ---------- Tap View (Pro) ---------- */

function playTapMidis(midis = []) {
    if (!Array.isArray(midis) || !midis.length) return;
    ensureAudioContext();
    const unitMs = getUnitMs();
    highlightUkuleleForMidis(midis, { scroll: false });
    midis.forEach((midi, idx) => {
        const dur = Math.max(140, unitMs * 0.9);
        playPluckedUkulele(midiToFrequency(midi), dur, { peakGain: 0.18, attackMs: 12 + idx * 8 });
        pressPianoKey(midi, dur);
        recordInterval(midi, "tap");
    });
}

function setupTapView() {
    const btn = document.getElementById("addTapButton");
    const output = document.getElementById("tapDiagram");
    const historyEl = document.getElementById("tapHistory");
    const infoEl = document.getElementById("tapInfo");
    if (!btn || !output) return;
    btn.addEventListener("click", () => {
        const notes = gatherTapNotes();
        if (!notes || !notes.length) {
            output.textContent = "Keine Auswahl im aktuellen Step.";
            return;
        }
        const chordGuess = detectChordFromNotes(notes.map(n => n.midi));
        const tap = renderTapSvg(notes, chordGuess);
        output.innerHTML = tap.svg;
        if (infoEl) infoEl.textContent = tap.labelText || "";
        tapHistory.unshift({
            id: Date.now(),
            svg: tap.svg,
            chordGuess: tap.labelText || chordGuess || "Tap",
            midis: notes.map(n => n.midi)
        });
        if (tapHistory.length > 5) tapHistory.pop();
        if (historyEl) renderTapHistory(historyEl);
        playTapMidis(notes.map(n => n.midi));
    });
}

function renderTapHistory(el) {
    el.innerHTML = "";
    tapHistory.forEach((item, idx) => {
        const card = document.createElement("div");
        card.className = "tap-card";
        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "tap-thumb";
        thumb.innerHTML = item.svg;
        thumb.title = (item.chordGuess || "Tap") + " #" + (tapHistory.length - idx);
        thumb.addEventListener("click", () => {
            const output = document.getElementById("tapDiagram");
            const infoEl = document.getElementById("tapInfo");
            if (output) output.innerHTML = item.svg;
            if (infoEl) infoEl.textContent = item.chordGuess || "";
            playTapMidis(item.midis || []);
        });
        const close = document.createElement("button");
        close.type = "button";
        close.className = "tap-close";
        close.textContent = "×";
        close.addEventListener("click", () => {
            const idx = tapHistory.findIndex(h => h.id === item.id);
            if (idx >= 0) tapHistory.splice(idx, 1);
            renderTapHistory(el);
        });
        card.appendChild(thumb);
        card.appendChild(close);
        el.appendChild(card);
    });
}

function gatherTapNotes() {
    let timeKey = getCurrentTimeKey();
    if (timeKey === null) timeKey = lastManualTimeKey;
    if (timeKey === null && manualStepSelections.size > 0) {
        timeKey = Array.from(manualStepSelections.keys())[0];
    }
    if (timeKey !== null) {
        const perTime = manualStepSelections.get(timeKey);
        if (perTime && perTime.size) {
            const midis = [];
            perTime.forEach(midi => midis.push(midi));
            const voicing = buildLowestVoicing(midis);
            if (voicing.length) return voicing;
        }
    }
    // Fallback 2: aktuell markierte Zellen im Griffbrett (manuelle/aktive Highlights)
    const highlighted = Array.from(document.querySelectorAll("#fretboardTable td.manual-selection, #fretboardTable td.active-fret"));
    if (highlighted.length) {
        const notes = highlighted.map(cell => {
            const midi = Number(cell.dataset.midi);
            const stringNumber = Number(cell.dataset.string);
            return Number.isFinite(midi) && Number.isInteger(stringNumber) ? { midi, stringNumber } : null;
        }).filter(Boolean);
        if (notes.length) {
            const midis = notes.map(n => n.midi);
            return buildLowestVoicing(midis);
        }
    }

    // Fallback: aktueller Timeline-Step falls vorhanden
    const tracks = getTracks();
    if (!tracks.length) return null;
    if (!playbackState.timeline || !playbackState.timeline.events?.length) {
        playbackState.timeline = buildTimeline(tracks);
        playbackState.currentTimeIndex = 0;
    }
    const timeline = playbackState.timeline;
    if (!timeline || !timeline.events || !timeline.events.length) return null;
    const idx = Math.max(0, Math.min(playbackState.currentTimeIndex || 0, timeline.events.length - 1));
    const evt = timeline.events[idx];
    if (!evt || !evt.notes) return null;
    const midis = evt.notes
        .filter(n => n && !n.rest && Number.isFinite(n.midi))
        .map(n => n.midi);
    const voicing = buildLowestVoicing(midis);
    return voicing.length ? voicing : null;
}

function buildLowestVoicing(midis = []) {
    const result = [];
    const usedStrings = new Set();
    midis.forEach(midi => {
        const positions = findAllStringFrets(midi)
            .sort((a, b) => a.fret - b.fret || a.stringIndex - b.stringIndex);
        const spot = positions.find(p => !usedStrings.has(p.stringIndex));
        if (spot) {
            usedStrings.add(spot.stringIndex);
            result.push({ midi, stringNumber: spot.stringIndex + 1, fret: spot.fret });
        }
    });
    result.sort((a, b) => a.stringNumber - b.stringNumber);
    return result;
}

function fingerForFret(fret, stringIndex = 0) {
    if (fret <= 0) return "";
    if (fret <= 1) return 1;
    if (fret === 2) return 2;
    if (fret === 3) return 3;
    if (fret === 4) return 4;
    return 3;
}

function renderTapSvg(notes, chordGuess = "") {
    const normalizeNotes = list => {
        if (!Array.isArray(list) || !list.length) return [];
        // one per string, lowest fret wins
        const byString = new Map();
        list.forEach(item => {
            const strNum = Math.max(1, Math.min(4, item.stringNumber));
            const fret = item.fret != null ? item.fret : Math.max(0, item.midi - UKULELE_STRINGS[strNum - 1].openMidi);
            const prev = byString.get(strNum);
            if (!prev || fret < prev.fret) {
                byString.set(strNum, { ...item, stringNumber: strNum, fret });
            }
        });
        let arr = Array.from(byString.values());
        const allSameMidi = arr.every(n => n.midi === arr[0].midi);
        if (allSameMidi && arr.length > 1) {
            // keep only the best single position
            const positions = findAllStringFrets(arr[0].midi).sort((a, b) => a.fret - b.fret || a.stringIndex - b.stringIndex);
            if (positions[0]) {
                const p = positions[0];
                arr = [{ midi: arr[0].midi, stringNumber: p.stringIndex + 1, fret: p.fret }];
            } else {
                arr = [arr[0]];
            }
        }
        return arr;
    };

    notes = normalizeNotes(notes);
    const width = 200;
    const height = 260;
    const strings = [4, 3, 2, 1]; // G C E A, left to right (nut on top)
    const stringGap = 36;
    const startX = 32;
    const startY = 50;
    const fretGap = 38;
    const maxFretSeen = Math.max(3, ...notes.map(n => Math.max(0, n.midi - UKULELE_STRINGS[n.stringNumber - 1].openMidi)));
    const fretCount = Math.min(6, Math.max(3, maxFretSeen + 1));
    let markers = "";
    const noteLabels = [];
    const labelsByPos = {};

    notes.forEach(item => {
        const strNum = Math.max(1, Math.min(4, item.stringNumber)); // 1..4 (A,E,C,G)
        const posIndex = 5 - strNum; // map to G,C,E,A left to right
        const x = startX + (posIndex - 1) * stringGap;
        const fret = item.fret != null ? item.fret : Math.max(0, item.midi - UKULELE_STRINGS[strNum - 1].openMidi);
        const y = fret === 0 ? startY - 16 : startY + (fret - 0.5) * fretGap;
        const { name, octave } = midiToNote(item.midi);
        noteLabels.push(name + octave);
        const hue = midiToHue(item.midi);
        if (!labelsByPos[posIndex]) labelsByPos[posIndex] = [];
        if (labelsByPos[posIndex].length === 0) labelsByPos[posIndex].push(name + octave);
        if (fret === 0) {
            markers += `<circle cx="${x}" cy="${startY - 16}" r="10" fill="hsla(${hue},65%,52%,0.22)" stroke="hsla(${hue},78%,62%,0.9)" stroke-width="2.4"/>`;
        } else {
            const finger = fingerForFret(fret, strNum - 1) || "";
            markers += `<circle cx="${x}" cy="${y}" r="14" fill="hsla(${hue},75%,50%,0.25)" stroke="#f6d88b" stroke-width="2"/>`;
            markers += `<text x="${x}" y="${y + 5}" font-size="13" text-anchor="middle" fill="#f6d88b" font-weight="800">${finger}</text>`;
        }
    });

    // Add X for strings without a note
    strings.forEach((_, i) => {
        const posIndex = i + 1; // 1..4
        if (!labelsByPos[posIndex]) {
            const x = startX + (posIndex - 1) * stringGap;
            const y = startY - 16;
            markers += `<text x="${x}" y="${y + 4}" font-size="16" font-weight="900" fill="#caa" text-anchor="middle">X</text>`;
        }
    });

    const stringLines = strings.map((_, i) => {
        const x = startX + i * stringGap;
        return `<line x1="${x}" y1="${startY}" x2="${x}" y2="${startY + fretGap * fretCount}" stroke="#555" stroke-width="2"/>`;
    }).join("");
    const fretLines = Array.from({ length: fretCount + 1 }).map((_, i) => {
        const y = startY + i * fretGap;
        const strokeW = i === 0 ? 6 : 2;
        const strokeCol = i === 0 ? "#bbb" : "#666";
        return `<line x1="${startX - 6}" y1="${y}" x2="${startX + stringGap * (strings.length - 1) + 6}" y2="${y}" stroke="${strokeCol}" stroke-width="${strokeW}"/>`;
    }).join("");

    const stringNames = ["G", "C", "E", "A"];
    const stringLabels = stringNames.map((s, i) => {
        const x = startX + i * stringGap;
        const labelsForString = labelsByPos[i + 1] || [];
        const line1 = labelsForString.slice(0, 1).join(" ");
        const yBase = startY + fretGap * (fretCount + 0.3);
        return `
            <text x="${x}" y="${yBase}" fill="#eee" font-size="12" text-anchor="middle">${line1 || s}</text>
        `;
    }).join("");
    const chordLabel = chordGuess ? `<text x="${width / 2}" y="16" fill="#b23" font-size="18" text-anchor="middle" font-weight="800">${chordGuess}</text>` : "";
    const tuningLabels = stringNames.map((s, i) => {
        const x = startX + i * stringGap;
        return `<text x="${x}" y="${startY - 16}" fill="#bbb" font-size="10" text-anchor="middle">${s.toLowerCase()}</text>`;
    }).join("");

    const svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Tap Diagramm">
        <rect x="0" y="0" width="${width}" height="${height}" rx="12" ry="12" fill="rgba(255,255,255,0.02)" stroke="#888"/>
        ${chordLabel}
        ${tuningLabels}
        ${fretLines}
        ${stringLines}
        ${markers || "<text x='12' y='20' fill='#f6d88b'>Keine Auswahl.</text>"}
        ${stringLabels}
    </svg>`;
    const orderedLabels = stringNames.map((_, i) => (labelsByPos[i + 1] && labelsByPos[i + 1][0]) || "").filter(Boolean);
    const labelText = `${chordGuess || "Tap"} · ${orderedLabels.join(" ") || noteLabels.join(" ")}`;
    return { svg, labelText };
}

/* ---------- Mic → Tracks Routing ---------- */
function addMicNoteToTracks(midi) {
    const options = arguments[1] || {};
    const source = options.source || "mic";
    const now = performance.now();
    const sameMidi = lastMicNote.midi === midi && now - lastMicNote.time < 450;

    // Diagramm-Quelle soll immer eintragen, ohne Debounce
    const positions = findAllStringFrets(midi);
    if (!positions.length) return;

    let chosen;
    if (source === "mic") {
        // Mic: falls gleicher Ton, nimm die nächste verfügbare Position
        if (sameMidi) {
            const sorted = positions.sort((a, b) => a.fret - b.fret || a.stringIndex - b.stringIndex);
            const currentIdx = sorted.findIndex(p => p.stringIndex === lastMicNote.idx);
            const next = sorted[(currentIdx + 1) % sorted.length];
            chosen = next;
        } else {
            chosen = positions.reduce((best, p) => {
                if (!best) return p;
                if (p.fret < best.fret) return p;
                if (p.fret === best.fret && p.stringIndex < best.stringIndex) return p;
                return best;
            }, null);
        }
    } else {
        // Diagramm etc.: Positions direkt verwenden (gleiche Reihenfolge A,E,C,G)
        chosen = positions[0];
    }

    if (!chosen) return;
    const trackIndex = chosen.stringIndex;
    const insertAt = Math.max(0, Math.min(trackCursors[trackIndex] || 0, getMelodyLength(trackIndex)));
    insertNoteAt(insertAt, midi, 1, trackIndex);
    trackCursors[trackIndex] = insertAt + 1;
    addStaffNote(midi, trackIndex);
    if (uiRefs.trackList && uiRefs.playhead) {
        renderMelodyTracks(uiRefs.trackList, uiRefs.playhead, { track: trackIndex, index: insertAt }, uiRefs.status);
        if (uiRefs.status) updateMelodyStatus(uiRefs.status);
    }
    lastMicNote = { midi, time: now, idx: chosen.stringIndex };
}

function findAllStringFrets(midi) {
    const positions = [];
    UKULELE_STRINGS.forEach((str, idx) => {
        const fret = midi - str.openMidi;
        if (fret >= 0) positions.push({ stringIndex: idx, fret });
    });
    return positions;
}

/* ---------- Draggable Panels ---------- */
function setupDraggables() {
    if (document.body.dataset.dragDisabled === "true") return;
    if (deviceInfo.isMobile || deviceInfo.isTablet) return;
    let zCounter = 20;
    const draggables = document.querySelectorAll("[data-draggable=\"true\"]");
    draggables.forEach(el => {
        if (!el.style.position) el.style.position = "fixed";
        const handle =
            (el.dataset.dragHandle && el.querySelector(el.dataset.dragHandle)) ||
            el.querySelector(".widget-handle") ||
            el.querySelector(".panel-handle");
        if (!handle) return; // nur draggbar, wenn ein Handle existiert
            handle.style.cursor = "grab";
            let active = false;
            let startX = 0;
            let startY = 0;
            let originLeft = 0;
            let originTop = 0;

        const onMove = e => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (!active) {
                const threshold = Math.abs(dx) + Math.abs(dy);
                if (threshold < 4) return; // nur Klick, kein Drag
                active = true;
                el.classList.add("dragging");
                // bereits fixed, nur sicherstellen
                el.style.position = "fixed";
                el.style.left = originLeft + "px";
                el.style.top = originTop + "px";
            }
            el.style.left = originLeft + dx + "px";
            el.style.top = originTop + dy + "px";
            };

        const onUp = () => {
            if (!active) return;
            active = false;
            el.classList.remove("dragging");
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            saveWidgetState(el);
            updateDesktopBounds();
        };

        handle.addEventListener("pointerdown", e => {
            if (e.target && (e.target.closest(".window-lights") || e.target.closest("button, input, select, textarea, option, label"))) return;
            e.preventDefault();
            const rect = el.getBoundingClientRect();
            el.style.right = "";
            el.style.bottom = "";
            originLeft = rect.left;
            originTop = rect.top;
            startX = e.clientX;
            startY = e.clientY;
            zCounter += 1;
            el.style.zIndex = String(zCounter);
            // unlock any pinned right/bottom so the panel can move freely
            el.style.right = "";
            el.style.bottom = "";
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
        });

        // Resize handle
        let resizeHandle = el.querySelector(".resize-handle");
        const createHandle = (cls, onMoveBuilder) => {
            let h = el.querySelector("." + cls);
            if (!h) {
                h = document.createElement("div");
                h.className = cls;
                el.appendChild(h);
            }
            h.addEventListener("pointerdown", e => {
                e.preventDefault();
                e.stopPropagation();
                const rect = el.getBoundingClientRect();
                const startX = e.clientX;
                const startY = e.clientY;
                const startW = rect.width;
                const startH = rect.height;
                const startL = rect.left;
                const startT = rect.top;
                const callbacks = onMoveBuilder({ startX, startY, startW, startH, startL, startT });
                const onMove = ev => callbacks.onMove(ev, el);
                const onUp = () => {
                    window.removeEventListener("pointermove", onMove);
                    window.removeEventListener("pointerup", onUp);
                    saveWidgetState(el);
                    updateDesktopBounds();
                };
                window.addEventListener("pointermove", onMove);
                window.addEventListener("pointerup", onUp);
            });
        };

        createHandle("resize-handle edge-right", ({ startX, startW }) => ({
            onMove: (ev, element) => {
                const dx = ev.clientX - startX;
                element.style.width = Math.max(240, startW + dx) + "px";
            }
        }));

        createHandle("resize-handle edge-left", ({ startX, startW, startL }) => ({
            onMove: (ev, element) => {
                const dx = ev.clientX - startX;
                const newW = Math.max(240, startW - dx);
                const newLeft = startL + dx;
                element.style.width = newW + "px";
                element.style.left = newLeft + "px";
            }
        }));

        createHandle("resize-handle edge-bottom", ({ startY, startH }) => ({
            onMove: (ev, element) => {
                const dy = ev.clientY - startY;
                element.style.height = Math.max(180, startH + dy) + "px";
            }
        }));

        createHandle("resize-handle edge-top", ({ startY, startH, startT }) => ({
            onMove: (ev, element) => {
                const dy = ev.clientY - startY;
                const newH = Math.max(180, startH - dy);
                element.style.height = newH + "px";
                element.style.top = startT + dy + "px";
            }
        }));
        // restore saved state if present
        restoreWidgetState(el);
    });
    applyDefaultLayout(true);
    updateDesktopBounds();
}

/* ---------- Visibility / iOS Handling ---------- */

function setupVisibilityHandling() {
    document.addEventListener("visibilitychange", () => {
        resumeAudioContextIfNeeded();
    });
}

/* ---------- Geräte-Erkennung ---------- */
function detectMobile() {
    const ua = navigator.userAgent || "";
    const lower = ua.toLowerCase();
    const androidMatch = /android\s([0-9\.]+)/i.exec(ua);
    const iosMatch = /os (\d+)[._](\d+)(?:[._](\d+))?/i.exec(ua);
    const isAndroid = /android/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isMobile = /mobile|iphone|ipad|ipod|android|blackberry|iemobile|silk/i.test(lower);
    const isTablet = /ipad|tablet/i.test(lower);
    let osVersion = "";
    if (androidMatch) osVersion = androidMatch[1];
    if (iosMatch) osVersion = iosMatch.slice(1).filter(Boolean).join(".");

    deviceInfo = {
        isMobile,
        isTablet,
        isAndroid,
        isIOS,
        osVersion,
        ua
    };

    document.body.dataset.device = isMobile ? "mobile" : "desktop";
    if (isAndroid) document.body.dataset.os = "android";
    if (isIOS) document.body.dataset.os = "ios";
    document.body.dataset.osVersion = osVersion;
    window.deviceInfo = deviceInfo;

    const headphoneEl = document.getElementById("headphoneStatus");
    if (headphoneEl) {
        headphoneEl.textContent = "Headset: unbekannt";
    }
}

function playSineOffset(offset = 0) {
    if (lastDetectedMidi === null || !Number.isFinite(lastDetectedMidi)) return;
    const ctx = ensureAudioContext();
    const freq = midiToFrequency(clampMidi(lastDetectedMidi + offset));
    const handle = buildSineVoice(ctx, freq);
    const rel = Math.max(0.8, (sineParams.releaseMs || 160) / 1000);
    const now = ctx.currentTime;
    try {
        handle.lfoVib.stop(now + rel);
        handle.lfoTrem.stop(now + rel);
    } catch (e) { /* ignore */ }
    handle.gain.gain.exponentialRampToValueAtTime(0.0001, now + rel);
    handle.osc.stop(now + rel + 0.05);
}

/* ---------- Chord Wheel Design Demo ---------- */
function logChordWheelDesigns() { /* removed noisy demo */ }

/* ---------- Widget State Persistence ---------- */
function saveWidgetState(el) {
    if (!el || !el.id) return;
    const rect = el.getBoundingClientRect();
    const state = JSON.parse(localStorage.getItem(widgetStateKey) || "{}");
    state[el.id] = {
        left: el.style.left || `${rect.left}px`,
        top: el.style.top || `${rect.top}px`,
        bottom: el.style.bottom || "",
        right: el.style.right || "",
        width: el.style.width || "",
        height: el.style.height || "",
        collapsed: el.classList.contains("collapsed")
    };
    localStorage.setItem(widgetStateKey, JSON.stringify(state));
}

function saveAllWidgetStates() {
    document.querySelectorAll(".desktop-window").forEach(saveWidgetState);
}

function restoreWidgetState(el) {
    if (!el || !el.id) return;
    const state = JSON.parse(localStorage.getItem(widgetStateKey) || "{}");
    const s = state[el.id];
    if (s) {
        if (s.left) { el.style.left = s.left; el.style.position = "fixed"; }
        if (s.right) { el.style.right = s.right; el.style.position = "fixed"; }
        if (s.top) { el.style.top = s.top; el.style.bottom = ""; el.style.position = "fixed"; }
        if (s.bottom) { el.style.bottom = s.bottom; el.style.top = ""; el.style.position = "fixed"; }
        if (s.width) el.style.width = s.width;
        if (s.height) el.style.height = s.height;
        if (s.collapsed) el.classList.add("collapsed");
        else el.classList.remove("collapsed");
    }
    if (!s) applyDefaultLayout(true, el.id);
}

function applyDefaultLayout(forceAll = false, onlyId = null) {
    const defaults = {
        // Linke Spalte (Rand)
        tapWindow: { left: "12px", top: "64px", width: "18vw", height: "220px" },
        playbackWindow: { left: "12px", top: "calc(58vh - 40px)", width: "32vw", height: "220px" },
        // Mittlere Spalte (zentriert)
        micWindow: { left: "calc(50% - 22vw)", top: "40px", width: "22vw", height: "500px" },
        staffWindow: { left: "calc(50% - 0vw)", top: "44px", width: "18vw", height: "500px" },
        tunerWindow: { left: "calc(50% + 18vw)", top: "44px", width: "16vw", height: "500px" },
        fretboardWindow: { left: "calc(50% - 18vw)", top: "calc(100vh - 600px)", width: "52vw", height: "210px" },
        pianoWindow: { left: "calc(50% - 18vw)", bottom: "150px", width: "52vw", height: "200px" },
        // Rechte Spalte (Rand)
        chordWindow: { left: "calc(50% + 18vw)", top: "64px", width: "22vw", height: "420px" }
    };
    Object.entries(defaults).forEach(([id, def]) => {
        if (onlyId && onlyId !== id) return;
        const el = document.getElementById(id);
        if (!el) return;
        const hasPosition = (el.style.left || el.style.right) && (el.style.top || el.style.bottom);
        if (!forceAll && hasPosition) return;
        el.style.position = "fixed";
        if (def.left) { el.style.left = def.left; el.style.right = ""; }
        if (def.right) { el.style.right = def.right; el.style.left = ""; }
        if (def.top) { el.style.top = def.top; el.style.bottom = ""; }
        if (def.bottom) { el.style.bottom = def.bottom; el.style.top = ""; }
        if (def.width) el.style.width = def.width;
        if (def.height) el.style.height = def.height;
    });
    updateDesktopBounds();
}

// Expose selected console helpers
// window.logChordWheelDesigns = logChordWheelDesigns;

async function checkHeadphones(statusEl) {
    if (!navigator.mediaDevices?.enumerateDevices) {
        if (statusEl) statusEl.textContent = "Headset: nicht verfügbar";
        return;
    }
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const outputs = devices.filter(d => d.kind === "audiooutput");
        const hasHeadset = outputs.some(d => /headphone|airpods|earpods|buds|headset/i.test(d.label || ""));
        if (statusEl) {
            statusEl.textContent = hasHeadset ? "Headset: verbunden (best guess)" : "Headset: nicht erkannt";
        }
    } catch (err) {
        if (statusEl) statusEl.textContent = "Headset: keine Berechtigung";
    }
}

async function requestMicPermission(detuneEl, permBtn) {
    try {
        if (navigator.permissions && navigator.permissions.query) {
            try {
                const status = await navigator.permissions.query({ name: "microphone" });
                if (status.state === "denied") {
                    detuneEl.textContent = "Mic blockiert (System)";
                    permBtn?.removeAttribute("disabled");
                    return false;
                }
            } catch (e) {
                // ignore
            }
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
        if (detuneEl) detuneEl.textContent = "Mic erlaubt";
        permBtn?.setAttribute("disabled", "disabled");
        return true;
    } catch (err) {
        console.error("Mic permission denied", err);
        if (detuneEl) {
            const hint = deviceInfo.isIOS
                ? "Einstellungen > Safari > Mikrofon erlauben"
                : "Bitte Mic-Zugriff erlauben";
            detuneEl.textContent = "Mic blockiert – " + hint;
        }
        permBtn?.removeAttribute("disabled");
        return false;
    }
}
