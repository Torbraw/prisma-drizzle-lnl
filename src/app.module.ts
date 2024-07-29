import { Module } from '@nestjs/common';
import { UsersModule as PrismaUsersModule } from './users/prisma/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaUsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
