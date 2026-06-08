<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Klaviertastatur</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <button id="startButton">Start</button>
    <div id="piano"></div>
    <div id="feedback" style="display:none; color: silver; font-family;arial;font-size: 20px;background:white; position: absolute; top: 250px; right: 70%; transform: translateX(70%);"></div>

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
            noteGenerator.synthesizer('G4');
            noteGenerator.synthesizer('E4');
            noteGenerator.synthesizer('C4');
        } else {
            // Wenn der AudioContext schon existiert, versuche ihn zu resume, falls er suspended ist
            if (window.audioContext.state === 'suspended') {
                window.audioContext.resume();
            }
        }
      // Verstecke den Button
      startButton.style.display = 'none';

    });
});
    </script>
</body>
</html>
