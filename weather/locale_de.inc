<?php
/*
 * This file holds the German translation of PHP Weather. To use it,
 * just include it in the main phpweather.inc file.
 *
 * Author: Martin Geisler <gimpster@gimpster.com>
 * Translation: Christian R&uuml;tgers <chr@1komma6.com>
 */

/* Unsets old language variables and loads new ones. */
if (isset($strings)) {
  /* The strings array is loaded - assume the same for the rest. */
  unset($strings);
  unset($wind_dir_text_short_array);
  unset($wind_dir_text_array);
  unset($weather_array);
  unset($cloud_condition_array);
}
/* Load the new strings */

$strings = array(
  'no_data'               => '<blockquote><p>Verzeihung! Es sind <b>keine Daten</b> verf&uuml;gbar f&uuml;r %s.</p></blockquote>',
  'mm_inches'             => '<b>%s</b> mm (<b>%s</b> inches)',
  'precip_a_trace'        => 'eine Spur',
  'precip_there_was'      => 'Der Niederschlag war %s',
  'sky_str_format1'       => 'Es waren <b>%s</b> auf einer H&ouml;he von <b>%s</b> Meter (<b>%s</b> Fu&szlig;)',
  'sky_str_clear'         => 'Der Himmel war <b>klar</b>',
  'sky_str_format2'       => ', <b>%s</b> auf einer H&ouml;he von <b>%s</b> Meter (<b>%s</b> Fu&szlig;) und <b>%s</b> auf einer H&ouml;he von <b>%s</b> Meter (<b>%s</b>Fu&szlig;)',
  'sky_str_format3'       => ' und <b>%s</b> auf einer H&ouml;he von <b>%s</b> Meter (<b>%s</b> Fu&szlig;)',
  'sky_cavok'             => 'Unterhalb von <b>1,524</b> Metern (<b>5,000</b> Fu&szlig;) sind keine Wolken',
  'clouds'                => ' Wolken',
  'clouds_cb'             => ' Kumuluswolken',
  'clouds_tcu'            => ' gestapelte Kumuluswolken',
  'visibility_format'     => 'Die Sicht war <b>%s</b> Kilometer (<b>%s</b> Meilen).',
  'wind_str_format1'      => 'weht mit einer Geschwindigkeit von <b>%s</b> Metern pro Sekunde (<b>%s</b> Meilen pro Stunde)',
  'wind_str_format2'      => ', mit B&ouml;en von <b>%s</b> Metern pro Sekunde (<b>%s</b> Meilen pro Stunde),',
  'wind_str_format3'      => ' von <b>%s</b>',
  'wind_str_calm'         => '<b>Ruhe</b>',
  'wind_vrb_long'         => 'verschiedene Richtungen',
  'wind_vrb_short'        => 'VAR',
  'windchill'             => ' Die Temperature einschliesslich des Wind-chill-Index war <b>%s</b>&nbsp;&deg;C (<b>%s</b>&nbsp;&deg;F) ',
  'precip_last_hour'      => 'in der letzten Stunde. ',
  'precip_last_6_hours'   => 'in den letzten 3 bis 6 Stunden. ',
  'precip_last_24_hours'  => 'in den letzten 24 Stunden. ',
  'precip_snow'           => 'Es liegen <b>%s</b> mm (<b>%s</b> inches) Schnee. ',
  'temp_min_max_6_hours'  => 'Die maximale und die minimale Temperatur in den letzen 6 Stunden war <b>%s</b> und <b>%s</b>&nbsp;&deg;C (<b>%s</b> and <b>%s</b>&nbsp;&deg;F).',
  'temp_max_6_hours'      => 'Die maximale Temperatur in den letzen 6 Stunden war <b>%s</b>&nbsp;&deg;C (<b>%s</b>&nbsp;&deg;F). ',
  'temp_min_6_hours'      => 'Die minimale Temperatur in den letzen 6 Stunden war <b>%s</b>&nbsp;&deg;C (<b>%s</b>&nbsp;&deg;F). ',
  'temp_min_max_24_hours' => 'Die maximale und die minimale Temperatur in den letzen 24 Stunden war <b>%s</b> und <b>%s</b>&nbsp;&deg;C (<b>%s</b> and <b>%s</b>&nbsp;&deg;F). ',
  'runway_vis'            => 'Die Sichtweite auf der Landebahn <b>%s</b> ist <b>%s</b> Meter (<b>%s</b> Fu&szlig;).',
  'runway_vis_min_max'    => 'Die Sichtweite auf der Landebahn <b>%s</b> variiert zwischen <b>%s</b> Metern (<b>%s</b> Fu&szlig;) und <b>%s</b> Metern (<b>%s</b> Fu&szlig;).',
  'light'                 => 'leichter ',
  'moderate'              => 'moderater ',
  'Heavy'                 => 'schwerer ',
  'nearby'                => 'nahezu ',
  'current_weather'       => 'Das aktuelle Wetter ist <b>%s</b>. ',
  'pretty_print_metar'    => '<blockquote><p>Vor <b>%s</b> minuten, um <b>%s</b> UTC, der Wind %s in %s. Die Temperatur war <b>%s</b>&nbsp;&deg;C (<b>%s</b>&nbsp;&deg;F), %s und der Luftdruck war <b>%s</b> hPa (<b>%s</b> inHg). Die relative Luftfeuchtigkeit war <b>%s%%</b>. %s %s %s %s %s %s</p></blockquote>'
 );

$wind_dir_text_short_array = array(
  'N',
  'N/NO',
  'NO',
  'O/NO',
  'O/SO',
  'SE',
  'S/SE',
  'S',
  'S/SW',
  'SW',
  'O',
  'W/SW',
  'W',
  'W/NW',
  'NW',
  'N/NW',
  'N');

$wind_dir_text_array = array(
  'Nord',
  'Nord/Nordost',
  'Nordost',
  'Ost/Nordost',
  'Ost',
  'Ost/S&uuml;dost',
  'S&uuml;dost',
  'S&uuml;d/S&uuml;dost',
  'S&uuml;d',
  'S&uuml;d/S&uuml;dwest',
  'S&uuml;dwest',
  'West/S&uuml;dwest',
  'West',
  'West/Nordwest',
  'Nordwest',
  'Nord/Nordwest',
  'Nord');

$weather_array = array(
  'MI' => 'Shallow ',
  'PR' => 'Teilweise ',
  'BC' => 'Muster ',
  'DR' => 'Niedrig Treibend ',
  'BL' => 'Starkwind ',
  'SH' => 'Regen ',
  'TS' => 'Sturm ',
  'FZ' => 'Frierend',
  'DZ' => 'Niesel ',
  'RA' => 'Regen ',
  'SN' => 'Schnee ',
  'SG' => 'Schneeschauer ',
  'IC' => 'Eis ',
  'PE' => 'Eis-St&uuml;cke ',
  'GR' => 'Hagel ',
  'GS' => 'Leichter Hagel und/oder Schneeschauer ',
  'UP' => 'Unbekannt ',
  'BR' => 'Leichter Nebel ',
  'FG' => 'Nebel ',
  'FU' => 'Dichter Nebel ',
  'VA' => 'Vulanische Asche ',
  'DU' => 'Weitverbreiteter Staub ',
  'SA' => 'Sand ',
  'HZ' => 'Belag ',
  'PY' => 'Spray',
  'PO' => 'Gut entwickelte Staub- / Sandwirbel ',
  'SQ' => 'St&ouml;&szlig;e ',
  'FC' => 'Trichterwolken / Tornado ',
  'SS' => 'Sandsturm / Staubsturm ');

$cloud_condition_array = array(
  'SKC' => 'klar',
  'CLR' => 'klar',
  'VV'  => 'vertikale Sicht',
  'FEW' => 'ein wenig',
  'SCT' => 'zerstreute',
  'BKN' => 'gebrochene',
  'OVC' => 'Übersicht');
?>
