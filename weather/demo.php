<html>
<head>
  <title>Hamburg City Wetterdaten </title>
</head>
<body>

<?php
include('locale_de.inc');
include('phpweather.inc');
include('images.inc');

    $metar = get_metar('EDDH'); 
    echo $metar;
    $decoded_metar = process_metar($metar); 
    pretty_print_metar($metar, 'Hamburg City Alder');
?>

<br>
<img src="<?php get_temp_image($decoded_metar) ?>" height="50" width="20" border="1">&nbsp;
<img src="<?php get_winddir_image($decoded_metar) ?>" height="40" width="40" border="1">
<img src="<?php get_sky_image($decoded_metar) ?>" height="50" width="80" border="1">&nbsp;

</body>
</html>
