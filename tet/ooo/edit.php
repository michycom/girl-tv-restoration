
<?php 
// set file to read 

$filename = "bay.txt"; 
   
   
$newdata = $_POST['newd']; 

if ($newdata != '') { 

// open file  
$fw = fopen($filename, 'w') or die('Could not open file!'); 
// write to file 
// added stripslashes to $newdata 
$fb = fwrite($fw,stripslashes($newdata)) or die('Could not write  
to file'); 
// close file 
fclose($fw); 
} 

// open file 
  $fh = fopen($filename, "r") or die("Could not open file!"); 
// read file contents 
  $data = fread($fh, filesize($filename)) or die("Could not read file!"); 
// close file 
  fclose($fh); 
// print file contents 
 echo "<h3>Contents of File</h3> 
<form action='$_SERVER[php_self]' method= 'post' > 
<textarea name='newd' cols='100%' rows='50'> $data </textarea> 
<input type='submit' value='Change'> 
</form>"; 

?>