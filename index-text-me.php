<html>
<head>
<title>girl.tv says: "text me".</title>

<style type="text/css">
<!--
body {
	font-family: Arial, Helvetica, sans-serif;
	color: #222222;
	text-size: 12px;
#	margin-left: 100px;
	margin-top: 100px;

}


textarea {
font-family: Arial,sans-serif; color: black;
font-size: 14px; border: none; border-top: 0px dotted #0050A0; border-bottom: 0px dotted #0050A0; background-color: white; opacity:1; height: 72px; width: 200px; 
outline: none;resize: none;
margin-top:10px;}

div

{
border-color: #2651A6 transparent transparent #2651A6;
position: relative;  
  width: 250px;  
  height: 120px;
  line-height: 120px;  
  font-size: 1.8em;
  font-family: helvetica, tahoma;
  border: 4px solid #2651A6;
  margin:0 auto;  
  -webkit-border-radius: 20px;  
  -moz-border-radius: 20px;  
  border-radius: 20px;
  text-align: center;  
  background: #fff;
 }

div:before {  
  content: ' ';  
  position: absolute;  
  width: 0;  
  height: 0;  
  left: 30px;  
  top: 120px;  
  border: 20px solid;  
  border-color: #2651A6 transparent transparent #2651A6;  
  }

div:after {  
  content: ' ';  
  position: absolute;  
  width: 0;  
  height: 0;  
  left: 34px;  
  top: 120px;  
  border: 15px solid;  
  border-color: #fff transparent transparent #fff;  
  }



table {
opacity: 1;
background-color:transparent;
#	    background-image: url("http://family.girl.tv/art/ColorBar.gif");

}
</style>
</head>

<Body background="http://www.girl.tv/bildstoerung/bildstoerung3.gif">
<?php
$text = $_GET["text"];
?>


<center>
<div>
<form action='./index.php' method='post'>
<textarea name='text' style='opacity:1;'>
! <?php
echo $text;
?>
</textarea><br><br>
<input type="image" src="http://girl.tv/SCREEN/art/pxl2boy.gif" border="0" alt="Submit" / style="margin-left:-200px;"></input>
</form>
<?php
//echo 'just say: ' . htmlspecialchars($_GET["text"]) . '!';
//$text = htmlspecialchars($_GET["text"]);
//$eo = $_SERVER["REMOTE_ADDR"].$_SERVER['HTTP_USER_AGENT'].$_SERVER['HTTP_ACCEPT_LANGUAGE'];

$link = "http://girl.junix.hamburg/enter.php?time=25&input=tv.ppm&text=$text";
//echo $link;
$content = file_get_contents($link);
//echo $content;

 ?>

</div>
</body>
</html>
