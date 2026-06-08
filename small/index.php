<?
/*
Small Chat 0.2 - (14. September 04)
Michael Salzer
http://spring.realone.ch
It's free to use, but don't delete these lines.
Special thanks to Mathias G. for :)-Script & to Tobi H. for JavaScripts
*/

error_reporting (E_ALL);

if (isset($submit_sms)) {
            if ((!empty($name)) && (!empty($text))) {
            include "config.php";
            $nummer=0;

            $text = nl2br($text);


            $datei=fopen($smsdaten,"r");
            $all='';
            while(feof($datei)==0) {
                $nummer++;
                $data=fgets($datei,1000000);
                if ($name!=$nummer)
                if ($nummer<$anzahl)
                $all=$all.$data;
            }

            fclose($datei);
            $all="|||".$name."|||".$text."|||".$_SERVER['REMOTE_ADDR']."\n".$all;
            $all=chop($all);
            $all=trim($all);
            $datei=fopen($smsdaten,"w");
            fputs($datei,$all);
            fclose($datei);

            $datei2=fopen($smsdatenall,"r");
            $eintrag='';
            while(feof($datei2)==0) {
                $nummer++;
                $data=fgets($datei2,1000000);
                if ($name!=$nummer)
                if ($nummer<$alle)
                $eintrag=$eintrag.$data;
            }

            fclose($datei2);
            $eintrag="|||".$name."|||".$text."|||".$_SERVER['REMOTE_ADDR']."\n".$eintrag;
            $eintrag=chop($eintrag);
            $eintrag=trim($eintrag);
            $datei2=fopen($smsdatenall,"w");
            fputs($datei2,$eintrag);
            fclose($datei2);

       } else {
            echo "<font color=#000000 face=Verdana, Arial, Helvetica, sans-serif size=1>Bitte alle Felder ausfüllen</font>";
    }
}
?>
<style type="text/css">
input {
border: 1px solid #222266;
background-color: #FAFAFA;
font-family: verdana;
font-size: 11px;
padding-left:2px;
padding-right:2px;
}

input.numeric {
text-align:right;
}

select {
background-color:#FAFAFA;
border: 1px solid #222266;
font-family: verdana;
font-size: 11px;
}

textarea {
background-color:#FAFAFA;
border: 1px solid #222266;
font-family: verdana;
font-size: 11px;
padding:1px;
}
</style>
<font color="#000000" face="Verdana, Arial, Helvetica, sans-serif" size="2">
<SCRIPT LANGUAGE="JavaScript">
function Aktualisieren ()
{
var c=109 - document.sms.text.value.length;
document.sms.Kontrolle.value = ""+c+"";
return true;
}
function cleanit(thefield){
                        if (thefield.defaultValue==thefield.value) {
                            thefield.value = "";
                    };
            }

function ueberpruefe()
  {
          if (document.sms.name.value == "")
            {
                      alert('Bitte gebe deinen Namen ein!');
                      document.sms.name.focus(); // Damit setzt sich der Cursor automatisch da ins Feld rein, wo der Fehler ist
                      return false;
            }
        if (document.sms.name.value == "Name")
            {
                      alert('Bitte gebe deinen Namen ein!');
                      document.sms.name.focus(); // Damit setzt sich der Cursor automatisch da ins Feld rein, wo der Fehler ist
                      return false;
            }

        if (document.sms.text.value == "")
            {
                      alert('Bitte gebe einen Text ein!');
                      document.sms.text.focus(); // Damit setzt sich der Cursor automatisch da ins Feld rein, wo der Fehler ist
                      return false;
            }

        if (document.sms.text.value == "Schreib was nettes ;-)")
            {
                      alert('Bitte gebe einen Text ein!');
                      document.sms.text.focus(); // Damit setzt sich der Cursor automatisch da ins Feld rein, wo der Fehler ist
                      return false;
            }
}
</SCRIPT>

<FORM name=sms action="<?=$_SERVER['PHP_SELF']?>" onSubmit="return ueberpruefe();" METHOD="POST">
<!--textarea name="txt">
</textarea-->  
 <input onFocus="cleanit(this)" type="text" maxlength=15 size=15 name="name" value="<?
    if (isset($name)) {
       echo $name;
       } else {
       echo "!";
       }
        ?>">
    <input onFocus="cleanit(this)" onkeydown = "Aktualisieren(this.value)" type="text" name="text" maxlength=110 size=25 value="?">
    <!--input readonly type="text" name="Kontrolle" size="3" value="110"-->
    <input type="submit" name="submit_sms" value="Send">
    <!--input type="reset" name="reset" value="Reset"-->
    <!--input onClick="window.open('smilies.php','Name','toolbar=no,status=no,menubar=no,width=90,height=135')" type="button" name="smilies" value=":-)"-->
    <!--input onClick="window.open('sms_showall.php','Name','toolbar=no,status=no,scrollbars=yes,menubar=no,width=890,height=500')" type="button" name="smilies" value="History"-->
</form>

<style type="text/css">
<!--
#frame { visibility:visible;}
-->
</style>
<div id=frame>
<IFRAME src="http://girl.tv/small/sms_iframe.php" width="100%" FrameBorder="0" scrolling="no" marginheight="0" allowtransparency="true" border="0" height="360" vspace"0" hspace="0">Sorry, dein Browser unterstützt kein Iframe</IFRAME>
</div>
