
<meta http-equiv="refresh" content=1>
<?php
$hello = "
<pre>
Das ist ein Text und darin vorkommende Verweise erscheinen als Links.
Z.B.: http://phpforum.de -

Nun Frage ich mich, wie kriege ich den Inhalt einer .log Datei 
anstelle des Inhalts dieser Variablen; 
wenn ich nicht die ganze Datei einlesen will? 

Um den Arbeitsspeicher zu schonen, arbeite momentan mit:

passthru (\"tail -n -45 example.log\");

Um den Inhalt in \$hello umzuleiten, 
habe es mit \$hello = passthru (\"tail -n -45 example.log\"); probiert, 
aber das führt zu keinem Ergebniss.  
Ich vermute, weil passthru eben nur durchreicht und ausgibt?!


Hat jemand eine Idee, wie man evl. mit einem php Befehl 
nur die letzten Zeilen einer Datei einliest, allerdings
ohne diese immer im Ganzen einzulesen? 
Soweit ich weiß ist das ein Problem. 

Oder gibt es einen Linxbefehl, 
den man als Parameter von passthru hinzufügen kann?
Sodass die Ausgabe von tail modifizier erscheint als: 

LINK als <a href=\"\">LINK</a> ?


</pre>
";
echo ereg_replace("[[:alpha:]]+://[^<>[:space:]]+[[:alnum:]/]",
                     "<a href=\"\\0\">\\0</a>", $hello);

?>