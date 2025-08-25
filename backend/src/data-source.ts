import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './modules/user/entities/user.entity';
import { Book } from './modules/book/entities/book.entity';
import { Student } from './modules/student/entities/student.entity';
import { StudentActivity } from './modules/student/entities/student-activity.entity';
import { Concern } from './modules/student/entities/raise-concern.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres#123',
  database: process.env.DB_NAME || 'psathi',
  entities: [User, Book, Student, StudentActivity, Concern],
  migrations: ['src/migrations/*.ts'], // required for migrations
  synchronize: false, // important: keep false when using migrations
  logging: true,
});
