import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
export enum ConcernStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}
@Entity()
export class Concern{
     @PrimaryGeneratedColumn()
    id:number  
    @Column()
    subject:string
    @Column()
    issueType:string
    @Column()
    priority:string
    @Column()
    message:string
      @Column({ type: 'enum', enum: ConcernStatus, default: ConcernStatus.PENDING })
     status: ConcernStatus;
    @ManyToOne(() => User, (user) => user.concerns)
    student: User;
    @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

}