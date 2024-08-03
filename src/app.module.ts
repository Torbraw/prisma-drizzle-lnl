import { Module } from '@nestjs/common';
import { UsersModule as PrismaUsersModule } from './users/prisma/users.module';
import { UsersModule as DrizzleUsersModule } from './users/drizzle/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaUsersModule,
    DrizzleUsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
