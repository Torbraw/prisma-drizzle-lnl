CREATE TABLE `drizzle_permissions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`type` enum('UI','API') NOT NULL,
	CONSTRAINT `drizzle_permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `drizzle_permissions_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `drizzle_roles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` varchar(191),
	CONSTRAINT `drizzle_roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `drizzle_roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `drizzle_user_infos` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`address` varchar(191) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`birth_year` int NOT NULL,
	`name` varchar(191),
	`user_id` bigint unsigned NOT NULL,
	CONSTRAINT `drizzle_user_infos_id` PRIMARY KEY(`id`),
	CONSTRAINT `drizzle_user_infos_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `drizzle_users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(191) NOT NULL,
	`password` varchar(191) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` datetime(3) NOT NULL DEFAULT '2024-07-29 01:31:32.893',
	`updated_at` datetime(3) NOT NULL,
	`role_id` bigint unsigned NOT NULL,
	CONSTRAINT `drizzle_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `drizzle_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `drizzle_user_infos` ADD CONSTRAINT `drizzle_user_infos_user_id_drizzle_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `drizzle_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `drizzle_users` ADD CONSTRAINT `drizzle_users_role_id_drizzle_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `drizzle_roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `type_idx` ON `drizzle_permissions` (`type`);