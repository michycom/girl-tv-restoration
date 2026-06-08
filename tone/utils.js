import { GuitarTab } from './guitarTab.js';

function findPositions(note) {
    const noteIndex = GuitarTab.NOTES.indexOf(note.slice(0, -1));
    const octave = parseInt(note.slice(-1), 10);
    let positions = [];

    for (let string = 0; string < GuitarTab.TUNING.length; string++) {
        const stringNote = GuitarTab.TUNING[string];
        const stringNoteIndex = GuitarTab.NOTES.indexOf(stringNote.slice(0, -1));
        const stringOctave = parseInt(stringNote.slice(-1), 10);
        let fret = (noteIndex - stringNoteIndex) + 12 * (octave - stringOctave);
        if (fret >= 0 && fret <= 24) {
            positions.push({ string: string + 1, fret, octave });
        }
    }
    return positions;
}

function getNoteAtPosition(string, fret) {
    const stringNote = GuitarTab.TUNING[string - 1];
    const stringNoteIndex = GuitarTab.NOTES.indexOf(stringNote.slice(0, -1));
    const stringOctave = parseInt(stringNote.slice(-1), 10);
    const noteIndex = (stringNoteIndex + fret) % 12;
    const octave = stringOctave + Math.floor((stringNoteIndex + fret) / 12);
    return GuitarTab.NOTES[noteIndex] + octave;
}

function getColorForOctave(octave, baseColor) {
    const intensity = Math.floor(150 + (octave - 2) * 35);
    if (baseColor === 'red') return `rgb(${intensity}, 0, 0)`;
    if (baseColor === 'orange') return `rgb(${intensity}, ${intensity / 2}, 0)`;
    if (baseColor === 'yellow') return `rgb(${intensity}, ${intensity}, 0)`;
    if (baseColor === 'green') return `rgb(0, ${intensity}, 0)`;
    if (baseColor === 'cyan') return `rgb(0, ${intensity}, ${intensity})`;
    if (baseColor === 'blue') return `rgb(0, 0, ${intensity})`;
    if (baseColor === 'purple') return `rgb(${intensity / 2}, 0, ${intensity})`;
    if (baseColor === 'pink') return `rgb(${intensity}, ${intensity / 2}, ${intensity / 2})`;
    if (baseColor === 'brown') return `rgb(${intensity / 2}, ${intensity / 4}, 0)`;
    if (baseColor === 'grey') return `rgb(${intensity}, ${intensity}, ${intensity})`;
    if (baseColor === 'black') return `rgb(${intensity / 4}, ${intensity / 4}, ${intensity / 4})`;
    return `rgb(${intensity}, ${intensity}, ${intensity})`;
}

export { findPositions, getNoteAtPosition, getColorForOctave };
