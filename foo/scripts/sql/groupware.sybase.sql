-- $Horde: horde/scripts/sql/create.sybase.sql,v 1.1.10.5 2006/06/29 16:29:03 jan Exp $
--
-- horde tables definitions : sql script
-- 01/22/2003 - F. Helly <francois.helly@wanadoo.fr>
-- command line syntax :  isql -ihorde_sybase.sql
-- warning : use nvarchar only if you need unicode encoding for some strings

use horde
go


DROP TABLE horde_datatree
go

DROP TABLE horde_prefs
go

DROP TABLE horde_users
go

DROP TABLE horde_sessionhandler
go

-- DROP TABLE horde_datatree_seq
-- go

-- DROP TABLE horde_tokens
-- go

-- DROP TABLE horde_vfs
-- go

-- DROP TABLE horde_muvfs
-- go


CREATE TABLE horde_users (
  user_uid varchar(256) NOT NULL,
  user_pass varchar(256) NOT NULL,
  user_soft_expiration_date numeric(10,0),
  user_hard_expiration_date numeric(10,0),
  PRIMARY KEY  (user_uid)
)
go

CREATE TABLE horde_datatree (
  datatree_id numeric(11,0) IDENTITY NOT NULL,
  group_uid varchar(256) NOT NULL,
  user_uid varchar(256) NOT NULL,
  datatree_name varchar(256) NOT NULL,
  datatree_parents varchar(256) NULL,
  datatree_data text NULL,
  datatree_serialized smallint DEFAULT 0 NOT NULL,
  PRIMARY KEY  (datatree_id),
  FOREIGN KEY (user_uid)
    REFERENCES horde_users(user_uid)
 )
go

CREATE TABLE horde_prefs (
  pref_uid varchar(256) NOT NULL,
  pref_scope varchar(16) NOT NULL,
  pref_name varchar(32) NOT NULL,
  pref_value text NULL,
  PRIMARY KEY  (pref_uid,pref_scope,pref_name)
)
go

CREATE TABLE horde_sessionhandler (
  session_id varchar(32) NOT NULL,
  session_lastmodified numeric(11,0) NOT NULL,
  session_data image NULL,
  PRIMARY KEY  (session_id)
)
go


-- CREATE TABLE horde_datatree_seq (
--   id numeric(10,0) IDENTITY NOT NULL,
--   PRIMARY KEY  (id)
-- )
-- go

-- CREATE TABLE horde_tokens (
--   token_address varchar(100) NOT NULL,
--   token_id varchar(32) NOT NULL,
--   token_timestamp numeric(20,0) NOT NULL,
--   PRIMARY KEY  (token_address,token_id)
-- )
-- go

-- CREATE TABLE horde_vfs (
--   vfs_id numeric(20,0) NOT NULL,
--   vfs_type numeric(8,0) NOT NULL,
--   vfs_path varchar(256) NOT NULL,
--   vfs_name nvarchar(256) NOT NULL,
--   vfs_modified numeric(20,0) NOT NULL,
--   vfs_owner varchar(256) NOT NULL,
--   vfs_data image NULL,
--   PRIMARY KEY  (vfs_id)
-- )
-- go

-- CREATE TABLE horde_muvfs (
--   vfs_id  numeric(20,0) NOT NULL,
--   vfs_type      numeric(8,0) NOT NULL,
--   vfs_path      varchar(256) NOT NULL,
--   vfs_name      varchar(256) NOT NULL,
--   vfs_modified  numeric(8,0) NOT NULL,
--   vfs_owner     varchar(256) NOT NULL,
--   vfs_perms     smallint NOT NULL,
--   vfs_data      image NULL,
--   PRIMARY KEY   (vfs_id)
--   )
-- go


CREATE INDEX pref_uid_idx ON horde_prefs (pref_uid)
go

CREATE INDEX pref_scope_idx ON horde_prefs (pref_scope)
go

CREATE INDEX datatree_datatree_name_idx ON horde_datatree (datatree_name)
go

CREATE INDEX datatree_group_idx ON horde_datatree (group_uid)
go

CREATE INDEX datatree_user_idx ON horde_datatree (user_uid)
go

CREATE INDEX datatree_serialized_idx ON horde_datatree (datatree_serialized)
go

-- CREATE INDEX vfs_path_idx ON horde_vfs (vfs_path)
-- go

-- CREATE INDEX vfs_name_idx ON horde_vfs (vfs_name)
-- go

-- CREATE INDEX vfs_path_idx ON horde_muvfs (vfs_path)
-- go

-- CREATE INDEX vfs_name_idx ON horde_muvfs (vfs_name)
-- go


grant select, insert, delete, update on editor to horde
go
grant select, insert, delete, update on host to horde
go
grant select, insert, delete, update on dbase to horde
go
grant select, insert, delete, update on site to horde
go
grant select, insert, delete, update on connection to horde
go
grant select, insert, delete, update on horde_datatree to horde
go
grant select, insert, delete, update on horde_prefs to horde
go
grant select, insert, delete, update on horde_sessionhandler to horde
go

-- grant select, insert, delete, update on horde_datatree_seq to horde
-- go
-- grant select, insert, delete, update on horde_tokens to horde
-- go
-- grant select, insert, delete, update on horde_vfs to horde
-- go
-- grant select, insert, delete, update on horde_muvfs to horde
-- go



-- add you admin_user_uid and admin_user_pass

-- insert into horde_users values ('your_admin_user_uid', 'your_admin_user_pass_md5_encrypted')
-- go

-- $Horde: kronolith/scripts/sql/kronolith.sql,v 1.3.2.1 2006/08/20 22:39:56 chuck Exp $

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
    event_recurtype INT DEFAULT 0,
    event_recurinterval INT,
    event_recurdays INT,
    event_recurenddate DATETIME,
    event_start DATETIME,
    event_end DATETIME,
    event_alarm INT DEFAULT 0,
    event_modified INT NOT NULL,

    PRIMARY KEY (event_id)
);

CREATE INDEX kronolith_calendar_idx ON kronolith_events (calendar_id);
CREATE INDEX kronolith_uid_idx ON kronolith_events (event_uid);

GRANT SELECT, INSERT, UPDATE, DELETE ON kronolith_events TO horde;


CREATE TABLE kronolith_storage (
    vfb_owner      VARCHAR(255) DEFAULT NULL,
    vfb_email      VARCHAR(255) NOT NULL DEFAULT '',
    vfb_serialized TEXT NOT NULL
);

CREATE INDEX kronolith_vfb_owner_idx ON kronolith_storage (vfb_owner);
CREATE INDEX kronolith_vfb_email_idx ON kronolith_storage (vfb_email);

GRANT SELECT, INSERT, UPDATE, DELETE ON kronolith_storage TO horde;

-- $Horde: nag/scripts/sql/nag.sql,v 1.4.8.1 2005/11/25 21:43:39 chuck Exp $

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

GRANT SELECT, INSERT, UPDATE, DELETE ON nag_tasks TO horde;

-- $Horde: mnemo/scripts/sql/mnemo.sql,v 1.5 2004/12/21 15:55:24 chuck Exp $

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

GRANT SELECT, INSERT, UPDATE, DELETE ON mnemo_memos TO horde;

