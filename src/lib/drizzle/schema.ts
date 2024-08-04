import {
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
  serial,
  boolean,
  datetime,
  index,
  unique,
  bigint,
  foreignKey,
  primaryKey,
} from 'drizzle-orm/mysql-core';
import { PERMISSION_TYPES } from '../const';
import { relations } from 'drizzle-orm';

export const users = mysqlTable('drizzle_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 191 }).unique().notNull(),
  password: varchar('password', { length: 191 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: datetime('created_at', { fsp: 3 })
    .notNull()
    .$default(() => new Date()),
  updatedAt: datetime('updated_at', { fsp: 3 })
    .notNull()
    .$onUpdate(() => new Date()),
  roleId: bigint('role_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => roles.id),
  userInfoId: bigint('user_info_id', { mode: 'number', unsigned: true })
    .notNull()
    .unique()
    .references(() => userInfos.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});

export const userInfos = mysqlTable('drizzle_user_infos', {
  id: serial('id').primaryKey(),
  address: varchar('address', { length: 191 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  birthYear: int('birth_year').notNull(),
  name: varchar('name', { length: 191 }),
});

export const roles = mysqlTable('drizzle_roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 191 }).notNull().unique(),
  description: varchar('description', { length: 191 }),
});

export const permissions = mysqlTable(
  'drizzle_permissions',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 191 }).notNull(),
    type: mysqlEnum('type', [PERMISSION_TYPES.API, PERMISSION_TYPES.UI]).notNull(),
  },
  (table) => {
    return {
      typeIdx: index('type_idx').on(table.type),
      uniqueIdx: unique().on(table.name, table.type),
    };
  },
);

export const rolesToPermissions = mysqlTable(
  'drizzle_roles_to_permissions',
  {
    roleId: bigint('role_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => roles.id),
    permissionId: bigint('permission_id', { mode: 'number', unsigned: true }).notNull(),
  },
  (table) => {
    return {
      // Custom FK since name too long
      permissionIdFk: foreignKey({
        columns: [table.permissionId],
        foreignColumns: [permissions.id],
        name: 'fk_permission_id',
      }),
      pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
    };
  },
);

export type DrizzleUser = typeof users.$inferSelect;
export type DrizzleUserInfo = typeof userInfos.$inferSelect;
export type DrizzleRole = typeof roles.$inferSelect;
export type DrizzlePermission = typeof permissions.$inferSelect;

export type DrizzleInsertUser = typeof users.$inferInsert;
export type DrizzleInsertUserInfo = typeof userInfos.$inferInsert;

//#region Relational queries specifics

export const usersRelations = relations(users, ({ one }) => ({
  userInfo: one(userInfos, {
    fields: [users.userInfoId],
    references: [userInfos.id],
  }),
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

// Not used but for example
export const userInfosRelations = relations(userInfos, ({ one }) => ({
  user: one(users),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  rolesToPermissions: many(rolesToPermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  permissionsToRoles: many(rolesToPermissions),
}));

export const rolesToPermissionsRelations = relations(rolesToPermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolesToPermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolesToPermissions.permissionId],
    references: [permissions.id],
  }),
}));

//#endregion
