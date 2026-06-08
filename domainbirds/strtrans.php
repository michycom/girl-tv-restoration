<html><body style="margin:120;">

<?php
function curPageName() {return substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1);}

$login= $_POST['login'];
$password= $_POST['password'];

?>
<form action=<?=curPageName();?> method="post">
<?php
echo '
<input type="hidden" name="login" value='.$login.'>
<input type="hidden" name="password" value='.$password.'>
</form>
';
?>

<?php
$password= $_POST['password'];
$ad= $_POST['one'];
// echo $password.$login.$ad;
if($password!="")
   {
include("ISPAPI.phar"); $api = ISPAPI\connect(array("url" => "https://coreapi.1api.net/api/call.cgi","entity" => "54cd","login" => $login,"password" => $password));
goto show;
 }
else
   {
   echo "wrong or none password, sorry!";
}
?>
<pre  style="font-family:Arial Rounded MT Bold">
<?php // ACTIVATE DOMAINS TRANSFER

TRANSFER EINLEITEN
/*
show : {

$command = "TransferDomain";
$param1 = "domain";
$value1 =  $domain;
$param2 = "action";
$value2 =  $action;
$param3 = "repository";
$value3 =  $repository;
$param3 = "auth";
$value3 =  $auth;

emailsender
domains@girl.tv
requestentity
DOMAINBIRD.S
emailtac
"we are transfering"
emailurl
isp/further infos
emaillanguage
de en
nameserverN
ns1.domabird.net



$response = $api->call(array("COMMAND" => $command, $param1 => $value1,$param2 => $value2, $param3 => $value3, $param4 => $value4));
$code = $response->code();
$description = $response->description();

//echo $code;
echo '<p><h1>'.$domain.'</h1>';
echo "<p><h1>";
 $description = preg_replace('/^.*;/', '', $description);
echo $description;
echo "</h1>";
}
*/
?>

<p><b><img style="border:0px solid transparent;" src="http://girl.tv/art/girl.tv.png">



</pre>
</body>
</html>

