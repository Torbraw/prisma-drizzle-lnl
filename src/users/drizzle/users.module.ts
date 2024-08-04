import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DrizzleModule } from 'src/lib/drizzle/drizzle.module';
import { UsersRelationsService } from './users-relations.service';

@Module({
  imports: [DrizzleModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRelationsService],
})
export class UsersModule {}
