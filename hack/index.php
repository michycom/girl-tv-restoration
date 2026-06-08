
<!-- (c) turbo // brutally hacked by me 2007-->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html><head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<meta name="author" content="girl.tv/turbo">
<meta name="description" content="Girl.Tv/Porn">
<meta name="robots" content="index, follow">
<script language="javascript" type="text/javascript">
<!--
// THANKS TO:
// Original by Stefan Klinger  manitou@gmx.net
// erweitert durch Michael Praast, www.praast.de
var ie = ((document.all) && (window.offscreenBuffering)) ? true : false; // IE >= 4.x
var nn = ((document.captureEvents) && (!document.getElementById)) ? true : false; // NN4.x
var mz = ((document.getElementById) && (!document.all) && (document.documentElement)) ? true : false; // 
var which=0;
var color= "";
var fade=1;
var r=0;
var g=0;
var b=0;
r_start=250;
g_start=120;
b_start=250;
r_end=250;
g_end=250;
b_end=250;
step=8;
var message= new Array();
message[0]='HEY PUSSY!'
message[1]= 'NOW'
message[2]='PRESS' 
message[3]='ENTER' 

// Add as many as you like
function hex_it(zahl) {
 if (zahl==0) return("0"); if (zahl==1) return("1"); if (zahl==2) return("2");
 if (zahl==3) return("3"); if (zahl==4) return("4"); if (zahl==5) return("5");
 if (zahl==6) return("6"); if (zahl==7) return("7"); if (zahl==8) return("8");
 if (zahl==9) return("9"); if (zahl==10) return("A"); if (zahl==11) return("B");
 if (zahl==12) return("C"); if (zahl==13) return("D"); if (zahl==14) return("E");
 if (zahl==15) return("F");
}
function byte_to_hex(zahl) {
 wert1=Math.floor(zahl/16);
 wert2=zahl-(wert1*16);
 wert=hex_it(wert1) + hex_it(wert2);
 return(wert);
}
function animate(){
 color="#"+byte_to_hex(r)+byte_to_hex(g)+byte_to_hex(b);
 if (nn) 
 {     // Netscape4
 document.animatedtext.document.writeln("<center><font face='courier' color="+color+" size=-1><NOBR><b>"+message[which]+"<\/b><\/NOBR><\/font><center>");
 document.animatedtext.document.close();
 }
 if (ie) 
 {     // IExplorer 4
 document.all.animatedtext.innerHTML="<center><font color="+color+" size=-1><NOBR><b>"+message[which]+"<\/b><\/NOBR><\/font><\/center>";
 }
 if (mz) 
 {     // Mozilla/NN6
 document.getElementById('animatedtext').innerHTML="<center><font color="+color+" size=-1><NOBR><b>"+message[which]+"<\/b><\/NOBR><\/font><\/center>";
 }
 if (fade==1) {       //einblenden
    if (r_start<r_end) {if (r<r_end) r+=step; else r=r_end;}
    else {if (r>r_end) r-=step;}
    if (g_start<g_end) {if (g<g_end) g+=step; else g=g_end;}
    else {if (g>g_end) g-=step;}
    if (b_start<b_end) {if (b<b_end) b+=step; else b=b_end;}
    else {if (b>b_end) b-=step;}
 }
 else {               //ausblenden
    if (r_start<r_end) {if (r>r_start) r-=step; else r=r_start;}
    else {if (r<r_start) r+=step;}
    if (g_start<g_end) {if (g>g_start) g-=step; else g=g_start;}
    else {if (g<g_start) g+=step;}
    if (b_start<b_end) {if (b>b_start) b-=step; else b=b_start;}
    else {if (b<b_start) b+=step;}
 }
// Einblenden beendet => Ausblenden
 if ((r==r_end) && (g==g_end) &&(b==b_end)) {fade=-1;}
// Wieder Ausblenden beendet => nachste Message einblenden
 if ((r==r_start) && (g==g_start) &&(b==b_start)) {
       fade=1;r=r_start;g=g_start;b=b_start;
       if (which<message.length-1) which+=1;
          else which=0;
 }
 setTimeout('animate()',50);
}
function init() {
 r=r_start;
 g=g_start;
 b=b_start;
 setTimeout('animate()',150);
}
// -->
</script>

<style type="text/css">
body
{ margin:0px; }
body
{ background-color:#000000; }
body 
{ font-family:Arial, Helvetica; }
body
{ font-size:7pt; }
body
{ color:#FFFFFF; }
a
{ color:#FFFFFF; }
a
{ text-decoration:none; }
div
{ position:absolute; }
img
{ border-width:0px; }
</style>

<title>Girl.Tv/Porn</title>
</head>
<body background="http://woodrose.org/grafik/woodrosestart.jpg" onload="init()">
<!-- 
background-color:#FFD0D4
data/muster_gelb.gif 
-->



<div style="left:0px; top:0px; right:0px; bottom:0px;"><img src="data/WorldMap.gif" style="width:100%; height:100%;"></div>

<div style="left:25%; top:30%;"><img src="data/soldier.gif" alt="Soldier" style="width:243px; height:452px;"></div>

<div style="right:40px; top:20px;"><img src="data/Camera.png" alt="Camera" style="width:200px; height:223px;"></div>

<div style="left:0px; top:20px;"><img src="data/orchidee.png" alt="Orchidee" style="width:366px; height:390px;"></div>

<div style="left:60%; width:25%; top:225px; text-align:center;">
girl.tv the major porn site on the web<br>
now open and free for everybody<br>
even kids under 18 are allowed<br>
"tell your friends"<br><br>
<font size="+7"><a href="http://www.girl.tv/join" onfocus="if(this.blur)this.blur()">ENTER</a>
</div>

<!-- ------------------------------------------------------------- TEXTBOX  ICON ID animatedtext -------------------------------- --!>
<div id="animatedtext" z-index:10; style="position: absolute; left: 230px; top: 300px">
</div>
<!-- --------------------------------------------------------------------------------------------------------------- --!>

</body
</body>
</html>
