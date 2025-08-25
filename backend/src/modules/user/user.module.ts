import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Student } from '../student/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Student])],  
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService,TypeOrmModule]
})
export class UserModule {}
