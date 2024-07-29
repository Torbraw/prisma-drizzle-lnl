ALTER TABLE `drizzle_permissions` DROP INDEX `drizzle_permissions_name_unique`;--> statement-breakpoint
ALTER TABLE `drizzle_users` MODIFY COLUMN `created_at` datetime(3) NOT NULL DEFAULT '2024-07-29 01:33:42.957';--> statement-breakpoint
ALTER TABLE `drizzle_permissions` ADD CONSTRAINT `drizzle_permissions_name_type_unique` UNIQUE(`name`,`type`);