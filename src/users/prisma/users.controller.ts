import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ValibotValidationPipe } from 'src/lib/valibot-validation.pipe';
import { PrismaSearchQuerySchema, PrismaCreateUserSchema, PrismaUpdateUserSchema } from 'src/lib/schemas';
import { PrismaSearchQuery, PrismaCreateUser, PrismaUpdateUser } from 'src/lib/types';

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

  @Delete(':id')
  public async delete(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.delete(id);
  }

  @Get()
  public async findAll(@Query(new ValibotValidationPipe(PrismaSearchQuerySchema)) query: PrismaSearchQuery) {
    return await this.usersService.findAll(query);
  }

  @Get('maturity')
  public async findAllWithMaturity() {
    return await this.usersService.findAllWithMaturity();
  }

  @Get('permissions-count')
  public async findAllWithPermissionsCount() {
    return await this.usersService.findAllWithPermissionsCount();
  }

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }
}
