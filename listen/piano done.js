 function fadeOutElement(element, duration) {

            let opacity = 1; // Startopacity
            const interval = 50; // Wie oft die Opacity reduziert wird (in ms)
            const fadeOutStep = interval / duration; // Berechne den Schritt der Opazitätsreduktion
          
            const timer = setInterval(() => {
                if (opacity <= 0) {
                    clearInterval(timer);
                    element.style.display = 'none'; // Element verstecken, nachdem es ausgeblendet wurde
                } else {
                    opacity -= fadeOutStep; // Reduziere die Opacity
                    element.style.opacity = opacity;
                }
            }, interval);
          }
          


function getToneColor(note, octave) {
  // Grundfarben für Noten in Oktave 4
  
  const baseColors1 = {

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
  }
    

  const baseColors2 = {
    'C': 'HSL(60, 100%, 50%)',   //Gelb
    'G': 'HSL(90, 100%, 50%)',   //Gelbgrün
    'D': 'HSL(120, 100%, 50%)',  //Grün
    'A': 'HSL(150, 100%, 50%)',  //Türkis
    'E': 'HSL(180, 100%, 50%)',  //Cyan
    'B': 'HSL(210, 100%, 50%)',  //Himmelblau
    'F#': 'HSL(240, 100%, 50%)', //Blau
    'C#': 'HSL(270, 100%, 50%)', //Violett
    'G#': 'HSL(300, 100%, 50%)', //Magenta
    'D#': 'HSL(330, 100%, 50%)', //Rosa
    'A#': 'HSL(0, 100%, 50%)',   //Rot
    'F': 'HSL(30, 100%, 50%)'   //Orange
}


    const baseColors3 = {

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

    }

    const baseColors4 = {
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
    };

// Wähle zufällig eines der baseColors-Sets aus
//const selectedBaseColors = [baseColors1, baseColors2, baseColors3, baseColors4][Math.floor(Math.random() * 4)];
const selectedBaseColors  =  baseColors1;
// Berechne die Anpassung der Helligkeit basierend auf der Oktave
let lightnessAdjustment = (octave - 4) * 10; // Jede Oktave über/unter 4 ändert die Helligkeit um 10%

// Zugriff auf das ausgewählte Farbschema, um die Farbe basierend auf der Note zu erhalten
let baseColor = selectedBaseColors[note.replace(/[0-9]/g, '')]; // Entferne die Oktavenzahl aus der Note für das Mapping

// Fallback, falls keine Farbe gefunden wird
if (!baseColor) return 'hsl(0, 0%, 0%)';

// Extrahiere die HSL-Werte aus der gewählten Farbe
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
      
      
      //const musicalNotes = new MusicalNote(note,  octave); 
      // const textElements = document.querySelectorAll('svg text');
      // // Überprüfe, ob Textelemente vorhanden sind
      // if (textElements.length > 0) {
      // // Zugriff auf das letzte Textelement und setze display auf 'none'
      // textElements[textElements.length - 1].style.display = 'none';
      // }

      const noteIndex = notes.indexOf(note);
      const a4Index = 9;
      const a4Octave = 4;
      
      const semitoneDistance = (octave - a4Octave) * 12 + (noteIndex - a4Index);
      const A4 = 440 ;
      //const A4 = 432 ;
      const frequency = A4 * Math.pow(2, semitoneDistance / 12);
      
      return parseFloat(frequency.toFixed(2));
    }
  
    synthesizer_for_phone(note_hight_octave) {
      const frequency = this.note_frequency(note_hight_octave);
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
    
      // Erstellen einer ausgewogenen benutzerdefinierten Wellenform
      // Eine einfache, aber effektive Kombination für Klarheit und Fülle
      var real = new Float32Array([0, 0.4, 0.6, 0.5, 0.3, 0.1]);
      var imag = new Float32Array(real.length);
      var customWave = this.audioContext.createPeriodicWave(real, imag);
    
      oscillator.setPeriodicWave(customWave);
    
      // Einstellen des Tiefpassfilters für Klarheit
      var filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(5000, this.audioContext.currentTime); // Erhöht für mehr Klarheit
      filter.Q.setValueAtTime(1, this.audioContext.currentTime); // Standard-Qualität
    
      // Einstellen der Gain-Node für hörbare Lautstärke
      gainNode.gain.setValueAtTime(0.01, this.audioContext.currentTime); // Beginnt fast stumm
      gainNode.gain.exponentialRampToValueAtTime(1, this.audioContext.currentTime + 0.01); // Schneller Anstieg zu voller Lautstärke
      gainNode.gain.exponentialRampToValueAtTime(0.1, this.audioContext.currentTime + 1); // Abklingen zu einer hörbaren, aber nicht überwältigenden Lautstärke
    
      // Verbindungen
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
    
      // Frequenz einstellen und Starten
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 1); // Der Ton spielt für 1 Sekunde
    }
    
    
    synthesizer(note_hight_octave) {
      // Überprüfen, ob die App auf einem iPhone läuft
      const isIphone = navigator.userAgent.match(/iPhone/i);
      
      // Wenn es ein iPhone ist, verwenden Sie die optimierte Funktion
      if (isIphone) {
        this.synthesizer_for_phone(note_hight_octave);
        return; // Stoppt die Ausführung weiter, um Duplikate zu vermeiden
      }

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

    // Visual Feedback für die richtige Note nur am Rand der Taste
    const noteWithoutOctave = clickedNote.slice(0, -1);
    const octave = parseInt(clickedNote.slice(-1));
    const correctColor = getToneColor(noteWithoutOctave, octave);

    const musicalNotes = new MusicalNote(clickedNote,octave); // was 4
      const textElements = document.querySelectorAll('svg text');
      // Überprüfe, ob Textelemente vorhanden sind
      if (textElements.length > 0) {
      // Zugriff auf das letzte Textelement und setze display auf 'none'
      textElements[textElements.length - 1].style.display = 'none';
      }
      const noteContainers = document.getElementsByClassName('note-container');
    // Überprüfe, ob 'noteContainers' Elemente enthält
    if (noteContainers.length > 0) {
        // Rufe 'fadeOutElement' für jedes Element in 'noteContainers' auf
        for (let i = 0; i < noteContainers.length; i++) {
            fadeOutElement(noteContainers[i], 2000); // Übergebe jedes Element einzeln an 'fadeOutElement'
        }
    }


    // Spricht die Note aus
    this.speakNote(clickedNote);

    setTimeout(() => {
      // Richtig geratene Note wird noch einmal abgespielt
      
      this.noteGenerator.synthesizer(clickedNote);


// for (let i = 0; i < noteContainers.length; i++) {
//           //noteContainers[i].innerHTML = "";

//       }     

      const correctKey = document.getElementById(clickedNote);
      correctKey.style.backgroundColor = correctColor;

      // Setzt die Randfarbe nach einer kurzen Zeit zurück
      setTimeout(() => {
        correctKey.style.backgroundColor = "";
      }, 500); // Kurze Verzögerung bevor die Randfarbe zurückgesetzt wird

    }, 500); // Wartezeit nach der Sprachausgabe, bevor die Note abgespielt wird

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



