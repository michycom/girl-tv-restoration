function getToneColor(note, octave) {
  // Grundfarben für Noten in Oktave 4
  const baseColors = {
    'G':'HSL(270, 100%, 50%)',
    'G#':'HSL(240, 100%, 50%)',
    'A':'HSL(210, 100%, 50%)',
    'A#': 'HSL(180, 100%, 50%)',
    'B': 'HSL(150, 100%, 50%)',
    'C': 'HSL(120, 100%, 50%)',
    'C#':'HSL(90, 100%, 50%)',
    'D': 'HSL(60, 100%, 50%)',
    'D#':'HSL(30, 100%, 50%)',
    'E': 'HSL(0, 100%, 50%)',
    'F': 'HSL(330, 100%, 50%)',
    'F#': 'HSL(300, 100%, 50%)'
    
    /*

    'G': 'HSL(270, 100%, 50%)', // - Violett
    'G#': 'HSL(285, 100%, 50%)', // - Ein hellerer Ton von Violett
    'A': 'HSL(300, 100%, 50%)', // - Magenta
    'A#': 'HSL(315, 100%, 50%)', // - Rosa
    'B': 'HSL(330, 100%, 50%)', // - Ein rosa-roter Ton
    'C': 'HSL(345, 100%, 50%)', // - Hellrot
    'C#': 'HSL(0, 100%, 50%)', // - Rot
    'D': 'HSL(15, 100%, 50%)', // - Orangerot
    'D#': 'HSL(30, 100%, 50%)', // - Orange
    'E': 'HSL(45, 100%, 50%)', // - Orangegelb
    'F': 'HSL(60, 100%, 50%)', // - Gelb
    'F#': 'HSL(75, 100%, 50%)' // - Gelbgrün

    /*
      'G': 'hsl(0, 100%, 50%)',
      'G#': 'hsl(30, 100%, 50%)',
      'A': 'hsl(60, 100%, 50%)',
      'A#': 'hsl(90, 100%, 50%)',
      'B': 'hsl(120, 100%, 50%)',
      'C': 'hsl(150, 100%, 50%)',
      'C#': 'hsl(180, 100%, 50%)',
      'D': 'hsl(210, 100%, 50%)',
      'D#': 'hsl(240, 100%, 50%)',
      'E': 'hsl(270, 100%, 50%)',
      'F': 'hsl(300, 100%, 50%)',
      'F#': 'hsl(330, 100%, 50%)'
 */
    };

  // Berechne die Anpassung der Helligkeit basierend auf der Oktave
  let lightnessAdjustment = (octave - 4) * 10; // Jede Oktave über/unter 4 ändert die Helligkeit um 10%
  let baseColor = baseColors[note.replace(/[0-9]/g, '')]; // Entferne die Oktavenzahl aus der Note für das Mapping

  if (!baseColor) return 'hsl(0, 0%, 0%)'; // Fallback, falls keine Farbe gefunden wird

  // Extrahiere die HSL-Werte
  let [hue, saturation, lightness] = baseColor.match(/\d+/g).map(Number);
  lightness = Math.max(0, Math.min(100, lightness + lightnessAdjustment)); // Stelle sicher, dass Lightness zwischen 0 und 100 bleibt

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Beispiel: Setze die Farbe des Hintergrunds basierend auf dem gespielten Ton und der Oktave
function setBackgroundColorForTone(note, octave) {
  const color = getToneColor(note, octave);
  document.body.style.backgroundColor = color;
}

// Beispielnutzung
//setBackgroundColorForTone('A', 5); // Dies würde die Hintergrundfarbe zu einem helleren Gelb ändern, da A5 in der 5. Oktave liegt


class NoteGenerator {
    constructor() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  
    note_frequency(note_hight_octave) {
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const octave = parseInt(note_hight_octave.slice(-1), 10);
      const note = note_hight_octave.slice(0, -1);
      const noteIndex = notes.indexOf(note);
      const a4Index = 9;
      const a4Octave = 4;
      
      const semitoneDistance = (octave - a4Octave) * 12 + (noteIndex - a4Index);
      const frequency = 440 * Math.pow(2, semitoneDistance / 12);
      
      return parseFloat(frequency.toFixed(2));
    }
  
    synthesizer(note_hight_octave) {
      const frequency = this.note_frequency(note_hight_octave);
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = 'sawtooth'; // square sawtooth triangle
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime); 
      oscillator.connect(this.audioContext.destination); 
      oscillator.start(); 
      oscillator.stop(this.audioContext.currentTime + 1); // Der Ton spielt für 1 Sekunde
    }
  }
  
  class PianoBuilder {
    constructor(containerId, octaves) {
        this.containerId = containerId;
        this.octaves = octaves;
        this.notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    }

    build() {
      const container = document.getElementById(this.containerId);
      let startOctave = 2; // Beginn bei Oktave 3 (C3)
      //let startOctave = 2; // Starte bei Oktave 2 (C2)
      for (let o = 0; o < this.octaves; o++) {
        this.notes.forEach((note) => {
          const key = document.createElement('div');
          key.className = note.includes('#') ? 'key black' : 'key white';
          key.id = `${note}${startOctave + o}`;
          container.appendChild(key);
        });
      }
    }
  }

  
  class EarTrainer {
    constructor(pianoBuilder) {
      this.pianoBuilder = pianoBuilder;
      this.currentNote = '';
      this.wrongNotes = [];
      this.notesHistory = JSON.parse(localStorage.getItem('notesHistory')) || {};
    }
  
    init() {
      this.pianoBuilder.build();
      this.addEventListeners();
      this.playRandomNote();
    }
  
    playRandomNote() {
      let nextNote;
      if (this.wrongNotes.length > 0) {
        nextNote = this.wrongNotes.shift();
      } else {
        const randomNoteIndex = Math.floor(Math.random() * this.pianoBuilder.notes.length);
        // Zufällige Oktave zwischen 2 und 5 wählen, um vier volle Oktaven abzudecken
        //const randomOctave = Math.floor(Math.random() * 3) + 3; // +2, weil Oktaven bei 2 anfangen
        const randomOctave = Math.floor(Math.random() * 1) + 2; // +3, weil wir bei Oktave 3 beginnen
        nextNote = `${this.pianoBuilder.notes[randomNoteIndex]}${randomOctave}`;
      }
    
      this.currentNote = nextNote;
      this.logNoteHistory(nextNote, 'played');
      const generator = new NoteGenerator();
      generator.synthesizer(nextNote);
      setBackgroundColorForTone(nextNote.slice(0, -1), parseInt(nextNote.slice(-1))); // Passt den Hintergrund an den gespielten Ton an
    }

    /*
    playRandomNote() {
      let nextNote;
      if (this.wrongNotes.length > 0) {
        nextNote = this.wrongNotes.shift();
      } else {
        const randomNoteIndex = Math.floor(Math.random() * this.pianoBuilder.notes.length);
        const randomOctave = 4;
        nextNote = `${this.pianoBuilder.notes[randomNoteIndex]}${randomOctave}`;
      }
  
      this.currentNote = nextNote;
      this.logNoteHistory(nextNote, 'played');
      const generator = new NoteGenerator();
      generator.synthesizer(nextNote);
      setBackgroundColorForTone(nextNote.slice(0, -1), parseInt(nextNote.slice(-1))); // Passt den Hintergrund an den gespielten Ton an
    }
    */
  
    addEventListeners() {
      document.querySelectorAll('.key').forEach(key => {
        key.removeEventListener('click', this.handleNoteClick.bind(this));
        key.addEventListener('click', this.handleNoteClick.bind(this));
      });
    }
  
    showFeedback(message, isError = true) {
      const feedbackElement = document.getElementById('feedback');
      feedbackElement.textContent = message;
      feedbackElement.style.display = "block";
      feedbackElement.style.color = isError ? "red" : "green"; // Rot für Fehler, Grün für korrekt
      
      setTimeout(() => {
          feedbackElement.style.display = "none";
      }, 2000); // Nachricht verschwindet nach 2 Sekunden
  }


  handleNoteClick(event) {
    const clickedNote = event.target.id;

    if (clickedNote === this.currentNote) {
        // Logge den korrekten Treffer
        this.logNoteHistory(clickedNote, 'correct');
        this.showFeedback("Richtig!", false); // Positive Rückmeldung

        // Spiele den richtigen Ton noch einmal ab
        const generator = new NoteGenerator();
        generator.synthesizer(this.currentNote);

        setTimeout(() => {
            // Hole die Farbe der aktuellen Note
            const noteWithoutOctave = this.currentNote.slice(0, -1);
            const octave = parseInt(this.currentNote.slice(-1));
            const color = getToneColor(noteWithoutOctave, octave);

            // Lasse die richtige Taste kurz in der richtigen Farbe aufblinken
            const currentKey = document.getElementById(this.currentNote);
            const originalColor = currentKey.style.backgroundColor;
            currentKey.style.backgroundColor = color;

            setTimeout(() => {
                // Setze die Taste auf die ursprüngliche Farbe zurück und den Hintergrund kurz auf hellgrau
                currentKey.style.backgroundColor = originalColor;
                document.body.style.backgroundColor = 'hsl(0, 0%, 90%)';

                setTimeout(() => {
                    // Zurücksetzen des Zählers für falsche Versuche
                    this.wrongAttempts = 0;
                    // Spiele den nächsten Ton ab
                    this.playRandomNote();
                }, 500); // Warte, bevor der nächste Ton gespielt wird
            }, 500); // Lasse die Farbe 500ms lang aufblinken
        }, 1000); // Warte, bevor alles zurückgesetzt wird, damit der Ton abgeschlossen wird
    } else {
        this.wrongAttempts = (this.wrongAttempts || 0) + 1;
        this.logNoteHistory(clickedNote, 'wrong');
        this.showFeedback("nope!");

        // Prüfe, ob dies der vierte falsche Versuch ist
        if (this.wrongAttempts >= 2) {
            // Lasse die Taste in der richtigen Farbe aufblinken
            const correctKey = document.getElementById(this.currentNote);
            const noteWithoutOctave = this.currentNote.slice(0, -1);
            const octave = parseInt(this.currentNote.slice(-1));
            const color = getToneColor(noteWithoutOctave, octave);
            
            correctKey.style.backgroundColor = color;
            setTimeout(() => {
                correctKey.style.backgroundColor = ""; // Setze die Farbe der Taste zurück
                this.wrongAttempts = 0; // Zurücksetzen des Zählers für falsche Versuche
            }, 1000); // Lasse die Farbe 1 Sekunde lang aufblinken
        }
    }
}

  
    logNoteHistory(note, status) {
      if (!this.notesHistory[note]) {
        this.notesHistory[note] = { played: 0, correct: 0, wrong: 0 };
      }
      this.notesHistory[note][status]++;
      this.notesHistory[note]['played'] += status === 'played' ? 1 : 0;
  
      localStorage.setItem('notesHistory', JSON.stringify(this.notesHistory));
    }
  }
  
  //const piano = new PianoBuilder('piano', 4); // Ändere die Anzahl der Oktaven zu 4
  const piano = new PianoBuilder('piano', 1); // Oktavenanzahl auf 3 gesetzt
  const trainer = new EarTrainer(piano);
  trainer.init();
  //piano.js