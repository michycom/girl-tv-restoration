<?php
/**
 * $Horde: horde/services/portal/index.php,v 1.39.10.9 2007/03/09 17:27:36 jan Exp $
 *
 * Copyright 2003-2007 Mike Cochrane <mike@graftonhall.co.nz>
 *
 * See the enclosed file COPYING for license information (LGPL). If you
 * did not receive this file, see http://www.fsf.org/copyleft/lgpl.html.
 */

@define('HORDE_BASE', dirname(__FILE__) . '/../..');
require_once HORDE_BASE . '/lib/base.php';
require_once 'Horde/Block/Collection.php';
require_once 'Horde/Block/Layout/View.php';
require_once 'Horde/Identity.php';

if (!Auth::isAuthenticated()) {
    Horde::authenticationFailureRedirect();
}

// Get full name for title
$identity = &Identity::singleton();
$fullname = $identity->getValue('fullname');
if (empty($fullname)) {
    $fullname = Auth::getAuth();
}

// Get refresh interval.
if ($prefs->getValue('summary_refresh_time')) {
    $refresh_time = $prefs->getValue('summary_refresh_time');
    $refresh_url = Horde::applicationUrl('services/portal/');
}

// Load layout from preferences.
$layout_pref = $prefs->getValue('portal_layout');
if (!$layout_pref || $layout_pref == 'a:0:{}') {
    $layout_pref = Horde_Block_Collection::getFixedBlocks();
}
$view = new Horde_Block_Layout_View($layout_pref);
$layout_html = $view->toHtml();
$cssApps = $view->getApplications();
$linkTags = $view->getLinkTags();

$title = _("My Portal");
require HORDE_TEMPLATES . '/common-header.inc';
require HORDE_TEMPLATES . '/portal/menu.inc';
$notification->notify(array('listeners' => 'status'));
echo $layout_html;
require HORDE_TEMPLATES . '/common-footer.inc';
