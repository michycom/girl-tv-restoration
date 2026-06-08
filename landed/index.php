 <title>wow, now i felt ready for some teleportation...</title>
<head>
<!-- the GIRL.TV/JOURNEY -->


<!--script language=javascript>
var rev = "fwd";
function titlebar(val)
{
	var msg  = "THE GIRL.TV JOURNEY";
	var res = " ";
	var speed = 1000;
	var pos = val;

	msg = "   "+msg+" ";
	var le = msg.length;
	if(rev == "fwd"){
		if(pos < le){
		var msg  = "hu! hu! ... there i was lost in cyberspace - ";

		pos = pos+1;
		scroll = msg.substr(0,pos);
		document.title = scroll;
		timer = window.setTimeout("titlebar("+pos+")",speed);
		}
		else{
		rev = "bwd";
		timer = window.setTimeout("titlebar("+pos+")",speed);
		}
	}
	else{
		if(pos > 0){
		pos = pos-1;
		var ale = le-pos;
		scrol = msg.substr(ale,le);
		document.title = scrol;
		timer = window.setTimeout("titlebar("+pos+")",speed);
		}
		else{
		rev = "fwd";
		timer = window.setTimeout("titlebar("+pos+")",speed);
		}	
	}
}

</script-->
<!-- credits: 
junkjet.net 
art.teleportacia.org
freemee.de
http://www.hscripts.com 

-->

<!--script> 

var repeat=1
var title=document.title
var leng=title.length
var start=1
function titlemove() {
titl=title.substring(start, leng) + title.substring(0, start)
document.title=titl
start++
if (start==leng+1) {
start=0
if (repeat==0)
return
}
setTimeout("titlemove()",120)
}
if (document.title)
titlemove()
</script-->
<!-- Weiterleitung -->

meta http-equiv="refresh" content="20000;URL=http://girl.tv/banner/frames.html">
<SCRIPT language=JavaScript1.2>
setTimeout("top.location.href=\'http://girl.tv/banner/frames.html\'",20000);
</script>
</head>

<body style="margin:0px;" bgcolor="#000000; width:10000px;"> 

<a style="position:absolute;z-index:16; top:460px; left:1020px;" href="http://art.teleportacia.org" onmouseover="javascript:titlemove(' ... and a visit to the... ');" onclick="javascript:document.title = 'PAGES IN THE MIDDLE OF NOWHERE | THE FIRST AND ONLY NET ART GALLERY (http://art.teleportacia.org) ';"target="freemix"><big>.</big></a>
<!-- girl.tv and me are visiting the THE FIRST AND ONLY NET ART GALLERY -->

<div style="position:absolute;z-index:1; width:8440; top:0px;"><iframe  style="position:absolute;z-index:1; width:10000px;height:900px; top:0px; background:99CCCC;" src="http://girl.tv/~renato/freemee/junkjet" name="freemix"
frameborder="0" scrolling="no"></iframe>

<iframe  style="position:absolute;z-index:1; top: 485px; left:800px; /*border: dotted, 1px;*/ width:200px; height:50;" src="http://girl.tv/country/landed.php" name="coutry"
frameborder="0" scrolling="no"></iframe></div>


<!--
mist... wie geht das jetzt?
http://www.uni-weimar.de/projekte/oil/index.php?p=tm04
http://de.selfhtml.org/javascript/sprache/schleifen.htm#while
http://de.selfhtml.org/javascript/objekte/location.htm

remember:
<marquee scrollamount="50" scrolldelay="5">
  <b>Dieser Text wird ziemlich schnell bewegt</b>
</marquee>
onmouseover="javascript:document.title = ' ... and a visit to the... ';" 
onclick="javascript:document.title = 'PAGES IN THE MIDDLE OF NOWHERE | THE FIRST AND ONLY NET ART GALLERY (http://art.teleportacia.org) ';" 

onclick="javascript:titlebar(val);" 
-->
