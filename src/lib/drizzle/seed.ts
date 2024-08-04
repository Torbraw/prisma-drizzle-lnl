import { drizzle } from 'drizzle-orm/mysql2';
import { createConnection } from 'mysql2/promise';
import { permissions, roles, rolesToPermissions, userInfos, users } from './schema';
import { PERMISSION_TYPES } from '../const';
import 'dotenv/config';

const defaultPermissions: (typeof permissions.$inferInsert)[] = [
  {
    id: 1,
    name: 'seeUsers',
    type: PERMISSION_TYPES.UI,
  },
  {
    id: 2,
    name: 'manageUsers',
    type: PERMISSION_TYPES.UI,
  },
  {
    id: 3,
    name: 'manageUsers',
    type: PERMISSION_TYPES.API,
  },
  {
    id: 4,
    name: 'fetchUsers',
    type: PERMISSION_TYPES.API,
  },
  {
    id: 5,
    name: 'seeRoles',
    type: PERMISSION_TYPES.UI,
  },
];

const defaultRoles: (typeof roles.$inferInsert)[] = [
  {
    id: 1,
    name: 'admin',
    description: 'Admin role',
  },
  {
    id: 2,
    name: 'user',
    description: 'User role',
  },
];

const defaultRoleToPermission: (typeof rolesToPermissions.$inferInsert)[] = [
  {
    permissionId: 1,
    roleId: 1,
  },
  {
    permissionId: 2,
    roleId: 1,
  },
  {
    permissionId: 3,
    roleId: 1,
  },
  {
    permissionId: 4,
    roleId: 1,
  },
  {
    permissionId: 5,
    roleId: 1,
  },
  {
    permissionId: 1,
    roleId: 2,
  },
  {
    permissionId: 4,
    roleId: 2,
  },
  {
    permissionId: 5,
    roleId: 2,
  },
];

const defaultUserInfos: (typeof userInfos.$inferInsert)[] = [
  {
    id: 1,
    address: '1234 rue de la rue',
    birthYear: 2000,
    phone: '123-456-7890',
    name: 'Maxime',
  },
  {
    id: 2,
    address: '1234 rue de la rue',
    birthYear: 2020,
    phone: '123-456-7890',
    name: 'Maxime',
  },
  {
    id: 3,
    address: '1234 rue de la rue',
    birthYear: 1998,
    phone: '123-456-7890',
    name: 'Maxime',
  },
  {
    id: 4,
    address: '1234 rue de la rue',
    birthYear: 1990,
    phone: '123-456-7890',
  },
  {
    id: 5,
    address: '1234 rue de la rue',
    birthYear: 2015,
    phone: '123-456-7890',
  },
];

const defaultusers: (typeof users.$inferInsert)[] = [
  {
    id: 1,
    email: 'maxime+1@altevo.ca',
    password: '$Dev12345',
    roleId: 1,
    userInfoId: 1,
  },
  {
    id: 2,
    email: 'maxime+2@altevo.ca',
    password: '$Dev12345',
    roleId: 1,
    userInfoId: 2,
  },
  {
    id: 3,
    email: 'maxime+3@altevo.ca',
    password: '$Dev12345',
    roleId: 1,
    userInfoId: 3,
  },
  {
    id: 4,
    email: 'maxime+4@altevo.ca',
    password: '$Dev12345',
    roleId: 2,
    userInfoId: 4,
  },
  {
    id: 5,
    email: 'maxime+5@altevo.ca',
    password: '$Dev12345',
    roleId: 2,
    userInfoId: 5,
  },
];

async function main() {
  const connection = await createConnection({
    uri: process.env.DATABASE_URL,
  });

  const db = drizzle(connection);

  await db.insert(permissions).values(defaultPermissions);

  await db.insert(roles).values(defaultRoles);

  await db.insert(rolesToPermissions).values(defaultRoleToPermission);

  await db.insert(userInfos).values(defaultUserInfos);

  await db.insert(users).values(defaultusers);

  await connection.end();
  connection.destroy();
}

main().catch((e: unknown) => {
  console.error(e);
});
