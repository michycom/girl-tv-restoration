<LINK REL="SHORTCUT ICON" HREF="http://www.girl.tv/programm/favicon.ico">

<style type="text/css">
<!--
.style1 {
	font-size: 12px;
	font-family: Georgia, "Times New Roman", Times, serif;
	color: #333333;
}
.style3 {
	font-size: 36px;
	font-family: Georgia, "Times New Roman", Times, serif;
	color: #FF9900;
}
.style6 {font-size: 11px;color: #333333;
}
body {
	margin-left: 20px;
	margin-top: 20px;
}
a:link {color: #FF6600;text-decoration: none;
}
a:visited {color: #FF6600;text-decoration: none;
}
a:hover {color: #FF9900;text-decoration: none;
}
a:active {color: #FF9933;text-decoration: none;
}
-->
</style>
<?  
    // Header
    if($sort==''){$sort="heute";}else{
    $sort = $HTTP_GET_VARS["sort"];}       // Sortierung der der Seite definieren
    
    if($sort=="heute"){
        $sortier = k_zeit_von;
        }else{
        $sortier = k_datum_von;
        }
    echo" <span class='style3'>girl.tv/land</span><br>
    <span class='style1'>Programm 1. bis 21. September 2005 <br>
    <span class='style6'>Kunsthaus Graz, Lendkai 1, 8010 Graz
    <br>. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .<br>
    <a href='index.php?sort=heute'>Heute -&gt;</a><br>
    <a href='index.php?sort=anderes'>Alle Tage-&gt;</a><br>
    .ICS File -&gt;
    <br>. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .<br>
    <br>. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .<br>

</span> ";

    //
    // CONNECT UND AUSGABE DER SEMINARE
    //$sort='anderes';
    mysql_connect("localhost","web26","CXrXrqyI"); //connect to mysql
    mysql_select_db("grazAdmin") or die ("Die Datenbank existiert nicht"); //select database
    $result = mysql_query("select * from aktuelles WHERE k_typ='$sort' ORDER BY $sortier");//select the table
    while($r=mysql_fetch_array($result))//grab all the content
    {       
   //the format is $variable = $r["nameofmysqlcolumn"];
    $id=$r["id"];            // Veranstaltung
    $k_titel=$r["k_titel"];            // Termin Titel
    $k_subtitel=$r["k_subtitel"];      // Termin Zusatztitel
    $k_datum_von=$r["k_datum_von"];    // Termin Datum von ...
    $k_datum_bis=$r["k_datum_bis"];    // Termin Datum bis ... 
    $k_zeit_von=$r["k_zeit_von"];      // Termin Zeit von ...
    $k_zeit_bis=$r["k_zeit_bis"];      // Termin Zeit bis ...
    $k_datumzusatz=$r["k_datumzusatz"];// Termin Datumzusatz
    $k_kosten=$r["k_kosten"];          // Termin Kosten
    $k_ort=$r["k_ort"];                // Termin Ort
    $k_anmeldung=$r["k_anmeldung"];    // Termin Anmeldung Email
    $k_text=$r["k_text"];              // Termin Beschreibung
    $k_link=$r["k_link"];              // Termin Link
    $k_typ=$r["k_typ"];                // Termin Typ
    $meindatum = $k_datum_von[8].$k_datum_von[9].'.'. $k_datum_von[5].$k_datum_von[6].'.'.$k_datum_von[0].$k_datum_von[1].$k_datum_von[2].$k_datum_von[3];
    
    
    // Darstellen der Seite
       
        echo "<br><span class='style1'>$k_subtitel ";
        if($meindatum !=='00.00.0000'){
        echo "$meindatum,";
        }
        echo" $k_zeit_von<br>$k_titel<br></span>
        <span class='style6'>";
        echo nl2br($k_text);
        echo"</span><br><span class='style6'>";
        echo "<a href='$k_link' target='_blank'>$k_link</a>";
        // Ende der Abfrage anmelden bei:
        echo"<br>. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .<br> </span>";
        
        }// Ende MYSQL_FETCH
        // Ende der Text-und Bildausgabe
       // Ende der Termine    
      // ###################################################################################################################
    
    
    
    
    echo"</td>\n</tr>\n</table>\n</div>\n";    
    // ende Layer  ########################################################################################################
?> 
<? 
   	echo"<br>. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .<br> </span>";
	echo"<br><br><span class='style1'> Jetzt girl.tv daily Spam abonnieren </span>";
 	include('../admin-graz/subscribe2.php'); 

?>