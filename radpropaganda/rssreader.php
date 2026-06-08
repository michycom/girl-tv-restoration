<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<title>RSS Reader</title>
<meta name="title" content="RSS Reader">
<meta http-equiv="content-language" content="de-at">
<meta http-equiv="content-type" content="text/html; charset=iso-8859-1">
<link rel=stylesheet type="text/css" href="rssreader.css">
</head>
<body>


<?php
  // Feed display settings
  $Feed_NoTitle = "No title";
  $Feed_MaxItems = 7; // To show all feed items, set $Feed_MaxItems to "-1".
  $Feed_ShowInfo = false;
  $Feed_ShowDescription = true;
  $Feed_RSS_ShowEnclosure = false;
  
  // Show feed
  ShowFeed("http://radpropaganda.org/feed/");
?>

</body>
</html>

<?php
/*

####################
## RSS Reader 1.3 ##
####################

*** LIZENZVERTRAG ***

Pflichten und Einschränkungen
-----------------------------

Der Vermerk "Powered by RSS Reader" und der Link zu "http://www.gaijin.at/"
dürfen nicht entfernt, verändert oder unkenntlicht gemacht werden und müssen gut
sichtbar an unveränderter Position angezeigt werden.

Der Quellcode des Scripts darf nicht verkauft, oder sonst, kostenlos oder gegen
ein Entgelt weitergegeben, oder in irgendeiner Weise veröffentlicht werden.
Dies gilt speziell für die Veröffentlichung im Internet, auf sog. Heft-CDs oder
anderen Software-Sammlungen.


Benutzungsrechte
----------------

Das Script darf kostenlos für private Zwecke genutzt werden. Die Verwendung des
Scripts auf kommerziellen Seiten oder die kommerzielle Verwendung des Scripts
(z.B. durch Webdesigner) ist ohne ausdrückliche Genehmigung durch den Autor
verboten.

Alle anderen Rechte, einschließlich des Veröffentlichungsrechts, bleiben beim
Autor.

Es besteht kein Recht auf Support oder sonstige Hilfestellung durch den Autor.

Das Script kann an die persönlichen Erfordernisse angepasst werden. Der
Copyright-Vermerk und der Link zu "http://www.gaijin.at/" müssen in der unter
"Pflichten und Einschränkungen" angegebenen Form erhalten bleiben.

Zuwiderhandlungen gegen Bestimmungen dieses Lizenzvertrages können
strafrechtlich und zivilrechtlich verfolgt werden.


Haftungsausschluss
------------------

Die Verwendung des Scripts erfolgt auf eigene Verantwortung. Der Autor
übernimmt keine Haftung für die Richtigkeit und Funktionsfähigkeit des Scripts.
Der Autor haftet weder für direkte, noch für indirekte Schäden, die durch das
Script entstanden sind. Dies umfasst vor allem, aber nicht ausschließlich,
Schäden an der Hardware, am Betriebssystem oder an anderen Programmen, sowie
die Beeinträchtigung des Geschäftsbetriebes.


Ausnahmen
---------

Die Erteilung einer Ausnahme von den Bestimmungen dieses Lizenzvertrages
erfordert eine ausdrückliche Genehmigung des Autors, die ggf. per E-Mail
erteilt wird.

Wenn Sie Fragen zur Lizenz haben, oder eine Ausnahmegenhemigung wünschen,
senden Sie bitte eine E-Mail an: <info@gaijin.at>

*/

// #############################################################################

function ShowFeed($RssFeedFile) {
  $XmlRoot = ParseXmlFile($RssFeedFile);
  if ($XmlRoot) {
    if (strtolower($XmlRoot->name) == "rss") {
      ShowFeed_RSS($XmlRoot);
    } else if (strtolower($XmlRoot->name) == "feed") {
      ShowFeed_Atom($XmlRoot);
    } else if (strtolower($XmlRoot->name) == "rdf:rdf") {
      ShowFeed_RDF($XmlRoot);
    } else if (strtolower($XmlRoot->name) == "smf:xml-feed") {
      ShowFeed_SMFXMLFEED($XmlRoot, "http://www.your-smf-forum.tld/", "Forum title", "Your SMF...");
    }
  }
}

// #############################################################################

function ShowFeed_RSS($XmlRoot) {
  global $Feed_NoTitle;
  global $Feed_RSS_ShowEnclosure;
  global $Feed_MaxItems;
  global $Feed_ShowInfo;
  global $Feed_ShowDescription;

  $title = GetFirstChildContentByPath($XmlRoot, "channel/title");
  $link = GetFirstChildContentByPath($XmlRoot, "channel/link");
  $desc = GetFirstChildContentByPath($XmlRoot, "channel/description");
  
  if (!$title) $title = $Feed_NoTitle;
  if ($link) {
    $outTitle = '<a href="'.$link.'" target="_blank" class="rsslink"><span class="rssitemtitle">'.$title.'</span></a>';
  } else {
    $outTitle = '<span class="rssitemnolinktitle">'.$title.'</span>';
  }

  echo '<div class="rsstitlebox">';
  echo $outTitle.'<br>'.$desc;
  echo "</div>\n";
  
  $nodelist = GetChildrenByPathAndName($XmlRoot, "channel", "item");
  if (!$nodelist) return 0;
  
  $iItemCount = 0;
  foreach ($nodelist as $nl) {
    if ($Feed_MaxItems > -1) if ($iItemCount >= $Feed_MaxItems) break;

    $title = GetFirstChildContentByName($nl, "title");
    $link = GetFirstChildContentByName($nl, "link");
    $desc = GetFirstChildContentByName($nl, "description");
    $creator = GetFirstChildContentByName($nl, "author");
    if (!$creator) $creator = GetFirstChildContentByName($nl, "dc:creator");
    $pubdate = GetFirstChildContentByName($nl, "pubDate");
    if (!$pubdate) $pubdate = GetFirstChildContentByName($nl, "dc:date");
    if ($pubdate) $pubdate = strtotime($pubdate);
    if ($pubdate) {
			if (strftime("%H%M%S", $pubdate) == "000000") {
			  $pubdate = strftime("%d.%m.%Y", $pubdate);
			} else {
				$pubdate = strftime("%d.%m.%Y %H:%M:%S", $pubdate);
			}
    }
    
    if (!$title) $title = $Feed_NoTitle;
    if ($link) {
      $outTitle = '<a href="'.$link.'" target="_blank" class="rsslink"><span class="rssitemtitle">'.$title.'</span></a>';
    } else {
      $outTitle = '<span class="rssitemnolinktitle">'.$title.'</span>';
    }

    $outInfo = $creator;
    if ( ($creator != "") && ($pubdate != "") ) $outInfo .= " @ ";
    $outInfo .= $pubdate;
    if ($outInfo != "") $outInfo = ' <span class="rssiteminfo">('.$outInfo.')</span>';
    
    if ($Feed_RSS_ShowEnclosure) {
      $encl = "";
      $enclNode = GetFirstChildByName($nl, "enclosure");
      if ($enclNode) {
        $enclUrl = GetAttribByName($enclNode, "url");
        $enclLen = intval(GetAttribByName($enclNode, "length"));
        $enclTyp = GetAttribByName($enclNode, "type");
        
        $path_parts = pathinfo($enclUrl);
        $enclFile = urldecode($path_parts["filename"].'.'.$path_parts["extension"]);

        if ($enclLen >= 1000 * 1024) {
          $enclLen = $enclLen / 1024 / 1024;
          $enclLenOut = ' ('.number_format($enclLen, 2, ',', '.').' MB)';
        } else if ($enclLen > 0) {
          $enclLen = $enclLen / 1024;
          $enclLenOut = ' ('.number_format($enclLen, 0, ',', '.').' KB)';
        } else {
          $enclLenOut = "";
        }
        
        $encl = '<div class="rssenclosure"><a href="'.$enclUrl.'" target="_blank" class="rsslink">'.$enclFile.'</a>'.$enclLenOut.'</div>';
      }
    }
    
    echo '<div class="rssitembox">';
    echo $outTitle;
    if ($Feed_ShowInfo) echo $outInfo;
    if ($Feed_ShowDescription) echo '<div class=rssdescription>'.$desc.'</div>';
    if ($Feed_RSS_ShowEnclosure) echo $encl;
    echo "<div style=\"clear:both;\"></div></div>\n";
    
    $iItemCount++;
  }
  
  // Das Entfernen oder Ändern der nachfolgenden Zeile ist nur mit ausdrücklicher Genhmigung des Autors gestattet!
  echo '<p><small>Powered by <a href="http://www.gaijin.at/" target="_blank"><b>RSS Reader</b></a>(<a href="http://www.gaijin.at/" target="_blank">www.gaijin.at</a>)</small></p>';
}

// #############################################################################

function ShowFeed_Atom($XmlRoot) {
  global $Feed_NoTitle;
  global $Feed_RSS_ShowEnclosure;
  global $Feed_MaxItems;
  global $Feed_ShowInfo;
  global $Feed_ShowDescription;

  $title = GetFirstChildContentByPath($XmlRoot, "title");
  $link = GetFirstChildContentByPath($XmlRoot, "link");
  $desc = GetFirstChildContentByPath($XmlRoot, "subtitle");
  
  if (!$title) $title = $Feed_NoTitle;
  if ($link) {
    $outTitle = '<a href="'.$link.'" target="_blank" class="rsslink"><span class="rssitemtitle">'.$title.'</span></a>';
  } else {
    $outTitle = '<span class="rssitemnolinktitle">'.$title.'</span>';
  }

  echo '<div class="rsstitlebox">';
  echo $outTitle.'<br>'.$desc;
  echo "</div>\n";
  
  $nodelist = GetChildrenByPathAndName($XmlRoot, "", "entry");
  if (!$nodelist) return 0;
  
  $iItemCount = 0;
  foreach ($nodelist as $nl) {
    if ($Feed_MaxItems > -1) if ($iItemCount >= $Feed_MaxItems) break;

    $title = GetFirstChildContentByName($nl, "title");
    $link = GetFirstChildContentByName($nl, "link");
    $desc = GetFirstChildContentByName($nl, "summary");
    $creator = GetFirstChildContentByPath($nl, "author/name");
    $pubdate = GetFirstChildContentByName($nl, "updated");
    if (!$pubdate) $pubdate = GetFirstChildContentByName($nl, "modified");
    if (!$pubdate) $pubdate = GetFirstChildContentByName($nl, "created");
    if ($pubdate) $pubdate = strtotime($pubdate);
    if ($pubdate) {
			if (strftime("%H%M%S", $pubdate) == "000000") {
			  $pubdate = strftime("%d.%m.%Y", $pubdate);
			} else {
				$pubdate = strftime("%d.%m.%Y %H:%M:%S", $pubdate);
			}
    }
    
    if (!$title) $title = $Feed_NoTitle;
    if ($link) {
      $outTitle = '<a href="'.$link.'" target="_blank" class="rsslink"><span class="rssitemtitle">'.$title.'</span></a>';
    } else {
      $outTitle = '<span class="rssitemnolinktitle">'.$title.'</span>';
    }

    $outInfo = $creator;
    if ( ($creator != "") && ($pubdate != "") ) $outInfo .= " @ ";
    $outInfo .= $pubdate;
    if ($outInfo != "") $outInfo = ' <span class="rssiteminfo">('.$outInfo.')</span>';
        
    echo '<div class="rssitembox">';
    echo $outTitle;
    if ($Feed_ShowInfo) echo $outInfo;
    if ($Feed_ShowDescription) echo '<div class=rssdescription>'.$desc.'</div>';
    echo "<div style=\"clear:both;\"></div></div>\n";
    
    $iItemCount++;
  }
  
  // Das Entfernen oder Ändern der nachfolgenden Zeile ist nur mit ausdrücklicher Genhmigung des Autors gestattet!
  echo '<p>Powered by <a href="http://www.gaijin.at/" target="_blank"><b>RSS Reader</b></a> <small>(<a href="http://www.gaijin.at/" target="_blank">www.gaijin.at</a>)</small></p>';
}

// #############################################################################

function ShowFeed_RDF($XmlRoot) {
  global $Feed_NoTitle;
  global $Feed_MaxItems;
  global $Feed_ShowInfo;
  global $Feed_ShowDescription;

  $title = GetFirstChildContentByPath($XmlRoot, "channel/title");
  $link = GetFirstChildContentByPath($XmlRoot, "channel/link");
  $desc = GetFirstChildContentByPath($XmlRoot, "channel/description");
  
  if (!$title) $title = $Feed_NoTitle;
  if ($link) {
    $outTitle = '<a href="'.$link.'" target="_blank" class="rsslink"><span class="rssitemtitle">'.$title.'</span></a>';
  } else {
    $outTitle = '<span class="rssitemnolinktitle">'.$title.'</span>';
  }

  echo '<div class="rsstitlebox">';
  echo $outTitle.'<br>'.$desc;
  echo "</div>\n";

  $nodelist = $XmlRoot->children;
  if (!$nodelist) return 0;
  
  $iItemCount = 0;
  foreach ($nodelist as $nl) {
    if ($Feed_MaxItems > -1) if ($iItemCount >= $Feed_MaxItems) break;
    if (strtolower($nl->name) != "item") continue;
    
    $title = GetFirstChildContentByName($nl, "title");
    $link = GetFirstChildContentByName($nl, "link");
    $desc = GetFirstChildContentByName($nl, "description");
    $creator = GetFirstChildContentByName($nl, "author");
    $creator = GetFirstChildContentByName($nl, "dc:creator");
    $pubdate = GetFirstChildContentByName($nl, "pubDate");
    if (!$pubdate) $pubdate = GetFirstChildContentByName($nl, "dc:date");
    if ($pubdate != "") intval($pubdate = strtotime($pubdate));
    if ($pubdate > 0) $pubdate = strftime("%d.%m.%Y", $pubdate); else $pubdate = "";
    
    if (!$title) $title = $Feed_NoTitle;
    if ($link) {
      $outTitle = '<a href="'.$link.'" target="_blank" class="rsslink"><span class="rssitemtitle">'.$title.'</span></a>';
    } else {
      $outTitle = '<span class="rssitemnolinktitle">'.$title.'</span>';
    }

    $outInfo = $creator;
    if ( ($creator != "") && ($pubdate != "") ) $outInfo .= " @ ";
    $outInfo .= $pubdate;
    if ($outInfo != "") $outInfo = ' <span class="rssiteminfo">('.$outInfo.')</span>';
    
    echo '<div class="rssitembox">';
    echo $outTitle;
    if ($Feed_ShowInfo) echo $outInfo;
    if ($Feed_ShowDescription) echo '<div class=rssdescription>'.$desc.'</div>';
    echo "<div style=\"clear:both;\"></div></div>\n";
    
    $iItemCount++;
  }
  
  // Das Entfernen oder Ändern der nachfolgenden Zeile ist nur mit ausdrücklicher Genhmigung des Autors gestattet!
  echo '<p>Powered by <a href="http://www.gaijin.at/" target="_blank"><b>RSS Reader</b></a> <small>(<a href="http://www.gaijin.at/" target="_blank">www.gaijin.at</a>)</small></p>';
}

// #############################################################################

function ShowFeed_SMFXMLFEED($XmlRoot, $link, $title, $desc) {
  global $Feed_NoTitle;
  global $Feed_MaxItems;
  global $Feed_ShowInfo;
  global $Feed_ShowDescription;

  if (!$title) $title = $Feed_NoTitle;
  if ($link) {
    $outTitle = '<a href="'.$link.'" target="_blank" class="rsslink"><span class="rssitemtitle">'.$title.'</span></a>';
  } else {
    $outTitle = '<span class="rssitemnolinktitle">'.$title.'</span>';
  }

  echo '<div class="rsstitlebox">';
  echo $outTitle.'<br>'.$desc;
  echo "</div>\n";

  $nodelist = $XmlRoot->children;
  if (!$nodelist) return 0;
  
  $iItemCount = 0;
  foreach ($nodelist as $nl) {
    if ($Feed_MaxItems > -1) if ($iItemCount >= $Feed_MaxItems) break;
    
    $title = GetFirstChildContentByName($nl, "subject");
    $link = GetFirstChildContentByPath($nl, "link");
    $desc = GetFirstChildContentByName($nl, "body");
    $poster = GetFirstChildContentByPath($nl, "poster/name");
    $posterlink = GetFirstChildContentByPath($nl, "poster/link");
    
    if (!$title) $title = $Feed_NoTitle;
    if ($link) {
      $outTitle = '<a href="'.$link.'" target="_blank" class="rsslink"><span class="rssitemtitle">'.$title.'</span></a>';
    } else {
      $outTitle = '<span class="rssitemnolinktitle">'.$title.'</span>';
    }

    if ( ($poster != "") && ($posterlink != "") ) $poster = '<a href="'.$posterlink.'" class="rsslink">'.$poster.'</a>';
    $pubdate = GetFirstChildContentByName($nl, "time");
    $outInfo = $poster;
    if ( ($poster != "") && ($pubdate != "") ) $outInfo .= " @ ";
    $outInfo .= $pubdate;
    if ($outInfo != "") $outInfo = ' <span class="rssiteminfo">('.$outInfo.')</span>';

    echo '<div class="rssitembox">';
    echo $outTitle;
    if ($Feed_ShowInfo) echo $outInfo;
    if ($Feed_ShowDescription) echo '<div class=rssdescription>'.$desc.'</div>';
    echo "<div style=\"clear:both;\"></div></div>\n";
    
    $iItemCount++;
  }
  
  // Das Entfernen oder Ändern der nachfolgenden Zeile ist nur mit ausdrücklicher Genhmigung des Autors gestattet!
  echo '<p>Powered by <a href="http://www.gaijin.at/" target="_blank"><b>RSS Reader</b></a> <small>(<a href="http://www.gaijin.at/" target="_blank">www.gaijin.at</a>)</small></p>';
}

// #############################################################################

function GetAttribByName($XmlNode, $sName, $bCase = false) {
  if (!$bCase) $sName = strtolower($sName);
  if (!$bCase) $aAttributes = array_change_key_case($XmlNode->attributes, CASE_LOWER);
  if (isset($aAttributes[$sName])) return $aAttributes[$sName]; else return false;
}

// #############################################################################

function GetChildrenByPathAndName($XmlRoot, $sPath, $sName, $bCase = false) {
  $oRes = array();
  $oNode = $XmlRoot;
  
  if ($sPath != "") {
		$aPath = GetPath($sPath);
		foreach ($aPath as $p) {
			$oNode = GetFirstChildByName($oNode, $p);
			if (!$oNode) return false;
		}
  }
  
  foreach ($oNode->children as $c) {
    if ($bCase) {
      if (strcmp($c->name, $sName) == 0) $oRes[count($oRes)] = $c;
    } else {
      if (strcasecmp($c->name, $sName) == 0) $oRes[count($oRes)] = $c;
    }
  }
  return $oRes;
}

// #############################################################################

function GetChildrenByPath($XmlRoot, $sPath, $bCase = false) {
  $aPath = GetPath($sPath);
  $oNode = $XmlRoot;
  foreach ($aPath as $p) {
    $oNode = GetFirstChildByName($oNode, $p, $bCase);
    if (!$oNode) return false;
  }
  return $oNode->children;
}

// #############################################################################

function GetFirstChildContentByPath($XmlRoot, $sPath, $bCase = false) {
  $oNode = GetFirstChildByPath($XmlRoot, $sPath, $bCase);
  if ($oNode) return $oNode->content; else return "";
}

// #############################################################################

function GetFirstChildByPath($XmlRoot, $sPath, $bCase = false) {
  $aPath = GetPath($sPath);
  $oNode = $XmlRoot;
  foreach ($aPath as $p) {
    $oNode = GetFirstChildByName($oNode, $p, $bCase);
    if (!$oNode) return false;
  }
  return $oNode;
}

// #############################################################################

function GetFirstChildContentByName($oParent, $sName, $bCase = False) {
  $oNode = GetFirstChildByName($oParent, $sName, $bCase);
  if ($oNode) return $oNode->content; else return "";
}

// #############################################################################

function GetFirstChildByName($oParent, $sName, $bCase = false) {
  if (count($oParent->children) < 1) return 0;
  if ($bCase) $sName = strtolower($sName);
  foreach ($oParent->children as $c) {
    if ($bCase) {
      if (strcmp($c->name, $sName) == 0) return $c;
    } else {
      if (strcasecmp($c->name, $sName) == 0) return $c;
    }
  }
  return false;
}

// #############################################################################

function GetPath($sPath, $iMax = 32) {
  return split("/", $sPath, $iMax);
}

// #############################################################################

class XmlElement {
  var $name;
  var $attributes;
  var $content;
  var $children;
};

// #############################################################################

function ParseXmlFile($sFileName) {
  $handle = @fopen($sFileName, "rb");
  $xml = '';
  if (!$handle) return false;
  while (!feof($handle)) {
    $xml .= fread($handle, 4096);
  }
  fclose($handle);

  $parser = xml_parser_create();
  xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0);
  xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 1);
  xml_parser_set_option($parser, XML_OPTION_TARGET_ENCODING, "ISO-8859-1");
  xml_parse_into_struct($parser, $xml, $tags);
  xml_parser_free($parser);

  $elements = array();
  $stack = array();
  $iItemCount = 0;
  foreach ($tags as $tag) {
   $index = count($elements);
   if ( ($tag['type'] == "complete") || ($tag['type'] == "open") ) {
     $elements[$index] = new XmlElement;
     if (isset($tag['tag'])) $elements[$index]->name = $tag['tag'];
     if (isset($tag['attributes'])) $elements[$index]->attributes = $tag['attributes'];
     if (isset($tag['value'])) $elements[$index]->content = $tag['value'];
     if ($tag['type'] == "open") {
       $elements[$index]->children = array();
       $stack[count($stack)] = &$elements;
       $elements = &$elements[$index]->children;
     }
   }
   if ($tag['type'] == "close") {
     $elements = &$stack[count($stack) - 1];
     unset($stack[count($stack) - 1]);
   }
  }
  return $elements[0];
}

// #############################################################################

?>
