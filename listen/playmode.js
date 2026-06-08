document.addEventListener('DOMContentLoaded', () => {
    let currentOctave = 4; // Startoktave
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const noteGenerator2 = new NoteGenerator2(audioContext);

    document.addEventListener('keydown', (e) => {
        // Definiere eine Mapping-Funktion für Tasten zu Noten
        const keyCodeToNote = {
            'Tab': 'A#', 'CapsLock': 'B', 'KeyA': 'C', 'KeyW': 'C#', 'KeyS': 'D', 'KeyE': 'D#', 'KeyD': 'E', 'KeyF': 'F',
            'KeyT': 'F#', 'KeyG': 'G', 'KeyY': 'G#', 'KeyH': 'A', 'KeyU': 'A#', 'KeyJ': 'B',
            'KeyK': 'C', 'KeyO': 'C#', 'KeyL': 'D', 'KeyP': 'D#', 'Semicolon': 'E', 'Quote': 'F','BracketRight':'F#','Backslash':'G',
            // Ergänze ggf. weitere Tasten
        };

        if (e.code === "ArrowUp") {
            currentOctave = Math.min(currentOctave + 1, 7); // Begrenze die Oktave nach oben
        } else if (e.code === "ArrowDown") {
            currentOctave = Math.max(currentOctave - 1, 1); // Begrenze die Oktave nach unten
        }
    
        let noteOctave = currentOctave;
        // Definiere eine Liste der Tasten, die eine höhere Oktave spielen sollen
        const higherOctaveKeys = ['KeyK', 'KeyL', 'KeyO', 'KeyP', 'Semicolon', 'Quote', 'BracketRight', 'Backslash'];
        if (higherOctaveKeys.includes(e.code)) {
            noteOctave = Math.min(currentOctave + 1, 7); // Erhöhe die Oktave für diese Tasten, begrenze auf max 7
        }
        
        if (keyCodeToNote[e.code]) {
            const note = keyCodeToNote[e.code] + noteOctave;
            console.log(`Note gespielt: ${note}`);
            console.log(`Note keyCodeToNote: ${e.code}`);
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
        if (!frequency) return;
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'square'; 
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime); 
        gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.02); 
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.93); 

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        console.log(frequency);
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 1); // Stoppe den Ton nach 1 Sekunde
    }

    noteToFrequency(note) {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const a4 = 440; // 432
        //const a4 = 432; // 
        const C4FREQ = a4 * Math.pow(2, -9 / 12);
        //const C4FREQ = 261.63 ;
        const [notePart, octave] = note.match(/([A-G]#?)(\d+)/).slice(1, 3);
        const keyNumber = notes.indexOf(notePart);
        const octaveNumber = parseInt(octave, 10);
        const distanceFromC4 = keyNumber + (octaveNumber - 4) * 12;
        const frequency = Math.pow(2, distanceFromC4 / 12) * C4FREQ; // Verwende 261.63 Hz als Basis für C4
        console.log("note: " + note + " frequency: " + frequency);
        return frequency;
    }
}