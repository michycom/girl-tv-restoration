<?php if (!defined(JZ_SECURE_ACCESS)) die ('Security breach detected.');
	// Now let's see if we should show the jukebox iframe
	global $jzUSER,$jukebox_display;
	$smarty->assign('jukebox_queue', false);
  if (checkPermission($jzUSER,"jukebox_queue") && $jukebox_display != "small" && $jukebox_display != "off" and $cms_mode == "false"){
		$smarty->assign('jukebox_queue', true);
		if ($jukebox_display == "small" or $jukebox_display == "minimal"){
			$smarty->assign('jukebox_display', "small");
		} else {
			$smarty->assign('jukebox_display', "full");
		}
		jzTemplate($smarty, "jukebox-wrapper");
	}	
?>
