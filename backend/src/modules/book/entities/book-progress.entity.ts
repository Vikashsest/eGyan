import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Book } from './book.entity';

@Entity()
export class BookProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.progressRecords)
  user: User;

  @ManyToOne(() => Book, (book) => book.progressRecords)
  book: Book;

  @Column({ type: 'int', default: 0 })
  progress: number; 

  @UpdateDateColumn()
  lastAccessed: Date;
}
