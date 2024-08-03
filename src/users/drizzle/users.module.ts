import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DrizzleModule } from 'src/lib/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
