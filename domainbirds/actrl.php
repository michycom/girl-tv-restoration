<html><body style="margin:120;">

<?php
function curPageName() {return substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1);}

$login= $_POST['login'];
$password= $_POST['password'];
$domain= $_POST['domain'];
$trigger= $_POST['trigger'];
$repository= $_POST['repository'];
$action= $_POST['action'];
?>
<?php
//<form action="'.curPageName().'" method="post">
/*
echo '
<input type="hidden" name="domain" value='.$domain.'>
<input type="hidden" name="trigger" value='.$trigger.'>
<input type="hidden" name="repository" value='.$repository.'>
<input type="hidden" name="action" value='.$repository.'>
<input type="hidden" name="login" value='.$login.'>
<input type="hidden" name="password" value='.$password.'>
</form>
';
*/
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
show : {

$command = "ActivateDomainTransfer";
$param1 = "domain";
$value1 =  $domain;
$param2 = "trigger";
$value2 =  $trigger;
$param3 = "repository";
$value3 =  $repository;
$param3 = "action";
$value3 =  $action;

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


echo '
<p><b>
<form action="domains.php" method="post">
<input type="hidden" name="login" value='.$login.'>
<input type="hidden" name="password" value='.$password.'>
<input type="image" style="border:0px solid transparent;" src="http://girl.tv/art/girl.tv.png">
</form>
';
?>



</pre>
</body>
</html>

