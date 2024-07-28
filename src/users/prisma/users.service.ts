import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import { PrismaUserWithRelationsInclude } from 'src/lib/const';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import {
  PrismaSearchQuery,
  PrismaCreateUser,
  PrismaUpdateUser,
  PrismaUserWithAge,
  PrismaUserWithMaturity,
  PrismaUserWithRelations,
  PrismaUserWithPermissionCount,
} from 'src/lib/types';
import { getPrismaArgsFromQuery } from 'src/lib/utils';

@Injectable()
export class UsersService {
  public constructor(private prisma: PrismaService) {}

  public async create(data: PrismaCreateUser): Promise<PrismaUserWithRelations> {
    const now = new Date();
    if (data.userInfo.create.birthYear > now.getFullYear()) {
      throw new BadRequestException('Birth year must be less than or equal to the current year');
    }

    const hashPassword = createHash('sha256').update(data.password).digest('hex');
    data.password = hashPassword;
    // Note: Nested writes & Bulk actions create a transaction automatically
    return await this.prisma.user.create({ data, include: PrismaUserWithRelationsInclude });
  }

  public async update(id: number, data: PrismaUpdateUser): Promise<PrismaUserWithRelations> {
    return await this.prisma.user.update({ where: { id }, data, include: PrismaUserWithRelationsInclude });
  }

  public async findAll(query: PrismaSearchQuery) {
    const findManyArgs = getPrismaArgsFromQuery(query);

    const [users, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        ...findManyArgs,
        include: {
          userInfo: true,
        },
      }),
      this.prisma.user.count(),
    ]);
    return {
      users,
      count,
    };
  }

  public async findOne(id: number): Promise<PrismaUserWithAge> {
    const result = await this.prisma.user.findUnique({
      where: { id },
      include: PrismaUserWithRelationsInclude,
    });
    if (!result) {
      throw new NotFoundException('User not found');
    }

    // Don't return birthYear but return age
    const age = new Date().getFullYear() - result.userInfo.birthYear;
    const userInfo = { ...result.userInfo } as Omit<typeof result.userInfo, 'birthYear'> & { birthYear: never };
    delete userInfo.birthYear;

    return { ...result, userInfo: { ...userInfo, age } };
  }

  public async findAllWithMaturity(): Promise<PrismaUserWithMaturity[]> {
    return await this.prisma.$queryRaw<PrismaUserWithMaturity[]>(
      Prisma.sql` 
SELECT 
  prisma_users.*, 
  JSON_OBJECT(
    'maturity', 
    CASE 
      WHEN YEAR(CURDATE()) - prisma_user_infos.birthYear < 18 THEN 'MINOR' 
      ELSE 'ADULT' 
    END,
    'birthYear', prisma_user_infos.birthYear,
    'address', prisma_user_infos.address,
    'phone', prisma_user_infos.phone,
    'name', prisma_user_infos.name
  ) AS userInfo
FROM 
  prisma_users 
INNER JOIN 
  prisma_user_infos ON prisma_user_infos.id = prisma_users.userInfoId`,
    );
  }

  public async findAllWithPermissionsCount(): Promise<PrismaUserWithPermissionCount[]> {
    const result = await this.prisma.$queryRaw<PrismaUserWithPermissionCount[]>(
      Prisma.sql`
WITH cte AS (
  SELECT COUNT(p.id) AS permissionCount, u.id AS userId
  FROM prisma_permissions p
	INNER JOIN _PermissionToRole pr ON p.id = pr.A
	INNER JOIN prisma_roles r ON r.id = pr.B
	INNER JOIN prisma_users u ON u.roleId = r.id
  GROUP BY userId
)
SELECT u.*, c.permissionCount, JSON_OBJECT(
  'birthYear', prisma_user_infos.birthYear,
  'address', prisma_user_infos.address,
  'phone', prisma_user_infos.phone,
  'name', prisma_user_infos.name
) AS userInfo
FROM prisma_users u
INNER JOIN cte c ON c.userId = u.id
INNER JOIN prisma_user_infos ON prisma_user_infos.id = u.userInfoId`,
    );
    return result.map((user) => {
      // Mysql COUNT() return bigint, json.stringify don't support bigint, dirty fix
      user.permissionCount = Number(user.permissionCount);
      return user;
    });
  }
}
