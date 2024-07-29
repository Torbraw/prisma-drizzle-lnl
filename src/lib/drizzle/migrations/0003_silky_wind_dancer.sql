CREATE TABLE `drizzle_roles_to_permissions` (
	`role_id` bigint unsigned NOT NULL,
	`permission_id` bigint unsigned NOT NULL,
	CONSTRAINT `drizzle_roles_to_permissions_role_id_permission_id_unique` UNIQUE(`role_id`,`permission_id`)
);
--> statement-breakpoint
ALTER TABLE `drizzle_users` DROP FOREIGN KEY `drizzle_users_user_info_id_drizzle_user_infos_id_fk`;
--> statement-breakpoint
ALTER TABLE `drizzle_roles_to_permissions` ADD CONSTRAINT `drizzle_roles_to_permissions_role_id_drizzle_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `drizzle_roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `drizzle_roles_to_permissions` ADD CONSTRAINT `fk_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `drizzle_permissions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `drizzle_users` ADD CONSTRAINT `drizzle_users_user_info_id_drizzle_user_infos_id_fk` FOREIGN KEY (`user_info_id`) REFERENCES `drizzle_user_infos`(`id`) ON DELETE cascade ON UPDATE cascade;