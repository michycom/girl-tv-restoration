<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="refresh" content="200000">

<!-- TITLE TAG  -->
<?
$mydate=date(d);
echo '<title>girl.tv/land |day';
echo $mydate;
echo'|</title>';
?> 

<SCRIPT LANGUAGE="JavaScript" type="text/javascript">
	
	var BaseURL = "";
    var File = "http://195.177.251.55/cam2.jpg";   
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

<script language="JavaScript" src="http://girl.tv/land/jscripts/gtv-land.js" type="text/javascript"></script>

<!--
<script language="JavaScript">
stby = window.open("http://girl.tv/standby", "standby", "scrollbars=no,status=no,width=110,height=100,left=100,top=100");
stby.blur();
</script>
-->

<style type="text/css">
body {margin-left: 0px;margin-top: 20px;margin-right: 0px;margin-bottom: 0px;}
.alt {font-family: Arial, Helvetica, sans-serif;font-size: 9px;color: #999999;}
.errorstyle {font-family: Georgia, "Times New Roman", Times, serif;font-size: 36px;color: #FF3366;}
</style>


</head>
<body onLoad='Imge' bgcolor ="#090808">
<div id="INFO-LAYER" style="position:absolute; width:522px; height:115px; z-index:1; visibility: hidden;"><a href="http://girl.tv">girl.tv</a> /// girltv /// land /// hits /// <a href="http://kunsthausgraz.at">Kunsthaus Graz</a> /// medien.KUNSTLABOR /// 1-21.9.2005 /// Er&ouml;ffnung Donnerstag 1.9.2005 20:00uhr /// K&uuml;nstler: Tim Kaiser /// Michael Heering /// Katharina Trudzinski /// Julien M&uuml;hlenpfordt /// Marc Wright /// Franz Xaver /// Marie Vogt /// Johanna Trundzinski /// <a href="http://hui-hui.de">HUI-HUI</a> /// 8grad /// d7 /// <a href="http://einlegen.de">EK-Einlegen Kassetten</a> /// </div>
<center>
	
	<IMG SRC="http://195.177.251.55/cam2.jpg"  ALT="welcome at 
girl.tv/land" NAME="Bild" width="720" height="576" hspace="0" vspace="0" border="0" usemap="#radio" class="alt">
    
<map name="radio" id="radio">
    
<!--area shape="rect" title="uploaded" coords="291,191,544,315" href="javascript:cam3pop()" alt="von der plattform"-->
<!--area shape="rect" title="LIVE AUDIO Elevate Festival" coords="291,191,544,315" href="javascript:p-pop()" alt="elevate festival"-->

<area shape="rect"coords="550,29,719,196" href="http://cam4.kunstlabor.at" target="_blank" alt="behind the land cam" title="girl.tv/land Programm">
<area shape="rect" coords="410,296,631,378" href="http://willson-musik.de" target="_blank" alt="willson">
<area shape="poly" coords="4,183,191,30,399,99,127,504" href="javascript:audiopop()" title="Willson live stream" alt="audio">
</map>

</body>
</html>

