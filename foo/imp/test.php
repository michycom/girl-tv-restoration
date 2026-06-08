<?php
/**
 * $Horde: imp/test.php,v 1.33.6.13 2007/01/02 13:54:54 jan Exp $
 *
 * Copyright 2002-2007 Brent J. Nordquist <bjn@horde.org>
 * Copyright 1999-2007 Charles J. Hagenbuch <chuck@horde.org>
 * Copyright 1999-2007 Jon Parise <jon@horde.org>
 *
 * See the enclosed file COPYING for license information (LGPL).  If you
 * did not receive this file, see http://www.fsf.org/copyleft/lgpl.html.
 */

/* Include Horde's core.php file. */
include_once '../lib/core.php';

/* We should have loaded the String class, from the Horde_Util
 * package, in core.php. If String:: isn't defined, then we're not
 * finding some critical libraries. */
if (!class_exists('String')) {
    echo '<br /><span style="color: red; font-size: 18px; font-weight: bold;">The Horde_Util package was not found. If PHP\'s error_reporting setting is high enough, there should be error messages printed above that may help you in debugging the problem. If you are simply missing these files, then you need to get the <a href="http://cvs.horde.org/cvs.php/framework">framework</a> module from <a href="http://horde.org/source/">Horde CVS</a>, and install the packages in it with the install-packages.php script.</span>';
    exit;
}

/* Initialize the Horde_Test:: class. */
if (!(@is_readable('../lib/Test.php'))) {
    echo 'ERROR: You must install Horde before running this script.';
    exit;
}
require_once '../lib/Test.php';
$horde_test = &new Horde_Test;

/* IMP version. */
$module = 'IMP';
require_once './lib/version.php';
$module_version = IMP_VERSION;

require TEST_TEMPLATES . 'header.inc';
require TEST_TEMPLATES . 'version.inc';

/* Display versions of other Horde applications. */
$app_list = array(
    'gollem' => array(
        'error' => 'Gollem provides access to local VFS filesystems to attach files.',
        'version' => '1.0'
    ),
    'ingo' => array(
        'error' => 'Ingo provides basic mail filtering capabilities to IMP.',
        'version' => '1.0'
    ),
    'nag' => array(
        'error' => 'Nag allows tasks to be directly created from e-mail data.',
        'version' => '2.0'
    ),
    'turba' => array(
        'error' => 'Turba provides addressbook/contacts capabilities to IMP.',
        'version' => '2.0'
    )
);
$app_output = $horde_test->requiredAppCheck($app_list);

?>
<h1>Other Horde Applications</h1>
<ul>
    <?php echo $app_output ?>
</ul>
<?php

/* Display PHP Version information. */
$php_info = $horde_test->getPhpVersionInformation();
require TEST_TEMPLATES . 'php_version.inc';

/* PHP modules. */
$module_list = array(
    'imap' => array(
        'descrip' => 'IMAP Support',
        'error' => 'IMP requires the imap module to interact with the mail server.  It is required even if you only use pop3 access.',
        'fatal' => true
    ),
    'openssl' => array(
        'descrip' => 'OpenSSL Support',
        'error' => 'The openssl module is required to use S/MIME in IMP. Compile PHP with <code>--with-openssl</code> to activate.',
        'fatal' => false
    )
);

/* PHP settings. */
$setting_list = array(
    'file_uploads'  =>  array(
        'setting' => true,
        'error' => 'file_uploads must be enabled to use various features of IMP. See the INSTALL file for more information.'
    )
);

/* IMP configuration files. */
$file_list = array(
    'config/conf.php' => 'The file <code>./config/conf.php</code> appears to be missing. You must generate this file as an administrator via Horde.  See horde/docs/INSTALL.',
    'config/mime_drivers.php' => null,
    'config/prefs.php' => null,
    'config/servers.php' => null
);

/* PEAR modules. */
$pear_list = array(
    'HTTP_Request' => array(
        'path' => 'HTTP/Request.php',
        'error' => 'The HTML composition mode requires HTTP_Request.'
    ),
    'Auth_SASL' => array(
        'path' => 'Auth/SASL.php',
        'error' => 'If your IMAP server uses CRAM-MD5 or DIGEST-MD5 authentication, this module is required.'
    )
);

/* Get the status output now. */
$module_output = $horde_test->phpModuleCheck($module_list);
$setting_output = $horde_test->phpSettingCheck($setting_list);
$file_output = $horde_test->requiredFileCheck($file_list);
$pear_output = $horde_test->PEARModuleCheck($pear_list);

?>

<h1>PHP Module Capabilities</h1>
<ul>
    <?php echo $module_output ?>
</ul>

<h1>Miscellaneous PHP Settings</h1>
<ul>
    <?php echo $setting_output ?>
</ul>

<h1>Required IMP Configuration Files</h1>
<ul>
    <?php echo $file_output ?>
</ul>

<h1>PEAR</h1>
<ul>
    <?php echo $pear_output ?>
</ul>

<h1>PHP Mail Server Support Test</h1>
<?php

$server = isset($_POST['server']) ? $_POST['server'] : '';
$port = isset($_POST['port']) ? $_POST['port'] : '';
$user = isset($_POST['user']) ? $_POST['user'] : '';
$passwd = isset($_POST['passwd']) ? $_POST['passwd'] : '';
$type = isset($_POST['server_type']) ? $_POST['server_type'] : '';

if (!empty($server) && !empty($user) && !empty($passwd) && !empty($type)) {
    if ($type == 'pop') {
        $conn = array(
            'pop3/notls' => 110,
            'pop3/ssl' => 995,
            'pop3/ssl/novalidate-cert' => 995,
            'pop3/tls/novalidate-cert' => 110
        );
    } else {
        $conn = array(
            'imap/notls' => 143,
            'imap/ssl' => 993,
            'imap/ssl/novalidate-cert' => 993,
            'imap/tls/novalidate-cert' => 143
        );
    }

    $success = array();

    echo "<strong>Attempting to automatically determine the correct connection parameters for your server:</strong>\n";

    foreach ($conn as $key => $val) {
        $server_port = !empty($port) ? $port : $val;
        $mbname = '{' . $server . ':' . $server_port . '/' . $key . '}INBOX';
        echo "<ul><li><em>Trying protocol <tt>" . $key . "</tt>, Port <tt>" . $server_port . "</tt>:</em>\n<blockquote>\n";
        $mbox = @imap_open($mbname, $user, $passwd);
        if ($mbox) {
            $minfo = @imap_mailboxmsginfo($mbox);
            if ($minfo) {
                echo '<font color="green">SUCCESS</font> - INBOX has ', $minfo->Nmsgs, ' messages (' . $minfo->Unread, ' new ', $minfo->Recent, ' recent)';
                $success[] = array('server' => $server, 'protocol' => $key, 'port' => $server_port);
            } else {
                echo '<font color="red">ERROR</font> - The server returned the following error message:' . "\n" . '<pre>';
                foreach (imap_errors() as $error) {
                    echo wordwrap($error);
                }
                echo '</pre>';
            }
            @imap_close($mbox);
        } else {
            echo '<font color="red">ERROR</font> - The server returned the following error message:' . "\n" . '<pre>';
            foreach (imap_errors() as $error) {
                echo wordwrap($error);
            }
            echo '</pre>';
        }
        echo "</blockquote>\n</li></ul>\n";
    }

    if (!empty($success)) {
        echo "<strong>The following configurations were successful and may be used in your imp/config/servers.php file:</strong>\n";
        $i = 1;
        foreach ($success as $val) {
            echo "<blockquote><em>Configuration " . $i++ . "</em><blockquote><pre>";
            foreach ($val as $key => $entry) {
                echo "'" . $key . "' => '" . $entry . "'\n";
            }
            echo "</pre></blockquote></blockquote>\n";
        }

        if ($type == 'imap') {
            echo "<strong>The following IMAP server information was discovered from the remote server:</strong>\n";
            $config = reset($success);
            require_once './lib/IMAP/Client.php';
            $imapclient = &new IMP_IMAPClient($config['server'], $config['port'], $config['protocol']);
            $use_tls = $imapclient->useTLS();
            if (!is_a($use_tls, 'PEAR_Error')) {
                $res = $imapclient->login($user, $passwd);
            }
            if (isset($res) && !is_a($res, 'PEAR_Error')) {
                echo "<blockquote><em>Namespace Information</em><blockquote><pre>";
                $namespace = $imapclient->namespace();
                if (is_array($namespace)) {
                    foreach ($namespace as $val) {
                        echo "NAMESPACE: \"" . $val['name'] . "\"\n";
                        echo "DELIMITER: " . $val['delimiter'] . "\n";
                        echo "TYPE: " . $val['type'] . "\n\n";
                    }
                } else {
                    echo "Could not retrieve namespace information from IMAP server.\n";
                }
                echo "</pre></blockquote></blockquote>\n";

                echo "<blockquote><em>IMAP CHILDREN support:</em><blockquote><pre>";
                echo ($imapclient->queryCapability('CHILDREN')) ? 'SUPPORTED' : 'Not supported';
                echo "</pre></blockquote></blockquote>\n";

                echo "<blockquote><em>IMAP Charset Search Support:</em><blockquote><pre>";
                $charset = NLS::getCharset();
                if ($imapclient->searchCharset($charset)) {
                    echo "Server supports searching with the $charset character set.\n";
                } else {
                    echo "Server does not support searching with the $charset character set.\n";
                }
                echo "</pre></blockquote></blockquote>\n";
            } else {
                echo "<blockquote><em>Could not retrieve IMAP information from the remote server.</em></blockquote>";
            }
        }
    } else {
        echo "<strong>Could not determine a successful connection protocol.  Make sure your mail server is running and you have specified the correct port.</strong>\n";
    }
} else {
    ?>
<form name="form1" method="post" action="test.php">
<table>
<tr><td align="right">Server:</td><td><input type="text" name="server" /></td></tr>
<tr><td align="right">Port:</td><td><input type="text" name="port" /></td><td>(If non-standard port; leave blank to auto-detect using standard ports)</td></tr>
<tr><td align="right">User:</td><td><input type="text" name="user" /></td></tr>
<tr><td align="right">Password:</td><td><input type="password" name="passwd" /></td></tr>
<tr><td align="right">Server Type:</td><td><select name="server_type"><option value="imap">IMAP</option><option value="pop">POP</option></select></td></tr>
<tr><td></td><td><input type="submit" name="f_submit" value="Submit" /><input type="reset" name="f_reset" value="Reset" /></td></tr>
</table>
</form>
<?php } ?>

<?php
require TEST_TEMPLATES . 'footer.inc';
