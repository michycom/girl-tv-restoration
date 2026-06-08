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
<label style="display:none;" for="octaves">Wähle die Anzahl der Oktaven:</label>
    <select style="display:none;" id="octaves">
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
    <script src="playmode.js"></script>

<div id="note">Note will be displayed here</div>
<canvas id="sineWave"  style="border:0 solid black;height:50%;width: 100%;margin-top: 10%;"></canvas>

<script src="pitchctr.js"></script>

</body>
</html>
