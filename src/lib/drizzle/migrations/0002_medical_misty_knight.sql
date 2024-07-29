ALTER TABLE `drizzle_user_infos` DROP FOREIGN KEY `drizzle_user_infos_user_id_drizzle_users_id_fk`;--> statement-breakpoint
ALTER TABLE `drizzle_user_infos` DROP INDEX `drizzle_user_infos_user_id_unique`;
--> statement-breakpoint
ALTER TABLE `drizzle_users` MODIFY COLUMN `created_at` datetime(3) NOT NULL;--> statement-breakpoint
ALTER TABLE `drizzle_users` ADD `user_info_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `drizzle_users` ADD CONSTRAINT `drizzle_users_user_info_id_unique` UNIQUE(`user_info_id`);--> statement-breakpoint
ALTER TABLE `drizzle_users` ADD CONSTRAINT `drizzle_users_user_info_id_drizzle_user_infos_id_fk` FOREIGN KEY (`user_info_id`) REFERENCES `drizzle_user_infos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `drizzle_user_infos` DROP COLUMN `user_id`;