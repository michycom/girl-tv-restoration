<html><body style="margin:120;">
<?php
$domain= $_GET['domain'];
$trigger= $_GET['trigger'];
$repository= $_GET['repository'];
$action= $_GET['action'];

if($trigger!=""){
echo '<i>welcome!  to activate your <p> TRANSFER '.$action.' for:<p><h2>'.$domain.'</h2> please log into your account.</i><p>
<form action="actrl.php" method="post">
<input value="enter your master domain.tld here"  style="background:#ddd;border:1px solid white;width:200px;padding:2px;" name="login" type="text" size="15" maxlength="30" ></input>
<br><input value="password" style="background:#ddd;border:1px solid white;width:200px;padding:2px;" name="password"  size="15" maxlength="20"  type="password"></input>
<input type="hidden" name="domain" value='.$domain.'>
<input type="hidden" name="trigger" value='.$trigger.'>
<input type="hidden" name="repository" value='.$repository.'>
<input type="hidden" name="action" value='.$action.'>
<p><input id="limg" src="http://girl.tv/art/girl.tv.png" alt="Absenden" type="image">
</form>';
}else{echo '<i>sorry!<br> you got lost.</i><!-- p><small>girl.tv</small -->';}
?>
</body></html>
