import { Module } from '@nestjs/common';
import { UsersModule as PrismaUsersModule } from './users/prisma/users.module';

@Module({
  imports: [PrismaUsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
