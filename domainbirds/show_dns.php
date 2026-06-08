<html><body  leftmargin="50">
<style type="text/css">
h2 {font-family:Arial Rounded MT Bold;}
a {color:black;text-decoration:none;}</style>
<?php

$password= $_POST['password'];
$login= $_POST['login'];
$ad= $_POST['one'];
$prop_in= $_POST['prin'];
$subD= $_POST['subD'];
$inA= $_POST['inA'];

function curPageName() { return substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1);}


// echo $password.$login.$ad;
if($password!="")
{
echo "<p><h2><a target='_window' href='http://".$prop_in."'>".$prop_in."</a>. <small>(dns)</small></h2>";
include("ISPAPI.phar"); $api = ISPAPI\connect(array("url" => "https://coreapi.1api.net/api/call.cgi","entity" => "54cd","login" => $login,"password" => $password));
goto show;
 }
else
   {
   echo "sorry!";
}
?>

<pre  style="font-family:Arial Rounded MT Bold">

<?php // DOMAINS

show : {






// DNSZONES
$dnszones = $api->call(array("COMMAND" => "QueryDNSZoneList", "dnszone" => $prop_in."."));
$dnsz = $propx[DNSZONE];

$propx = $dnszones->properties();

$prop_in."<br>"; 

// add oder del RR ZONE IN A //



$ad= $_POST['one'];
//$ad= "addrr";

if($ad !="")
   { 

$ip = " 3600 IN A ".$_SERVER['SERVER_ADDR'];
$rr0 = $ad."0";
$www0 = "test0.";
$ip = $inA;

//$i7 =  $dnszones->first();

echo $UpdateDNSZone;

{$UpdateDNSZone = $api->call(array("COMMAND" => "UpdateDNSZone", "dnszone" => $prop_in.".", $rr0 => $subD.".".$prop_in.". 3600 A $ip"));
echo  $UpdateDNSZone->as_string();

}
echo $prop_in."<p>";
$QueryDNSZoneRRList = $api->call(array("COMMAND" => "QueryDNSZoneRRList", "dnszone" => $prop_in."."));

$rrr = $QueryDNSZoneRRList->properties();
$rrr = $rrr[RR];
$i2 =  $dnszones->first();
while($i2 < count($rrr)) {echo $rrr[$i2]."<br>";$i2++;}
   }
else
   {
$QueryDNSZoneRRList = $api->call(array("COMMAND" => "QueryDNSZoneRRList", "dnszone" => $prop_in."."));
{
$rrr = $QueryDNSZoneRRList->properties();
$rrr = $rrr[RR];
$i2 =  $dnszones->first();
while($i2 < count($rrr)) {echo $rrr[$i2]."<br>";$i2++;}

	//echo  $QueryDNSZoneRRList->as_string();
}


   }
}


echo '<p><form action="show_dns.php" method="post">
<select name="one">
  <option value="">  </option>
  <option value="addrr">add </option>
  <option value="delrr">delete </option>
</select>
IN A <input type="text" name="subD" value="w3" size="1" style="border:none;">.'.$prop_in.'
<input type="text" name="inA" size="10"style="border:none;" value="144.76.155.48">
<input type="hidden" name="prin" value='.$prop_in.'>
<input type="hidden" name="login" value='.$login.'>
<input type="hidden" name="password" value='.$password.'>

<input id="limg" type="image" src="http://girl.tv/art/girl.tv.png" alt="Absenden">
</form>
';

?>



</pre>
</body>
</html>

