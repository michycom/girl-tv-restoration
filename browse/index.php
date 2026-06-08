<!-- hi floh.

bist du da?


15:59 -->
<!DOCTYPE HTML PUBLIC "-//W3C/OB/DTD HTML 4.01 Transitional//EN">
<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="robots" content="index, follow">
<link href="css/style.css" rel="stylesheet" type="text/css">
<script language="JavaScript" type="text/javascript" src="js/change.js"></script>
<title>Gtv // browse</title>
</head><body>
<script language="JavaScript" type="text/javascript" src="js/wz_dragdrop.js"></script>

<iframe src="../air3/" style="width:100%; height:100%; border-width:0px;" name="browse" id="browse" scroll="no" scrolling="no"></iframe>

<div class="navic" id="navi">

<div class="gtv"><a href="javascript:document.browse.history.go(-1)" onfocus="if(this.blur)this.blur()">girl.tv/</a></div>

<div class="foam"><?
if ($ver_girltv = opendir('../')) {
    while (false !== ($girltvs = readdir($ver_girltv))) {
        if ($girltvs !='.' && $girltvs !='..' && $girltvs !='.DS_Store') {
            $girltv_nr[]=$girltvs;
        }
    }
}
closedir($ver_girltv);
$anz_girltv = count($girltv_nr);
$array_lowercase = array_map('strtolower', $girltv_nr);
array_multisort($array_lowercase, SORT_ASC, SORT_STRING, $girltv_nr); 
print('<form><select name="kategorien" class="select" onChange="change(this.form)">'."\n");
for ($g=0; $g<$anz_girltv; $g++) {
    print('<option value="http://girl.tv/'.$girltv_nr[$g].'">'.$girltv_nr[$g].'</option>'."\n");
}
print ('</select></form>'."\n");
?></div>

</div>

<script type="text/javascript" language="javascript">
 <!--
SET_DHTML(CURSOR_MOVE, "navi"+TRANSPARENT);
 -->
</script> 

</body></html>
