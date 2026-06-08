<html>
<head><title>Rad Upload Plus</title></head>


<body  bgcolor="FFFFFF">
<?

/*
 * SET THE SAVE PATH by editing the line below. Make sure that the path
 * name ends with the correct file system path separator ('/' in linux and
 * '\\' in windows servers (eg "c:\\temp\\uploads\\" )
 */

$save_path="/home/girltv/public_html/agency/cfaeurope.com/upload";


$file = $_FILES['userfile'];
$k = count($file['name']);


for($i=0 ; $i < $k ; $i++)
{
	if($i %2)
	{
		echo '  ';
	}
	else
	{	
		echo ' ';
	}
	$shortName = split('/',urldecode($file['name'][$i]));
	
	echo ' <br>' . urldecode($file['name'][$i]) ."<br>\n";
	echo ' ' . $file['size'][$i] ."\n";

	if(isset($save_path) && $save_path!="")
	{
		$name = $shortName;
		
		move_uploaded_file($file['tmp_name'][$i], $save_path . $name[count($name)-1]);
	}
	
}

/* echo "<tr style='color: #0066cc'><td>SSL</td><td>". (($_SERVER[HTTPS] != 'on') ? 'Off' : 'On') ."</td></tr>";
if(! isset($save_path) || $save_path =="")
{
	echo '<tr style="color: #0066cc"><td colspan=2 align="left">Files have not been saved, please edit upload.php to match your configuration</td></tr>';
}

echo "<tr style='color: #0066cc'><td colspan=2>Top level folder hint : $userfile_parent</td></tr>";
*/
?>
<br>
<br>
<br>
<small>_drop more, please.</small><br>
<img src="http://girl.tv/3boys.gif">
</div>

</body>
</html>
