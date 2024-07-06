import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { ValibotValidationPipe } from 'src/lib/valibot-validation.pipe';
import { PrismaCreateUserSchema, PrismaUpdateUserSchema } from 'src/lib/schemas';
import { PrismaCreateUser, PrismaUpdateUser } from 'src/lib/types';

@Controller('prisma/users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body(new ValibotValidationPipe(PrismaCreateUserSchema)) data: PrismaCreateUser) {
    return await this.usersService.create(data);
  }

  @Put(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValibotValidationPipe(PrismaUpdateUserSchema)) data: PrismaUpdateUser,
  ) {
    return await this.usersService.update(id, data);
  }

  @Get()
  public async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }

  @Get('maturity')
  public async findAllWithMaturity() {
    return await this.usersService.findAllWithMaturity();
  }
}
