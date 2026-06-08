<?php


/*
 * Various convenience functions
 */

function store_temp($temp,&$destination,$temp_cname,$temp_fname) {
  /*
   * Given a numerical temperature $temp in Celsius, coded to tenth of
   * degree, store in $destination[$temp_cname], convert to Fahrenheit
   * and store in $decoded_metar[$temp_fname]
   * Note: &$destination is call by reference
   * Note: $temp is converted to negative if $temp > 100.0 (See
   * Federal Meteorological Handbook for groups T, 1, 2 and 4) For
   * example, a temperature of 2.6°C and dew point of -1.5°C would be
   * reported in the body of the report as
   * "03/M01" and the TsnT'T'T'snT'dT'dT'd group as "T00261015").
   */

  /* Temperature measured in Celsius, coded to tenth of degree */
  $temp = number_format($temp/10, 1);
  if ($temp >100.0) { /* first digit = 1 means minus temperature */
     $temp = -($temp - 100.0);
  }
  $destination[$temp_cname] = $temp;
  /* The temperature in Fahrenheit. */
  $destination[$temp_fname] = number_format($temp * (9/5) + 32, 1);
}


function pretty_print_precip($precip_mm, $precip_in) {
  global $strings;
  /* 
   * Returns amount if $precip_mm > 0, otherwise "trace" (see Federal
   * Meteorological Handbook No. 1 for code groups P, 6 and 7) used in
   * several places, so standardized in one function.
   */
  if ($precip_mm > 0) {
    $amount = sprintf($strings['mm_inches'], $precip_mm, $precip_in);
  } else {
    $amount = $strings['a_trace'];
  }
  return sprintf($strings['precip_there_was'], $amount);
}


function store_speed($value, $windunit, &$meterspersec, &$knots, &$milesperhour) {
  /*
   * Helper function to convert and store speed based on unit.
   * &$meterspersec, &$knots and &$milesperhour are passed on
   * reference
   */
  if ($windunit == 'KT') {
    /* The windspeed measured in knots: */
    $knots = number_format($value);
    /* The windspeed measured in meters per second, rounded to one
     * decimal place: */
    $meterspersec = number_format($value * 0.51444, 1);
    /* The windspeed measured in miles per hour, rounded to one
     * decimal place: */
    $milesperhour = number_format($value * 1.1507695060844667, 1);
  } elseif ($windunit == 'MPS') {
    /* The windspeed measured in meters per second: */
    $meterspersec = number_format($value);
    /* The windspeed measured in knots, rounded to one decimal
     * place: */
    $knots = number_format($value / 0.51444, 1);
    /* The windspeed measured in miles per hour, rounded to one
     * decimal place: */
    $milesperhour = number_format($value / 0.51444 * 1.1507695060844667, 1);
  } elseif ($windunit == 'KMH') {
    /* The windspeed measured in kilometers per hour: */
    $meterspersec = number_format($value * 1000 / 3600, 1);
    $knots = number_format($value * 1000 / 3600 / 0.51444, 1);
    /* The windspeed measured in miles per hour, rounded to one
     * decimal place: */
    $milesperhour = number_format($knots * 1.1507695060844667, 1);
  }
}


function pretty_print_metar($metar, $location) {
  /*
   * This is just a wrapper for the get_pretty_print_metar() function.
   */
  print(get_pretty_print_metar($metar, $location));
}

function get_pretty_print_metar($metar, $location) {
  global $strings;
  /*
   * The main pretty-print function.
   * You should pass a metar and a location, eg. 'Aalborg,
   * Denmark'. It then returns something like this:
   *
   *   14 minutes ago, at 12:20 UTC, the wind was blowing at a speed
   *   of 4.6 meters per second (10.4 miles per hour) from West in
   *   Aalborg, Denmark. The temperature was 15 degrees Celsius (59
   *   degrees Fahrenheit), and the pressure was 1,018 hPa (30.06
   *   inHg). The relative humidity was 47.7%. The clouds were few at
   *   a height of 1067 meter (3500 feet) and scattered at a height of
   *   6096 meter (20000 feet). The visibility was >11.3 kilometers
   *   (>7 miles).
   *
   * Neat isn't it? :-)
   */

  if (!$metar) {
    /* We don't want to display all sorts of silly things if the metar
       is empty. */
    return sprintf($strings['no_data'], $location);
  }


  $data = process_metar($metar);
  //extract($data);

  $minutes_old = round((time() - $data['time'])/60);
  /*
   * If you want to use another timezone then uncomment the next line,
   * and then edit as apropriate:
   * $gmtime = gmdate('H:i', $data['time'] + 3600 * 1);
   *
   * If you just want to use your local timezone, then use the next
   * line:
   * $gmtime = date('H:i', $data['time']);
   *
   * If you use any of the above lines, then remember to change
   * apropriate part of the pretty_print_metar() function as well.
   * The standard is to use UTC (Universal Time Coordinated).
   */
  $gmtime = gmdate('H:i', $data['time']);

  /* Cloudlayers. */
  if($data['cloud_layer1_condition'] == 'CAVOK') {
    $sky_str = $strings['sky_cavok'];
  } elseif (isset($data['cloud_layer1_altitude_ft'])) {
    $sky_str = sprintf($strings['sky_str_format1'],
                       $data['cloud_layer1_condition'],
                       $data['cloud_layer1_altitude_m'],
                       $data['cloud_layer1_altitude_ft']);
    if(isset($data['cloud_layer2_altitude_ft'])) {
      if(isset($data['cloud_layer3_altitude_ft'])) {
        $sky_str .= sprintf($strings['sky_str_format2'],
                            $data['cloud_layer2_condition'],
                            $data['cloud_layer2_altitude_m'],
                            $data['cloud_layer2_altitude_ft'],
                            $data['cloud_layer3_condition'],
                            $data['cloud_layer3_altitude_m'],
                            $data['cloud_layer3_altitude_ft']);
      } else {
        $sky_str .= sprintf($strings['sky_str_format3'],
                            $data['cloud_layer2_condition'],
                            $data['cloud_layer2_altitude_m'],
                            $data['cloud_layer2_altitude_ft']);
      }
    }
  } else {
    $sky_str = $strings['sky_str_clear'];
  }
  $sky_str .= '.';

  /* Visibility. */
  if(isset($data['visibility_miles'])) {
    $visibility = sprintf($strings['visibility_format'],
                          $data['visibility_km'],
                          $data['visibility_miles']);
  } else {
    $visibility = '';
  }

  /* Wind. */
  if (isset($data['wind_meters_per_second']) &&
      $data['wind_meters_per_second'] > 0) {
    $wind_str = sprintf($strings['wind_str_format1'],
                        $data['wind_meters_per_second'],
                        $data['wind_miles_per_hour']);
    if (isset($data['wind_gust_meters_per_second']) &&
        $data['wind_gust_meters_per_second'] > 0) {
      $wind_str .= sprintf($strings['wind_str_format2'],
                           $data['wind_gust_meters_per_second'],
                           $data['wind_gust_miles_per_hour']);
    }
    $wind_str .= sprintf($strings['wind_str_format3'], $data['wind_dir_text']);
  } else {
    $wind_str = $strings['wind_str_calm'];
  }

  /* Windchill */
  if (isset($data['windchill_c'])) {
    $windchill_str = sprintf($strings['windchill'],
                             $data['windchill_c'],
                             $data['windchill_f']);
  } else {
    $windchill_str = '';
  }

  /* Precipitation. */
  $prec_str = '';
  if (isset($data['precip_in'])) {
    $prec_str .= pretty_print_precip($data['precip_mm'], $data['precip_in']) .
      $strings['precip_last_hour'];
  }
  if (isset($data['precip_6h_in'])) {
    $prec_str .= pretty_print_precip($data['precip_6h_mm'],
                                     $data['precip_6h_in']) .
      $strings['precip_last_6_hours'];
  }
  if (isset($data['precip_24h_in'])) {
    $prec_str .= pretty_print_precip($data['precip_24h_mm'],
                                     $data['precip_24h_in']) .
      $strings['precip_last_24_hours'];
  }
  if (isset($data['snow_in'])) {
    $prec_str .= sprintf($strings['precip_snow'],
                         $data['snow_mm'], $data['snow_in']);
  }

  /* Min and max temperatures. */
  $temp_str = '';
  if (isset($data['temp_max6h_c']) && isset($data['temp_min6h_c'])) {
    $temp_str .= sprintf($strings['temp_min_max_6_hours'],
                         $data['temp_max6h_c'], $data['temp_min6h_c'],
                         $data['temp_max6h_f'], $data['temp_min6h_f']);
  } else {
    if (isset($data['temp_max6h_c'])) {
      $temp_str .= sprintf($strings['temp_max_6_hours'],
                           $data['temp_max6h_c'], $data['temp_max6h_f']);
    }
    if (isset($data['temp_min6h_c'])) {
      $temp_str .= sprintf($strings['temp_max_6_hours'],
                           $data['temp_min6h_c'], $data['temp_min6h_f']);
    }
  }
  if (isset($data['temp_max24h_c'])) {
    $temp_str .= sprintf($strings['temp_min_max_24_hours'],
                         $data['temp_max24h_c'], $data['temp_min24h_c'],
                         $data['temp_max24h_f'], $data['temp_min24h_f']);
  }

  /* Runway information. */
  if (isset($data['runway_vis_meter'])) {
    $runway_str = sprintf($strings['runway_vis'], $data['runway_nr'],
                          $data['runway_vis_meter'], $data['runway_vis_ft']);
  } else {
    $runway_str = '';
  }
    

  if (isset($data['runway_vis_min_meter'])) {
    $runway_str = sprintf($strings['runway_vis_min_max'],
                          $data['runway_nr'],
                          $data['runway_vis_min_meter'],
                          $data['runway_vis_min_ft'],
                          $data['runway_vis_max_meter'],
                          $data['runway_vis_max_ft']);
  } else {
    $runway_str = '';
  }
  
  /* Current weather. */
  if (!empty($data['weather'])) {
    $weather_str = sprintf($strings['current_weather'], $data['weather']);
  } else {
    $weather_str = '';
  }

  return sprintf($strings['pretty_print_metar'],
                 $minutes_old,
                 $gmtime,
                 $wind_str,
                 $location,
                 $data['temp_c'],
                 $data['temp_f'],
                 $windchill_str,
                 $data['altimeter_hpa'],
                 $data['altimeter_inhg'],
                 $data['rel_humidity'],
                 $sky_str,
                 $visibility,
                 $runway_str,
                 $weather_str,
                 $prec_str,
                 $temp_str);
}



// catch output into buffer and return it as string
function pretty_print_metar_string($metar, $location) {
    ob_start();
    pretty_print_metar($metar, $location);
    $m = ob_get_contents();
    ob_end_clean();
    return $m;
}

function pretty_print_metar_wap($metar, $location) {
  /*
   * The wap pretty-print function.
   *
   * You should pass a metar and a location, eg. 'Aalborg'. That
   * produces something like this:
   *
   * Aalborg, 31 min ago
   * Wind: 4.6 mps 
   * Temp: 11 C
   * Clouds: 5/8 - 7/8
   *
   */

  $data = process_metar($metar);
  $minutes_old = round((time() - $data['time'])/60);
  echo "<p>$location, $minutes_old min ago<br/>\n" .
    'Wind: ' . $data['wind_meters_per_second'] . ' mps ' .
    $data['wind_dir_text_short'] . "<br/>\n" .
    'Temp: ' . $data['temp_c'] . " C<br/>\n" .
    'Clouds: ' . $data['cloud_layer1_coverage'] . "</p>\n";
}

function get_metar($station, $always_use_cache = 0) {
  /*
   * Looks in the database, and fetches a new metar is nesceary. If
   * $always_use_cache is true, then it ignores the timestamp of the
   * METAR and just returns it.
   * 
   * You should pass a ICAO station identifier, eg. 'EKYT' for
   * Aalborg, Denmark.
   */

  global $useOCI, $useMySQL, $useDBM, $useDBA, $usePSQL, $conn, $dbmMetar,
    $dbmTimestamp, $useXML, $XMLMetar, $XMLParser, $XMLFile;

  if ($useMySQL) {
    $query = "SELECT metar, UNIX_TIMESTAMP(timestamp) FROM metars WHERE station = '$station'";
    $result = mysql_query($query);
    if (mysql_num_rows($result)) { /* found station */
      list($metar, $timestamp) = mysql_fetch_row($result);
    }
  } elseif ($usePSQL) {
    $query = "SELECT metar,timestamp FROM metars WHERE station='$station'";
    $result = pg_exec($conn,$query);
    $num=pg_numrows($result);
    if (pg_numrows($result)) {
      list($metar,$timestamp) = pg_fetch_row($result,0);
    }
  } elseif ($useDBM) {
    if (dbmexists($dbmMetar, $station) &&
	dbmexists ($dbmTimestamp, $station)) { /* found station */
      $metar = dbmfetch ($dbmMetar, $station);
      $timestamp = dbmfetch($dbmTimestamp, $station);
    }
  } elseif ($useDBA) {
    if (dba_exists($station, $dbmMetar) &&
        dba_exists ($station, $dbmTimestamp)) { /* found station */
      $metar = dba_fetch ($station, $dbmMetar);
      $timestamp = dba_fetch($station, $dbmTimestamp);
    }
  } elseif ($useOCI) {
    $query = "SELECT metar,(timestamp-to_date('01-JAN-70','DD-MON-YY')) time_stamp FROM metars WHERE station='$station'";
    $stmt = OCIParse($conn,$query);
    OCIExecute($stmt);
    $nrows = OCIFetchStatement($stmt,$results);
    $val1  = $results['METAR'];
    $val2  = $results['TIME_STAMP'];
    $metar = $val1[0];
    $timestamp = $val2[0]*86400;
  } elseif ($useXML) {
    // Make sure we have data
    if (is_array($XMLMetar[$station])) {
      $metar = $XMLMetar[$station]["metar"];
      //$timestamp = strtotime($XMLMetar[$station]["timestamp"]);
      $timestamp = $XMLMetar[$station]["timestamp"];
    }
  }

  if (isset($metar)) { /* found station */
    if ($always_use_cache || $timestamp > time() - 3600) {
      /* We have asked explicit for a cached metar, or the metar is
       * still fresh. */
      return $metar;
    } else {
      /* We looked in the cache, but the metar was too old. */
      return fetch_metar($station, 0);
    }
  } else {
    /* The station is new - we fetch a new METAR */
    return fetch_metar($station, 1);
  }
}

function fetch_metar($station, $new) {
  /*
   * Fetches a new METER from weather.noaa.gov. If the $new variable
   * is true, the metar is inserted, else it will replace the old
   * metar. The new METAR is returned.
   */
  global $useMySQL, $usePSQL, $useOCI, $conn,
    $useDBM, $useDBA, $dbmMetar, $dbmTimestamp,
    $useProxy, $proxy_host, $proxy_port,
    $useXML, $XMLMetar, $XMLParser, $XMLFile;

  $metar = '';
  $station = strtoupper($station);
  
  if ($useProxy) {
    /* Inspirated by code from Paul Kairis <Paul.Kairis@sas.com> */
    
    $fp = fsockopen($proxy_host, $proxy_port); // connect to proxy
    if ($fp) {
      fputs($fp, 'GET http://weather.noaa.gov/pub/data/' .
            "observations/metar/stations/$station.TXT HTTP/1.0\r\n" .
            "If-Modified-Since: Sat, 29 Oct 1994 09:00:00 GMT\r\n" .
            "Pragma: no-cache\r\n\r\n"); 
      
      /* We check the status line */
      if (strpos(fgets($fp, 1024), '200')) {
        /* Then we seek until we find the empty line between the
           header and the contents. */
        $line = fgets($fp, 1024);
        while ($line != "\r\n") {
          $line = fgets($fp, 1024);
        }
        /* We now know, that the following lines are the contents. */
        unset($file);
        while ($line = fgets($fp, 1024)) {
          $file[] = $line;
        }
        fclose($fp);
      }
    }
  } else {
    /* We use the @ notation, because it might fail. */
    $file  = @file('http://weather.noaa.gov/pub/data/' .
                   "observations/metar/stations/$station.TXT");
  }

  /* Here we test to see if we actually got a METAR. */
  if (is_array($file)) {
    $date = trim($file[0]);
    $metar = trim($file[1]);
    for ($i = 2; $i < count($file); $i++) {
      $metar .= ' ' . trim($file[i]);
    }
    
    /* The date is in the form 2000/10/09 14:50 UTC. This seperates
       the different parts. */
    $date_parts = explode(':', strtr($date, '/ ', '::'));
    $date_unixtime = gmmktime($date_parts[3], $date_parts[4],
                              0, $date_parts[1], $date_parts[2],
                              $date_parts[0]);
   
    if (!ereg('[0-9]{6}Z', $metar)) {
      /* Some reports dont even have a time-part, so we insert the
       * current time. This might not be the time of the report, but
       * it was broken anyway :-) */
      $metar = gmdate('dHi', $date_unixtime) . 'Z ' . $metar;
    }
    
    if ($date_unixtime < (time() - 3300)) {
      /* The timestamp in the metar is more than 55 minutes old. We
       * adjust the timestamp, so that we won't try to fetch a new
       * METAR within the next 5 minutes. After 5 minutes, the
       * timestamp will again be more than 1 hour old. */
      $date_unixtime = time() - 3300;
    }

  } else {
    /* If we end up here, it means that there was no file, we then set
     * the metar to and empty string. We set the date to time() - 3000
     * to give the server 10 minutes of peace. If the file is
     * unavailable, we don't want to stress the server. */
    $metar = '';
    $date_unixtime = time() - 3000;
  }
  
  /* It might seam strange, that we make a local date, but MySQL
   * expects a local when we insert the METAR. */
  $date = date('Y/m/d H:i', $date_unixtime);

  if ($useMySQL) {
    if ($new) {
      /* Insert the new record */
      $query = "INSERT INTO metars SET station = '$station', " .
        "metar = '$metar', timestamp = '$date'";
    } else {
      /* Update the old record */
      $query = "UPDATE metars SET metar = '$metar', " .
        "timestamp = '$date' WHERE station = '$station'";
    }
    mysql_query($query);
  } elseif ($usePSQL) {
    if ($new) {
      /* Insert the new record */
      $query = "INSERT INTO metars (station,metar,timestamp) " .
        "VALUES ('$station','$metar','$date')";
    } else {
      /* Update the old record */
      $query = "UPDATE metars SET metar='$metar', " .
        "timestamp='$date' WHERE station='$station'";
    }
    pg_exec($conn,$query);
  } elseif ($useDBA) {
    if ($new) {
      /* Insert the new record */
      dba_insert ($station, $metar, $dbmMetar);
      dba_insert ($station, $date_unixtime, $dbmTimestamp);
      dba_sync ($dbmMetar); dba_sync ($dbmTimestamp); 
    } else {
      /* Update the old record */
      dba_replace ($station, $metar, $dbmMetar);
      dba_replace ($station, $date_unixtime, $dbmTimestamp);
      dba_sync ($dbmMetar); dba_sync ($dbmTimestamp); 
    }
  } elseif ($useDBM) {
    if ($new) {
      /* Insert the new record */
      dbminsert ($dbmMetar, $station, $metar);
      dbminsert ($dbmTimestamp, $station, $date_unixtime);
    } else {
      /* Update the old record */
      dbmreplace ($dbmMetar, $station, $metar);
      dbmreplace ($dbmTimestamp, $station, $date_unixtime);
    }
  } elseif ($useOCI) {
    if ($new) {
      /* Insert the new record */
      $query = "INSERT INTO metars (station,metar,timestamp) " .
        "VALUES ('$station','$metar',to_date('$date','YYYY/MM/DD HH24:MI'))";
    } else {
      /* Update the old record */
      $query = "UPDATE metars SET metar='$metar', " .
        "timestamp=to_date('$date','YYYY/MM/DD HH24:MI') " .
        "WHERE station='$station'";
    }
    $stmt = OCIParse($conn,$query);
    OCIExecute($stmt);
  } elseif ($useXML) {
    // Write to XML File
    $XMLMetar[$station]["station"] = $station;
    $XMLMetar[$station]["metar"] = $metar;
    $XMLMetar[$station]["timestamp"] = $date_unixtime;
    
    WriteXML ($XMLMetar, $XMLFile);
  }
  
  return $metar;
}

function process_metar($metar) {
  /* This function decodes a raw METAR. The result is an associative
   * array with entries like 'temp_c', 'visibility_miles' etc.  */

  global $strings, $wind_dir_text_short_array, $wind_dir_text_array,
    $cloud_condition_array, $weather_array, $offset;

  $temp_visibility_miles = '';
  $cloud_layers = 0;
  $decoded_metar['remarks'] = '';
  $decoded_metar['weather'] = '';
  
  $cloud_coverage = array('SKC' => '0',
        'CLR' => '0',
        'VV'  => '8/8',
        'FEW' => '1/8 - 2/8',
        'SCT' => '3/8 - 4/8',
        'BKN' => '5/8 - 7/8',
        'OVC' => '8/8');
  
  $decoded_metar['metar'] = $metar;
  $parts = split('[ ]+', $metar);
  $num_parts = count($parts);
  for ($i = 0; $i < $num_parts; $i++) {
    $part = $parts[$i];

    if (ereg('RMK|TEMPO|BECMG', $part)) {
      /* The rest of the METAR is either a remark or temporary
       * information. We skip the rest of the METAR. */
      $decoded_metar['remarks'] .= ' ' . $part;
      break;
    } elseif ($part == 'METAR') {
      /*
       * Type of Report: METAR
       */
      $decoded_metar['type'] = 'METAR';
    } elseif ($part == 'SPECI') {
      /*
       * Type of Report: SPECI
       */
      $decoded_metar['type'] = 'SPECI';
    } elseif (ereg('^[A-Z]{4}$', $part) && ! isset($decoded_metar['station']))  {
      /*
       * Station Identifier
       */
      $decoded_metar['station'] = $part;
    } elseif (ereg('([0-9]{2})([0-9]{2})([0-9]{2})Z', $part, $regs)) {
      /*
       * Date and Time of Report
       * We return a standard Unix UTC/GMT timestamp suitable for
       * gmdate()
       */
      $decoded_metar['time'] = gmmktime($regs[2] + $offset, $regs[3], 0,
                                        gmdate('m'), $regs[1], gmdate('Y'));
    } elseif (ereg('(AUTO|COR|RTD|CC[A-Z]|RR[A-Z])', $part, $regs)) {
      /*
       * Report Modifier: AUTO, COR, CCx or RRx
       */
      $decoded_metar['report_mod'] = $regs[1];
    } elseif (ereg('([0-9]{3}|VRB)([0-9]{2,3}).*(KT|MPS|KMH)', $part, $regs)) {
      /* Wind Group */
      $windunit = $regs[3];  /* do ereg in two parts to retrieve unit first */
      /* now do ereg to get the actual values */
      ereg("([0-9]{3}|VRB)([0-9]{2,3})(G([0-9]{2,3})?$windunit)", $part, $regs);
      if ($regs[1] == 'VRB') {
        $decoded_metar['wind_deg'] = $strings['wind_vrb_long'];
        $decoded_metar['wind_dir_text'] = $strings['wind_vrb_long'];
        $decoded_metar['wind_dir_text_short'] = $strings['wind_vrb_short'];
      } else {
        $decoded_metar['wind_deg'] = $regs[1];
        $decoded_metar['wind_dir_text'] =
          $wind_dir_text_array[intval(round($regs[1]/22.5))];
        $decoded_metar['wind_dir_text_short'] =
          $wind_dir_text_short_array[intval(round($regs[1]/22.5))];
      }
      store_speed($regs[2],
                  $windunit,
                  $decoded_metar['wind_meters_per_second'],
                  $decoded_metar['wind_knots'],
                  $decoded_metar['wind_miles_per_hour']);

      if (isset($regs[4])) {
        /* We have a report with information about the gust. First we
           have the gust measured in knots: */
        store_speed($regs[4],$windunit,
          $decoded_metar['wind_gust_meters_per_second'],
          $decoded_metar['wind_gust_knots'],
          $decoded_metar['wind_gust_miles_per_hour']);
      }
    } elseif (ereg('^([0-9]{3})V([0-9]{3})$', $part, $regs)) {
      /*
       * Variable wind-direction
       */
      $decoded_metar['wind_var_beg'] = $regs[1];
      $decoded_metar['wind_var_end'] = $regs[2];
    } elseif ($part == 9999) {
      /* A strange value. When you look at other pages you see it
         interpreted like this (where I use > to signify 'Greater
         than'): */
      $decoded_metar['visibility_miles'] = '>6.2';
      $decoded_metar['visibility_km']    = '>10';
    } elseif(ereg('^([0-9]{4})$', $part, $regs)) {
      /* 
       * Visibility in meters (4 digits only)
       */
      $decoded_metar['visibility_km'] = number_format($regs[1]/1000, 1);
      $decoded_metar['visibility_miles'] =
        number_format( ($regs[1]/1000) / 1.609344, 1);
    } elseif (ereg('^[0-9]$', $part)) {
      /*
       * Temp Visibility Group, single digit followed by space
       */
      $temp_visibility_miles = $part;
    } elseif (ereg('^M?(([0-9]?)[ ]?([0-9])(/?)([0-9]*))SM$',
                   $temp_visibility_miles . ' ' .
                   $parts[$i], $regs)) {
      /*
       * Visibility Group
       */
      if ($regs[4] == '/') {
        $vis_miles = $regs[2] + $regs[3]/$regs[5];
      } else {
        $vis_miles = $regs[1];
      }
      if ($regs[0][0] == 'M') {
        /* The visibility measured in miles, prefixed with < to
           indicate 'Less than' */
        $decoded_metar['visibility_miles'] =
          '<' . number_format($vis_miles, 1);
        /* The visibility measured in kilometers. The value is rounded
           to one decimal place, prefixed with < to indicate 'Less
           than' */
        $decoded_metar['visibility_km']    =
          '<' . number_format($vis_miles * 1.609344, 1);
      } else {
        /* The visibility measured in mile.s */
        $decoded_metar['visibility_miles'] = number_format($vis_miles, 1);
        /* The visibility measured in kilometers, rounded to one
           decimal place. */
        $decoded_metar['visibility_km'] =
          number_format($vis_miles * 1.609344, 1);
      }
    } elseif ($part == 'CAVOK') {
      /* CAVOK: Used when the visibility is greather than 10
         kilometers, the lowest cloud-base is at 5000 feet and there
         is no significant weather. */
      $decoded_metar['visibility_km']    = '>10';
      $decoded_metar['visibility_miles'] = '>6.2';
      $decoded_metar['cloud_layer1_condition'] = 'CAVOK';
    } elseif (ereg('^R([0-9][0-9][RLC]?)/([MP]?[0-9]{4})V?(P?[0-9]{4})?F?T?$', $part, $regs)) {
      $decoded_metar['runway_nr'] = $regs[1];
      if ($regs[3]) {
  /* We have both min and max visibility. */
  $prefix = '';
  if ($regs[2][0] == 'M') {
    /* Less than. */
    $prefix = '<';
    $regs[2] = substr($regs[2], 1);
  }
  $decoded_metar['runway_vis_min_ft']    = $prefix . number_format($regs[2]);
  $decoded_metar['runway_vis_min_meter'] = $prefix . number_format($regs[2] * 0.3048);

  $prefix = '';
  if ($regs[3][0] == 'P') {
    /* Greather than. */
    $prefix = '>';
    $regs[3] = substr($regs[3], 1);
  }
  $decoded_metar['runway_vis_max_ft']    = $prefix . number_format($regs[3]);
  $decoded_metar['runway_vis_max_meter'] = $prefix . number_format($regs[3] * 0.3048);
    
      } else {
  /* We only have a single visibility. */
  $prefix = '';
  if ($regs[2][0] == 'M') {
    $prefix = '<';
    $regs[2] = substr($regs[2], 1);
  } elseif ($regs[2][0] == 'P') {
    $prefix = '>';
    $regs[2] = substr($regs[2], 1);
  }
  $decoded_metar['runway_vis_ft']    = $prefix . number_format($regs[2]);
  $decoded_metar['runway_vis_meter'] = $prefix . number_format($regs[2] * 0.3048);
      }
    } elseif (ereg('^(-|\+|VC)?(TS|SH|FZ|BL|DR|MI|BC|PR|RA|DZ|SN|SG|GR|' .
                   'GS|PE|IC|UP|BR|FG|FU|VA|DU|SA|HZ|PY|PO|SQ|FC|SS|DS)+$',
                   $part)) {
      /*
       * Current weather-group
       */ 
      if ($part[0] == '-') {
        /* A light phenomenon */
        $decoded_metar['weather'] .= $strings['light'];
        $part = substr($part, 1);
      } elseif ($part[0] == '+') {
        /* A heavy phenomenon */
        $decoded_metar['weather'] .= $strings['heavy'];
        $part = substr($part, 1);
      } elseif ($part[0].$part[1] == 'VC') {
        /* Proximity Qualifier */
        $decoded_metar['weather'] .= $strings['nearby'];
        $part = substr($part, 2);
      } else {
        /* no intensity code => moderate phenomenon */
        $decoded_metar['weather'] .= $strings['moderate'];
      }
      
      while ($bite = substr($part, 0, 2)) {
        /* Now we take the first two letters and determine what they
           mean. We append this to the variable so that we gradually
           build up a phrase. */
        $decoded_metar['weather'] .= $weather_array[$bite];
        /* Here we chop off the two first letters, so that we can take
           a new bite at top of the while-loop. */
        $part = substr($part, 2);
      }
    } elseif (ereg('(SKC|CLR)', $part, $regs)) {
      /*
       * Cloud-layer-group.
       * There can be up to three of these groups, so we store them as
       * cloud_layer1, cloud_layer2 and cloud_layer3.
       */
      $cloud_layers++;
      /* Again we have to translate the code-characters to a
         meaningful string. */
      $decoded_metar['cloud_layer'. $cloud_layers.'_condition'] =
        $cloud_condition_array[$regs[1]];
      $decoded_metar['cloud_layer'.$cloud_layers.'_coverage'] =
        $cloud_coverage[$regs[1]];
    } elseif (ereg('^(VV|FEW|SCT|BKN|OVC)([0-9]{3})(CB|TCU)?$',
                   $part, $regs)) {
      /* We have found (another) a cloud-layer-group. There can be up
         to three of these groups, so we store them as cloud_layer1,
         cloud_layer2 and cloud_layer3. */
      $cloud_layers++;
      /* Again we have to translate the code-characters to a
         meaningful string. */
      if ($regs[1] == 'OVC') {
        $clouds_str_temp = '';
      } else {
        $clouds_str_temp = $strings['clouds'];
      }
      if ($regs[3] == 'CB') {
        /* cumulonimbus (CB) clouds were observed. */
        $decoded_metar['cloud_layer'.$cloud_layers.'_condition'] =
          $cloud_condition_array[$regs[1]] . $strings['clouds_cb'];
      } elseif ($regs[3] == 'TCU') {
        /* towering cumulus (TCU) clouds were observed. */
        $decoded_metar['cloud_layer'.$cloud_layers.'_condition'] =
          $cloud_condition_array[$regs[1]] . $strings['clouds_tcu'];
      } else {
        $decoded_metar['cloud_layer'.$cloud_layers.'_condition'] =
          $cloud_condition_array[$regs[1]] . $clouds_str_temp;
      }
      $decoded_metar['cloud_layer'.$cloud_layers.'_coverage'] =
        $cloud_coverage[$regs[1]];
      $decoded_metar['cloud_layer'.$cloud_layers.'_altitude_ft'] =
        $regs[2] *100;
      $decoded_metar['cloud_layer'.$cloud_layers.'_altitude_m'] =
        round($regs[2] * 30.48);
    } elseif (ereg('^(M?[0-9]{2})/(M?[0-9]{2})?$', $part, $regs)) {
      /*
       * Temperature/Dew Point Group
       * The temperature and dew-point measured in Celsius.
       */
      $decoded_metar['temp_c'] = number_format(strtr($regs[1], 'M', '-'));
      $decoded_metar['dew_c']  = number_format(strtr($regs[2], 'M', '-'));
      /* The temperature and dew-point measured in Fahrenheit, rounded
         to the nearest degree. */
      $decoded_metar['temp_f'] = round(strtr($regs[1], 'M', '-') * (9/5) + 32);
      $decoded_metar['dew_f']  = round(strtr($regs[2], 'M', '-') * (9/5) + 32);
    } elseif(ereg('A([0-9]{4})', $part, $regs)) {
      /*
       * Altimeter
       * The pressure measured in inHg
       */
      $decoded_metar['altimeter_inhg'] = number_format($regs[1]/100, 2);
      /* The pressure measured in mmHg, hPa and atm */
      $decoded_metar['altimeter_mmhg'] = number_format($regs[1] * 0.254, 1);
      $decoded_metar['altimeter_hpa']  = number_format($regs[1] * 0.33863881578947);
      $decoded_metar['altimeter_atm']  = number_format($regs[1] * 3.3421052631579e-4, 3);
    } elseif(ereg('Q([0-9]{4})', $part, $regs)) {
      /*
       * Altimeter
       * This is strange, the specification doesnt say anything about
       * the Qxxxx-form, but it's in the METARs.
       */
      /* The pressure measured in hPa */
      $decoded_metar['altimeter_hpa']  = number_format($regs[1]);
      /* The pressure measured in mmHg, inHg and atm */
      $decoded_metar['altimeter_mmhg'] = number_format($regs[1] * 0.7500616827, 1);
      $decoded_metar['altimeter_inhg'] = number_format($regs[1] * 0.0295299875, 2);
      $decoded_metar['altimeter_atm']  = number_format($regs[1] * 9.869232667e-4, 3);
    } elseif (ereg('^T([0-9]{4})([0-9]{4})', $part, $regs)) {
      /*
       * Temperature/Dew Point Group, coded to tenth of degree.
       * The temperature and dew-point measured in Celsius.
       */
      store_temp($regs[1],$decoded_metar,'temp_c','temp_f');
      store_temp($regs[2],$decoded_metar,'dew_c','dew_f');
    } elseif (ereg('^T([0-9]{4}$)', $part, $regs)) {
      store_temp($regs[1],$decoded_metar,'temp_c','temp_f');
    } elseif (ereg('^1([0-9]{4}$)', $part, $regs)) {
      /*
       * 6 hour maximum temperature Celsius, coded to tenth of degree
       */
      store_temp($regs[1],$decoded_metar,'temp_max6h_c','temp_max6h_f');
    } elseif (ereg('^2([0-9]{4}$)', $part, $regs)) {
      /*
       * 6 hour minimum temperature Celsius, coded to tenth of degree
       */
      store_temp($regs[1],$decoded_metar,'temp_min6h_c','temp_min6h_f');
    } elseif (ereg('^4([0-9]{4})([0-9]{4})$', $part, $regs)) {
      /*
       * 24 hour maximum and minimum temperature Celsius, coded to
       * tenth of degree
       */
      store_temp($regs[1],$decoded_metar,'temp_max24h_c','temp_max24h_f');
      store_temp($regs[2],$decoded_metar,'temp_min24h_c','temp_min24h_f');
    } elseif(ereg('^P([0-9]{4})', $part, $regs)) {
      /*
       * Precipitation during last hour in hundredths of an inch
       * (store as inches)
       */
      $decoded_metar['precip_in'] = number_format($regs[1]/100, 2);
      $decoded_metar['precip_mm'] = number_format($regs[1]*0.254, 2);
    } elseif(ereg('^6([0-9]{4})', $part, $regs)) {
      /*
       * Precipitation during last 3 or 6 hours in hundredths of an
       * inch  (store as inches)
       */
      $decoded_metar['precip_6h_in'] = number_format($regs[1]/100, 2);
      $decoded_metar['precip_6h_mm'] = number_format($regs[1]*0.254, 2);
    } elseif(ereg('^7([0-9]{4})', $part, $regs)) {
      /*
       * Precipitation during last 24 hours in hundredths of an inch
       * (store as inches)
       */
      $decoded_metar['precip_24h_in'] = number_format($regs[1]/100, 2);
      $decoded_metar['precip_24h_mm'] = number_format($regs[1]*0.254, 2);
    } elseif(ereg('^4/([0-9]{3})', $part, $regs)) {
      /*
       * Snow depth in inches
       */
      $decoded_metar['snow_in'] = number_format($regs[1]);
      $decoded_metar['snow_mm'] = number_format($regs[1] * 25.4);
    } else {
      /*
       * If we couldn't match the group, we assume that it was a
       * remark.
       */
      $decoded_metar['remarks'] .= ' ' . $part;
    }
  }
  /*
   * Relative humidity
   */
  $decoded_metar['rel_humidity'] = number_format(pow(10, 
    (1779.75 * ($decoded_metar['dew_c'] - $decoded_metar['temp_c'])/
    ((237.3 + $decoded_metar['dew_c']) * (237.3 + $decoded_metar['temp_c']))
    + 2)), 1);

  /*
   * Humidity index
   */
  $e = 6.112 * pow(10, 7.5 * $decoded_metar['temp_c']
       / (237.7 + $decoded_metar['temp_c']))
       * $decoded_metar['rel_humidity']/100;
  $decoded_metar['humidex_c'] =
    number_format($decoded_metar['temp_c'] + 5/9 * ($e - 10),1);
  $decoded_metar['humidex_f'] =
    number_format($decoded_metar['humidex_c'] * 9/5 + 32, 1);
  
  /*
   * Windchill.
   * 
   * This is only appropriate if temp < 40f and windspeed > 3 mph
   */
  if ($decoded_metar['temp_f'] <= '40' &&
      $decoded_metar['wind_miles_per_hour'] > '3'){
    $decoded_metar['windchill_f'] =
      number_format(35.74 + 0.6215 * $decoded_metar['temp_f'] -
                    35.75 * pow((float)$decoded_metar['wind_miles_per_hour'], 0.16) +
                    0.4275 * $decoded_metar['temp_f'] *
                    pow((float)$decoded_metar['wind_miles_per_hour'],0.16));
    $decoded_metar['windchill_c'] =
      number_format(13.112 + 0.6215 * $decoded_metar['temp_c'] -
                    13.37 * pow(($decoded_metar['wind_miles_per_hour']/1.609), 0.16) +
                    0.3965 * $decoded_metar['temp_c'] * 
                    pow(($decoded_metar['wind_miles_per_hour']/1.609),0.16));
  }

  return $decoded_metar;
}
 
function update_metars_db() {
  /* Updates all the metars in the database. You should use it like
   * this:
   *
   * <?php
   * include('phpweather.inc');
   * register_shutdown_function('update_metars_db');
   * ?>
   *  
   * This will update all the metars *after* the script has
   * finished. This means that the user won't know that PHP is still
   * running, and most important, they won't have to wait when the
   * script fetches a new METAR, because it is done afterwards.
   *
   * You can pass en extra argument to get_metar(), so that it never
   * tries to fetch a new meter. This ensures that the page will load
   * quickly, but the weather might be a little old. If the user the
   * refreshed the page, the new weather will be shown.
   */

  global $useMySQL, $useDBM, $useDBA, $usePSQL, $conn, $dbmMetar, $dbmTimestamp;
  global $useXML, $XMLMetar, $XMLParser, $XMLFile;

  if ($useMySQL) {
    $query = "SELECT station FROM metars";
    $result = mysql_query($query);
    while (list($station) = mysql_fetch_row($result)) {
      fetch_metar($station, 0);
    }
  } elseif ($usePSQL) {
    $query = "SELECT station FROM metars";
    $result = pg_exec($conn,$query);
    $num=pg_numrows($result);
    if (pg_numrows($result)) {
      for ($i = 0; $i < $num; $i++) {
        list($station) = pg_fetch_row($result, $i);
        fetch_metar($station, 0);
      }
    }
  } elseif ($useDBM) {
    $station = dbmfirstkey($dbmMetar);
    while ($station) {
      fetch_metar($station, 0);
      $station = dbmnextkey($dbmMetar, $station);
    }
  } elseif ($useDBA) {
    $station = dba_firstkey($dbmMetar);
    while ($station) {
      fetch_metar($station, 0);
      $station = dba_nextkey($dbmMetar);
    }
  } elseif ($useOCI) {
    $query = "SELECT station FROM metars";
    $stmt = OCIParse($conn,$query);
    OCIExecute($stmt);
    $nrows = OCIFetchStatement($stmt,$results);
    if ( $nrows > 0 ) {
      for ($i = 0; $i < $nrows; $i++) {
        list($station) = $results[i];
        fetch_metar($station, 0);
      }
    }
  } elseif ($useXML) {
    // File Update here
    // Parse the XML
    ParseXML ($XMLParser, $XMLFile);
    
    reset ($XMLMetar);

    while (list ($station) = each ($XMLMetar)) {
      fetch_metar ($station, 0);
    }
  }
}

/*
 * XML Handling Tools
 */
function ParseXML($XMLParser, $XMLFile){
  // Open the file for reading
  $FileHandle = fopen($XMLFile, "r");
  
  // Suck the information out
  $XMLData = fread($FileHandle, filesize($XMLFile));
  
  // Close the file
  fclose($FileHandle);
  
  // Configure and create the parser
  $XMLParser = xml_parser_create();
  xml_set_element_handler($XMLParser,
                          'StartElementHandler',
                          'EndElementHandler');
  xml_parser_set_option ($XMLParser, XML_OPTION_CASE_FOLDING, 0);
  
  // Parse the file or die trying!
  if (!xml_parse($XMLParser, $XMLData)) {
    die(sprintf('XML error: %s at line %d',
                xml_error_string(xml_get_error_code($XMLParser)),
                xml_get_current_line_number($XMLParser)));
  }
  
  // Free the parser
  xml_parser_free ($XMLParser);
}

function StartElementHandler ($XMLParser, $ElementName, $ElementAttributes) {
  global $XMLMetar;

  // Is this a station?
  if ($ElementName == 'cache') {
    // Assign the data to the station array
    $XMLMetar[$ElementAttributes['station']] = $ElementAttributes;
  }
}

function EndElementHandler ($XMLParser, $ElementName) {
  // Do Nothing
}

function WriteXML($XMLMetar, $XMLFileData){
  // Set the environment
  reset ($XMLMetar);
  $Head = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<metardata>";
  $Foot = "\n</metardata>\n";

  // Open/Create the file for writing
  $FileHandle = fopen($XMLFileData, 'w');

  // Write the head
  fwrite($FileHandle, $Head, strlen ($Head));

  // Walk the stations and write them to the file
  while (list ($Station, $Info) = each ($XMLMetar)) {
    // Check for actual station value in array!
    if (!empty($Station)) {
      $CacheString = "\n\t<cache station=\"" . $Info['station'] .
        '" metar="' . $Info['metar'] .
        '" timestamp="' . $Info['timestamp'] . '" />';
      fwrite ($FileHandle, $CacheString, strlen ($CacheString));
    }
  }

  // Write the foot
  fwrite ($FileHandle, $Foot, strlen ($Foot));

  // Close the file
  fclose ($FileHandle);
}

?>
