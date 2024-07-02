import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const permissions: Prisma.PermissionCreateManyInput[] = [
  {
    id: 1,
    name: 'seeUsers',
    type: 'UI',
  },
  {
    id: 2,
    name: 'manageUsers',
    type: 'UI',
  },
  {
    id: 3,
    name: 'manageUsers',
    type: 'API',
  },
  {
    id: 4,
    name: 'fetchUsers',
    type: 'API',
  },
  {
    id: 5,
    name: 'seeRoles',
    type: 'UI',
  },
];

const roles: Prisma.RoleCreateInput[] = [
  {
    name: 'admin',
    description: 'Admin role',
    permissions: {
      connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    },
  },
  {
    name: 'user',
    description: 'User role',
    permissions: {
      connect: [{ id: 1 }, { id: 4 }, { id: 5 }],
    },
  },
];

async function main() {
  await prisma.permission.createMany({
    data: permissions,
    skipDuplicates: true,
  });

  for (const role of roles) {
    await prisma.role.create({
      data: role,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: unknown) => {
    console.error(e);
    await prisma.$disconnect();
  });
