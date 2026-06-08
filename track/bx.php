<?php

$c_ip = $HTTP_COOKIE_VARS["user_ip"]; 
$counter_file = "count.txt"; 
$counter_file_line = file($counter_file);<br>  if(!$c_ip) { 
setcookie("user_ip", $REMOTE_ADDR, time()+360000);  $counter_file_line[0]++;  
$cf = fopen($counter_file, "w+"); 
fputs($cf, "$counter_file_line[0]");   <br>  fclose($cf);  
}  
elseif($c_ip != $REMOTE_ADDR){ 
$counter_file_line[0]++; <br>  $cf = fopen($counter_file, "w+"); 
fputs($cf, "$counter_file_line[0]"); 
 fclose($cf); 
} 

?>