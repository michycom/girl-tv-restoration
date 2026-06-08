   class MusicalNote {
            constructor(note, octave) {
                const noteParts = note.match(/([A-G])([#b]?)/);
                this.note = noteParts ? noteParts[1] : note; // Basiston ohne Akzidental
                
                this.accidental = noteParts ? noteParts[2] : ''; // Das Akzidental, falls vorhanden
                this.octave = octave;
                this.svgNS = "http://www.w3.org/2000/svg";
                this.lineSpacing = 20;
                this.baseY = 100; // Basislinie Y-Position
                this.C4ref = this.baseY + (this.lineSpacing * 5); // Berechnung der Y-Position für C4
                this.width = 150;
                this.startY = 100;
                this.height = 300;
            this.createNoteContainer();
    }


            isBassClef() {
                // Bestimmen, ob die Note im F-Schlüssel angezeigt werden sollte
                
                //return this.octave < 4 || (this.octave === 4 && ['A', 'B'].includes(this.note));
                return this.octave < 4 || (this.octave === 4 && this.noteBase <= 'B');
            }

            createNoteContainer() {
            const container = document.createElement('div');
            container.className = 'note-container';
            const svg = document.createElementNS(this.svgNS, 'svg');
            svg.setAttribute('width', this.width);
            svg.setAttribute('height',this.height);
            
            const baseY = this.C4ref - ((this.octave - 4)*(this.lineSpacing * 3.5)) - this.getNoteIndex(this.note)*(this.lineSpacing/2);
            
            this.drawStaffLines(svg, baseY);
            this.drawClef(svg, baseY - 10, this.isBassClef() ? 'F' : 'G');
            this.drawNoteCircle(svg, 82, baseY, this.isBassClef());
            this.drawNote(svg);
            
            container.appendChild(svg);
            document.getElementById('notes').appendChild(container);
    }

            drawStaffLines(svg) {
                for (let i = 0; i < 5; i++) {
                    const y = this.startY + i * this.lineSpacing;
                    const line = document.createElementNS(this.svgNS, "line");
                    line.setAttribute("x1", "0");
                    line.setAttribute("y1", y);
                    line.setAttribute("x2", "150");
                    line.setAttribute("y2", y);
                    line.setAttribute("stroke", "black");
                    svg.appendChild(line);
                }
            }

            drawClef(svg, yPosition, clefType) {
                const clef = document.createElementNS(this.svgNS, "text");
                clef.setAttribute("x", "5");
                clef.setAttribute("y", clefType === 'G' ? "175" : "156");
                clef.setAttribute("font-size", clefType === 'G' ? "130" : "80");
                clef.textContent = clefType === 'G' ? "\uD834\uDD1E" : "\uD834\uDD22";
                svg.appendChild(clef);
            }

            drawNote(svg) {
                const accidentalSymbol = this.accidental === '#' ? '\u266F' : this.accidental === 'b' ? '\u266D' : '';
                
                const noteTextContent = this.note + accidentalSymbol + this.octave;
                
                
                const noteText = document.createElementNS(this.svgNS, "text");
                noteText.setAttribute("x", "7");
                noteText.setAttribute("y", "60");
                noteText.setAttribute("font-size", "16");
                noteText.textContent = noteTextContent;
                svg.appendChild(noteText);
            }

        
        
            drawNoteCircle(svg, xPosition, yPosition, Clef) {
    // Akzidentalzeichen hinzufügen, falls vorhanden
    if (this.accidental) {
        const accidentalText = document.createElementNS(this.svgNS, "text");
        accidentalText.setAttribute("x", xPosition - 25); // Position links von der Note
        accidentalText.setAttribute("y", Clef ? yPosition + 7 - this.lineSpacing * 6 : yPosition + 7);
        accidentalText.setAttribute("font-size", "24"); // Größe des Akzidentalzeichens
        accidentalText.textContent = this.accidental === '#' ? '\u266F' : '\u266D'; // Unicode für ♯ oder ♭
        svg.appendChild(accidentalText);
    }

    // Anpassung für den Bassschlüssel
    if (this.isBassClef())
        yPosition = yPosition - this.lineSpacing * 6;

    // Erstellen einer waagerechten Ellipse anstelle eines Kreises
    const ellipse = document.createElementNS(this.svgNS, "ellipse");
    ellipse.setAttribute("cx", xPosition);
    ellipse.setAttribute("cy", yPosition);
    ellipse.setAttribute("rx", 8); // Breite der Ellipse, macht sie waagerecht
    ellipse.setAttribute("ry", 6); // Höhe der Ellipse
    ellipse.setAttribute("fill", "black");
    svg.appendChild(ellipse);

    // Hinzufügen von Hilfslinien, falls notwendig
    this.LedgerLines(this.note, yPosition, svg);
}


            LedgerLines(noteName, noteY, svg) {
            const noteIndex = this.getNoteIndex(noteName.charAt(0));
            let ledgerLines = [];
            if (this.isBassClef()) {
            // Für F-Schlüssel, Noten unterhalb des Systems
            ledgerLines = this.calculateLedgerLinesForBassClef(noteIndex, noteY);
            } else {
            // Für G-Schlüssel, Noten oberhalb des Systems
            ledgerLines = this.calculateLedgerLinesForTrebleClef(noteIndex, noteY);
            }

            // Zeichne die berechneten Hilfslinien.
            ledgerLines.forEach(ledgerY => {
            this.drawLedgerLine(svg, ledgerY);
            });
        }

        calculateLedgerLinesForTrebleClef(noteIndex, noteY) {
        let additionalLines = [];
        // Berechne Hilfslinien für Noten oberhalb von C4 im G-Schlüssel
        if (noteIndex === 0 && this.octave === 4) { // Für C4
        additionalLines.push(noteY);
        } else if (this.octave >= 5) {
        let linesAboveStaff = Math.ceil((noteIndex / 4) + (this.octave - 5) * 2);
        for (let i = 0; i < linesAboveStaff; i++) {
            additionalLines.push(this.baseY - (1 + i) * this.lineSpacing);
        }
        }
        return additionalLines;
        }

calculateLedgerLinesForBassClef(noteIndex, noteY) {
    let additionalLines = [];
    // Berechne Hilfslinien für Noten unterhalb von F3 im F-Schlüssel
    if (this.octave <= 2 || (this.octave === 3 && noteIndex < 3)) {
        let linesBelowStaff = Math.ceil((2 - noteIndex / 2) + (2 - this.octave) * 3.5);
        for (let i = 0; i < linesBelowStaff; i++) {
            additionalLines.push(this.baseY + (5 + i) * this.lineSpacing);
        }
    }
    return additionalLines;
}

drawLedgerLine(svg, yPosition) {
    // Zeichne eine Hilfslinie an der berechneten Y-Position
    const ledgerLine = document.createElementNS(this.svgNS, "line");
    ledgerLine.setAttribute("x1", "65");
    ledgerLine.setAttribute("y1", yPosition.toString());
    ledgerLine.setAttribute("x2", "105");
    ledgerLine.setAttribute("y2", yPosition.toString());
    ledgerLine.setAttribute("stroke", "black");
    svg.appendChild(ledgerLine);
}

            getNoteIndex(note) {
            const notesInOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
            return notesInOrder.indexOf(note);
    }

        }

        document.addEventListener('DOMContentLoaded', (event) => {
            // Dein Code hier
            //new MusicalNote('F#', 3);
            //new MusicalNote('F#', 4);
            //const musicalNotes = new MusicalNote('C', 4);
            // ...und so weiter
        });
        
        document.addEventListener('DOMContentLoaded', () => {
            const noteElement = document.getElementById('note');
            let noteText = noteElement.textContent;
          
            // Entferne alle Zeichen, die nicht zu einer Notenbezeichnung gehören
            noteText = noteText.replace(/[^a-gA-G#]/g, '');
          
            // Wenn die Note ein Vorzeichen enthält, aber keine Oktave, füge die Standardoktave "4" hinzu
            if (noteText.includes('#')) {
              noteText = noteText + '4';
            }
          
            //console.log(noteText.slice(0, -1), noteText.slice(-1));
          });
          
        
        // new MusicalNote('C#', 4);
        // new MusicalNote('C', 5);
        // new MusicalNote('F', 5);
        // new MusicalNote('A', 5);
        // new MusicalNote('B', 5);
        // new MusicalNote('D', 6);
        // new MusicalNote('D#', 6);
        // new MusicalNote('E', 6);
        // new MusicalNote('C', 6);
        // new MusicalNote('F', 3);
        // new MusicalNote('E', 2);
        // new MusicalNote('C', 2);
        // new MusicalNote('E', 1);
        // //new MusicalNote('A', 3);
        //new MusicalNote('F', 2);