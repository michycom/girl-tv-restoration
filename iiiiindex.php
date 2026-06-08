<html>
<head>
<title>girl.tv says: "wait".</title>

<style type="text/css">
<!--
body {
	font-family: Arial, Helvetica, sans-serif;
	color: #222222;
	text-size: 12px;
#	margin-left: 100px;
	margin-top: 100px;

}


table {
opacity: 0.7;
#	    background-image: url("http://family.girl.tv/art/ColorBar.gif");}
</style>
</head>

<Body background="http://www.girl.tv/bildstoerung/bildstoerung3.gif">
<table width='90%' height='70%' align='center' bgcolor="white" >
<TR><TD>
<center>
<!--00275795,,statustransfer,de-->
<table border="0" cellspacing="0" cellpadding="0">

       <tr>
       </tr>
<pre></table>

<?php
echo "<form action='./index.php' method='get'><input type='text' name='wo'></input></form>";	
$wo = $_GET["wo"];
//echo 'just say: ' . htmlspecialchars($_GET["wo"]) . '!';
//$words = htmlspecialchars($_GET["words"]);

echo $wo;
$eo = $_SERVER["REMOTE_ADDR"];

$content = file_get_contents("http://girl.junix.hamburg/enter.php?time=15&input=tv.ppm&text=".'-'.$eo.$_SERVER['HTTP_USER_AGENT'].$_SERVER['HTTP_ACCEPT_LANGUAGE'].$_SERVER['HTTP_REFERER']);
 ?>
<!--// //
-->
<pre><small>

</small></pre></td></tr></table><BR><BR></TD></TR></table>
</body>
</html>
