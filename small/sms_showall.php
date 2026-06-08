
<a href="http://spring.realone.ch" target="_blank"><font color="#000000" face="Verdana, Arial, Helvetica, sans-serif" size="1">Small Chat 0.2</a> :: History<hr>
<?
INCLUDE "config.php";
INCLUDE "functions.php";
$datei=file($smsdatenall);
rsort($datei);
reset($datei);

foreach($datei as $v) {
    $data=stripslashes($v);
    $data=explode("|||",$data);
    echo "<img src=\"./icons/smilies/blank.gif\" width=\"1\" height=\"15\">".htmlentities(date("d. M y, H:i",$data[0]))."&nbsp;- &nbsp;".smileize(htmlentities($data[1])).":&nbsp; ".urlize(smileize(htmlentities($data[2])))."<br>";
}
?>
</font>
