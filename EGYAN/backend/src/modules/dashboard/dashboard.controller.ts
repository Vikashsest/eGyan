import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from '../user/entities/user.entity';


@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('teacher')
  @Roles(UserRole.ADMIN,UserRole.ADMIN,UserRole.TEACHER)  
  getStatsDashboard(){
    return this.dashboardService.getTeacherDashboardStats()
  }

@Get('recent-upload')
@Roles(UserRole.ADMIN,UserRole.PRINCIPAL,UserRole.TEACHER)
recentUpload(){
  return this.dashboardService.recentUpload()
}

}
