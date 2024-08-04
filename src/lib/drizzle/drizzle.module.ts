import { Module } from '@nestjs/common';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { ConfigService } from '@nestjs/config';
import { createConnection } from 'mysql2/promise';
import * as schema from './schema';

@Module({
  providers: [
    {
      provide: 'Drizzle',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<Drizzle | DrizzleWithSchema> => {
        const connection = await createConnection({
          uri: configService.getOrThrow<string>('DATABASE_URL'),
        });
        return drizzle(connection, {
          logger: true,
          mode: 'default',
          // Schema only needef for relationnal queries
          schema,
        });
      },
    },
  ],
  exports: ['Drizzle'],
})
export class DrizzleModule {}

export type Drizzle = MySql2Database;
export type DrizzleWithSchema = MySql2Database<typeof schema>;
