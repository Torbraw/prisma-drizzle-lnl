import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { eq, getTableColumns, SQL, sql } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import {
  DrizzlePermission,
  DrizzleRole,
  DrizzleUser,
  DrizzleUserInfo,
  permissions,
  roles,
  rolesToPermissions,
  userInfos,
  users,
} from 'src/lib/drizzle/schema';
import { DrizzleCreateUser, DrizzleUpdateUser, DrizzleUserWithAge, DrizzleUserWithRelations } from 'src/lib/types';

const { password, ...usersColumns } = getTableColumns(users);
const userInfosColumns = getTableColumns(userInfos);

@Injectable()
export class UsersService {
  public constructor(@Inject('Drizzle') private readonly drizzle: MySql2Database) {}

  public async create(data: DrizzleCreateUser): Promise<DrizzleUserWithRelations> {
    const now = new Date();
    if (data.userInfo.birthYear > now.getFullYear()) {
      throw new BadRequestException('Birth year must be less than or equal to the current year');
    }

    const hashPassword = createHash('sha256').update(data.password).digest('hex');
    data.password = hashPassword;

    const userId = await this.drizzle.transaction(async (trx) => {
      const userInfoId = await trx
        .insert(userInfos)
        .values(data.userInfo)
        .$returningId()
        .then((ids) => ids[0].id);
      return await trx
        .insert(users)
        .values({ ...data, userInfoId: userInfoId })
        .$returningId()
        .then((ids) => ids[0].id);
    });

    return this.getUserWithRelations(userId);
  }

  public async update(id: number, data: DrizzleUpdateUser): Promise<DrizzleUserWithRelations> {
    if (data.userInfo?.birthYear) {
      const now = new Date();
      if (data.userInfo.birthYear > now.getFullYear()) {
        throw new BadRequestException('Birth year must be less than or equal to the current year');
      }
    }

    await this.drizzle.transaction(async (trx) => {
      if (data.userInfo && data.userInfoId) {
        await trx.update(userInfos).set(data.userInfo).where(eq(userInfos.id, data.userInfoId));
      }
      await trx.update(users).set(data).where(eq(users.id, id));
    });

    return this.getUserWithRelations(id);
  }

  public async findOne(id: number): Promise<DrizzleUserWithAge> {
    const { birthYear, ...rest } = userInfosColumns;
    return this.getUserWithRelations(id, { ...rest, age: sql<number>`YEAR(CURDATE()) - ${userInfos.birthYear}` });
  }

  private async getUserWithRelations<T>(
    userId: number,
    customInfosColumn: Partial<typeof userInfosColumns> | Record<string, SQL> = userInfosColumns,
  ): Promise<T> {
    const rows = await this.drizzle
      .select({
        user: usersColumns,
        role: roles,
        userInfo: customInfosColumn,
        permission: permissions,
      })
      .from(users)
      .innerJoin(userInfos, eq(users.userInfoId, userInfos.id))
      .innerJoin(roles, eq(users.roleId, roles.id))
      .innerJoin(rolesToPermissions, eq(roles.id, rolesToPermissions.roleId))
      .innerJoin(permissions, eq(rolesToPermissions.permissionId, permissions.id))
      .where(eq(users.id, userId));
    return this.mapRowsToUser<T>(rows);
  }

  private mapRowsToUser<T>(
    rows: {
      user: Partial<DrizzleUser>;
      role: Partial<DrizzleRole>;
      userInfo: Partial<DrizzleUserInfo>;
      permission: Partial<DrizzlePermission>;
    }[],
  ): T {
    return {
      ...rows[0].user,
      userInfo: rows[0].userInfo,
      role: {
        ...rows[0].role,
        permissions: rows.map((row) => row.permission),
      },
    } as T;
  }
}
