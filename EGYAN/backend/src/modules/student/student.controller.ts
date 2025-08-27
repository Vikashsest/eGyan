
import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StudentService } from './student.service';
import { RolesGuard } from '../../common/guard/role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CreateConcernDto } from './dto/raise-concern.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { UserRole } from '../user/entities/user.entity';
import { LogActivityDto } from './dto/log.acitvity.dto';


@Controller('students')
@UseGuards(JwtAuthGuard,RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService)
 
  {}

 @Get('metrices')
@Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER,UserRole.STUDENT)
async getStudentDashboardStats(@Req() req: any) {
  console.log(req.user)
  const userId = req.user?.['id']; 
  if (!userId) throw new UnauthorizedException('No user ID');
  return this.studentService.studentMetrice(userId);
}
@Post("mark-completed")
@Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.STUDENT)
async markAsComplete(@Req() req, @Body() body) {
  const userId = req.user.id;
  const { bookId } = body;
  return this.studentService.markBookAsCompleted(userId, bookId);
}
@Post('concerns')
@Roles(UserRole.STUDENT)
@UseInterceptors(FileInterceptor('file'))
async raiseConcern(
  @UploadedFile() file: Express.Multer.File,
  @Req() req: Request,

) {
  const user = req.user as any;
  const { subject, issueType, priority, message } = req.body;
  const dto: CreateConcernDto = {
    subject,
    issueType,
    priority,
    message,
  };

  return this.studentService.raiseConcern(user.id, dto);
}

@Get('previous-concerns')
@Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.STUDENT)
async getPreviousConcerns(@Req() req: any) {
  const userId = req.user?.id;
  return this.studentService.previousConcern(userId);
}

  @Get('filter')
  filterBooks(@Query() query: any) {
    return this.studentService.getByFilters(query);
  }
 @Get('progress')
  async getStudentProgress(@Req() req) {
    const userId = req.user.id; 
    return this.studentService.getStudentProgress(userId);
  }
  @Get('recent-books')
async getRecentBooks(@Req() req) {
  const userId = req.user.id;
  return this.studentService.getRecentBooks(userId);
}
@Get('favorite-books')
@Roles(UserRole.STUDENT)
getFavoriteBooks(@Req() req) {
  return this.studentService.getFavoriteBooksList(req.user.id);
}
@Get('favorites')
@Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.STUDENT)
async getFavoriteBook(@Req() req: any) {
  const userId = req.user?.['id'];
  if (!userId) throw new UnauthorizedException('No user ID');
  return this.studentService.getFavoriteBooks(userId);
}


@Patch('toggle-favorite/:bookId')
@Roles(UserRole.STUDENT)
async toggleFavorite(@Req() req, @Param('bookId') bookId: number) {
  const userId = req.user?.['id'];
  return this.studentService.toggleFavoriteStatus(userId, bookId);
}
@Post('activity')
@Roles(UserRole.STUDENT)
async logBookActivity(@Req() req, @Body() body: LogActivityDto) {
  const userId = req.user.id;
  console.log(body)
  return this.studentService.logActivity(userId, body);
}
@Get('announcements')
async getAnnouncements() {
  return this.studentService.getAnnouncements();
}
@Delete('concern/:id')
async deleteConcern(@Param('id', ParseIntPipe) id: number) {
  if (isNaN(id)) {
    throw new BadRequestException('Concern ID must be a number');
  }
  return await this.studentService.deleteConcern(id);
}

}
