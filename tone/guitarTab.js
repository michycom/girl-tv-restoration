import { findPositions, getNoteAtPosition, getColorForOctave } from './utils.js';

class GuitarTab {
    static TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
    static NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    constructor() {
        this.note = null;
        this.positions = [];
        this.octavePositions = [];
        this.intervalPositions = [];
        this.selectedIntervals = [];
        this.clickTimeout = null;
    }

    static getColorForInterval(note, interval) {
        const noteIndex = GuitarTab.NOTES.indexOf(note.slice(0, -1));
        const octave = parseInt(note.slice(-1), 10);
        const intervalIndex = (noteIndex + interval) % 12;
        const intervalOctave = octave + Math.floor((noteIndex + interval) / 12);
        return GuitarTab.NOTES[intervalIndex] + intervalOctave;
    }

    drawFretboard() {
        const svgWidth = 170, svgHeight = 618, stringSpacing = 30, fretSpacing = 25;
        let svgContent = `<svg id="fretboard" width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

        // Draw fretboard
        svgContent += `<rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="#964B00" />`;

        // Draw nut
        svgContent += `<rect x="0" y="0" width="${svgWidth}" height="10" fill="#444" />`;

        // Draw frets
        for (let j = 0; j <= 24; j++) {
            svgContent += `<line x1="0" y1="${j * fretSpacing + 10}" x2="${svgWidth}" y2="${j * fretSpacing + 10}" stroke="grey" stroke-width="2" />`;
        }

        // Draw strings
        for (let i = 0; i < 6; i++) {
            svgContent += `<line x1="${i * stringSpacing + 10}" y1="10" x2="${i * stringSpacing + 10}" y2="${svgHeight + 10}" stroke="black" stroke-width="2" />`;
        }

        // Draw fret markers
        const markers = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
        markers.forEach(marker => {
            if (marker === 12 || marker === 24) {
                svgContent += `<circle cx="78" cy="${marker * fretSpacing - fretSpacing / 2 + 10}" r="5" fill="snow" />`;
                svgContent += `<circle cx="92" cy="${marker * fretSpacing - fretSpacing / 2 + 10}" r="5" fill="snow" />`;
            } else {
                svgContent += `<circle cx="85" cy="${marker * fretSpacing - fretSpacing / 2 + 10}" r="5" fill="snow" />`;
            }
        });

        svgContent += '</svg>';
        document.body.innerHTML += svgContent;
    }

    drawNotes(positions, color, baseColor) {
        const svg = document.getElementById('fretboard');
        positions.forEach(position => {
            const { string, fret, octave } = position;
            const noteColor = getColorForOctave(octave, baseColor);
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", (string - 1) * 30 + 10);
            circle.setAttribute("cy", fret * 25);
            circle.setAttribute("r", 8);
            circle.setAttribute("fill", noteColor);
            circle.setAttribute("class", color);
            circle.setAttribute("data-string", string);
            circle.setAttribute("data-fret", fret);
            circle.setAttribute("data-color", color);
            svg.appendChild(circle);

            // Event listener for the note
            circle.addEventListener('dblclick', (event) => {
                clearTimeout(this.clickTimeout);
                const clickedString = parseInt(event.target.getAttribute('data-string'), 10);
                const clickedFret = parseInt(event.target.getAttribute('data-fret'), 10);
                const clickedNote = getNoteAtPosition(clickedString, clickedFret);
                console.log('Double click detected. Note:', clickedNote); // Log the note name
                document.getElementById('noteName').innerText = `Selected Note: ${clickedNote}`; // Display the note name
                this.drawIntervalPositions(clickedNote);
            });
        });
    }

    addOctavePositions() {
        const rootNoteIndex = GuitarTab.NOTES.indexOf(this.note.slice(0, -1));
        const octaves = [1, 2, 3, 4, 5, 6]; // All possible octaves

        octaves.forEach(octave => {
            const noteWithOctave = GuitarTab.NOTES[rootNoteIndex] + octave;
            const positions = findPositions(noteWithOctave);
            this.octavePositions.push(...positions);
        });

        this.drawNotes(this.octavePositions, 'octave-note', 'red');
    }

    drawIntervalPositions(rootNote) {
        this.selectedIntervals.forEach(({ interval, color }) => {
            const intervalNote = GuitarTab.getColorForInterval(rootNote, interval);
            const positions = findPositions(intervalNote);
            this.intervalPositions.push(...positions);
            this.drawNotes(positions, 'interval-note', color);
        });
    }

    clearNotes() {
        const svg = document.getElementById('fretboard');
        const notes = svg.querySelectorAll('.note, .octave-note, .interval-note');
        notes.forEach(note => svg.removeChild(note));
    }
}

export { GuitarTab };
