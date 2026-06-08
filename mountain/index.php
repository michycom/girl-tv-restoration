<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">


<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>

<link rel="stylesheet" href="css/junk.css" type="text/css" media="screen" charset="utf-8" />
<script type="text/javascript" src="js/master.js"></script>



<?php 

// Open the file for reading 
$fp = fopen("counterlog.txt", "r"); 
// Get the existing count 
$count = fread($fp, 1024); 
// Close the file 
fclose($fp); 

// Add 1 to the existing count 
$count = $count + 1; 
// Reopen the file and erase the contents 
$fp = fopen("counterlog.txt", "w"); 
// Write the new count to the file 
fwrite($fp, $count); 
// Close the file 
fclose($fp); 
?> 


<? 
$adornot=$_GET['status'];
$client = $_SERVER['HTTP_USER_AGENT'];
$domain = GetHostByName($REMOTE_ADDR); 
$now = time();

// echo "you: $REMOTE_ADDR";
// echo " time: $now";
// echo "<br />$HTTP_REFERER";
?>



<title>THE GREAT HUNT</title>
</head>

<body>

<div id="strech">
<iframe src="tail.php" width="400" height="20" frameborder="0" scrolling="no">i</iframe>
</div>

<!-- bergkette contains all mountain stuff to keep a good growing position -->
<div id="bergkette">




<!-- writing logs ( ip, timestamp, referrer ) to logs.txt -->
<?php 
$data = "$count $domain $now $HTTP_REFERER $client \n"; 
$fp = fopen("logs.txt", "a"); 
fwrite($fp, $data); 
fclose($fp); 
?>


<!-- berge anzeigen und groesse anpassen begin-->
<div class="stats">
<?
$hexel = file_get_contents('counterlog.txt');
$teile = explode(" ", $hexel);
$result = count($teile);
$margin = ceil(323-$hexel/3*2);



echo "<div class='berge' style='z-index:1'>574<br /><img src='art/berg.png' style='margin-top:60px'  height='401'  /></div>";
echo "<div class='berge' style='z-index:2'>191<br /><img src='art/berg.png' style='margin-top:200px' height='191'  /></div>";

echo "<div class='berge' style='z-index:4'>383<br /><img src='art/berg.png' style='margin-top:70px'  height='383'  /></div>";

echo "<div class='berge' style='z-index:5'>450<br /><img src='art/berg.png' style='margin-top:20px'  height='450'  /></div>";

echo "<div class='berge' style='z-index:6'>450<br /><img src='art/berg.png' style='margin-top:40px'  height='430'  /></div>";

echo "<div class='berge' style='z-index:7'>565<br /><img src='art/berg.png' style='margin-top:-55px'  height='565'  /></div>";


echo "<div class='berge' style='z-index:8'>".$teile[0]."<br/><a href='index.php?status=".$adornot."'><img src='art/berg.png' style='margin-top:".$margin."px' height='".$teile[0]."' /></a></div>";

?>
</div>
<!-- berge anzeigen und groesse anpassen END-->


</div>


<!-- add yourself-FORM submit to test2.php, add yourself to landscape -->
<div id="addyou">
<? 
if ($adornot != 'added'){
echo "<form action='test2.php' method=post'>
	<input type='hidden' name='now' value='".$now."'><input type='hidden' name='domain' value='".$domain."'>
	<input type=image name=point src='art/add-yourself-freemee.png'>
	</form>";}
else { echo "NEW on the map: $domain at: $now";}
?>
</div>

<div><? include('addadoggy.txt'); ?></div>


<div id="sucker"><SPAN CLASS="blink"> TGH B E T A -0.1 ///</span> 
<a href="http://freemee.de" class="blink"> F R E E M E E . D E |</a><a href="http://girl.tv" class="blink">girl.tv |</a><a href="http://tejat.de" class="blink">tejat.de |<br /> </a><a href="http://junkjet.net" class="blink">for JUNKJET 1.0</a>
</div>
	


<div id="wolko"><a href="#" onclick="bookpop();" class="alpha">
<img src="art/wolkowolf.gif" alt="Aplpha" title="send message" border="0" />OPINION LEADER</a>
</div>





</body>
</html>
