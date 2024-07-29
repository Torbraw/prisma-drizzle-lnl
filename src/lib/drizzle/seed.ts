import { drizzle } from 'drizzle-orm/mysql2';
import { createConnection } from 'mysql2/promise';
import { permissions, roles, rolesToPermissions } from './schema';
import { PERMISSION_TYPES } from '../const';
import 'dotenv/config';

const defaultPermissions = [
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

const defaultRoles = [
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

const defaultRoleToPermission = [
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

async function main() {
  const connection = await createConnection({
    uri: process.env.DATABASE_URL,
  });

  const db = drizzle(connection);

  await db.insert(permissions).values(defaultPermissions);

  await db.insert(roles).values(defaultRoles);

  await db.insert(rolesToPermissions).values(defaultRoleToPermission);

  await connection.end();
  connection.destroy();
}

main().catch((e: unknown) => {
  console.error(e);
});
