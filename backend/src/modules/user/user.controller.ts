import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req, UnauthorizedException, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import { User, UserRole } from './entities/user.entity';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';

import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

@Post()
async createUser(@Body() dto: CreateUserDto, @Req() req: any) {
  return this.userService.createUser(dto, req.user);
}

//ROLE MANAGEMET API 
@Patch('update-role/:id')
@Roles(UserRole.ADMIN,UserRole.PRINCIPAL,UserRole.TEACHER)
async updateRole(
  @Param('id') id: number,
  @Body() dto: UpdateRoleDto,
  @Req() req: Request,
) {
  console.log('Current Admin:', req.user);
  if (!req.user) {
  throw new UnauthorizedException('User not found in request');
}
  const adminUser = req.user as User; 
  return this.userService.updateUserRole(+id, dto, adminUser);
}

//MANAGE STUDENTS,TEACHER,PRINCIPAL 


@Get('filter')
@Roles(UserRole.ADMIN,UserRole.PRINCIPAL,UserRole.TEACHER)
async getUsers(@Query('role') role: UserRole, @Req() req) {

  return this.userService.findByRole(role);
}
//GET ALL  STUDENTS,TEACHER,STUDENTS

@Get()
@Roles(UserRole.ADMIN,UserRole.PRINCIPAL,UserRole.TEACHER)
getAllUsers(): Promise<User[]> {
console.log(this.userService.findAll())
  return this.userService.findAll();
}
//Delete role


@Delete('delete-role/:id')
@Roles(UserRole.ADMIN,UserRole.TEACHER,UserRole.PRINCIPAL)
async deleteRole(
    @Param('id') id: number){
      return this.userService.deleteRole(id)
    }
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }
}
