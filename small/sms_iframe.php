<?
/*
Small Chat 0.2 - (14. September 04)
Michael Salzer
http://spring.realone.ch
It's free to use, but don't delete these lines.
Special thanks to Mathias G. for :)-Script & to Tobi H. for JavaScripts
*/
INCLUDE "config.php";
INCLUDE "functions.php";
header("Expires: Mon, 10 Jan 1970 01:01:01 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Pragma: no-cache");
?>

<STYLE type="text/css">
body{background-color: transparent}
</STYLE>
<meta http-equiv="refresh" content="<?=$reload ?>">
</head>
<?

$datei=fopen($smsdaten,"r");
while(feof($datei)==0) {
    $data=stripslashes(fgets($datei,1000000));
    $data=explode("|||",$data);
    $datum = date("d.m.y, H:i",$data[0]);
    $name = "".smileize(htmlentities($data[1]))."";
    echo "<font size=\"1\" face=\"Verdana, Arial, Helvetica, sans-serif\">".$name.":&nbsp; ".urlize(smileize(htmlentities($data[2])))."</font><br>";
}
fclose($datei);
?>
