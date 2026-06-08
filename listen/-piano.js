// Verantwortlich für die Erzeugung der Notenfrequenzen und deren Abspielen
class NoteGenerator {
  constructor(audioContext) {
    this.audioContext = audioContext;
    
  }



  // Berechnet die Frequenz einer Note basierend auf Notenname und Oktave
  noteFrequency(noteHeightOctave) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteIndex = notes.indexOf(noteHeightOctave.slice(0, -1));
    const octave = parseInt(noteHeightOctave.slice(-1), 10);
    
    // A4 ist die 9. Note in der vierten Oktave mit Index 9 (0-basiert) und hat eine Frequenz von 440Hz
    const a4Index = 9;
    const a4Octave = 4;
    const a4Frequency = 440;

    // Berechnet die Anzahl der Halbtonschritte von A4
    const halfStepsFromA4 = (octave - a4Octave) * 12 + (noteIndex - a4Index);
    
    // Verwendet die Gleichung der zwölften Wurzel von 2, um die Frequenz zu berechnen
    const frequency = a4Frequency * Math.pow(2, halfStepsFromA4 / 12);
    return frequency;
  }


    synthesizer(noteHeightOctave) {
      // Ruft die Frequenz der Note ab
      const frequency = this.noteFrequency(noteHeightOctave);

      // Erstellt einen neuen Oszillator innerhalb des AudioContext
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = 'sine'; // Der Oszillatortyp: 'sine', 'square', 'sawtooth', 'triangle'
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime); // Setzt die Frequenz des Oszillators

      // Erstellt einen GainNode, um die Lautstärke der Note zu kontrollieren
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime); // Setzt die Lautstärke

      // Verbindet den Oszillator mit dem GainNode und den GainNode mit dem AudioContext
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Startet den Oszillator sofort
      oscillator.start(this.audioContext.currentTime);

      // Stoppt den Oszillator nach 1 Sekunde
      oscillator.stop(this.audioContext.currentTime + 1);
  }
}

// Verantwortlich für den Aufbau des Pianos
class PianoBuilder {
  constructor(containerId, octaves) {
    this.containerId = containerId; // ID des HTML-Elements, in dem das Klavier gerendert wird
    this.octaves = octaves; // Anzahl der Oktaven, die das Klavier haben soll
    this.notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']; // Noten innerhalb einer Oktave
  }

  build() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error('Container not found');
      return;
    }
    // Beginnt das Erstellen der Tasten basierend auf der Anzahl der Oktaven
    for (let o = 0; o < this.octaves; o++) {
      this.notes.forEach((note, index) => {
        const key = document.createElement('div');
        key.id = `${note}${o + 3}`; // Oktavennummerierung beginnt bei 3 für ein mittleres C
        key.className = note.includes('#') ? 'key black' : 'key white';
        key.textContent = `${note}${o + 3}`; // Textinhalt für die Demo, kann für visuelle Klarheit entfernt werden
        key.style.cursor = 'pointer'; // Zeigt den Cursor als Zeiger, um Interaktivität anzudeuten

        // Fügt EventListener hinzu, der später für das Abspielen von Tönen implementiert wird
        key.addEventListener('click', (e) => {
          console.log(`${e.target.id} was clicked`);
          // Logik zum Abspielen der Note hier einfügen
        });

        container.appendChild(key);
      });
    }
  }
}

// Verantwortlich für das Trainingsprogramm
class EarTrainer {
    constructor(pianoBuilder, noteGenerator, options = {}) {
      this.pianoBuilder = pianoBuilder;
      this.noteGenerator = noteGenerator; // Speichere noteGenerator
      this.options = options;
      this.currentNote = '';
      this.wrongNotes = [];
      this.notesHistory = JSON.parse(localStorage.getItem('notesHistory')) || {};
      this.wrongAttempts = 0; // Zählt die Anzahl der falschen Versuche
    }
  
  

  init() {
    this.pianoBuilder.build();
    this.addEventListeners();
    //this.playInitialSequence(); // Optional: Spiel eine Sequenz von Noten beim Start
  }

  playRandomNote() {
    let nextNote;
    if (this.wrongNotes.length > 0 && this.options.focusOnWrongNotes) {
      nextNote = this.wrongNotes[Math.floor(Math.random() * this.wrongNotes.length)];
    } else {
      const randomNoteIndex = Math.floor(Math.random() * this.pianoBuilder.notes.length);
      const randomOctave = Math.floor(Math.random() * (this.options.octaveRange[1] - this.options.octaveRange[0] + 1)) + this.options.octaveRange[0];
      nextNote = `${this.pianoBuilder.notes[randomNoteIndex]}${randomOctave}`;
    }
  
    this.currentNote = nextNote;
    this.logNoteHistory(nextNote, 'played');
    this.noteGenerator.synthesizer(nextNote); // Änderung hier
    
  }
  

  playInitialSequence() {
    // Abspielen einer initialen Sequenz von Noten beim Start
    const startOctave = this.options.octaveRange[0];
    const endOctave = this.options.octaveRange[1];
    let currentOctave = startOctave;
    let noteIndex = 0;
  
    const playNext = () => {
      if (currentOctave > endOctave || (currentOctave === endOctave && noteIndex >= this.pianoBuilder.notes.length)) {
        // Nach Abschluss der Sequenz den ersten zufälligen Ton abspielen
        this.playRandomNote();
        return;
      }
  
      const note = this.pianoBuilder.notes[noteIndex] + currentOctave;
      // Verwende den noteGenerator aus dem Konstruktor, nicht einen neuen
      this.noteGenerator.synthesizer(note);
      setBackgroundColorForTone(note.slice(0, -1), parseInt(note.slice(-1))); // Optional: Aktualisiere den Hintergrund
  
      noteIndex++;
      if (noteIndex >= this.pianoBuilder.notes.length) {
        noteIndex = 0;
        currentOctave++;
      }
  
      setTimeout(playNext, 500); // Wartezeit zwischen den Noten
    };
  
    playNext();
  }
  
  

  addEventListeners() {
    document.querySelectorAll('.key').forEach(key => {
      key.addEventListener('click', this.handleNoteClick.bind(this));
    });
  }

  handleNoteClick(event) {
    const clickedNote = event.target.id;
    if (clickedNote === this.currentNote) {
      this.logNoteHistory(clickedNote, 'correct');
      this.clearFeedback(); // Löscht sofortiges Feedback, wenn vorhanden
      this.wrongAttempts = 0; // Zurücksetzen der falschen Versuche
      setTimeout(() => {
        this.playRandomNote();
      }, this.options.delayBetweenNotes);
    } else {
      this.wrongAttempts++;
      if (this.wrongAttempts >= this.options.attemptsBeforeHint) {
        this.showHint();
        this.wrongAttempts = 0; // Zurücksetzen der falschen Versuche nach Anzeige des Hinweises
      }
      this.logNoteHistory(clickedNote, 'wrong');
      // Optional: Zeige Feedback für falsche Antwort
    }
  }

  showHint() {
    // Anzeigen eines Hinweises, wenn der Benutzer mehrmals falsch liegt
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = `Hinweis: Versuche die Note ${this.currentNote}`;
    feedbackElement.style.display = "block";
    feedbackElement.style.color = "blue"; // Blau für Hinweise
    
    setTimeout(() => {
        feedbackElement.style.display = "none";
    }, 5000); // Hinweis verschwindet nach 5 Sekunden
  }

  clearFeedback() {
    // Löscht sofortiges Feedback zur Vorbereitung auf die nächste Note
    const feedbackElement = document.getElementById('feedback');
    if (feedbackElement) {
        feedbackElement.style.display = "none";
    }
  } 

  logNoteHistory(note, status) {
    if (!this.notesHistory[note]) {
      this.notesHistory[note] = { played: 0, correct: 0, wrong: 0 };
    }
    this.notesHistory[note][status]++;
    localStorage.setItem('notesHistory', JSON.stringify(this.notesHistory));
  }
}


function setBackgroundColorForTone(note, octave) {
  // Hier kommt die Logik für die Zuordnung von Farben zu den Noten und Oktaven
  // Dies ist ein Beispiel und kann entsprechend angepasst werden
  const hue = (note.charCodeAt(0) - 65) * 30; // Einfache Logik, um eine Farbe basierend auf dem Notennamen zu erzeugen
  const lightness = 50 + (octave - 4) * 10; // Einfache Logik, um die Helligkeit basierend auf der Oktave zu ändern
  document.body.style.backgroundColor = `hsl(${hue}, 100%, ${lightness}%)`;
}

// Initialisierung und Verwendung
document.addEventListener('DOMContentLoaded', (event) => {
  const audioContext = new AudioContext();
  const pianoBuilder = new PianoBuilder('piano', 1);
  const noteGenerator = new NoteGenerator(audioContext);
  const options = {
    octaveRange: [3, 5],
    focusOnWrongNotes: true,
    delayBetweenNotes: 1000,
    attemptsBeforeHint: 2,
  };
  const trainer = new EarTrainer(pianoBuilder, noteGenerator, options);

  trainer.init();
});
