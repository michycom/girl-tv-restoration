 <?php
header('Content-Type: text/html; charset=utf-8');
//$myFont = "/home/ky/public_html/kathrinleist.com/Geometric.ttf";
$myFont = "./DejaVuSans-Bold.ttf";
$size = 32;
$r = $_REQUEST['r'];
$g = $_REQUEST['g'];
$b = $_REQUEST['b'];

// 13, 229, 255 ich merke mir blau

// IMAGEGETTFBBOX is ein ARRAY[]
// untere linke Ecke, X-Position
// 1
// untere linke Ecke, Y-Position
// 2
// untere rechte Ecke, X-Position
// 3
// untere rechte Ecke, Y-Position
// 4
// obere rechte Ecke, X-Position
// 5
// obere rechte Ecke, Y-Position
// 6
// obere linke Ecke, X-Position
// 7
// obere linke Ecke, Y-Position

$textwerte = imagettfbbox ( $size, 0, $myFont, $_REQUEST['Code'] );

$textwerte[2] += 18;

$textwerte[5] = abs ( $textwerte[5] );

$textwerte[5] += 19;                                            // BOX hoehe

$image=imagecreate ( $textwerte[2], $textwerte[5] );

$farbe_body=imagecolorallocate ( $image, 255, 255, 255 );       // Hintergrundfarbe



$farbe = imagecolorallocate  ( $image, $r, $g, $b );            // Textfarbe


$textwerte[5] -= 15;                                            // zeilen position

imagettftext ( $image, $size, 0, 4, $textwerte[5], $farbe,  $myFont, $_REQUEST['Code'] );
 
imagepng ( $image );

imagedestroy ( $image );


?>
