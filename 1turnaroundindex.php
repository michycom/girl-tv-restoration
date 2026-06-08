<html>

<head>
<title>girl.tv does the 1th step"</title>


<script src="http://girl.tv/js/jquery.js" type="text/javascript"></script>
<script src="http://girl.tv/js/jquery-css-transform.js" type="text/javascript"></script>
<!-- script src="http://girl.tv/js/jquery-animate-css-rotate-scale.js" type="text/javascript"></script -->
<!-- script src="http://girl.tv/js/jquery.transit.min.js" type="text/javascript"></script -->
<script src="http://girl.tv/js/rotate3Di.js" type="text/javascript"></script>


<!-- meta http-equiv="refresh" content="5; url=http://girl.tv/2017" -->

<style type="text/css">

<!--
body {
	font-family: Arial, Helvetica, sans-serif;
	color: #222222;
	color: transparent;
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
background-image: url("http://family.girl.tv/art/ColorBar.gif");

}



body {
background-image: url("http://family.girl.tv/art/ColorBar.gif");
//background-position: center center;
//			background-repeat:  no-repeat;
//			background-attachment: fixed;
//			background-size:  cover;
//			background-color: #999;

}

</style>
</head>

<Body>
<?php
$text = $_GET["text"];
?>


<center>
<div>
<form action='./2017' method='get'>
<textarea name='text' style='opacity:1;'>
<?php
//echo $text;
?>


you might just turn it around.


</textarea><br><br>
<input type="image" src="http://girl.tv/SCREEN/art/pxl2boy.gif" border="0" alt="Submit" / style="margin-left:-200px;"></input>
</form>



<script type="text/javascript">
</script>

<?php
//echo 'just say: ' . htmlspecialchars($_GET["text"]) . '!';
//$text = htmlspecialchars($_GET["text"]);

$eo = $_SERVER["REMOTE_ADDR"].$_SERVER['HTTP_USER_AGENT'].$_SERVER['HTTP_ACCEPT_LANGUAGE'];

$link = "http://baby.junix.hamburg/enter.php?time=25&input=tv.ppm&text=$text";
//echo $link;
echo $text;
$content = file_get_contents($link);
//echo $content;

?>




</div>


<script type="text/javascript">

$('html').click(function () {$('html').rotate3Di('-=180', 1000);});


</script>


</body>
</html>
