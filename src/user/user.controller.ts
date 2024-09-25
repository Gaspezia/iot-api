import { Controller, Get, Post, Param, Delete, Body, Query, UseGuards, Request, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { requestParamsToQueryBuilder } from '../utils/query-util';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() params: any) {
    let queryBuilder;

    queryBuilder = this.userService.createQueryBuilder('user');

    const filteredQuery = requestParamsToQueryBuilder(params, queryBuilder, [
      'email',
      'is_admin',
      'is_active',
      'last_login'
    ]);

    const users = await filteredQuery.getMany();
    const count = await filteredQuery.getCount();

    return {
      data: users,
      count
    };
  }

  @Post()
  create(@Body() user: User) {
    return this.userService.create(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() user: User) {
    return this.userService.update(+id, user);
  }

  @Get('me')
  async me(@Request() req) {
    const user = req.user;
    return this.userService.findOne(user.id);
  }
}
