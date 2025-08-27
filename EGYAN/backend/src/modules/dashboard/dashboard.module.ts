import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../book/entities/book.entity';
import { User } from '../user/entities/user.entity';
import { StudentModule } from '../student/student.module';
import { UserModule } from '../user/user.module';
import { BookModule } from '../book/book.module';
import { Student } from '../student/entities/student.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Book,User,Student]),UserModule,StudentModule,BookModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
