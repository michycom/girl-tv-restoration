#!/usr/bin/php -q
<?php
/**
 * $Horde: groupware/scripts/setup.php,v 1.12.2.1 2008/02/06 22:21:18 jan Exp $
 *
 * This script finishes the database setup for Horde Groupware.
 */

/**
 * Shows a prompt for a single configuration setting.
 *
 * @param array $config  The array that should contain the configuration
 *                       array in the end.
 * @param string $name   The name of the configuration setting.
 * @param array $field   A part of the parsed configuration tree as returned
 *                       from Horde_Config.
 */
function question(&$config, $name, $field)
{
    global $cli;

    $question = $field['desc'];
    $default = $field['default'];
    $values = null;
    if (isset($field['switch'])) {
        $values = array();
        foreach ($field['switch'] as $case => $case_field) {
            $values[$case] = $case_field['desc'];
        }
    } else {
        switch ($field['_type']) {
        case 'boolean':
            $values = array(true => 'Yes', false => 'No');
            $default = (int)$default;
            break;
        case 'enum':
            $values = $field['values'];
            break;
        }
        if (!empty($field['required'])) {
            $question .= '*';
        }
    }

    while (true) {
        $config[$name] = $cli->prompt($question, $values, $default);
        if (empty($field['required']) || $config[$name] !== '') {
            break;
        } else {
            $cli->writeln($cli->red('This field is required.'));
        }
    }

    if (isset($field['switch']) &&
        !empty($field['switch'][$config[$name]]['fields'])) {
        foreach ($field['switch'][$config[$name]]['fields'] as $sub => $sub_field) {
            question($config, $sub, $sub_field);
        }
    }
}

/**
 * Asks for the database settings and creates the SQL configuration.
 */
function config_db()
{
    global $conf;

    $sql_config = $GLOBALS['config']->_configSQL('');
    question($GLOBALS['sql'], 'phptype', $sql_config['switch']['custom']['fields']['phptype']);
    $conf['sql'] = $GLOBALS['sql'];
    if ($GLOBALS['bundle'] == 'webmail') {
        $conf['auth']['driver'] = 'application';
        $conf['auth']['params']['app'] = 'imp';
    } else {
        $conf['auth']['driver'] = 'sql';
    }
    $conf['prefs']['driver'] = 'sql';
    $conf['datatree']['driver'] = 'sql';
    $conf['token']['driver'] = 'sql';
    $conf['vfs']['driver'] = 'sql';

    write_config();
}

/**
 * Creates the database and/or tables.
 *
 * @param boolean $tables_only  Whether to create the tables only.
 */
function create_db($tables_only = false)
{
    global $conf, $cli, $registry;

    if (empty($conf['sql']['phptype'])) {
        config_db();
    }

    $mdb_supported = array('fbsql', 'ibase', 'mssql', 'mysql', 'mysqli', 'oci8', 'pgsql', 'querysim', 'sqlite');
    if (!in_array($conf['sql']['phptype'], $mdb_supported)) {
        $cli->message('Your database type is not supported for creating databases and tables automatically. Please see the manual at docs/INSTALL for how to setup the database manually.', 'cli.warning');
        return;
    }

    if ($tables_only) {
        $create_db = false;
    } else {
        $create_db = $cli->prompt("Should we create the database for you? If yes, you need to provide a database\nuser that has permissions to create new databases on your system. If no, we\nwill only create the database tables for you.", array('y' => 'Yes', 'n' => 'No'), 'y');
        $create_db = $create_db == 'y';
    }
    $db_user = $cli->prompt('Database user for creating the ' . ($create_db ? 'database' : 'tables') . ' if necessary for your database system:');
    $db_pass = $cli->prompt('Specify a password for the database user:');

    $sql = array_merge($conf['sql'],
                       array('username' => $db_user, 'password' => $db_pass));
    $db_name = $sql['database'];
    unset($sql['database'], $sql['charset']);

    // Create database from schemas.
    $cli->writeln('Loading database module...');
    require_once 'MDB2.php';
    $mdb2 = &MDB2::factory($sql);
    $manager = &$mdb2->loadModule('Manager');
    if ($create_db) {
        $databases = $manager->listDatabases();
        if (is_a($databases, 'PEAR_Error') &&
            $databases->getCode() != MDB2_ERROR_UNSUPPORTED) {
            $cli->message('Listing the current databases failed. Please see the manual at docs/INSTALL for how to setup the database manually. Error messages:', 'cli.error');
            $cli->writeln($databases->getMessage());
            $cli->writeln($databases->getUserInfo());
            return;
        }
        if (is_array($databases) && in_array($db_name, $databases)) {
            $cli->message('Database ' . $db_name . ' exists already, skipping.', 'cli.warning');
            $create_db = false;
        }
    }
    $cli->writeln('Creating database...');
    require_once 'MDB2/Schema.php';
    $schema = &MDB2_Schema::factory($sql);
    $success = $schema->updateDatabase(HORDE_BASE . '/scripts/sql/create.xml',
                                       false,
                                       array('create' => $create_db,
                                             'name' => $db_name));
    if (is_a($success, 'PEAR_Error')) {
        $cli->message('Creating the ' . ($create_db ? 'database' : 'tables') . ' failed. Please see the manual at docs/INSTALL for how to setup the database manually. Error messages:', 'cli.error');
        $cli->writeln($success->getMessage());
        $cli->writeln($success->getUserInfo());
    } else {
        $cli->message($create_db ? 'Successfully created the database.' : 'Successfully created the global tables.', 'cli.success');

        // Create application tables.
        foreach ($registry->listApps() as $application) {
            $schema_file = $registry->get('fileroot', $application) .
                '/scripts/sql/' . $application . '.xml';
            if (file_exists($schema_file)) {
                $success = $schema->updateDatabase($schema_file,
                                                   false,
                                                   array('name' => $db_name));
                if (is_a($success, 'PEAR_Error')) {
                    $cli->message(sprintf('Creating the tables for %s (%s) failed. Error messages:', $registry->get('name', $application), $application), 'cli.error');
                    $cli->writeln($success->getMessage());
                    $cli->writeln($success->getUserInfo());
                } else {
                    $cli->message(sprintf('Successfully created the tables for %s (%s).', $registry->get('name', $application), $application), 'cli.success');
                }
            }
        }
    }
}

/**
 * Asks for the administrator settings and creates the configuration.
 */
function config_admin()
{
    global $cli;

    if (empty($GLOBALS['conf']['sql']['phptype'])) {
        create_db();
    }

    if ($GLOBALS['bundle'] == 'webmail') {
        $admin_user = $cli->prompt('Specify a mail user who should have administrator permissions (optional):');
    } else {
        $sql = $GLOBALS['conf']['sql'];
        unset($sql['charset']);
        require_once 'MDB2.php';
        $mdb2 = &MDB2::factory($sql);
        $manager = &$mdb2->loadModule('Manager');
        $tables = $manager->listTables();
        if (is_a($tables, 'PEAR_Error')) {
            $cli->message('An error occured while trying to find the installed database tables. Error messages:', 'cli.error');
            $cli->writeln($tables->getMessage());
            $cli->writeln($tables->getUserInfo());
            return;
        }
        if (!in_array('horde_users', $tables)) {
            $cli->message('You didn\'t create the necessary database tables.', 'cli.warning');
            if ($cli->prompt('Do you want to create the tables now?', array('y' => 'Yes', 'n' => 'No'), 'y') == 'y') {
                create_db(true);
            } else {
                return;
            }
        }
        while (true) {
            $admin_user = $cli->prompt('Specify a user name for the administrator account:');
            if (empty($admin_user)) {
                $cli->writeln($cli->red('An administration user is required'));
                continue;
            }
            $admin_pass = $cli->prompt('Specify a password for the adminstrator account:');
            if (empty($admin_user)) {
                $cli->writeln($cli->red('An administrator password is required'));
            } else {
                require_once 'Horde/Auth.php';
                $auth = &Auth::singleton($GLOBALS['conf']['auth']['driver']);
                $exists = $auth->exists($admin_user);
                if (is_a($exists, 'PEAR_Error')) {
                    $cli->message('An error occured while trying to list the users. Error messages:', 'cli.error');
                    $cli->writeln($exists->getMessage());
                    $cli->writeln($exists->getUserInfo());
                    return;
                }
                if ($exists) {
                    if ($cli->prompt('This user exists already, do you want to update his password?', array('y' => 'Yes', 'n' => 'No'), 'y') == 'y') {
                        $result = $auth->updateUser($admin_user, $admin_user, array('password' => $admin_pass));
                    } else {
                        break;
                    }
                } else {
                    $result = $auth->addUser($admin_user, array('password' => $admin_pass));
                }
                if (is_a($result, 'PEAR_Error')) {
                    $cli->message('An error occured while adding or updating the adminstrator. Error messages:', 'cli.error');
                    $cli->writeln($result->getMessage());
                    $cli->writeln($result->getUserInfo());
                    return;
                }
                break;
            }
        }
        
    }

    $GLOBALS['conf']['auth']['admins'] = array($admin_user);
    write_config();
}

/**
 * Writes the current configuration to the conf.php file.
 */
function write_config()
{
    $php_config = $GLOBALS['config']->generatePHPConfig(new Variables(), $GLOBALS['conf']);
    $fp = fopen(HORDE_BASE . '/config/conf.php', 'w');
    if (!$fp) {
        $GLOBALS['cli']->message('Cannot write configuration file '. HORDE_BASE . '/config/conf.php', 'cli.error');
        exit;
    }
    fwrite($fp, $php_config);
    fclose($fp);

    // Reload configuration.
    include HORDE_BASE . '/config/conf.php';
    $GLOBALS['conf'] = $conf;
}

// No auth.
@define('AUTH_HANDLER', true);

// Find the base file path of Horde.
@define('HORDE_BASE', dirname(__FILE__) . '/..');

// Do CLI checks and environment setup first.
require_once HORDE_BASE . '/lib/core.php';
require_once 'Horde/CLI.php';

// Enable error reporting.
$error_level = E_ALL;
if (defined('E_STRICT')) {
    $error_level &= ~E_STRICT;
}
ini_set('error_reporting', $error_level);
ini_set('display_errors', 1);

// Make sure no one runs this from the web.
if (!Horde_CLI::runningFromCLI()) {
    exit("Must be run from the command line\n");
}

// Load the CLI environment - make sure there's no time limit, init some
// variables, etc.
$cli = &Horde_CLI::singleton();
$cli->init();

// Check if conf.php is writeable.
if ((file_exists(HORDE_BASE . '/config/conf.php') &&
     !is_writable(HORDE_BASE . '/config/conf.php')) ||
    !is_writable(HORDE_BASE . '/config')) {
    require_once 'Horde/Util.php';
    $cli->message(Util::realPath(HORDE_BASE . '/config/conf.php') . ' is not writable.', 'cli.warning');
}

// We need a valid conf.php to instantiate the registry.
$conf_created = false;
if (!file_exists(HORDE_BASE . '/config/conf.php')) {
    if (!is_writable(HORDE_BASE . '/config')) {
        exit(1);
    }
    copy(HORDE_BASE . '/config/conf.php.dist', HORDE_BASE . '/config/conf.php');
    $conf_created = true;
}

// Load libraries, instanticate objects.
require_once 'Horde/Config.php';
require_once 'Horde/Form.php';
require_once 'Horde/Form/Action.php';
require_once 'Horde/Variables.php';
$registry = &Registry::singleton();
$config = new Horde_Config('horde');
$bundle = is_dir(HORDE_BASE . '/imp') ? 'webmail' : 'groupware';
umask(0);
$conf['log']['enabled'] = false;

// Is this a first time run?
if ($conf_created) {
    $webroot = $cli->prompt('What is the web root path on your web server for this installation, i.e. the path of the address you use to access Horde Groupware Webmail Edition in your browser?', null, '/' . basename(dirname(dirname(__FILE__))));
    $conf['cookie']['path'] = $webroot;
    unlink(HORDE_BASE . '/config/conf.php');
}

// Main menu.
while (true) {
    $menu = $cli->prompt('Configuration Menu',
                         array('Exit', 'Configure database settings',
                               'Create database or tables',
                               'Configure administrator settings'));
    switch ($menu) {
    case 0:
        break 2;
    case 1:
        config_db();
        $cli->writeln($cli->bold('Done configuring database settings.'));
        $cli->writeln();
        break;
    case 2:
        create_db();
        $cli->writeln($cli->bold('Done creating database or tables.'));
        $cli->writeln();
        break;
    case 3:
        config_admin();
        $cli->writeln($cli->bold('Done configuring administrator settings.'));
        $cli->writeln();
        break;
    }
}

// Finished.
$cli->writeln($cli->bold('Thank you for using Horde Groupware Webmail Edition!'));
