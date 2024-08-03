import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { eq, getTableColumns } from 'drizzle-orm';
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
import { DrizzleCreateUser, DrizzleUserWithRelations } from 'src/lib/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { password, ...usersColumns } = getTableColumns(users);

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

  public async getUserWithRelations(userId: number): Promise<DrizzleUserWithRelations> {
    const rows = await this.drizzle
      .select({
        user: usersColumns,
        role: roles,
        userInfo: userInfos,
        permission: permissions,
      })
      .from(users)
      .innerJoin(userInfos, eq(users.userInfoId, userInfos.id))
      .innerJoin(roles, eq(users.roleId, roles.id))
      .innerJoin(rolesToPermissions, eq(roles.id, rolesToPermissions.roleId))
      .innerJoin(permissions, eq(rolesToPermissions.permissionId, permissions.id))
      .where(eq(users.id, userId));
    return this.mapRowsToUser<DrizzleUserWithRelations>(rows);
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
