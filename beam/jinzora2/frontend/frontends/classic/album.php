<?php if (!defined(JZ_SECURE_ACCESS)) die ('Security breach detected.');
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *    
	* JINZORA | Web-based Media Streamer  
	*
	* Jinzora is a Web-based media streamer, primarily desgined to stream MP3s 
	* (but can be used for any media file that can stream from HTTP). 
	* Jinzora can be integrated into a CMS site, run as a standalone application, 
	* or integrated into any PHP website.  It is released under the GNU GPL. 
	* 
	* Jinzora Author:
	* Ross Carlson: ross@jasbone.com 
	* http://www.jinzora.org
	* Documentation: http://www.jinzora.org/docs	
	* Support: http://www.jinzora.org/forum
	* Downloads: http://www.jinzora.org/downloads
	* License: GNU GPL <http://www.gnu.org/copyleft/gpl.html>
	* 
	* Contributors:
	* Please see http://www.jinzora.org/modules.php?op=modload&name=jz_whois&file=index
	*
	* Code Purpose: This page contains all the album related related functions
	* Created: 9.24.03 by Ross Carlson
	*
	* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

 	// This function displays all the Genres or Artists 
	function drawPage(&$node){
		global $media_dir, $jinzora_skin, $hierarchy, $album_name_truncate, $row_colors, 
		       $jz_MenuItemLeft, $jz_MenuSplit, $jz_MenuItemHover, $jz_MainItemHover, $jz_MenuItem,
			   $img_download, $img_more, $img_email, $img_play, $img_rate, $img_discuss, $num_other_albums, $include_path, $cms_mode;					
							
		// Let's setup the new display object
		$display = &new jzDisplay();
		$blocks = &new jzBlocks();
		$fe = &new jzFrontend();
		// Now let's display the header 
		
		// Let's include the menus
		$album = $node->getName();
		$artist = $node->getAncestor("artist");
		if (is_object($artist)) {
			$artist = $artist->getName();	
		} else {
			$artist = "";
		}
		
		echo '<br>';
		$blocks->blockBodyOpen();
		include_once($include_path. "frontend/menus/album-menu.php");
		// Now let's setup the row with the description and the art for the album
		?>
		<br>
		<table class="jz_track_table" width="100%" cellpadding="0" cellspacing="0" border="0">
			<tr>
				<td width="100%" valign="top">
				  <table width="100%">
				    <tr>
				      <td style="align: center;">
					      <?php
						      // Now let's get the art and description
						      if (($art = $node->getMainArt('200x200')) !== false) {
							      $display->playLink($node,$display->returnImage($art,$node->getName(),200,200,"fit",false,false,"left","5","5"));
						      }
					      ?>
                <?php
	  					    $year = $node->getYear();
                  if ($year <> "-" && $year <> ""){ $dispYear = " (". $year. ")"; } else { $dispYear = ""; }
    							$display->link($node, $display->returnShortName($node->getName(),$album_name_truncate) . $dispYear, $node->getName() . $dispYear, "jz_artist_album");
    							echo '<br>';
						      if ($cms_mode == "false"){
							      echo '<span class="jz_artistDesc">';
						      }
						      echo "<br/>";
						      echo $node->getDescription();
						      if ($cms_mode == "false"){
							      echo '</span>';
						      }						
      					?>
    					</td>
					    <?php
						    // Now let's get some other random images
						    if ($num_other_albums > 0) {
							    $parent = $node->getAncestor("artist");
							    if (!is_object($parent)) {
								    $parent = $node->getNaturalParent();
							    }
							    $nodes = $parent->getSubNodes("nodes",false,true,$num_other_albums,true); // randomized, only with art.
 		              echo "<td style=\"width: 300px; vertical-align: top;\">";
							    foreach ($nodes as $child) {
								    if ($child->getName() <> $node->getName()){	
									    $year = $child->getYear();
									    if ($year <> "-" && $year <> ""){ $dispYear = " (". $year. ")"; } else { $dispYear = ""; }
        							$display->link($child,$display->returnImage($child->getMainArt('100x100'),$child->getName(),100,100,"fit",false,false,"right","5","5"), $child->getName() . $dispYear);
								    }
							    }
                  echo "</td>";
						    }
					    ?>
				    </tr>
			    </table>
				</td>
			</tr>
		</table>
		<br>
		<?php
		
		// Now let's see if this is a multi-disc album
		$disks = $node->getSubNodes("nodes");
		$all_tracks = array();

		if (count($disks) > 0){
		  // Yep, it's a multi...
		  foreach ($disks as $disk) {
		    $disktracks = $disk->getSubNodes("tracks",-1);
		    sortElements($disktracks,"number");
		    
		    ob_start();
		    $display->playButton($disk);
		    $display->link($disk,"&nbsp;<strong>". $disk->getName()."</strong><br>");
		    
		    $header = ob_get_contents();
		    ob_end_clean();
		    
		    
		    // Now let's store the album name
		    $all_tracks[] = $header;
		    
		    // Now let's display the tracks for this album
		    foreach ($disktracks as $t) {
		      $all_tracks[] = $t;
		    }
		  }
		}

		// Now let's read all the tracks for this album
		$tracks = $node->getSubNodes("tracks");
		sortElements($tracks,"number");
		$all_tracks += $tracks;

		$blocks->trackTable($all_tracks, "album");
		$blocks->blockBodyClose();
	}
?>
