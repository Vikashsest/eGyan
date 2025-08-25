import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';

import * as dotenv from 'dotenv';
import { Book } from 'src/modules/book/entities/book.entity';
import { Student } from 'src/modules/student/entities/student.entity';
import { StudentActivity } from 'src/modules/student/entities/student-activity.entity';
import { Concern } from 'src/modules/student/entities/raise-concern.entity';
import { BookProgress } from 'src/modules/book/entities/book-progress.entity';
import { Announcement } from 'src/modules/student/entities/announcement.entity';
import { Chapter } from 'src/modules/book/entities/chapter.entity';


dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres#123',
  database: process.env.DB_NAME || 'psathi',
  entities: [User,Book,Student,StudentActivity,Concern,BookProgress,Announcement,Chapter],
  ssl: {
    rejectUnauthorized: false,  // Agar self-signed cert hai to false rakh sakte ho
  },
  // Optional: timeout settings
  extra: {
    connectionTimeoutMillis: 30000,
  },
   synchronize: true,
};

