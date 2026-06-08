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
  if (!window.audioContext) {
    window.audioContext = new AudioContext();
    // Erstelle hier alle benötigten Instanzen neu
    const noteGenerator = new NoteGenerator(window.audioContext);
    const pianoBuilder = new PianoBuilder('piano', 3);
    const trainer = new EarTrainer(pianoBuilder, noteGenerator, { octaveRange: [3, 5] });
    trainer.init();
  } else {
    if (window.audioContext.state === 'suspended') {
      window.audioContext.resume();
    }
  }
  startButton.style.display = 'none';
});

});
    </script>
</body>
</html>
