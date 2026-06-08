<html>
<head>
<title>Scrollen mittels Buttons</title>
<script type="text/javascript">
<!--
var scroll;
var speed = 5;

function los() {
 if(document.all) {
   x = meinIframe.document.body.scrollTop + speed;
 } else {
   x = meinIframe.pageXOffset + speed;
 }
 meinIframe.scrollTo(x, 0);
 scroll = window.setTimeout("los()", 100);
}

function runter () {
 if(document.all) {
   x = meinIframe.document.body.scrollTop + speed;
 } else {
   x = meinIframe.pageXOffset + speed;
 }
 meinIframe.scrollTo(x, 0);
 scroll = window.setTimeout("runter()", 83);
}

function rauf () {
 if(document.all) {
   x = meinIframe.document.body.scrollTop - speed;
 } else {
   x = meinIframe.pageXOffset - speed;
 }
 meinIframe.scrollTo(x, 0);
 scroll = window.setTimeout("rauf()", 83);
}

//-->
</script>
</head>

<body onload="javascript:los () ">
<a href="#" onMouseover="runter()"
onMouseout="window.clearTimeout(scroll)">nach unten</a>
<br><br>
<a href="#" onMouseover="rauf()"
onMouseout="window.clearTimeout(scroll)">nach oben</a>
<br><br>
<div style="border:solid 1px;width:600px;height400px;">
<iframe width="600" height="400" src="http://girl.tv/~renato/freemee/junkjet" name="meinIframe"
frameborder="0" scrolling="no"></iframe>
</div>



