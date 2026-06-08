<?php // zwingend vor html aufrufen, sonst funzt headerlocation nicht!!  
if($_POST['login']){
    $password = $_POST['pswd'];
    if( $password == "dbc" ) { //passw.
    header('Location:http://drivenbycreatives.com/show/my-password'); //redirect
    exit;
    } else {
?>

<script type="text/javascript">
    alert('ERROR! Wrong Password.')
</script>

<?php
    }
}
?>

<html>
<head>
		
		
<link rel="stylesheet" href="master.css" type="text/css" media="screen" charset="utf-8" />
		
</head>
<body>
	
	<div id="login_box">
	   <br />
	   <br />
	   <div id="login_logo"></div>
	   <br />
	   <br />	   
	   <center>
	   <form method="post" action="">
	       <input class="login_form" value="" maxlength="3" size="12" type="password" name="pswd">
	       <input class="login_form button" type="submit" name="login" value="Login">
	   </form>
	   </center>
	
	</div>
	
	
	
	
	
	
	
	
	
	</body>
</html>
