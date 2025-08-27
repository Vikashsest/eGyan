import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../book/entities/book.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { Student } from '../student/entities/student.entity';

@Injectable()
export class DashboardService {
 constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepo:Repository<Student>
  ) {}

 async getTeacherDashboardStats() {
  const totalStudents = await this.userRepo.count({
    where: { role: UserRole.STUDENT },
  });

  const totalSubjectsRaw = await this.bookRepo
    .createQueryBuilder('book')
    .select('COUNT(DISTINCT book.subject)', 'count')
    .getRawOne();
  const totalSubjects = parseInt(totalSubjectsRaw.count) || 0;

  const totalBooks = await this.bookRepo.count();

  const totalClassesRaw = await this.studentRepo
    .createQueryBuilder('student')
    .select('COUNT(DISTINCT student.className)', 'count')
    .getRawOne();
  const totalClasses = parseInt(totalClassesRaw.count) || 0;

  const teacherUploadBooks = await this.bookRepo.count({
    where: {
      uploadedBy: {
        role: UserRole.TEACHER,
      },
    },
    relations: ['uploadedBy'],
  });

  const books = await this.bookRepo.find();

  const subjectWiseUploads = {};

  books.forEach((book) => {
    const subject = book.subject;
    const month = book.uploadedAt.toLocaleString('default', { month: 'short' });

    if (!subjectWiseUploads[subject]) {
      subjectWiseUploads[subject] = [];
    }

    const monthEntry = subjectWiseUploads[subject].find(
      (m) => m.month === month
    );
    if (monthEntry) {
      monthEntry.uploads++;
    } else {
      subjectWiseUploads[subject].push({ month, uploads: 1 });
    }
  });

  return {
    totalStudents,
    totalBooks,
    totalClasses,
    teacherUploadBooks,
    totalSubjects,
    subjectWiseUploads, 
  };
}


  async recentUpload(){
    const recentUploads=await this.bookRepo.find({
      order:{uploadedAt:'DESC'},
      take:5,
      relations:['uploadedBy']
    })
    return{
      recentUploads
    }
  }



}
