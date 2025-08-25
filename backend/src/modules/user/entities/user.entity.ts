import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "src/modules/student/entities/student.entity";
import { Exclude } from "class-transformer";
import { StudentActivity } from "src/modules/student/entities/student-activity.entity";
import { Concern } from "src/modules/student/entities/raise-concern.entity";
import { Book } from "src/modules/book/entities/book.entity";
import { BookProgress } from "src/modules/book/entities/book-progress.entity";

export enum UserRole {
  ADMIN = 'admin',
  PRINCIPAL = 'principal',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
@Column({ nullable: true })
@Exclude()
password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

 @Column({ type: 'varchar', nullable: true })
subject: string | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  dob: Date|null
  @OneToOne(() => Student, (student) => student.user, { nullable: true })
  studentProfile: Student;
  @OneToMany(() => StudentActivity, activity => activity.user)
activities: StudentActivity[];
@OneToMany(() => Concern, (concern) => concern.student)
concerns: Concern[];
@OneToMany(() => Book, (book) => book.uploadedBy)
books: Book[];
@OneToMany(() => BookProgress, (progress) => progress.book)
progressRecords: BookProgress[];
}
