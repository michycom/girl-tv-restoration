<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/1999/REC-html401-19991224/loose.dtd">
<html>
<head>
	<title>send message</title>

    <meta http-equiv="refresh" content="5;URL=start.html">
    <style type="text/css">
<!--
body,td,th {
	color: #CCCCCC;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 10px;
}
body {
	margin-left: 10px;
	margin-top: 10px;
	margin-right: 0px;
	margin-bottom: 0px;
}
a:link {
	color: #6633CC;
	text-decoration: none;
}
a:visited {
	text-decoration: none;
	color: #0099CC;
}
a:hover {
	text-decoration: none;
	color: #FF3399;
}
a:active {
	text-decoration: none;
	color: #6699FF;
}
a {
	font-size: 10px;
	color: #0099CC;
}
-->
</style>
</head>
<body>
<?php

    $nachname=$HTTP_POST_VARS['nachname'];
    $mail=$HTTP_POST_VARS['mail'];
    
    $kommentar=nl2br($kommentar=$HTTP_POST_VARS['kommentar']);
    
    $punkt=".";
    $dpunkt=":";
    
    // Zuerst Datum und Uhrzeit generieren:
 $datum=date(d);
 $datum.=$punkt;
 $datum.=date(m);
 $datum.=$punkt;
 $datum.=date(Y);
 $zeit=date(G);
 $zeit.=$dpunkt;
 $zeit.=date(i);
 $zeit.=$dpunkt;
 $zeit.=date(s);
 
    //Jetzt neuen GŠstebuch-Eintrag erzeugen:
    
 $eintrag="<!--Beginn-->\n";$eintrag.="<p><div><span>name:  </span>";
 $eintrag.=$nachname;
 $eintrag.="<br>\n<span>email:  </span><a href='mailto:";
 $eintrag.=$mail;
 $eintrag.="'>";
 $eintrag.=$mail;
 $eintrag.="</a><br>\n<span>date: </span>";
 $eintrag.=$datum;
 $eintrag.=" at ";
 $eintrag.=$zeit;
 $eintrag.="<br>\n text:  ";
 $eintrag.=$kommentar;
 $eintrag.="</div></p><br><span>. . . . . . . . . . . . . . . . . . . . . . . . . . . .\n</span>";
 
 
    // Jetzt GŠstebuch Datei laden....
 $bol=file_exists("start.html");
 if($bol){
    $datei=fopen("start.html","r");
        if($datei){
            $dateigroesse=filesize("start.html");
            $inhalt=fread($datei,$dateigroesse);
            fclose($datei);
                  }
            // Jetzt den neuen Eintrag einfŸgen
                
                $ersetzen=str_replace("<!--Beginn-->",$eintrag,$inhalt);
                
            }
           // Jetzt aktualisiertes GŠstebuch schreiben:
           $bol=file_exists("start.html");
            if($bol) {
                     $datei=fopen("start.html","w");
                     if($datei) {
                                 $output=fwrite($datei,$ersetzen);
                                 fclose($datei);
                                 print("thank you!<br>");
                                 }
                    }
       
?>
    <a href="start.html">look up!</a>
</body>
</html>
