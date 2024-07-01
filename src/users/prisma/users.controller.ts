import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('prisma/users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}
}
