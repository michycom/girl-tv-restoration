<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Klaviertastatur</title>
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

    <button id="startButton">Start</button>
    <div id="piano"></div>
    <div id="feedback" style="display:none; color: silver; font-size: 20px;background:white; position: absolute; top: 250px; right: 70%; transform: translateX(70%);"></div>

    <script src="piano.js"></script>
    <script>
       document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function() {

        
        // Überprüfen, ob der AudioContext bereits existiert
        if (!window.audioContext) {
            // Initialisiere den AudioContext
            window.audioContext = new AudioContext();

            // Jetzt, da window.audioContext definiert ist, können wir auf onstatechange sicher zugreifen
            window.audioContext.onstatechange = function() {
                console.log(window.audioContext.state);
            };

            // Beispiel, um den ersten Ton abzuspielen
            let noteGenerator = new NoteGenerator(window.audioContext);
            //noteGenerator.synthesizer('G4');
            //noteGenerator.synthesizer('E4');
            //noteGenerator.synthesizer('C4');
        } else {
            // Wenn der AudioContext schon existiert, versuche ihn zu resume, falls er suspended ist
            if (window.audioContext.state === 'suspended') {
                window.audioContext.resume();
            }
        }
      // Verstecke den Button



document.body.addEventListener('click', function(event) {
  // Prüfe, ob das geklickte Element eine Klaviertaste ist
  if (!event.target.classList.contains('key')) {
      // Wenn nicht, spiele den zuletzt gespielten Ton erneut ab
      if (trainer && trainer.currentNote) {
          trainer.noteGenerator.synthesizer(trainer.currentNote);
      }
  }
});



      startButton.style.display = 'none';

    });
});
    </script>
</body>
</html>
