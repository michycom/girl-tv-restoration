
<HTML PUBLIC "-//W3C//DTD HTML 4.01 
Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>hello...</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">




<script language="javascript" type="text/javascript">
function changecolor(code)
{
	H=new Date(); H.getHours(); S=H.getHours(); var a="";
	
	if(S>=04)  {document.bgColor="#000000"};
		if(S>=05 && S<=8) {document.bgColor="#000033"};
			if(S>=08 && S<=09) {document.bgColor="#333333"};

	if(S>=09 && S<=10) {document.bgColor="#CCCCFF"};
	if(S>=10 && S<=11) {document.bgColor="#FFFFCC"};
	if(S>=11 && S<=13) {document.bgColor="#66FFFF"};
	if(S>=13 && S<=15) {document.bgColor="#CCCCFF"};
	if(S>=15 && S<=17) {document.bgColor="#078DCC"};
	if(S>=17 && S<=19) {document.bgColor="#003366"};
	if(S>=19)  {document.bgColor="#000000"};
		if(S>=0 && S<=01) {document.bgColor="#000000"};
                if(S>=02 && S<=03) {document.bgColor="#000000"};
}

function east(id)
{
if(document.getElementsByTagName){  
   var table = document.getElementById(id);   
   var rows = table.getElementsByTagName("td");   
   for(i = 0; i < rows.length; i++){           
 //manipulate rows 
     if(i % 2 == 0){ 
       rows[i].className = "even"; 
     }else{ 
       rows[i].className = "odd"; 
     }       
   } 
 } 
}
</script>



<script language="JavaScript">

<!--
// please keep these lines on when you copy the source
// made by: Nicolas - http://www.javascript-page.com

var clockID = 0;

function UpdateClock() {
   if(clockID) {
      clearTimeout(clockID);
      clockID  = 0;
   }

   var tDate = new Date();

   document.theClock.theTime.value = "" 
                                   + tDate.getHours() + ":" 
                                   + tDate.getMinutes() + ":" 
                                   + tDate.getSeconds();
   
   clockID = setTimeout("UpdateClock()", 1000);
}
function StartClock() {
   clockID = setTimeout("UpdateClock()", 500);
}

function KillClock() {
   if(clockID) {
      clearTimeout(clockID);
      clockID  = 0;
   }
}

//-->

</script>


<style type="text/css">
<!--
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}
.odd{background-color: yellow;} 
.one{background-color: #000000"};
.two{background-color: #000033"};
.three{background-color: #333333"};
.four{background-color: #CCCCFF"};
.five{background-color: #FFFFCC"};
.six{background-color: #66FFFF"};
.seven{background-color: #CCCCFF"};
.eight{background-color: #078DCC"};
.nine{background-color: #003366"};
.ten{background-color: #000000"};
.eleven{background-color: #000000"};



-->
</style>
<SCRIPT LANGUAGE="JavaScript" SRC="snow.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript">
function snow()
{
Falling(25,"<div style='z-index:2;'><FONT SIZE='3' FACE='arial' COLOR='yellow'>$</FONT><a href=http://your.girl.tv:8000/wie_es_sein_wollte.m3u><img border=0 src=girl.TV-boys_copy.gif></a></div>", 999999);  // siehe Erweiterung !
}
</SCRIPT>

</head>
<body bgcolor="snow" onload="snow()">


<!-- DIV STYLE="position: absolute;
            left: 733px; top: 43px;
            width: 181; height: 51;
            background: url(http://girl.tv/fly/clock.png);
            z-index: 3;"
     ONCLICK="this.style.zIndex = parseInt(this.style.zIndex) + 5"
>
</DIV-->

<!--DIV STYLE="position: absolute;
            left: 733px; top: 94px;
            width: 181; height: 51;
            z-index: 3;"
     ONCLICK="this.style.zIndex = parseInt(this.style.zIndex) + 5"
>
<table border="0" cellpadding="0" cellspacing="0" style="margin-left: auto; margin-right: auto; font-size:0px;">
<tr height="210">
<td width="1" colspan="1" bgcolor="#AAAAAA">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#BBBBBB">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#CCCCCC">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#DDDDDD">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#EEEEEE">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#FFFFFF">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#EEEEEE">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#DDDDDD">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#CCCCCC">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#BBBBBB">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#AAAAAA">&nbsp;</td>

</tr>

<tr heigth="1">
<td width="1" colspan="1" >&nbsp;</td>
<td width="1" colspan="1" bgcolor="#BBBBBB">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#CCCCCC">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#DDDDDD">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#EEEEEE">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#FFFFFF">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#EEEEEE">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#DDDDDD">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#CCCCCC">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#BBBBBB">&nbsp;</td>
<td width="1" colspan="1" >&nbsp;</td>
</tr>
<tr heigth="1">
<td width="1" colspan="2" >&nbsp;</td>
<td width="1" colspan="1" bgcolor="#CCCCCC">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#DDDDDD">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#EEEEEE">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#FFFFFF">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#EEEEEE">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#DDDDDD">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#CCCCCC">&nbsp;</td>
<td width="1" colspan="2" >&nbsp;</td>
</tr>

<tr heigth="1">
<td width="1" colspan="3" >&nbsp;</td>
<td width="1" colspan="1" bgcolor="#DDDDDD">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#EEEEEE">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#FFFFFF">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#EEEEEE">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#DDDDDD">&nbsp;</td>
<td width="1" colspan="3" >&nbsp;</td>
</tr>
<tr heigth="1">
<td width="1" colspan="4" >&nbsp;</td>
<td width="1" colspan="1" bgcolor="#EEEEEE">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#FFFFFF">&nbsp;</td>
<td width="1" colspan="1" bgcolor="#EEEEEE">&nbsp;</td>
<td width="1" colspan="4" >&nbsp;</td>
</tr>
</table>

</DIV--!>

<!--#E9EDF7-->

<!-- 
 onload="changecolor('red') --!>


<!-- onload="StartClock()" onunload="KillClock()"--!>

<!-- ##### SKY --!>

<!--a href="javascript:east('sky')">sky</a--> 
<div id="east" 

style="position:absolute; width:100px; height:30px; z-index:1; left: 600px; top: 40px; visibility: visible;">
<a href="http://my.girl.tv"><img src="http://girl.tv/mail+/ico/newmail.gif" border="0"> </a>
<a href="http://www.girl.tv/feed.rss"><img src="http://girl.tv/mail+/ico/inbox.gif" border="0"></a--!> 
<!--a href="http://ck.girl.tv"><img src="http://girl.tv/mail+/ico/adressbook.gif" border="0"></a--!>
</div>	   
<br><br><br>
<table id="sky" width="100%"  border="0" cellpadding="0" cellspacing="0">
  <tr>
<!--div id="uhr" style="position:absolute; z-index:4; left: 654px; top: 235px;">
<center><form name="theClock">
<input type=text name="theTime" size=8>
<form></center>

</div--!>		
    <td id="sky "width="782" valign="bottom"><img src="girl-tv-east-building.gif" width="587" height="251"></td>
  </tr>
  <tr>
<!-- ----------------- GROUND COLOR --------------------- --!>
    <td width="782" height="372" valign="top" bgcolor="#5FFFFF" 
background="http://girl.tv/bildstoerung/bildstoerung3.gif"
<!-- http://www.uni-stuttgart.de/igma/junkjet/pix/noyzmini.gif" -->
<!-- http://girl.tv/bildstoerung/bildstoerung3.gif"-->
<!--"66CC33" -->
<!-- ---------------------------------------------------- --!>
<img src="girl-tv-east-street.gif" width="587" height="279">
    
    
    <!--  ####### ICONS LINKS ###### START--!>
  <div id=frame style="position:absolute; width:300px; height:50px; z-index:10; left: 748px; top: 60px; visibility: visible;">

<form name="abcdef">
<input type="text" name="b" size=2 value="">  
<input type="text" name="c" size=2 value="">  
<input type="text" name="d" size=2 value=""> 
<input type="text" name="e" size=2 value=""> 
<input type="text" name="f" size=2 value=""> 

</form><script language="JavaScript">

<!--
// please keep these lines on when you copy the source
// made by: Nicolas - http://www.javascript-page.com

var Temp2;
var timerID = null;
var timerRunning = false;

var timerID = null;
var timerRunning = false;

function stopclock () {
if(timerRunning)
clearTimeout(timerID);
timerRunning = false;

}

function startclock () {
stopclock();
showtime();

}

function showtime() {

now = new Date();
var CurHour = now.getHours();
var CurMinute = now.getMinutes();
var CurMonth = now.getMonth();
var CurDate = now.getDate();
var CurSecond = now.getSeconds();
now = null;
var Hourleft = 23 - CurHour
var Minuteleft = 59 - CurMinute
var Secondleft = 59 - CurSecond
var Monthleft = 11 - CurMonth
var Dateleft = 31 - CurDate

document.abcdef.b.value = Monthleft
document.abcdef.c.value = Dateleft
document.abcdef.d.value = Hourleft
document.abcdef.e.value = Minuteleft
document.abcdef.f.value = Secondleft

timerID = setTimeout("showtime()",1000);
timerRunning = true;
}

startclock();
// -->

</script><!-- -->
<!-- BACKGROUND HERE -->
<body background=""> 

<body >
<!--background="http://www.uni-stuttgart.de/igma/junkjet/pix/noyzmini.gif"-->
<!-- body background="http://girl.tv/~share/Bilder/Bild-24.gif"-->
<!-- http://girl.tv/bildstoerung/bildstoerung3.gif -->
<body>  </div>
  <!-- ###  ERDBEERCHEN #### --!>
    
 <div id=frame style="position:absolute; width:300px; height:50px; z-index:10; left: 780px; top: 500px; visibility: visible;">
<a href="http://www.girl.tv/strawberries"  onFocus="if(this.blur)this.blur()" style="text-decoration: none" border="0"><img src="e1.gif" border=""></a>
</div> 


<!-- ### BOMB ### -->
<div id=frame style="position:absolute; width:30px; height:60px; z-index:1; left: 580px; top: 320px; visibility: visible;">
<a href="http://www.girl.tv/shop"  onFocus="if(this.blur)this.blur()" style="text-decoration: none" border="0">
<img src="http://girl.tv/shop/shoppinCartBOMB.gif" border="0"></a>
</div>
<!-- -->

<!-- ###  NACHO #### --!>
 <div id="nachoinger" style="position:absolute; z-index:21; left: 650px; top: 450px;">
<a href="http://girl.tv/nacho/" onFocus="if(this.blur)this.blur()" style="text-decoration: none"><img src="girl.TV-alegre.gif" border="0"></a>
</div>

<!-- ###  ME #### --!>
<div id="me" style="position:absolute; z-index:12; left: 620px; top: 490;">
<a href="http://music.girl.tv:8000" onFocus="if(this.blur)this.blur()" style="text-decoration: none">
<img border="0" src="girl.TV-boys_copy.gif"></a>
</div>

<!-- ###  JUDAS #### --!>
<div id="judas" style="position:absolute; z-index:13; left: 677px; top: 500;">
<a href="http://www.girl.tv/music" onFocus="if(this.blur)this.blur()" style="text-decoration: none"><img border="0" src="girltv-boy.gif" boarder="0"></a>
</div>


<!-- ###  KIRSCHE	 #### --!>
<div id="cherry" style="position:absolute; z-index:13; left: 677px; top: 300;">
<a href="http://www.girl.tv/pool" onFocus="if(this.blur)this.blur()" style="text-decoration: none"><img border="0" src="http://girl.tv/pool/cherry.gif
"></a>
</div>


<!-- ###  GIRLTVGIRL
<div id="girltvgirl" style="position:absolute; z-index:14; left: 40px; top: 56px;">
<a href="http://girl.tv/pool" onFocus="if(this.blur)this.blur()" style="text-decoration: none"><img  src"http://girl.tv/pool/girl_rollover/girl-rollover-basis.gif" border="0"></a>
</div> ### --!>

<!-- ### HUI-HUI ### --!>
<div id="hui-hui" style="position:absolute; z-index:16; left: 733px; top: 480px;">
<a href="http://www.girl.tv/huihui"  onFocus="if(this.blur)this.blur()" style="text-decoration: none"><img border="0" src="huihui.gif"></a>
</div>

<!-- ### FOTO 
<div id="foto" style="position:absolute; z-index:17; left: 4px; top: 5px;">
<img border="0" src="images.jpg">
</div>#### --!>

<!--### TURBO FEATURE -->
<div id="turbo" style="position:absolute; z-index:17; left: 827px; top: 355px;">
<a href="http://www.debruen.com"  onFocus="if(this.blur)this.blur()" style="text-decoration: none"><img border="0" src="turboski.gif"></a>
</div>
<!-- -->


<!-- ### RABIT #### --!>
<div id="foto" style="position:absolute; z-index:18; left: 720px; top: 509px;">
<a href="http://girl.tv/elena" onFocus="if(this.blur)this.blur()" style="text-decoration: none"><img border="0" src="bunny.gif"></a>
</div>

<!-- ### CAM ####
<div id="foto" style="position:absolute; z-index:19; left: 4px; top: 5px;">
<img border="0" src="cam-1.gif">
</div> --!>
    <!--  ####### ICONS LINKS ###### STOP--!>

<!-- ###  GOLDAWARD BROWSER POPUP PLACEHOLDER ############ http://deck7.de --!>

<SCRIPT LANGUAGE="JavaScript">

	function CenterWindowBROWSKY(mintpage, mintname, w, h, scroll) {
	var winl = (screen.width - w) / 2;
	var wint = (screen.height - h) / 2;
	winprops = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable'
	win = window.open(mintpage, mintname, winprops)
	if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
	}
</script>

<div id="bunny" 	
			style="position:absolute; 
			width:30px; height:80px; 
			left: 393px; top: 446px; 
			visibility: show; 
			background-image: url();
			layer-background-image: url(); 
 			border: 0px none #000000; 
 		        background-color:;
			z-index:1; overflow: hidden;"

			ONCLICK="this.style.zIndex = parseInt(this.style.zIndex) + 1">
<a href="http://girl.tv/browser/frames.html" onclick="CenterWindowBROWSKY(this.href,'name','1000','650','no');return false;"><img border="0" src="http://girl.tv/art/d7sgoldgirltvAward.gif" alt="POP UP YOUR HEAD!" width="24" height="44" border="0" onfocus="this.blur()"></a>
</div>


<!-- ###  GOLDAWARD BROWSER POPUP PLACEHOLDER ############ http://deck7.de 
<div id="Layer3" style="position:absolute; width:37px; height:46px; 
-->

</div></td>
  </tr>
</table>
</body>
</html>

