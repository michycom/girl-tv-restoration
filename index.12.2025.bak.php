<!DOCTYPE HTML>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>girl.tv: "Unveiling the Enigma of Not-Something"</title>
  <style>

#before {
    position: fixed;    /* Fixed position to stay on top of other content */
    top: 0;             /* Align to the top of the page */
    right: 0;           /* Align to the right of the page */
    background-color: pink; /* Background color */
font-family: 'Arial', sans-serif; /* Example of a more formal and versatile font */
    font-size: 1.5em;   /* Font size */
    color: white;       /* Text color */
    padding: 10px;      /* Some padding around the text */
    z-index: 1000;      /* High z-index to ensure it stays on top */
    border-bottom-left-radius: 10px; /* Rounded bottom-left corner for aesthetic */

}

    body, html {
      height: 100%;
      margin: 0;
      font-size: 30px;
      color: black;
      background-color: green;
    }

    #love {
      filter: invert(100%);
    }
    .video-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 50%;
      width: 100%;
      height: 76%;
      overflow: hidden;
      z-index: -1;
      padding: 10% 25%; /* Ränder oben/unten und rechts/links */
      padding: 10% 20%; /* Ränder oben/unten und rechts/links */
    }

    #banner {
  position: absolute;
  
  /*right: 0;*/
  z-index: 100;
  margin-right: 30px;
  margin-top: 15px;
  top: 9px;
  left: 31px;
}

#banner img {height:64px; width:64px; margin-top:30px;} 

    video {
      position: absolute;
      top: 50%;
      left: 50%;
      top: 28%;
      transform: translate(-50%, -50%);
      max-width: 100%; /* Maximale Breite */
      max-height: 100%; /* Maximale Höhe */
    }

    .tv {
      font-size: 10px;
      position: absolute;
      margin-top: 50vh;
      background: white;
      margin-left: 242px;
      z-index: 1;
      opacity: 0.80;
    }

    .hello {
      margin-left: -200px;
      margin-top: -142px;
    }

    .world {
      display: none;
      border: 0px solid black;
      background: silver;
      height: 5000px;
      position: absolute;
      top: 1000px;
      opacity: 0.6;
      left: -2500px;
      width: 4500px;
      border-radius: 50%;
      z-index: 1;
    }


  .www, .girl {
  position: absolute;
  z-index: 1;
}

.www {
  padding: 49px;
  transform: translate(-50%, -50%);
}

.girl {
  transform: translate(38%, -50%);
}

    html {
      filter: invert(100%);
      opacity: 0.8;
    }

    .world {
  /* Dein bisheriger Code */
  box-shadow: 0 0 80px 30px #ffffff; /* softer Glow */
}

#banner {
    animation: color-animation 60s infinite alternate; /* Hinzufügen der Farbwechsel-Animation */
    text-shadow: 3px 3px 3px lightgray; /* Schatteneffekt */
    background: linear-gradient(45deg, black, brown); /* Hintergrund */
    -webkit-background-clip: text;
    color: transparent;
    padding-right:20px;
  }
    
    body {
    cursor: url('https://girl.tv/2023/note.ico'), auto; /* Benutzerdefinierter Cursor */
      }


  body, html {
      height: 100%;
      margin: 0;
      font-size: 60px;
      color: black;
      background-color: green;
      overflow: hidden; /* Neu */
    }

    .top-bar, .bottom-bar { /* Neu */
      position: fixed;
      background: greenyellow;
      width: 100%;
      height: 90px;
      z-index: 100;
      
    }

    .top-bar {
      top: 0;
      background: lightblue;
      display:none;
    }

    .bottom-bar {
      bottom: 0;
      border-top:30px solid black;
    }

    @keyframes bg-color-flashing { /* Neu */
      0% { background-color: red; }
      50% { background-color: blue; }
      100% { background-color: red; }
    }


    @keyframes color-animation {
    0% { color: silver; }
    25% { color: lightskyblue; }
    50% { color: lightgreen; }
    75% { color: lightyellow; }
    100% { color: lightpink; }
  }
    body {
      animation: bg-color-flashing 2s infinite; /* Neu */
    }


    .video-container {
      border-radius: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      transform: translate(-50%, -50%) perspective(20px) rotateX(20deg); /* Perspektivische Verzerrung */
      transform: translate(-50%, -65%) perspective(15px) rotateX(4deg);
      overflow: hidden;
      z-index: 0; /* Geändert */
      border-radius: 372px;
    }

    video {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;

      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 68%;
      max-height: 70%;
      border-radius: 372px;
    }

    .tv {
  font-size: 10px;
  position: absolute;
  margin-top: 30%;
  background: white;
  margin-left: 50%;
  z-index: 1;}

  .world {
  display: none;
  border: 0px solid black;
  background: #dfed78;
  height: 4416px;
  position: absolute;
  top: -191px;
  opacity: 0.5;
  left: -2516px;
  width: 5312px;
  border-radius: 49%;
  z-index: 1;
}


.world {
  display: none;
  border: 0px solid black;
  background: silver;
  height: 431vh;
  position: absolute;
  top: -20vh;
  opacity: 0.8;
  left: -245vh;
  width: 490vh;
  border-radius: 50%;
  z-index: 1;

  }


  </style>
</head>
<body>
 <div class="top-bar"></div>   
  <div class="bottom-bar"></div> 

  <div class="video-container">
    <video id="myvideo" autoplay loop muted>
      <source src="https://girl.tv/2023/Nothing-to-discuss-2025-david-listen.mp4" type="video/mp4"/>
    </video>
  </div>

  <div id="banner"><img alt="girl.tv" src="https://girl.tv/art/tv.girl.gif"></div>

  <div class="tv">
    <div class="hello">it just nothing.</div>
    <div class="world"></div>

  <div class="www">𓃦 </div>
  <div class="girl">𓁓.</div>

  <script src="https://girl.tv/js/jquery-3.7.1.min.js"></script>
  <script>
  $(document).ready(function(){
  $("html").click(function(){
    var myVideo = document.getElementById('myvideo');
    myVideo.play();
    myVideo.muted = !myVideo.muted;
  });


  let cursor = document.createElement("img");
  cursor.src = 'https://girl.tv/2023/note.ico';
  cursor.style.position = "absolute";
  cursor.style.zIndex = "9999";
  cursor.style.width = "32px";
  cursor.style.height = "32px";
  cursor.style.pointerEvents = "none"; // Damit der Cursor nicht in den Weg kommt

  document.body.appendChild(cursor);

  document.addEventListener('mousemove', function(e) {
    cursor.style.left = (e.clientX + 16) + "px"; // Zentrierung des Cursors
    cursor.style.top = (e.clientY - 16) + "px";
  });

  setInterval(function() { cursor.style.opacity ^= 0.5; }, 100000); // Blinken

  // HTML Element reference
const htmlEl = document.documentElement;
const helloEl = document.querySelector('.hello');
const worldEl = document.querySelector('.world');
const tvEl = document.querySelector('.tv'); // hinzufügt den Punkt vor "tv"
const wwwEl = document.querySelector('.www');
const girlEl = document.querySelector('.girl');
const bodyEl = document.body;

// HTML invert & opacity animation
setInterval(() => {
    //htmlEl.style.transition = 'filter 10s, opacity 10s';
    //htmlEl.style.filter = `invert(${Math.random() * 1}%)`;
    //htmlEl.style.opacity = `${Math.random() * (1 - 0.88) + 0.11}`;
}, 2000);

// Hello Element Animation
setInterval(() => {
  htmlEl.style.transition = 'filter 3s ease-in-out, opacity 3s ease-in-out';
    helloEl.style.marginLeft = Math.random() > 0.5 ? '-2px' : '0px';
    helloEl.style.marginTop = Math.random() > 0.5 ? '-1px' : '0px';
}, 500);

// World Element Animation starting after 2m30s
setTimeout(() => {
    worldEl.style.display = 'block';

    // Other animations for World Element
    setInterval(() => {
        //worldEl.style.transition = 'background 45s, box-shadow 50s';
        //worldEl.style.background = Math.random() > 0.7 ? '#756641' : '#46266c';
        worldEl.style.boxShadow = Math.random() > 0.8 ? '0 0 80px 30px #240505' : '0 0 80px 30px #55555542';
    }, 4500);

}, 150000); // 2m30s

// TV Element Animation after 1m30s
setTimeout(() => {
    tvEl.style.transition = 'margin-top 20s';
    tvEl.style.marginTop = '100%';
}, 90000); // 1m30s

// www Element Animation
setTimeout(() => {
    setInterval(() => {
        wwwEl.style.transition = 'transform 70s, padding 30s';
        //wwwEl.style.transform = Math.random() > 0.5 ? 'translate(-34%, -30%)' : 'translate(0%, 0%)';
        wwwEl.style.padding = Math.random() > 0.5 ? '5px' : '0px';
    }, 7000);
}, 60000); // 1m

// Girl Element Animation
setInterval(() => {
    girlEl.style.transition = 'transform 1s';
    const girlX = Math.random() * 2 - 1; // Reduced the range for subtle movement
    //const girlY = Math.random() * 0.5 - 0.25; // Die Y-Bewegung ist nun subtiler
    const girlY = 0;//Math.random() * 1 - 1;
    // girlEl.style.transform = `translate(${girlX}%, ${girlY}%)`;
}, 1500);

// Body font color change
setInterval(() => {
    bodyEl.style.transition = 'color 10s';
    bodyEl.style.color = Math.random() > 0.5 ? '#4e90b0' : '#040b0abf';
}, 18000); // 3 minutes


  
});

</script>
<div id="before"><a href="./3boys">what happend earlier</div>
</body>
</html>
