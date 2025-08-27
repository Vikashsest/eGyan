import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { UserRole } from '../user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/utils/multer';
import { extname } from 'path';


@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //GET ALL STASTS OF ADMIN DASHBOARD
  @Get('stats')
  @Roles(UserRole.ADMIN)        
  findAll(@Req() req) {
    
    return this.adminService.getDashboardStats();
  }


@Get('school-overview')
 @Roles(UserRole.ADMIN)
async getSchoolOverView(@Req() req){
  return this.adminService.getSchoolOverview()
}
@Get('concerns')
async getAllConcerns(@Req() req) {
  return this.adminService.getAllConcerns();
}

@Post('upload-credentials')
// @Roles(UserRole.ADMIN)
@UseInterceptors(FileInterceptor('credentialFile', multerConfig)) 
async uploadCredentials(@UploadedFile() file: Express.Multer.File) {
  if (!file) throw new BadRequestException('File is required');

  const ext = extname(file.originalname).toLowerCase();
  if (!['.xlsx', '.xls'].includes(ext)) {
    throw new BadRequestException('Only Excel files are allowed');
  }

  return this.adminService.importUsersFromFile(file.path);
}

}


