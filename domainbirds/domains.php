<html>

<form action="domains.php" method="post">
<input style="display:hidden;background:transparent;border:0px;width:70px;padding:5px;" name="login" type="text" size="12" maxlength="30" value="LOGIN"></input>
<input style="background:transparent;border:0px;width:70px;padding:5px;" name="password"  size="12" maxlength="20" value="password" type="password"></input>
<input id="limg" type="image" src="https://girl.tv/art/girl.tv.png" alt="Absenden">
</form>


<style type="text/css">.hello {height:10px;} #nono {display:none;} a {text-decoration:none;color:black;}</style>

<body  leftmargin="50">
<pre  style="font-family:Arial Rounded MT Bold">
<?php

$password= $_POST['password'];
$login= $_POST['login'];


function curPageName() {
 return substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1);

echo  substr($_SERVER["SCRIPT_NAME"]);
}
?>


<?php 

if($password!="")
   { 

include("ISPAPI.phar"); 
$api = ISPAPI\connect(array("url" => "https://coreapi.1api.net/api/call.cgi","entity" => "54cd","login" => $login,"password" => $password));

//echo $api;

//$api = ISPAPI\connect(array("url" => "https://coreapi.1api.net/api/call.cgi","entity" => "54cd","login" => $login,"password" => $password));
//include("ISPAPI.phar"); $api = ISPAPI\connect(array("url" => "https://coreapi.1api.net/api/call.cgi","entity" => "54cd","login" => $login,"password" => $password)); 
echo "name: $login<p>";
goto show;
 }
else
   {
 echo  "<div style='width:350px;
 white-space: normal;
 border:0px solid red;
 text-align: right;'>";
 
echo $_SERVER['HTTP_USER_AGENT']."<p>from IP <a href='http://".$_SERVER['REMOTE_ADDR']."'>".$_SERVER['REMOTE_ADDR']."</a> <p>";
echo " ".date('d.m.Y').", ";
echo date('H:i:s')."<p>";
echo "illegal request.";
echo "</div>";

}
// DOMAINS


show : {
echo "USR:";

$command = "QueryExtendedDomainList";
$param1 = "renewalmode";
//$value1 =  "DELETE";
$value1 =  "RENEW";
$param2 = "userdepth";
//$value2 =  "SELF";
$value2 =  "ALL";
$param3 = "wide";
$value3 =  "1";

$value4 = "s_user";
$param4 = $login;


$domains = $api->call(array("COMMAND" => $command, $param1 => $value1,$param2 => $value2, $param3 => $value3, $param4 => $value4));
//$domains = $api->call(array("COMMAND" => $command, $param1 => $value1,$param2 => $value2, $param3 => $value3));
$prop = $domains->properties();
$eco = $domains->as_string();
echo $eco;
$usr = $prop[USER];
echo "hi$usr";
$total = $domains->total();
// THIS USER
echo "(name? <big style='background-color:yellow;'>".$usr[0]."huh</big><p>here)<p>";



// USERS  DOMAINS
 echo "DOMAINS <small>(".$total.")</small><br>";
$prop = $prop[DOMAIN]; $i =  $domains->first(); while($i < count($prop)) {

echo "<form class='hello' method='post' action='show_dns.php' name='dns".$i."'><a name='bot' href='#' onClick='document.dns".$i.".submit()'>".$prop[$i]."</a><div id='nono'><input type='hidden' name='password' value='".$password."'><input type='hidden' name='login' value='".$login."'><input type='hidden' name='prin' value='".$prop[$i]."'></div></form>"; $i++;}}
?><p><br>

<a href="http://domainbird.de"><img src="http://girl.tv/art/girl.tv.png" border="0"></a><br>
</pre>



</body>
</html>

