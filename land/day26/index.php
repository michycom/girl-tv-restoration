<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">

<!-- TITLE TAG  -->
<?
$mydate=date(d);
echo '<title>girl.tv/land |day';
echo $mydate;
echo'|</title>';
?> 

<!-- RESIZE--> 
<script language="JavaScript">window.resizeTo(810,685)</script>
<!-- >
<SCRIPT LANGUAGE="JavaScript" type="text/javascript">
location.href="rtsp://5.girl.tv/laika.sdp";
</SCRIPT>
< -->

<RELOAD CAM PICTURE >
<SCRIPT LANGUAGE="JavaScript" type="text/javascript">
	
	var BaseURL = "";
    var File = "cam1.jpg";   
	var theTimer = setTimeout("reloadImage()",1);
      
      function reloadImage() {
     theDate = new Date();
        var url = BaseURL;
        url += File;
        url += "?dummy=";
        url += theDate.getTime().toString(10);

        document.Bild.src = url;

        theTimer = setTimeout("reloadImage()",1000);
      }
</SCRIPT>

<script language="JavaScript" type="text/JavaScript">
<!--
function MM_reloadPage(init) {  //reloads the window if Nav4 resized
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}
MM_reloadPage(true);
//-->
</script>

<script language="JavaScript" src="http://girl.tv/land/jscripts/gtv-land.js" type="text/javascript"></script>
<script language="JavaScript">
stby = window.open("http://girl.tv/standby", "standby", "scrollbars=no,status=no,width=110,height=100,left=100,top=100");
stby.blur();
</script>

<style type="text/css">
body {margin-left: 20px;margin-top: 20px;margin-right: 0px;margin-bottom: 0px;}
.alt {font-family: Arial, Helvetica, sans-serif;font-size: 9px;color: #999999;}
.errorstyle {font-family: Georgia, "Times New Roman", Times, serif;font-size: 36px;color: #FF3366;}
</style>


</head>

<body onLoad='Imge'>

	<div id="INFO-LAYER" style="position:absolute; width:522px; height:115px; z-index:1; visibility: hidden;"><a href="http://girl.tv">girl.tv</a> /// girltv /// land /// hits /// <a href="http://kunsthausgraz.at">Kunsthaus Graz</a> /// medien.KUNSTLABOR /// 1-21.9.2005 /// Er&ouml;ffnung Donnerstag 1.9.2005 20:00uhr /// K&uuml;nstler: Tim Kaiser /// Michael Heering /// Katharina Trudzinski /// Julien M&uuml;hlenpfordt /// Marc Wright /// Franz Xaver /// Marie Vogt /// Johanna Trundzinski /// <a href="http://hui-hui.de">HUI-HUI</a> /// 8grad /// d7 /// <a href="http://einlegen.de">EK-Einlegen Kassetten</a> /// </div>
	<a href="http://girltv.muehlenpfordt.net/">
	<IMG SRC="cam1.jpg"  ALT="welcome at girl.tv/land" NAME="Bild" width="768" height="576" hspace="0" vspace="0" border="0" usemap="#radio" class="alt">
</a>
<map name="radio" id="radio">
    
        <!-- <area shape="rect" title="uploaded" coords="291,191,544,315" href="javascript:cam3pop()" alt="von der plattform"> -->
        <!-- <area shape="rect" title="LIVE AUDIO Elevate Festival" coords="291,191,544,315" href="javascript:p-pop()" alt="elevate festival"> -->
  	
  	<area shape="rect" coords="4,312,152,385" href="javascript:audiopop();" alt="GIRL.TV/LAND Radio" title="girl.tv radio loop">

  	<area shape="rect" title="CAM2" coords="446,137,502,200" href="cam2.php" target="_self" alt="CAM2">
  	<area shape="circle" coords="692,462,57" href="http://cam4.kunstlabor.at" target="_blank" alt="hui-hui">
  	<area shape="rect" coords="366,294,710,386" href="http://girl.tv/docschoko" title="Doc Schoko" target="_blank" alt="doc schoko">

	<area shape="rect" title="girl.tv/land Programm"coords="697,10,753,85" href="javascript:programpop()" alt="Programm">
	
	<area shape="poly" coords="191,61,330,11,380,125,267,125" href="javascript:videopop()" title="television" alt="tv">

	<area shape="rect" coords="511,134,569,201" href="rtsp://laika.girl.tv/hu.sdp" title="laika" target="_self" alt="CAM3">
        
</map>

</body>
</html>

