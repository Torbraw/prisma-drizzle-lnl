import { Module } from '@nestjs/common';
import { UsersModule as PrismaUsersModule, UsersModule as DrizzleUsersModule } from './users/prisma/users.module';
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
