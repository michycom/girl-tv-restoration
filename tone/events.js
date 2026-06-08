import { getNoteAtPosition, findPositions } from './utils.js';

function addEventListeners(guitarTab) {
    document.getElementById('fretboard').addEventListener('click', (event) => {
        clearTimeout(guitarTab.clickTimeout);
        guitarTab.clickTimeout = setTimeout(() => {
            const svg = document.getElementById('fretboard');
            const pt = svg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
            const clickedString = Math.floor(cursorpt.x / 30) + 1;
            const clickedFret = Math.floor(cursorpt.y / 25);

            if (clickedString >= 1 && clickedString <= 6 && clickedFret >= 0 && clickedFret <= 24) {
                const clickedNote = getNoteAtPosition(clickedString, clickedFret);
                const isHighlighted = !!document.elementFromPoint(event.clientX, event.clientY).classList.contains('note');
                if (!isHighlighted) {
                    guitarTab.clearNotes();
                    guitarTab.note = clickedNote;
                    guitarTab.positions = findPositions(clickedNote);
                    guitarTab.octavePositions = [];
                    guitarTab.selectedIntervals = [];
                    guitarTab.drawNotes(guitarTab.positions, 'note', 'red');
                    guitarTab.addOctavePositions();
                } else {
                    console.log('Note clicked:', clickedNote); // Log the note name
                    document.getElementById('noteName').innerText = `Selected Note: ${clickedNote}`; // Display the note name
                }
            }
        }, 250);
    });

    document.querySelectorAll('.color-picker div').forEach(colorDiv => {
        colorDiv.addEventListener('click', (event) => {
            const interval = parseInt(event.target.getAttribute('data-interval'), 10);
            const color = event.target.style.backgroundColor;
            if (guitarTab.selectedIntervals.some(intervalColor => intervalColor.interval === interval)) {
                guitarTab.selectedIntervals = guitarTab.selectedIntervals.filter(intervalColor => intervalColor.interval !== interval);
            } else {
                guitarTab.selectedIntervals.push({
                    interval,
                    color
                });
            }
        });
    });
}

export { addEventListeners };
