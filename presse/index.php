<html>
<HEAD>
<pre>
<style type="text/css">
<!--
a {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 9px;
	color: #IIIIII;
}
a:link {
	text-decoration: none;
}
a:visited {
	text-decoration: none;
	color: #IIIIII;
}
a:hover {
	text-decoration: none;
	color: #IIIIII;
}
a:active {
	text-decoration: none;
	color: #IIIIII;
}
body,td,th {
	background: white;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 9px;
	color: #666666;
	padding: 0; 
	line-height: 10px;
	margin-top: 120;
	margin-left: 200;
}


-->

</style>
</HEAD>
<BODY>
<div style="position:absolute; top:70px;"><a style="font-size: 30px; color:black;"  href="http://girl.tv">/</a><a style="color:black; font-size: 30px;" href="http://girl.tv/presse" target="_top">presse</a></div>

<a href="http://girl.tv/feed.rss">FEED</a> .rss

<a href="http://girl.tv/presse/girl.tv_Land">GIRL.TV LAND</a> 2005 .HTML

<a href="http://girl.tv/land/doku/girl.tv:land/girl.tv%20land.pdf">GIRL.TV LAND READER</a> 2006 .PDF


<a href="http://girl.tv/presse/download">DOWNLOAD</a> 2007 .DIR





PRINT SCREENSHOTS .FREE


<?php 
$fh = opendir("./download"); //Verzeichnis 
$verzeichnisinhalt = array(); 
while (true == ($file = readdir($fh))) 
{ 
        if ((substr(strtolower($file), -3)=="png") or (substr(strtolower($file), -3)=="gif")) //Abfrage nach gŸltigen Datenformat         
        {         
            $verzeichnisinhalt[] = $file; 
        }     
} 

echo "<div id='download'><table width='600' cellspacing='50'>"; 
for($i=0;$i<count($verzeichnisinhalt);$i++)     
{ //HTML Einbindung der Bilder 
    echo "<tr><td>"; 
    echo "<a href='./download/".$verzeichnisinhalt[$i]."'><img src='./download/".$verzeichnisinhalt[$i]."' height=150 width=200 border=0 ><br><center>".substr($verzeichnisinhalt[$i],0,strlen($verzeichnisinhalt[$i])-4)."</center></img></a></td>";  
    $i++; 
    if( $i < count($verzeichnisinhalt) ) 
    { 
        echo "<td><a href='./download/".$verzeichnisinhalt[$i]."'><img src='./download/".$verzeichnisinhalt[$i]."' height=150 width=200 border=0><br><center>".substr($verzeichnisinhalt[$i],0,strlen($verzeichnisinhalt[$i])-4)."</center></img></a></td>";  
    } 
    echo "</tr>"; 
} 
echo "</table></div>"; 
?>
<big>we@girl.tv | 2007</big>
</pre>
</html>
