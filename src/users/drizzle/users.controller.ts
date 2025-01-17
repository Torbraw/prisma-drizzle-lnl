import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ValibotValidationPipe } from 'src/lib/valibot-validation.pipe';
import { DrizzleCreateUserSchema, DrizzleSearchQuerySchema, DrizzleUpdateUserSchema } from 'src/lib/schemas';
import { DrizzleCreateUser, DrizzleSearchQuery, DrizzleUpdateUser } from 'src/lib/types';
import { UsersRelationsService } from './users-relations.service';

@Controller('drizzle/users')
export class UsersController {
  public constructor(
    private readonly usersService: UsersService,
    private readonly userRelationsService: UsersRelationsService,
  ) {}

  @Post()
  public async create(@Body(new ValibotValidationPipe(DrizzleCreateUserSchema)) data: DrizzleCreateUser) {
    return await this.usersService.create(data);
  }

  @Put(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValibotValidationPipe(DrizzleUpdateUserSchema)) data: DrizzleUpdateUser,
  ) {
    return await this.usersService.update(id, data);
  }

  @Delete(':id')
  public async delete(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.delete(id);
  }

  @Get()
  public async findAll(@Query(new ValibotValidationPipe(DrizzleSearchQuerySchema)) query: DrizzleSearchQuery) {
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

  //#region Relations

  @Get('relations')
  public async relationsFindAll(@Query(new ValibotValidationPipe(DrizzleSearchQuerySchema)) query: DrizzleSearchQuery) {
    return await this.userRelationsService.findAll(query);
  }

  @Get('relations/:id')
  public async relationsFindOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userRelationsService.findOne(id);
  }

  //#endregion
}
