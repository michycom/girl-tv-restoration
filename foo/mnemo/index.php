<?php
/**
 * $Horde: mnemo/index.php,v 1.10.10.4 2006/01/01 21:29:05 jan Exp $
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
$mnemo_configured = (@is_readable(MNEMO_BASE . '/config/conf.php') &&
                     @is_readable(MNEMO_BASE . '/config/prefs.php'));

if (!$mnemo_configured) {
    require MNEMO_BASE . '/../lib/Test.php';
    Horde_Test::configFilesMissing('Mnemo', MNEMO_BASE, array('conf.php', 'prefs.php'));
}

require MNEMO_BASE . '/list.php';
