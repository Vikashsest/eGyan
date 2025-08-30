import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { BookProgress } from "./book-progress.entity";
import { Chapter } from "./chapter.entity";

@Entity()

export class Book {
@PrimaryGeneratedColumn()
  id: number;
@Column()
bookName: string;
@Column({ nullable: true })
category: string; 
@Column({nullable:true})
subject: string;  
@Column({ nullable: true })
educationLevel: string;
@Column({ nullable: true })
language: string;
@Column({ nullable: true })
stateBoard: string; 
// @Column({ nullable: true })
// resourceType: string;  
@Column({ nullable: true })
fileUrl: string;
@Column({ nullable: true })
thumbnail: string; 
@CreateDateColumn()
uploadedAt: Date; 
@ManyToOne(() => User, (user) => user.books, { eager: true, nullable: true })
uploadedBy: User;
@OneToMany(() => BookProgress, (progress) => progress.book)
progressRecords: BookProgress[];
@Column({ nullable: true })
totalPages?: number;

  @OneToMany(() => Chapter, (chapter) => chapter.book)
  chapters: Chapter[];
}