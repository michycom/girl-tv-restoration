<?php
/**
 * $Horde: mnemo/search.php,v 1.9.8.4 2006/01/01 21:29:05 jan Exp $
 *
 * Copyright 2001-2006 Jon Parise <jon@horde.org>
 *
 * See the enclosed file LICENSE for license information (ASL). If you
 * did not receive this file, see http://www.horde.org/licenses/asl.php.
 *
 * @author  Jon Parise <jon@horde.org>
 * @since   Mnemo 1.0
 * @package Mnemo
 */

@define('MNEMO_BASE', dirname(__FILE__));
require_once MNEMO_BASE . '/lib/base.php';
$title = _("Search");
require MNEMO_TEMPLATES . '/common-header.inc';
require MNEMO_TEMPLATES . '/menu.inc';
require MNEMO_TEMPLATES . '/search/search.inc';
require $registry->get('templates', 'horde') . '/common-footer.inc';
