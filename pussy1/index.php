<?php 

$str = "teststring";
$len = strlen($str);
for($i=0; $i<$len; $i++)
  printf("Zeichen %d ist %s<br>\n", $i, $str{$i});

 $str = "dies.ist.12.ein.teststring.";
  $avar = explode(".", $str);
  $len = count($avar);
  for ($i=0; $i<$len; $i++)
    printf("%d: %s<br>\n", $i, $avar[$i]);


?>
<credit><!-- http://www.php-faq.de/q/q-string-teilen.html --></credit>
