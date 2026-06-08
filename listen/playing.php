<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Klaviertastatur</title>
    <script src="score.js"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>


<label style="display:none;" for="octaves">Wähle die Anzahl der Oktaven:</label>
<select style="display:none;"  id="octaves">
    <option value="1" selected>1 Oktave</option>
    <option value="2">2 Oktaven</option>
    <option value="3">3 Oktaven</option>
    <option value="4">4 Oktaven</option>
    <option value="5">5 Oktaven</option>
</select>
<div id="notes" style="position: fixed;top:50%;"></div>
<button id="changeNote">Change Note</button>
    <button id="startButton">Start</button>
    <div id="piano"></div>
    <div id="feedback" style="display:none; color: silver; font-size: 20px;background:white; position: absolute; top: 250px; right: 70%; transform: translateX(70%);"></div>

    <script src="piano.js"></script>
  <script>
  document.addEventListener('DOMContentLoaded', () => {
    let currentOctave = 4; // Startoktave
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const noteGenerator2 = new NoteGenerator2(audioContext);


    // Definiere eine Mapping-Funktion für Tasten zu Noten
    document.addEventListener('keydown', (e) => {
    const keyCodeToNote = {
        'KeyA': 'C3',  // C der 3. Oktave
        'KeyW': 'C#3', // C# der 3. Oktave
        'KeyS': 'D3',  // D der 3. Oktave
        'KeyE': 'D#3', // D# der 3. Oktave
        'KeyD': 'E3',  // E der 3. Oktave
        'KeyF': 'F3',  // F der 3. Oktave
        'KeyT': 'F#3', // F# der 3. Oktave
        'KeyG': 'G3',  // G der 3. Oktave
        'KeyZ': 'G#3', // G# der 3. Oktave, auf QWERTY ist dies 'KeyY'
        'KeyH': 'A3',  // A der 3. Oktave
        'KeyU': 'A#3', // A# der 3. Oktave
        'KeyJ': 'B3',  // B der 3. Oktave
        'KeyK': 'C4',  // C der 4. Oktave
        'KeyO': 'C#4', // C# der 4. Oktave
        'KeyL': 'D4',  // D der 4. Oktave
        'KeyP': 'D#4', // D# der 4. Oktave
        'Semicolon': 'E4',  // E der 4. Oktave, Achtung: Dieser Code variiert je nach Layout
        'Quote': 'F4',      // F der 4. Oktave, Achtung: Dieser Code variiert je nach Layout
        // Ergänze ggf. weitere Tasten
    };
    
    if (e.code === "ArrowUp") {
            currentOctave = Math.min(currentOctave + 1, 5); // Begrenze die Oktave nach oben
            console.log(`Oktave geändert: ${currentOctave}`);
        } else if (e.code === "ArrowDown") {
            currentOctave = Math.max(currentOctave - 1, 3); // Begrenze die Oktave nach unten
            console.log(`Oktave geändert: ${currentOctave}`);
        } else if (keyCodeToNote[e.code]) {
            const note = keyCodeToNote[e.code] + currentOctave;
            console.log(`Note gespielt: ${note}`);
            noteGenerator2.synthesizer(note); // Spiele die Note
        }
    });
});

class NoteGenerator2 {
    constructor(audioContext) {
        this.audioContext = audioContext;
    }

    synthesizer(note) {
        const frequency = this.noteToFrequency(note);
        if (!frequency) return; // Wenn keine Frequenz gefunden wurde, beende die Funktion
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.connect(this.audioContext.destination);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5); // Stoppe den Ton nach 0.5 Sekunden
    }

    noteToFrequency(note) {
        // Vereinfachte Notenliste ohne doppelte Einträge für enharmonische Verwechslungen
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const [notePart, octave] = note.match(/([A-G]#?)(\d)/).slice(1, 3);
        const keyNumber = notes.indexOf(notePart);
        const octaveNumber = parseInt(octave, 10);

        if (keyNumber === -1) return null; // Note nicht gefunden
        // Korrigiere die Berechnung, um die tatsächliche Oktave und die Position der Note zu berücksichtigen
        return Math.pow(2, (keyNumber + (octaveNumber - 4) * 12) / 12) * 440;
    }
}

  </script>

<div id="note">Note will be displayed here</div>
<canvas id="sineWave"  style="border:0 solid black;height:50%;width: 100%;margin-top: 10%;"></canvas>

<script src="pitchctr.js"></script>

</body>
</html>
