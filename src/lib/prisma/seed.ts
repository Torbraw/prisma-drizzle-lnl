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

const roles: Prisma.RoleUncheckedCreateInput[] = [
  {
    id: 1,
    name: 'admin',
    description: 'Admin role',
    permissions: {
      connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    },
  },
  {
    id: 2,
    name: 'user',
    description: 'User role',
    permissions: {
      connect: [{ id: 1 }, { id: 4 }, { id: 5 }],
    },
  },
];

const userInfos: Prisma.UserInfoUncheckedCreateInput[] = [
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

const users: Prisma.UserUncheckedCreateInput[] = [
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
  await prisma.permission.createMany({
    data: permissions,
    skipDuplicates: true,
  });

  for (const role of roles) {
    await prisma.role.create({
      data: role,
    });
  }

  for (const userInfo of userInfos) {
    await prisma.userInfo.create({
      data: userInfo,
    });
  }

  for (const user of users) {
    await prisma.user.create({
      data: user,
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
