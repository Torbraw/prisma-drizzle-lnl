import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { count, eq, sql } from 'drizzle-orm';
import { DrizzleWithSchema } from 'src/lib/drizzle/drizzle.module';
import { userInfos, users } from 'src/lib/drizzle/schema';
import { DrizzleFindAllResponse, DrizzleSearchQuery, DrizzleUserWithAge } from 'src/lib/types';

@Injectable()
export class UsersRelationsService {
  public constructor(@Inject('Drizzle') private readonly drizzle: DrizzleWithSchema) {}

  public async findOne(id: number): Promise<DrizzleUserWithAge> {
    const result = await this.drizzle.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        password: false,
      },
      with: {
        userInfo: {
          columns: {
            birthYear: false,
          },
          extras: {
            age: sql<number>`YEAR(CURDATE()) - ${userInfos.birthYear}`.as('age'),
          },
        },
        role: {
          with: {
            rolesToPermissions: {
              with: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('User not found');
    }

    const permissions = result.role.rolesToPermissions.map((rtp) => rtp.permission);
    const { rolesToPermissions, ...role } = result.role;

    return { ...result, role: { ...role, permissions } };
  }

  public async findAll(query: DrizzleSearchQuery): Promise<DrizzleFindAllResponse> {
    let limit: number | undefined = undefined;
    let offset: number | undefined = undefined;
    if (query) {
      if (query.limit) {
        limit = query.limit;
        if (query.page) {
          offset = query.limit * (query.page - 1);
        }
      }
    }

    return await this.drizzle.transaction(async (trx) => {
      const rows = await this.drizzle.query.users.findMany({
        columns: {
          password: false,
        },
        with: {
          userInfo: true,
        },
        limit: limit,
        offset: offset,
      });

      const totalCount = await trx
        .select({
          count: count(users.id),
        })
        .from(users)
        .then((r) => r[0].count);

      return {
        users: rows,
        totalCount,
      };
    });
  }
}
