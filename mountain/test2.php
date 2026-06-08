<html>
<head>
<style type="text/css">

body {
	background-repeat: repeat-x;
	background-image: url(art/gitter-bg.gif);
}

</style>
</head>
<meta http-equiv="Refresh" content="5; url=index.php?status=added">

<script type="text/javascript">
  var zaehler = 5;                          // Sekunden bis zur Weiterleitung
  var weiter_zu ="index.php?status=added";    // Seite zu der weitergeleitet wird

  function downcount()
  {
    document.getElementById('digit').firstChild.nodeValue = zaehler ;
     if (zaehler == 0 )
     {
      window.location.href=weiter_zu;
     }else{
    zaehler--;
    window.setTimeout('downcount()', 1000);
    }
  }
  window.onload=downcount;
</script>

</head>
<body>
<span id="digit" style="font-weight: bolder;">creating profile ... 5</span></pre>

<?php
$domain=$_GET['domain'];
$now=$_GET['now'];
$top = rand(360,800);
$left = rand(10,600);


$your_data = "<div id='".$now."' style='position:absolute; top:".$top."px; left:".$left."px;'><img src='art/wolkowolf.gif' border='0' /> $domain</div> \n";


$fp = fopen("addadoggy.txt", "a"); 
fwrite($fp, $your_data); 
fclose($fp); 

?>

<pre>thanks, welcome at landscape you are nr. <? echo $domain;?><br> <? echo $now;?><? echo $your_data;?>

</body>
</html>
