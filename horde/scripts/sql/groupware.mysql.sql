-- $Horde: horde/scripts/sql/create.mysql.sql,v 1.4.6.10 2007/09/27 22:36:49 jan Exp $
--
-- If you are installing Horde for the first time, you can simply
-- direct this file to mysql as STDIN:
--
-- $ mysql --user=root --password=<MySQL-root-password> < create.mysql.sql
--
-- If you are upgrading from a previous version, you will need to comment
-- out the the user creation steps below, as well as the schemas for any
-- tables that already exist.
--
-- If you choose to grant permissions manually, note that with MySQL, PEAR DB
-- emulates sequences by automatically creating extra tables ending in _seq,
-- so the MySQL "horde" user must have CREATE privilege on the "horde"
-- database.
--
-- If you are upgrading from Horde 1.x, the Horde tables you have from
-- that version are no longer used; you may wish to either delete those
-- tables or simply recreate the database anew.

USE mysql;

REPLACE INTO user (host, user, password)
    VALUES (
        'localhost',
        'horde',
-- IMPORTANT: Change this password!
        PASSWORD('horde')
);

REPLACE INTO db (host, db, user, select_priv, insert_priv, update_priv,
                 delete_priv, create_priv, drop_priv, index_priv)
    VALUES (
        'localhost',
        'horde',
        'horde',
        'Y', 'Y', 'Y', 'Y',
        'Y', 'Y', 'Y'
);

-- Make sure that priviliges are reloaded.
FLUSH PRIVILEGES;

-- MySQL 3.23.x appears to have "CREATE DATABASE IF NOT EXISTS" and
-- "CREATE TABLE IF NOT EXISTS" which would be a nice way to handle
-- reinstalls gracefully (someday).  For now, drop the database
-- manually to avoid CREATE errors.
CREATE DATABASE horde;

USE horde;

CREATE TABLE horde_users (
    user_uid                    VARCHAR(255) NOT NULL,
    user_pass                   VARCHAR(255) NOT NULL,
    user_soft_expiration_date   INT,
    user_hard_expiration_date   INT,

    PRIMARY KEY (user_uid)
);

CREATE TABLE horde_prefs (
    pref_uid        VARCHAR(200) NOT NULL,
    pref_scope      VARCHAR(16) NOT NULL DEFAULT '',
    pref_name       VARCHAR(32) NOT NULL,
    pref_value      LONGTEXT NULL,

    PRIMARY KEY (pref_uid, pref_scope, pref_name)
);

CREATE INDEX pref_uid_idx ON horde_prefs (pref_uid);
CREATE INDEX pref_scope_idx ON horde_prefs (pref_scope);

CREATE TABLE horde_datatree (
       datatree_id INT NOT NULL,
       group_uid VARCHAR(255) NOT NULL,
       user_uid VARCHAR(255) NOT NULL,
       datatree_name VARCHAR(255) NOT NULL,
       datatree_parents VARCHAR(255) NOT NULL,
       datatree_order INT,
       datatree_data TEXT,
       datatree_serialized SMALLINT DEFAULT 0 NOT NULL,

       PRIMARY KEY (datatree_id)
);

CREATE INDEX datatree_datatree_name_idx ON horde_datatree (datatree_name);
CREATE INDEX datatree_group_idx ON horde_datatree (group_uid);
CREATE INDEX datatree_user_idx ON horde_datatree (user_uid);
CREATE INDEX datatree_serialized_idx ON horde_datatree (datatree_serialized);

CREATE TABLE horde_datatree_attributes (
    datatree_id INT NOT NULL,
    attribute_name VARCHAR(255) NOT NULL,
    attribute_key VARCHAR(255) DEFAULT '' NOT NULL,
    attribute_value TEXT
);

CREATE INDEX datatree_attribute_idx ON horde_datatree_attributes (datatree_id);
CREATE INDEX datatree_attribute_name_idx ON horde_datatree_attributes (attribute_name);
CREATE INDEX datatree_attribute_key_idx ON horde_datatree_attributes (attribute_key);

CREATE TABLE horde_tokens (
    token_address    VARCHAR(100) NOT NULL,
    token_id         VARCHAR(32) NOT NULL,
    token_timestamp  BIGINT NOT NULL,

    PRIMARY KEY (token_address, token_id)
);

CREATE TABLE horde_vfs (
    vfs_id        BIGINT NOT NULL,
    vfs_type      SMALLINT NOT NULL,
    vfs_path      VARCHAR(255) NOT NULL,
    vfs_name      VARCHAR(255) NOT NULL,
    vfs_modified  BIGINT NOT NULL,
    vfs_owner     VARCHAR(255) NOT NULL,
    vfs_data      LONGBLOB,

    PRIMARY KEY (vfs_id)
);

CREATE INDEX vfs_path_idx ON horde_vfs (vfs_path);
CREATE INDEX vfs_name_idx ON horde_vfs (vfs_name);

CREATE TABLE horde_histories (
    history_id       BIGINT NOT NULL,
    object_uid       VARCHAR(255) NOT NULL,
    history_action   VARCHAR(32) NOT NULL,
    history_ts       BIGINT NOT NULL,
    history_desc     TEXT,
    history_who      VARCHAR(255),
    history_extra    TEXT,

    PRIMARY KEY (history_id)
);

CREATE INDEX history_action_idx ON horde_histories (history_action);
CREATE INDEX history_ts_idx ON horde_histories (history_ts);
CREATE INDEX history_uid_idx ON horde_histories (object_uid);

CREATE TABLE horde_sessionhandler (
    session_id             VARCHAR(32) NOT NULL,
    session_lastmodified   INT NOT NULL,
    session_data           LONGBLOB,

    PRIMARY KEY (session_id)
) ENGINE = InnoDB;

-- Done!

-- $Horde: turba/scripts/sql/turba.mysql.sql,v 1.1.2.1 2007/11/18 12:04:43 jan Exp $
-- You can simply execute this file in your database.
--
-- Run as:
--
-- $ mysql --user=root --password=<MySQL-root-password> <db name> < turba_objects.mysql.sql

CREATE TABLE turba_objects (
    object_id VARCHAR(32) NOT NULL,
    owner_id VARCHAR(255) NOT NULL,
    object_type VARCHAR(255) NOT NULL DEFAULT 'Object',
    object_uid VARCHAR(255),
    object_members BLOB,
    object_name VARCHAR(255),
    object_alias VARCHAR(32),
    object_email VARCHAR(255),
    object_homeaddress VARCHAR(255),
    object_workaddress VARCHAR(255),
    object_homephone VARCHAR(25),
    object_workphone VARCHAR(25),
    object_cellphone VARCHAR(25),
    object_fax VARCHAR(25),
    object_title VARCHAR(255),
    object_company VARCHAR(255),
    object_notes TEXT,
    object_pgppublickey TEXT,
    object_smimepublickey TEXT,
    object_freebusyurl VARCHAR(255),
    
    PRIMARY KEY(object_id)
);

CREATE INDEX turba_owner_idx ON turba_objects (owner_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON turba_objects TO horde@localhost;

-- $Horde: kronolith/scripts/sql/kronolith.mysql.sql,v 1.3.2.1 2006/08/20 22:39:56 chuck Exp $

CREATE TABLE kronolith_events (
    event_id VARCHAR(32) NOT NULL,
    event_uid VARCHAR(255) NOT NULL,
    calendar_id VARCHAR(255) NOT NULL,
    event_creator_id VARCHAR(255) NOT NULL,
    event_description TEXT,
    event_location TEXT,
    event_status INT DEFAULT 0,
    event_attendees TEXT,
    event_keywords TEXT,
    event_exceptions TEXT,
    event_title VARCHAR(255),
    event_category VARCHAR(80),
    event_recurtype SMALLINT DEFAULT 0,
    event_recurinterval SMALLINT,
    event_recurdays SMALLINT,
    event_recurenddate DATETIME,
    event_start DATETIME,
    event_end DATETIME,
    event_alarm INT DEFAULT 0,
    event_modified INT NOT NULL,

    PRIMARY KEY (event_id)
);

CREATE INDEX kronolith_calendar_idx ON kronolith_events (calendar_id);
CREATE INDEX kronolith_uid_idx ON kronolith_events (event_uid);

GRANT SELECT, INSERT, UPDATE, DELETE ON kronolith_events TO horde@localhost;


CREATE TABLE kronolith_storage (
    vfb_owner      VARCHAR(255) DEFAULT NULL,
    vfb_email      VARCHAR(255) NOT NULL DEFAULT '',
    vfb_serialized TEXT NOT NULL
);

CREATE INDEX kronolith_vfb_owner_idx ON kronolith_storage (vfb_owner);
CREATE INDEX kronolith_vfb_email_idx ON kronolith_storage (vfb_email);

GRANT SELECT, INSERT, UPDATE, DELETE ON kronolith_storage TO horde@localhost;

-- $Horde: nag/scripts/sql/nag.sql,v 1.4.8.2 2007/09/27 22:41:03 jan Exp $

CREATE TABLE nag_tasks (
    task_id         VARCHAR(32) NOT NULL,
    task_owner      VARCHAR(255) NOT NULL,
    task_name       VARCHAR(255) NOT NULL,
    task_uid        VARCHAR(255) NOT NULL,
    task_desc       TEXT,
    task_due        INT,
    task_priority   INT NOT NULL DEFAULT 0,
    task_category   VARCHAR(80),
    task_completed  SMALLINT NOT NULL DEFAULT 0,
    task_alarm      INT NOT NULL DEFAULT 0,
    task_private    INT NOT NULL DEFAULT 0,
--
    PRIMARY KEY (task_id)
);

CREATE INDEX nag_tasklist_idx ON nag_tasks (task_owner);
CREATE INDEX nag_uid_idx ON nag_tasks (task_uid);

-- $Horde: mnemo/scripts/sql/mnemo.sql,v 1.5.2.1 2007/09/27 22:41:46 jan Exp $

CREATE TABLE mnemo_memos (
    memo_owner      VARCHAR(255) NOT NULL,
    memo_id         VARCHAR(32) NOT NULL,
    memo_uid        VARCHAR(255) NOT NULL,
    memo_desc       VARCHAR(64) NOT NULL,
    memo_body       TEXT,
    memo_category   VARCHAR(80),
    memo_private    SMALLINT NOT NULL DEFAULT 0,
--
    PRIMARY KEY (memo_owner, memo_id)
);

CREATE INDEX mnemo_notepad_idx ON mnemo_memos (memo_owner);
CREATE INDEX mnemo_uid_idx ON mnemo_memos (memo_uid);

