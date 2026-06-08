<?php
/**
 * $Horde: turba/config/sources.php.dist,v 1.97.6.23 2007/01/12 17:49:57 jan Exp $
 *
 * This file is where you specify the sources of contacts available to users
 * at your installation. It contains a large number of EXAMPLES. Please
 * remove or comment out those examples that YOU DON'T NEED. There are a
 * number of properties that you can set for each server, including:
 *
 * title:       This is the common (user-visible) name that you want displayed
 *              in the contact source drop-down box.
 *
 * type:        The types 'ldap', 'sql', 'imsp' and 'prefs' are currently
 *              supported. Preferences-based address books are not intended
 *              for production installs unless you really know what you're
 *              doing - they are not searchable, and they won't scale well if
 *              a user has a large number of entries.
 *
 * params:      These are the connection parameters specific to the contact
 *              source. See below for examples of how to set these.
 *
 * Special params settings:
 *
 *   charset:       The character set that the backend stores data in. Many
 *                  LDAP servers use utf-8. Database servers typically use
 *                  iso-8859-1.
 *
 *   tls:           Only applies to LDAP servers. If true, then try to use a
 *                  TLS connection to the server.
 *
 *   scope:         Only applies to LDAP servers. Can be set to 'one' to
 *                  search one level of the LDAP directory, or 'sub' to search
 *                  all levels. 'one' will work for most setups and should be
 *                  much faster. However we default to 'sub' for backwards
 *                  compatibility.
 *
 *   checkrequired: Only applies to LDAP servers. If present, this value causes
 *                  the driver to consult the LDAP schema for any attributes
 *                  that are required by the given objectclass(es). Required
 *                  attributes will be provided automatically if the
 *                  'checkrequired_string' parameter is present.
 *
 *   checksyntax:   Only applies to LDAP servers. If present, this value causes
 *                  the driver to inspect the LDAP schema for particular
 *                  attributes by the type defined in the corresponding schema
 *
 *   dn:            Only applies to LDAP servers. Defines the list of LDAP
 *                  attributes that build a valid DN.
 *
 *   objectclass:   Only applies to LDAP servers. Defines a list of
 *                  objectclasses that the LDAP object must be a member of.
 *
 *   filter:        Filter helps to filter your result based on certain
 *                  condition in SQL and LDAP backends. A filter can be
 *                  specified to avoid some unwanted data. For example, if the
 *                  source is an external sql database, to select records with
 *                  the delete flag = 0:
 *                  'filter' = 'deleted=0'
 *
 * map:         This is a list of mappings from the Turba attribute names 
 *              (on the left) to the attribute names by which they are known
 *              in this contact source (on the right). Turba also supports
 *              composite fields. A composite field is defined by mapping
 *              the field name to an array containing a list of component
 *              fields and a format string (similar to a printf() format
 *              string). Here is an example:
 *              ...
 *              'name' => array('fields' => array('firstname', 'lastname'),
 *                              'format' => '%s %s'),
 *              'firstname' => 'object_firstname',
 *              'lastname' => 'object_lastname',
 *              ...
 *
 *              Standard Turba attributes are:
 *                __key     : A backend-specific ID for the entry (any value
 *                            as long as it is unique inside that source;
 *                            required)
 *                __uid     : Globally unique ID of the entry (used for
 *                            synchronizing and must be able to be set to any
 *                            value)
 *                __owner   : User name of the contact's owner
 *                __type    : Either 'Object' or 'Group'
 *                __members : Serialized PHP array with list of Group members.
 *              More Turba attributes are defined in config/attributes.php.
 *
 * tabs:        All fields can be grouped into tabs with this optional entry.
 *              This list is multidimensional hash, the keys are the tab
 *              titles.
 *              Here is an example:
 *              'tabs' => array(
 *                  'Names' => array('firstname', 'lastname', 'alias'),
 *                  'Addresses' => array('homeAddress', 'workAddress')
 *              );
 *
 * search:      A list of Turba attribute names that can be searched for this
 *              source.
 *
 * strict:      A list of native field/attribute names that must always be
 *              matched exactly in a search.
 *
 * export:      If set to true, this source will appear on the Export menu,
 *              allowing users to export the contacts to a CSV (etc.) file.
 *
 * browse:      If set to true, this source will be browseable via the Browse
 *              menu item, and empty searches against the source will return
 *              all contacts.
 *
 * use_shares:  If this is present and true, Horde_Share functionality will
 *              be enabled for this source - allowing users to share their
 *              personal address books as well as to create new ones. Since
 *              Turba only supports having one backend configured for
 *              creating new shares, use the 'shares' configuration option to
 *              specify which backend will be used for creating new shares.
 *              All permission checking will be done against Horde_Share, but
 *              note that any 'extended' permissions (such as max_contacts)
 *              will still be enforced. Also note that the backend driver
 *              must have support for using this. Currently SQL only.
 *
 * Here are some example configurations:
 */

/**
 * A local address book in an SQL database. This implements a private
 * per-user address book. Sharing of this source with other users may be
 * accomplished by enabling Horde_Share for this source by setting
 * 'use_shares' => true.
 *
 * Be sure to create a turba_objects table in your Horde database from the
 * schema in turba/scripts/db/turba.sql if you use this source.
 */
$cfgSources['localsql'] = array(
    'title' => _("My Address Book"),
    'type' => 'sql',
    // The default connection details are pulled from the Horde-wide SQL
    // connection configuration.
    //
    // The old example illustrates how to use an alternate database
    // configuration.
    //
    // New Example:
    'params' => array_merge($conf['sql'], array('table' => 'turba_objects')),

    // Old Example:
    // 'params' => array(
    //     'phptype' => 'mysql',
    //     'hostspec' => 'localhost',
    //     'username' => 'horde',
    //     'password' => '*****',
    //     'database' => 'horde',
    //     'table' => 'turba_objects',
    //     'charset' => 'iso-8859-1'
    // ),

    // Using two tables as datasource.
    // 'params' => array_merge($conf['sql'],
    //                         array('table' => 'leaddetails LEFT JOIN leadaddress ON leaddetails.leadid = leadaddress.leadaddressid',
    //                               'filter' => 'leaddetails.converted = 0')),
    'map' => array(
        '__key' => 'object_id',
        '__owner' => 'owner_id',
        '__type' => 'object_type',
        '__members' => 'object_members',
        '__uid' => 'object_uid',
        'name' => 'object_name',
        'email' => 'object_email',
        'alias' => 'object_alias',
        'homeAddress' => 'object_homeaddress',
        'workAddress' => 'object_workaddress',
        'homePhone' => 'object_homephone',
        'workPhone' => 'object_workphone',
        'cellPhone' => 'object_cellphone',
        'fax' => 'object_fax',
        'title' => 'object_title',
        'company' => 'object_company',
        'notes' => 'object_notes',
        'pgpPublicKey' => 'object_pgppublickey',
        'smimePublicKey' => 'object_smimepublickey',
        'freebusyUrl' => 'object_freebusyurl'
    ),
    'search' => array(
        'name',
        'email'
    ),
    'strict' => array(
        'object_id',
        'owner_id',
        'object_type',
    ),
    'export' => true,
    'browse' => true,
    'use_shares' => true,
);
