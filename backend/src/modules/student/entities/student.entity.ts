import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.studentProfile, { cascade: true, eager: true })
  @JoinColumn()
  user: User;

@Column()
className: string;
@Column()
rollNo: number;
@Column({ name: 'book_id' }) 
bookId: number; 
}
