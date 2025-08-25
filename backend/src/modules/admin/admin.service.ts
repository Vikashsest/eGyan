import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../book/entities/book.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { ILike } from 'typeorm';
import { Concern } from '../student/entities/raise-concern.entity';
import { instanceToPlain } from 'class-transformer';
import { Student } from '../student/entities/student.entity';
import * as bcrypt from 'bcrypt';
import * as XLSX from 'xlsx';
import { NextcloudService } from '../nextcloud/nextcloud.service';

import { unlink } from 'fs/promises';
import * as path from 'path';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Concern)
    private readonly concernRepo:Repository<Concern>,
    @InjectRepository(Student)
    private readonly studentRepo:Repository<Student>,
    private readonly nextcloudService: NextcloudService,
  ) {}

  async getDashboardStats() {
  const totalBooks = await this.bookRepo.count();
  const totalPdf = await this.bookRepo.count({ where: { resourceType: ILike('PDF') } });
  const totalVideos = await this.bookRepo.count({ where: { resourceType: ILike('Video') } });
  const totalAudio = await this.bookRepo.count({ where: { resourceType: ILike('Audio') } });
  const totalStudents = await this.userRepo.count({ where: { role: UserRole.STUDENT } });
     
    return {
      totalBooks,
      totalPdf,
      totalVideos,
      totalAudio,
      totalStudents,
    };
  }
  async getAllConcerns() {
  const concerns = await this.concernRepo
    .createQueryBuilder('concern')
    .leftJoinAndSelect('concern.student', 'student')
    .orderBy(`
      CASE 
        WHEN concern.status = 'resolved' THEN 0
        WHEN concern.status = 'pending' THEN 1
        WHEN concern.status = 'rejected' THEN 2
        ELSE 3
      END
    `)
    .addOrderBy('concern.id', 'DESC')
    .getMany();

  return instanceToPlain(concerns); 
}

async getSchoolOverview(){
  const totalBooks = await this.bookRepo.count();
  const totalTeachers=await this.userRepo.count({where:{role:UserRole.TEACHER}})
  const totalStudents=await this.userRepo.count({where:{role:UserRole.STUDENT}})
  const totalClasses = await this.studentRepo
    .createQueryBuilder('student')
    .select('COUNT(DISTINCT  student.className)', 'count')
    .getRawOne();
  return {
    totalBooks,totalTeachers,totalStudents,totalClasses: parseInt(totalClasses.count)
  }
}
// async importUsersFromFile(filePath: string) {
//     const workbook = XLSX.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rawData = XLSX.utils.sheet_to_json(sheet);
//     const data = rawData.map((row: any) => {
//       const normalized: any = {};
//       Object.keys(row).forEach((key) => {
//         normalized[key.toLowerCase()] = row[key];
//       });
//       return normalized;
//     });

//     console.log('Parsed Excel Data:', data);

//     const usersToInsert: User[] = [];

//     for (const row of data) {
//       const r = row as {
//         name?: string;
//         email?: string;
//         password?: string;
//         role?: string;
//         subject?: string;
//         dob?: string;
//         isactive?: boolean;
//       };

//       const { name, email, password, role, subject, dob, isactive } = r;

//       if (!email || !password || !name || !role) continue;

//       const hashedPassword = await bcrypt.hash(password.toString(), 10);

//   const user: User = this.userRepo.create({
//   name: name!,
//   email: email!,
//   password: hashedPassword,
//   role: role!.toLowerCase() as any, 
//   subject: subject || null,
//   dob: dob ? new Date(dob) : null,
//   isActive: isactive !== undefined ? Boolean(isactive) : true,
// });

//       usersToInsert.push(user);
//     }

//     if (usersToInsert.length === 0) {
//       throw new BadRequestException('No valid users found in the file');
//     }

//     try {
//       await this.userRepo.save(usersToInsert);
//       console.log('Inserted users into DB:', usersToInsert.length);
//     } catch (error) {
//       console.error('Error saving users:', error);
//       throw new BadRequestException('Failed to save users to DB');
//     }

//     return { message: `${usersToInsert.length} users uploaded successfully` };
//   }


async importUsersFromFile(filePath: string) {
  // 1. Parse Excel File first
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json(sheet);

  const data = rawData.map((row: any) => {
    const normalized: any = {};
    Object.keys(row).forEach((key) => {
      normalized[key.toLowerCase()] = row[key];
    });
    return normalized;
  });

  console.log('Parsed Excel Data:', data);

  // 2. Prepare user entities
  const usersToInsert: User[] = [];

  for (const row of data) {
    const r = row as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      subject?: string;
      dob?: string;
      isactive?: boolean;
    };

    const { name, email, password, role, subject, dob, isactive } = r;

    if (!email || !password || !name || !role) continue;

    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    const user: User = this.userRepo.create({
      name: name!,
      email: email!,
      password: hashedPassword,
      role: role!.toLowerCase() as any,
      subject: subject || null,
      dob: dob ? new Date(dob) : null,
      isActive: isactive !== undefined ? Boolean(isactive) : true,
    });

    usersToInsert.push(user);
  }

  if (usersToInsert.length === 0) {
    throw new BadRequestException('No valid users found in the file');
  }

  try {
    await this.userRepo.save(usersToInsert);
    console.log('Inserted users into DB:', usersToInsert.length);
  } catch (error) {
    console.error('Error saving users:', error);
    throw new BadRequestException('Failed to save users to DB');
  }

  try {
    await unlink(filePath);
    console.log('Temporary file deleted:', filePath);
  } catch (err) {
    console.warn('Failed to delete local file:', err);
  }

  return {
    message: `${usersToInsert.length} users uploaded successfully`,
  };
}


}
