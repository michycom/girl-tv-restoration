<html><body  leftmargin="50">
<?php

$password= $_POST['password'];
$login= $_POST['login'];
$ad= $_POST['one'];
function curPageName() { return substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1);}


// echo $password.$login.$ad;
if($password!="")
   {
echo $login;
include("ISPAPI.phar"); $api = ISPAPI\connect(array("url" => "https://coreapi.1api.net/api/call.cgi","entity" => "54cd","login" => $login,"password" => $password));
goto show;
 }
else
   {
   echo "wrong or none password, sorry!";
}



?>

<pre  style="font-family:Arial Rounded MT Bold">

<?php // DOMAINS

show : {

$command = "QueryExtendedDomainList";
$param1 = "renewalmode";
$value1 =  "RENEW";
$param2 = "userdepth";
$value2 =  "SELF";
$param3 = "wide";
$value3 =  "1";

$domains = $api->call(array("COMMAND" => $command, $param1 => $value1,$param2 => $value2, $param3 => $value3));
$prop = $domains->properties();
$usr = $prop[USER];
$total = $domains->total();
// THIS USER
echo "USR<br><big style='background-color:yellow;'>".$usr[0]."</big><p>";
// USERS  DOMAINS
echo "DOMAINS <small>(".$total.")</small><br>";
$prop = $prop[DOMAIN]; $i =  $domains->first(); while($i < count($prop)) {echo $prop[$i]."<br>"; $i++;}
// DNSZONES
$dnszones = $api->call(array("COMMAND" => "QueryDNSZoneList", "dnszone" => "*"));
$propx = $dnszones->properties();
$dnsz = $propx[DNSZONE];

echo "<br>DNSZONES<br>";

$i =  $dnszones->first();
while($i < count($dnsz)) {echo $dnsz[$i]."<br>"; $i++;}

// add oder del RR ZONE IN A //

echo '<form action="dns.php" method="post">
<select name="one">
  <option value=""">  </option>
  <option value="delrr"">del</option>
  <option value="addrr">add</option>
</select>
<input type="hidden" name="login" value='.$login.'>
<input type="hidden" name="password" value='.$password.'>
    <input type="submit" value="Send">
</form>
';
//#####################################//

//#####################################//


// $ad= $_POST['one'];
//$ad= "addrr";

echo $ad;
if($ad !="")
   {
echo "THIS PAGE DOES <p style=background:cyan>";

$ip = " 3600 IN A ".$_SERVER['SERVER_ADDR'];
$rr0 = $ad."1";
$rr1 = $ad."0";
$www0 = "test0.";
$www1 = "test1.";
$i7 =  $dnszones->first();
while($i7 < count($dnsz)) {$UpdateDNSZone = $api->call(array("COMMAND" => "UpdateDNSZone", "dnszone" => $dnsz[$i7], $rr0 => $www0.$dnsz[$i7]." 3600 IN A 144.76.155.48", $rr1 => $www1.$dnsz[$i7]." 3600 IN A 144.76.155.48"));
echo  $UpdateDNSZone->as_string();
$i7++;
}
echo $dnsz[$i]."<p>";
{
$rrr = $QueryDNSZoneRRList->properties();
$rrr = $rrr[RR];
$i2 =  $response->first();
while($i2 < count($rrr)) {echo $rrr[$i2]."<br>";$i2++;}
}
   }
else
   {
   echo "select and addrr or delrr for family.girl.tv";


// DNSZONES DETAILS


echo "<p>DETAILED DNSZONE ENTRIES";
$i0 =  $dnszones->first();

while($i0 < count($dnsz)) {
echo "<p style=background:silver;>";
$QueryDNSZoneRRList = $api->call(array("COMMAND" => "QueryDNSZoneRRList", "dnszone" => $dnsz[$i0]));
//echo $QueryDNSZoneRRList;
echo $dnsz[$i0]."<p>";
{
$rrr = $QueryDNSZoneRRList->properties();
$rrr = $rrr[RR];
$i2 =  $dnszones->first();
while($i2 < count($rrr)) {echo $rrr[$i2]."<br>";$i2++;}
}
$i0++;

	//echo  $QueryDNSZoneRRList->as_string();
}


   }
}
?>



</pre>
</body>
</html>

