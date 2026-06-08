<?php
$str = "text_teil 1 http://www.intervation.de /blabla.de/ nach url";
function replace_uri($str) {
  $pattern = '#(http://|ftp://|mailto:|news(\S+)#i';
  $replace = "<a href=\"$1$2\">$1$2</a>";
  return preg_replace($pattern,$replace,$str);
}
$strn = replace_uri($str);
echo $strn; 
?>