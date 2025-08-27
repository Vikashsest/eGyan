import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { User } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';
import { StudentActivity } from './entities/student-activity.entity';
import { Concern } from './entities/raise-concern.entity';
import { BookProgress } from '../book/entities/book-progress.entity';
import { Announcement } from './entities/announcement.entity';
import { Chapter } from '../book/entities/chapter.entity';


@Module({
   imports: [TypeOrmModule.forFeature([Student, User,Book,StudentActivity,Concern,BookProgress,Announcement,Chapter])],
  controllers: [StudentController],
   exports: [TypeOrmModule],
  providers: [StudentService],
})
export class StudentModule {}
