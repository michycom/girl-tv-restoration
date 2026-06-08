<?php

require_once("cache/Lite.php"); 
$id = "999";
$options = array("cacheDir" => "/tmp/", "lifeTime" => 5); // Intervall in Sekunden
$Cache_Lite = new Cache_Lite($options);
$data = $Cache_Lite->get($id);

if ($data == false)
{ 
	$data = getLog("/var/log/apache2/master.log"); // Hier Datei angeben
	$Cache_Lite->save($data, $id);
}

function getLog($log)
{
	$handle = fopen($log, "r");
	$linecount = 45;
	$pos = -2;
	$content = "";
	$char = " "; 
	while ($linecount > 0) {
		while ($char != "\n") {
	    	fseek($handle, $pos, SEEK_END);
	        $char = fgetc($handle);
	        $pos --;
	    }
	    $char = " ";
	    $content .= assembleHref(fgets($handle));
	    $linecount --;
	}
	fclose ($handle);
	return $content;
}

function assembleHref($line)
{
	return ereg_replace("http://[^\"]+", "<a href=\"\\0\" target=\"_blank\">\\0</a>", $line); // Hier href zusammengebaut
}

?>
<html>
<head>
<style type="text/css">
body {background-color:black; margin:0px; padding:0px; overflow:hidden;}
pre {color:#ffffff; font-size:smaller;}
pre a:link, pre a:active, pre a:visited, pre a:hover {color:#00FFFF; text-decoration:none;}
pre a:hover {font-weight:bold;}
</style>
<meta http-equiv="refresh" content="5; URL=index.php">
</head>
<body>
<pre><?php echo $data // Hier werden die Daten angezeigt ?></pre>
<!-- stats -->
<script type='text/javascript' src="/js/awstats_misc_tracker.js"></script>
<noscript><img src="/js/awstats_misc_tracker.js?nojs=y" height="0" width="0" border="0" style="display: none" alt="none" /></noscript>
<!-- stats -->
</body>
</html>
