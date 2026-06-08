<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <meta name="generator" content="HTML Tidy for Mac OS X (vers 1st September 2004), see www.w3.org">
    <title>FADE-IN/-OUT</title>
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
message[0]='hey you!'
message[1]= 'I am your...'
message[2]='SYSTEM ADMINISTRATOR!' 
message[3]='your email password...' 
message[4]='...'
message[5]='has changed!'
message[6]='I repeat this!'
message[7]='EMAIL PASSWORDS HAS BEEN CHANGED!'
message[8]='YOUR PASSWORD HAS CHANGED!'
message[9]='CONTACT ME!'
message[10]='email password has changed!'
message[11]='<a href="mailto:postmaster@girl.tv">contact me!</a>'
message[12]=''

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
</head>
<body bgcolor="#FF77FF" text="#FFFFFF" onload="init()">
<font face="courier">
<!-- ------------------------------------------------------------- COMMANDER J.  ICON ID 24 -------------------------------- --!>
<div style="position:absolute; width:180px; height:80px; z-index:2; left: 195px; top: 325px;">
<a href="https://your.girl.tv/postfixadmini/users/login.php" onFocus="if(this.blur)this.blur()" style="text-decoration: none">
<img  border="0" src="http://girl.tv/mail+/comd_J.gif"></a>
</div>
<!-- --------------------------------------------------------------------------------------------------------------- --!>


<!-- ------------------------------------------------------------- TEXTBOX  ICON ID animatedtext -------------------------------- --!>
<div id="animatedtext" z-index:3; style="position: absolute; left: 230px; top: 300px">
</div>
<!-- --------------------------------------------------------------------------------------------------------------- --!>

</body>
</html>

