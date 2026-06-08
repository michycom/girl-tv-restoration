

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
  document.body.style.transition = 'background-color 1s';
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
  const gainNode = this.audioContext.createGain();

  // Eine ausgewogene benutzerdefinierte Wellenform
  var real = new Float32Array([0.9, 0.3, 0.2, 0.9, 0.3, 0.4, 0.1]);
  var imag = new Float32Array(real.length);
  var customWave = this.audioContext.createPeriodicWave(real, imag);

  oscillator.setPeriodicWave(customWave);

  // Erstelle einen Tiefpassfilter
  var filter = this.audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(720, this.audioContext.currentTime); // Senke die Frequenz für mehr Wärme
  filter.Q.setValueAtTime(1, this.audioContext.currentTime);

  // Erstelle einen Kompressor
  var compressor = this.audioContext.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime); // Schwellenwert für die Kompression
  compressor.knee.setValueAtTime(30, this.audioContext.currentTime); // Macht die Kompression bei der Schwelle weicher
  compressor.ratio.setValueAtTime(12, this.audioContext.currentTime); // Kompressionsverhältnis
  compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime); // Schnelle Attack-Zeit für eine präzise Kontrolle
  compressor.release.setValueAtTime(0.25, this.audioContext.currentTime); // Release-Zeit

  // Verbindungen
  oscillator.connect(filter);
  filter.connect(compressor);
  compressor.connect(gainNode);
  gainNode.connect(this.audioContext.destination);

  oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

  // Attack und Decay
  gainNode.gain.setValueAtTime(0, this.audioContext.currentTime); // Starte bei 0
  gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.1); // Attack bis 1 in 0.1 Sekunden
  gainNode.gain.exponentialRampToValueAtTime(0.1, this.audioContext.currentTime + 1); // Decay zu 0.1 in einer Sekunde für einen weicheren Ausklang

  oscillator.start();
  oscillator.stop(this.audioContext.currentTime + 1); // Der Ton spielt für 1 Sekunde
}

  
  }
  
 class PianoBuilder {
    constructor(containerId) {
        this.containerId = containerId;
        this.notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    }

    // Erweiterung der Klasse PianoBuilder um Event-Listener für das Spielen der Tasten
PianoBuilder.prototype.addPlayNoteListener = function(noteGenerator) {
  document.querySelectorAll('.key').forEach(key => {
      key.addEventListener('click', event => {
          const noteId = event.target.id;
          const note = noteId.slice(0, -1);
          const octave = parseInt(noteId.slice(-1), 10);
          
          // Spiele den Ton
          noteGenerator.synthesizer(noteId);
          
          // Setze die Farbe der Taste
          const color = getToneColor(note, octave);
          event.target.style.backgroundColor = color;
          
          // Setze die Farbe der Taste nach kurzer Zeit zurück
          setTimeout(() => {
              event.target.style.backgroundColor = '';
          }, 500); // Die Dauer kann angepasst werden, um das "Aufleuchten" zu steuern
      });
  });
};

// Integration der addPlayNoteListener Funktion in die init Funktion der EarTrainer Klasse
EarTrainer.prototype.addEventListeners = function() {
  this.pianoBuilder.addPlayNoteListener(this.noteGenerator);

  // Füge hier weitere Event-Listener hinzu, falls benötigt
};

// Stelle sicher, dass die PianoBuilder Instanz und die NoteGenerator Instanz verfügbar sind, bevor du Event-Listener hinzufügst
document.addEventListener('DOMContentLoaded', () => {
  // Beispielhafte Initialisierung und Verwendung
  const pianoBuilder = new PianoBuilder('piano-container-id'); // Ersetze 'piano-container-id' mit der tatsächlichen ID des Containers für die Klaviertastatur
  pianoBuilder.build([3, 4]); // Baue eine Klaviertastatur für die Oktaven 3 bis 4
  const noteGenerator = new NoteGenerator();

  // Füge Play-Note-Listener hinzu, damit die Tasten spielbar sind
  pianoBuilder.addPlayNoteListener(noteGenerator);
});


    calculateBlackKeyPosition(whiteKeyIndex, whiteKeyWidth, blackKeyWidth) {
      // Position der schwarzen Taste zwischen den weißen Tasten berechnen
      let offsetForBlack = whiteKeyWidth - blackKeyWidth / 2;
      return whiteKeyIndex * whiteKeyWidth - offsetForBlack;
    }

    
    build(octaveRange) {
      const container = document.getElementById(this.containerId);
      container.innerHTML = ''; // Lösche bestehende Inhalte

      let whiteKeyIndex = 0; // Zähler für die Positionierung der schwarzen Tasten
      
      for (let octave = octaveRange[0]; octave <= octaveRange[1]; octave++) {

        let octaveDiv = document.createElement('div');
        octaveDiv.className = 'octave';
        container.appendChild(octaveDiv);


        this.notes.forEach((note, index) => {
          const key = document.createElement('div');
          key.className = note.includes('#') ? 'key black' : 'key white';
          key.id = `${note}${octave}`;
          
          const label = document.createElement('span');
          label.className = 'note-label';
          label.innerText = note.includes('#') ? note.replace('#', '♯') : note;
          key.appendChild(label);
          
          octaveDiv.appendChild(key); // Füge die Taste zum aktuellen Oktave-Div hinzu
          
          //container.appendChild(key);
    
          if (!note.includes('#')) {
            whiteKeyIndex++;
          } else {
            // Dies stellt sicher, dass jede schwarze Taste eine Position erhält
            // die sich auf die vorherige weiße Taste bezieht
            key.style.left = `${whiteKeyIndex * 66 }px`; // Ändere hier die Werte entsprechend deines Designs
          }
        });
      }
    }
    





}

  

     // Übersetzt Notennamen für die Sprachausgabe
     function translateNoteForSpeech(note) {
      // Ersetzt "C#" zu "Zis" für die spezifische deutsche Aussprache
      let translatedNote = note.replace('C#', 'Zis');
      // Ersetzt alle anderen "#"-Vorkommen mit "is", nachdem "C#" bereits behandelt wurde
      translatedNote = translatedNote.replace('#', 'is');
      return translatedNote;
    }

  class EarTrainer {
    constructor(pianoBuilder, noteGenerator, options) {
      this.pianoBuilder = pianoBuilder;
      this.noteGenerator = noteGenerator;
      // Stelle sicher, dass options und options.octaveRange korrekt initialisiert werden
      this.options = options;
      if (!this.options.octaveRange) {
          // Standardwert, falls nicht spezifiziert
          this.options.octaveRange = [3, 4];
      }
      this.currentNote = '';
      this.masteredNotes = new Set();
      this.wrongAttempts = 0;
      this.notesHistory = {};
  }
  
  init() {
    this.pianoBuilder.build(this.options.octaveRange); // Stelle sicher, dass octaveRange korrekt übergeben wird
    this.addEventListeners();
    this.playRandomNote();
}
  
    playRandomNote() {
      let weightedNotes = [];
  
      // Erzeugung der gewichteten Noten basierend auf der Fehlerrate
      Object.entries(this.notesHistory).forEach(([note, stats]) => {
          if (stats.wrong > stats.correct && !this.masteredNotes.has(note)) {
              for (let i = 0; i < stats.wrong - stats.correct; i++) {
                  weightedNotes.push(note);
              }
          }
      });
  
      // Hinzufügen der Noten, die nicht gemeistert wurden
      this.pianoBuilder.notes.forEach(note => {
          for (let i = this.options.octaveRange[0]; i <= this.options.octaveRange[1]; i++) {
              if (!this.masteredNotes.has(`${note}${i}`)) {
                  weightedNotes.push(`${note}${i}`);
              }
          }
      });
  
      // Mischen der Notenliste
      weightedNotes = this.shuffleArray(weightedNotes);
  
      if (weightedNotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * weightedNotes.length);
          this.currentNote = weightedNotes[randomIndex];
          this.noteGenerator.synthesizer(this.currentNote);
          setBackgroundColorForTone(this.currentNote.slice(0, -1), parseInt(this.currentNote.slice(-1)));
      } else {
        console.log("Alle Noten wurden gemeistert! Wechsel der Oktave oder Neustart.");

        // Hier beginnt die Logik zum Hinzufügen einer neuen Oktave
        this.addNewOctaveAndRebuild();
    }
}

// Neue Methode innerhalb der Klasse EarTrainer zum Hinzufügen einer neuen Oktave und Neuaufbau
addNewOctaveAndRebuild() {
    const maxOctave = 5; // Maximale Oktave, die erreicht werden kann
    const minOctave = 2; // Minimale Oktave, die erreicht werden kann

    // Erweitere zuerst nach unten, bis die minimale Oktave erreicht ist
    if (this.options.octaveRange[0] > minOctave) {
        this.options.octaveRange[0] -= 1;
    }
    // Sobald die minimale Oktave erreicht ist, erweitere nach oben, bis das Maximum erreicht ist
    else if (this.options.octaveRange[1] < maxOctave) {
        this.options.octaveRange[1] += 1;
    } else {
        console.log("Die maximale Erweiterung der Oktaven wurde erreicht.");
        // Hier könnte eine Logik implementiert werden, um das Spiel zurückzusetzen oder eine andere Art von Herausforderung zu bieten
    }

    // Lösche die gemeisterten Noten und Notenhistorie, um von vorne zu beginnen
    this.masteredNotes.clear();
    this.notesHistory = {};

    // Neuaufbau der Klaviertastatur mit der neuen Oktavenanzahl
    this.pianoBuilder.build(this.options.octaveRange);

    // Erneutes Hinzufügen von Event Listeners für die neu generierten Tasten
    this.addEventListeners();


    // Fortsetzung des Spiels mit einer neuen zufälligen Note
    this.playRandomNote();
}


  
shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // ES6 Tauschtrick
  }
  return array;
}
  
    addEventListeners() {
      document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', this.handleNoteClick.bind(this));
      });
    }



// Sprachausgabe der Note
speakNote(note) {
  const utterance = new SpeechSynthesisUtterance(translateNoteForSpeech(note));
  utterance.rate = 0.5;
  utterance.pitch = 0.8;
  window.speechSynthesis.speak(utterance);
}
  
handleNoteClick(event) {
  const clickedNote = event.target.id;

  if (clickedNote === this.currentNote) {
    this.logNoteHistory(clickedNote, 'correct');
    this.showFeedback("Richtig!", true);

    // Spricht die Note aus
    this.speakNote(clickedNote);

    setTimeout(() => {
      // Richtig geratene Note wird noch einmal abgespielt
      this.noteGenerator.synthesizer(clickedNote);

      // Visual Feedback für die richtige Note nur am Rand der Taste
      const noteWithoutOctave = clickedNote.slice(0, -1);
      const octave = parseInt(clickedNote.slice(-1));
      const correctColor = getToneColor(noteWithoutOctave, octave);

      const correctKey = document.getElementById(clickedNote);
      correctKey.style.backgroundColor = correctColor;

      // Setzt die Randfarbe nach einer kurzen Zeit zurück
      setTimeout(() => {
        correctKey.style.backgroundColor = "";
      }, 500); // Kurze Verzögerung bevor die Randfarbe zurückgesetzt wird

    }, 1000); // Wartezeit nach der Sprachausgabe, bevor die Note abgespielt wird

    if (this.wrongAttempts === 0) {
      // Wenn der Ton beim ersten Mal richtig geraten wurde, füge ihn zu den gemeisterten hinzu
      this.masteredNotes.add(clickedNote);
    }

    setTimeout(() => {
      this.wrongAttempts = 0;
      this.playRandomNote();
    }, this.options.delayBetweenNotes + 1500); // Anpassung für Sprachausgabe und visuelles Feedback
  } else {
        this.wrongAttempts++;
        this.logNoteHistory(clickedNote, 'wrong');
        this.masteredNotes.delete(clickedNote);
        this.showFeedback("Falsch, versuche es nochmal!");
    
        if (this.wrongAttempts >= 2) {
          // Wenn zwei Mal falsch geraten wurde, zeige die richtige Note visuell
          const correctKey = document.getElementById(this.currentNote);
          const noteWithoutOctave = this.currentNote.slice(0, -1);
          const octave = parseInt(this.currentNote.slice(-1));
          const correctColor = getToneColor(noteWithoutOctave, octave);
    
          
          correctKey.style.border = `2px solid ${correctColor}`;
          setTimeout(() => {
            correctKey.style.border = ""; // Setze die Farbe der Taste zurück
            this.wrongAttempts = 0;
          }, 1000);
        }
      }
    }
  
    visualFeedback(noteId, type, reset) {
      const noteElement = document.getElementById(noteId);
      if (noteElement && type === "correct") {
        const noteWithoutOctave = noteId.slice(0, -1);
        const octave = parseInt(noteId.slice(-1));
        const correctColor = getToneColor(noteWithoutOctave, octave);
        noteElement.style.backgroundColor = correctColor;
        setTimeout(() => {
          noteElement.style.backgroundColor = ""; // Setzt die Farbe zurück
          if (reset) {
            this.wrongAttempts = 0;
            this.playRandomNote();
          }
        }, 1000);
      } else if (noteElement) {
        // Für andere Typen von visuellem Feedback, falls benötigt
      }
    }
  
    logNoteHistory(note, status) {
  if (!this.notesHistory[note]) {
    this.notesHistory[note] = { played: 0, correct: 0, wrong: 0 };
  }
  this.notesHistory[note][status]++;
  localStorage.setItem('notesHistory', JSON.stringify(this.notesHistory));
}
  
    showFeedback(message, isSuccess) {
      console.log(message); // Implementiere hier deine Logik für visuelles Feedback
    }
  }
  
  // Globale Variable trainer definieren
let trainer;

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function() {
        if (!window.customAudioContext) {
            window.customAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            const pianoBuilder = new PianoBuilder('piano', parseInt(document.getElementById('octaves').value, 10) || 3);
            const noteGenerator = new NoteGenerator(window.customAudioContext);
            const options = {
                octaveRange: [3,3],
                focusOnWrongNotes: true,
                delayBetweenNotes: 1000,
                attemptsBeforeHint: 2,
            };
            // Initialisiere trainer mit der neu instanziierten Klasse EarTrainer
            trainer = new EarTrainer(pianoBuilder, noteGenerator, options);
            trainer.init();

            document.addEventListener('click', function(event) {
              // Prüfe, ob das geklickte Element eine Klaviertaste ist oder nicht
              if (!event.target.closest('.key')) {
                  // Wenn nicht, spiele den zuletzt gespielten Ton erneut ab
                  if (trainer && trainer.currentNote) {
                      trainer.noteGenerator.synthesizer(trainer.currentNote);
                  }
              }
          });





        } else {
            window.customAudioContext.resume();
        }
        startButton.style.display = 'none';
    });
});



