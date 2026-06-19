CREATE TABLE `attendances` (`id` integer PRIMARY KEY AUTOINCREMENT,`user_id` integer NOT NULL,`last_checkin` datetime,`consecutive_days` integer DEFAULT 0,`total_days` integer DEFAULT 0,`updated_at` datetime);

CREATE TABLE `bookmarks` (`id` integer PRIMARY KEY AUTOINCREMENT,`user_id` integer NOT NULL,`torrent_id` integer NOT NULL,`created_at` datetime);

CREATE TABLE `comments` (`id` integer PRIMARY KEY AUTOINCREMENT,`user_id` integer NOT NULL,`torrent_id` integer NOT NULL,`content` text NOT NULL,`created_at` datetime,`updated_at` datetime);

CREATE TABLE `invites` (`id` integer PRIMARY KEY AUTOINCREMENT,`sender_id` integer NOT NULL,`code` text NOT NULL,`email` text,`is_used` numeric DEFAULT false,`used_by_id` integer DEFAULT null,`expires_at` datetime,`created_at` datetime);

CREATE TABLE `medals` (`id` integer PRIMARY KEY AUTOINCREMENT,`code` integer NOT NULL,`description` text,`image` text,`price` decimal(12,2) DEFAULT 0,`is_active` numeric DEFAULT true,`created_at` datetime,CONSTRAINT `uni_medals_code` UNIQUE (`code`));

CREATE TABLE `messages` (`id` integer PRIMARY KEY AUTOINCREMENT,`sender_id` integer NOT NULL,`receiver_id` integer NOT NULL,`subject` text NOT NULL,`body` text NOT NULL,`is_read` numeric DEFAULT false,`is_deleted` numeric DEFAULT false,`created_at` datetime);

CREATE TABLE `news` (`id` integer PRIMARY KEY AUTOINCREMENT,`title` text NOT NULL,`content` text NOT NULL,`user_id` integer NOT NULL,`created_at` datetime);

CREATE TABLE `offer_votes` (`id` integer PRIMARY KEY AUTOINCREMENT,`user_id` integer NOT NULL,`offer_id` integer NOT NULL,`is_yeah` numeric NOT NULL,`created_at` datetime);

CREATE TABLE `offers` (`id` integer PRIMARY KEY AUTOINCREMENT,`user_id` integer NOT NULL,`name` text NOT NULL,`description` text,`category` text,`status` varchar(16) DEFAULT "pending",`vote_yeah` integer DEFAULT 0,`vote_against` integer DEFAULT 0,`created_at` datetime);

CREATE TABLE `permissions` (`id` integer PRIMARY KEY AUTOINCREMENT,`code` text NOT NULL,`name` text,`group` text NOT NULL,`description` text,`created_at` datetime);

CREATE TABLE `reports` (`id` integer PRIMARY KEY AUTOINCREMENT,`reporter_id` integer NOT NULL,`target_type` text NOT NULL,`target_id` integer NOT NULL,`reason` text NOT NULL,`status` varchar(16) DEFAULT "pending",`created_at` datetime);

CREATE TABLE `role_models` (`id` integer PRIMARY KEY AUTOINCREMENT,`name` text NOT NULL,`display_name` text,`description` text,`is_system` numeric DEFAULT false,`sort_order` integer DEFAULT 0,`created_at` datetime,`updated_at` datetime);

CREATE TABLE `role_permissions` (`role_model_id` integer,`permission_id` integer,PRIMARY KEY (`role_model_id`,`permission_id`),CONSTRAINT `fk_role_permissions_role_model` FOREIGN KEY (`role_model_id`) REFERENCES `role_models`(`id`),CONSTRAINT `fk_role_permissions_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`));

CREATE TABLE `site_settings` (`id` integer PRIMARY KEY AUTOINCREMENT,`key` text NOT NULL,`value` text NOT NULL,`type` text DEFAULT "string",`description` text,`is_active` numeric DEFAULT true,`created_at` datetime,`updated_at` datetime);

CREATE TABLE `snatches` (`id` integer PRIMARY KEY AUTOINCREMENT,`user_id` integer NOT NULL,`torrent_id` integer NOT NULL,`uploaded` integer DEFAULT 0,`downloaded` integer DEFAULT 0,`left` integer DEFAULT 0,`ip` text DEFAULT "",`port` integer DEFAULT 0,`peer_id` text DEFAULT "",`seed_time` integer DEFAULT 0,`leech_time` integer DEFAULT 0,`is_seeding` numeric DEFAULT false,`is_hr` numeric DEFAULT false,`started_at` datetime,`last_announce` datetime,`finished_at` datetime);

CREATE TABLE `subs` (`id` integer PRIMARY KEY AUTOINCREMENT,`torrent_id` integer NOT NULL,`user_id` integer NOT NULL,`language` text NOT NULL,`title` text,`file_name` text NOT NULL,`file_size` integer DEFAULT 0,`hits` integer DEFAULT 0,`created_at` datetime);

CREATE TABLE `sys_dict_data` (`id` integer PRIMARY KEY AUTOINCREMENT,`type_id` integer NOT NULL,`key` text NOT NULL,`value` text,`label` text,`sort_order` integer DEFAULT 0,`is_default` numeric DEFAULT false,`is_active` numeric DEFAULT true,`created_at` datetime,`updated_at` datetime);

CREATE TABLE `announcements` (`id` integer PRIMARY KEY AUTOINCREMENT,`title` text NOT NULL,`content` text,`is_sticky` numeric DEFAULT false,`expires_at` datetime,`is_active` numeric DEFAULT true,`created_by` integer NOT NULL,`created_at` datetime,`updated_at` datetime);

CREATE TABLE `bonus_logs` (`id` integer PRIMARY KEY AUTOINCREMENT,`user_id` integer NOT NULL,`business_type` integer NOT NULL DEFAULT 0,`old_total_value` decimal(20,1),`value` decimal(20,1),`new_total_value` decimal(20,1),`comment` text,`created_at` datetime);

CREATE TABLE `sys_dict_type` (`id` integer PRIMARY KEY AUTOINCREMENT,`name` text NOT NULL,`label` text NOT NULL,`remark` text,`sort_order` integer DEFAULT 0,`is_system` numeric DEFAULT false,`is_active` numeric DEFAULT true,`created_at` datetime,`updated_at` datetime,CONSTRAINT `uni_sys_dict_type_name` UNIQUE (`name`));

CREATE TABLE `sys_i18n` (`key` text NOT NULL,`locale` text NOT NULL,`value` text NOT NULL,`created_at` datetime,`updated_at` datetime,PRIMARY KEY (`key`,`locale`));

CREATE TABLE `sys_user_level` (`id` integer PRIMARY KEY AUTOINCREMENT,`code` integer NOT NULL,`label` text DEFAULT '',`min_upload` integer DEFAULT 0,`min_download` integer DEFAULT 0,`min_ratio` decimal(10,3) DEFAULT 0,`min_bonus` decimal(12,2) DEFAULT 0,`min_seed_count` integer DEFAULT 0,`color` text,`icon` text,`sort_order` integer DEFAULT 0,`is_active` numeric DEFAULT true,`created_at` datetime,CONSTRAINT `uni_sys_user_level_code` UNIQUE (`code`));

CREATE TABLE `thanks` (`id` integer PRIMARY KEY AUTOINCREMENT,`user_id` integer NOT NULL,`torrent_id` integer NOT NULL,`created_at` datetime);

CREATE TABLE `torrents` (`id` integer PRIMARY KEY AUTOINCREMENT,`user_id` integer NOT NULL,`info_hash` bytea NOT NULL,`name` text NOT NULL,`description` text,`file_name` text DEFAULT "",`size` integer DEFAULT 0,`file_count` integer DEFAULT 0,`category` text DEFAULT "",`source` text DEFAULT "",`medium` text DEFAULT "",`codec` text DEFAULT "",`standard` text DEFAULT "",`processing` text DEFAULT "",`team` text DEFAULT "",`audiocodec` text DEFAULT "",`small_descr` text,`technical_info` text,`cover` text,`nfo` text,`tags` text DEFAULT "",`promotion` varchar(16) DEFAULT "none",`seed_hours` integer DEFAULT 0,`seeders` integer DEFAULT 0,`leechers` integer DEFAULT 0,`completed` integer DEFAULT 0,`created_at` datetime,`is_deleted` numeric DEFAULT false);

CREATE TABLE `user_medals` (`id` integer PRIMARY KEY AUTOINCREMENT,`user_id` integer NOT NULL,`medal_id` integer NOT NULL,`expire_at` datetime,`created_at` datetime);

CREATE TABLE `users` (`id` integer PRIMARY KEY AUTOINCREMENT,`username` text NOT NULL,`email` text NOT NULL,`password_hash` text NOT NULL,`passkey` text NOT NULL,`role` varchar(16) DEFAULT "user",`role_id` integer,`status` integer DEFAULT 0,`upload_bytes` integer DEFAULT 0,`download_bytes` integer DEFAULT 0,`bonus` decimal(12,2) DEFAULT 0,`level_id` integer,`created_at` datetime);

CREATE UNIQUE INDEX `idx_attendances_user_id` ON `attendances`(`user_id`);
CREATE UNIQUE INDEX `idx_bookmark_user_torrent` ON `bookmarks`(`user_id`,`torrent_id`);
CREATE INDEX `idx_comments_torrent_id` ON `comments`(`torrent_id`);
CREATE INDEX `idx_comments_user_id` ON `comments`(`user_id`);
CREATE UNIQUE INDEX `idx_invites_code` ON `invites`(`code`);
CREATE INDEX `idx_invites_sender_id` ON `invites`(`sender_id`);
CREATE INDEX `idx_messages_receiver_id` ON `messages`(`receiver_id`);
CREATE INDEX `idx_messages_sender_id` ON `messages`(`sender_id`);
CREATE INDEX `idx_news_user_id` ON `news`(`user_id`);
CREATE UNIQUE INDEX `idx_offer_user` ON `offer_votes`(`user_id`,`offer_id`);
CREATE INDEX `idx_offers_category` ON `offers`(`category`);
CREATE INDEX `idx_offers_user_id` ON `offers`(`user_id`);
CREATE UNIQUE INDEX `idx_permissions_code` ON `permissions`(`code`);
CREATE INDEX `idx_permissions_group` ON `permissions`(`group`);
CREATE INDEX `idx_reports_reporter_id` ON `reports`(`reporter_id`);
CREATE UNIQUE INDEX `idx_role_models_name` ON `role_models`(`name`);
CREATE UNIQUE INDEX `idx_site_settings_key` ON `site_settings`(`key`);
CREATE INDEX `idx_snatches_is_hr` ON `snatches`(`is_hr`);
CREATE INDEX `idx_snatches_is_seeding` ON `snatches`(`is_seeding`);
CREATE INDEX `idx_subs_torrent_id` ON `subs`(`torrent_id`);
CREATE INDEX `idx_subs_user_id` ON `subs`(`user_id`);
CREATE INDEX `idx_sys_dict_data_type_id` ON `sys_dict_data`(`type_id`);
CREATE UNIQUE INDEX `idx_thanks_user_torrent` ON `thanks`(`user_id`,`torrent_id`);
CREATE INDEX `idx_torrents_category` ON `torrents`(`category`);
CREATE INDEX `idx_torrents_created_at` ON `torrents`(`created_at`);
CREATE UNIQUE INDEX `idx_torrents_info_hash` ON `torrents`(`info_hash`);
CREATE INDEX `idx_torrents_promotion` ON `torrents`(`promotion`);
CREATE INDEX `idx_torrents_user_id` ON `torrents`(`user_id`);
CREATE UNIQUE INDEX `idx_user_medal` ON `user_medals`(`user_id`,`medal_id`);
CREATE UNIQUE INDEX `idx_user_torrent` ON `snatches`(`user_id`,`torrent_id`);
CREATE UNIQUE INDEX `idx_users_email` ON `users`(`email`);
CREATE INDEX `idx_bonus_logs_user_id` ON `bonus_logs`(`user_id`);
CREATE INDEX `idx_users_level_id` ON `users`(`level_id`);
CREATE UNIQUE INDEX `idx_users_passkey` ON `users`(`passkey`);
CREATE INDEX `idx_users_role` ON `users`(`role`);
CREATE INDEX `idx_users_role_id` ON `users`(`role_id`);
CREATE INDEX `idx_users_status` ON `users`(`status`);
CREATE UNIQUE INDEX `idx_users_username` ON `users`(`username`);
