<script type="text/javascript">
<!--

	/* determine the platform for direct popups */
	system = (navigator.appVersion.indexOf("Mac") == -1) ? "PC" : "MAC";
	
	/* determine the browser for direct popups */
	d = document;
	w = window;
	ie = ((d.all) && (w.offscreenBuffering)) ? true : false;
	nn = ((d.captureEvents) && (!d.getElementById)) ? true : false;
	mz = ((d.getElementById) && (!d.all) && (d.documentElement)) ? true : false;
	
	if (ie && (system=="MAC")) {
		alert("Hinweis\nAuf dem Internet Explorer 5.2 kann es auf dieser Seite zu Darstellungsproblemen kommen. Verwenden Sie nach Moeglichkeit einen anderen Browser.");
	}
	
	function popup(url,name,breite,hoehe,parameter) {
		
		var	xMitte = screen.width / 2;
		var	yMitte = screen.height / 2;
	
		xMitte = xMitte - breite / 2;
		yMitte = yMitte - hoehe / 2;

		parameter = parameter + ',width=' + breite +',height=' + hoehe;
		parameter = parameter + ',left=' + xMitte + ',top=' + yMitte;
		
		window.open(url,name,parameter);
	
	}




//-->
</script>

<style type="text/css" media="screen">
<!--
	* {
        margin: 0; padding: 0;
    }
    body {
        height: 100%;
    }
    .alignIt {
        position: absolute;
        top: 50%;
        width: 100%;
    }
    .posIt {
        display: block;
        font-size: 50px;
        line-height: 20px;
        margin-top: -45px;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        text-align: center;
    }


a
{
color: #00FF00;
text-decoration:none;
}
-->
</style>
<script language="JavaScript">
<!--
window.setTimeout('move()',20);


function move() {
if(document.getElementById) {
var x=parseInt(document.getElementById("ufo").style.top);
if(x<document.body.offsetWidth || x<window.innerWidth) {
x=x-12;
document.getElementById("ufo").style.top=x+"px"
window.setTimeout('move()',20);
}
}

if(document.layers) {
var x=parseInt(document.ufo.top);
if(x<window.innerWidth) {
x=x-12;
document.ufo.left=x;
window.setTimeout('move()',20);
window.setTimeout('moove()',120);
}
}
return;
}


             
function moove() {
if(document.getElementById) {
var x=parseInt(document.getElementById("ufo").style.top);
if(x<document.body.offsetWidth || x<window.innerWidth) {
x=x+8;
document.getElementById("ufo").style.top=x+"px"
}               
}
         
if(document.layers) {
var x=parseInt(document.ufo.top);
if(x<window.innerWidth) {
x=x+10;
document.ufo.left=x;
}
}
return;                                                                  
}

window.setTimeout('move()',20);
window.setTimeout('boys()',20);


function boys() {
if(document.getElementById) {
var x=parseInt(document.getElementById("boys").style.top);
if(x<document.body.offsetWidth || x<window.innerWidth) {
x=x-12;
document.getElementById("ufo").style.top=x+"px"
window.setTimeout('move()',20);
}
}
return;
}



//-->
</script>
<!-- kredit: http://www.exine.de/clientseitig/js_work_animationen_1.htm -->
<p name="ufo" id="ufo" style="background: #FFFFFF; height: 2px; position:absolute; top:700px; left:0px; width:100%;"><a style="color:white;" href="javascript:move();"><a href="http//artcityhamburg.de"><img src="http://thespecial.org/spacer.gif" border="0"</a></p>

