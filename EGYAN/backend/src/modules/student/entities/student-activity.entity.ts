// src/modules/student/entities/student-activity.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Book } from 'src/modules/book/entities/book.entity';
import { Chapter } from 'src/modules/book/entities/chapter.entity';
export enum ResourceType {
  PDF = 'PDF',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

export enum ActivityType {
  OPENED = 'OPENED',
  COMPLETED = 'COMPLETED',
  FAVORITE = 'FAVORITE',
}

@Entity('student_activities')
export class StudentActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.activities, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: ResourceType })
  resourceType: ResourceType;
 @ManyToOne(() => Chapter, { eager: true, nullable: true })
  chapter?: Chapter;
  @Column({ type: 'enum', enum: ActivityType })
  activityType: ActivityType;

  @Column()
  resourceTitle: string;


  @Column({ type: 'int', default: 0 })
  timeSpent: number; 

  @CreateDateColumn()
  createdAt: Date;
  @Column({ default: false })
isCompleted: boolean;
@Column({ default: false })
isFavorite: boolean;
@UpdateDateColumn()
updatedAt: Date;
@ManyToOne(() => Book, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'bookId' }) 
book: Book;
@Column({ type: 'int', nullable: true })
pageNumber?: number;
}
