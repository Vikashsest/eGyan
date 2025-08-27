import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concern } from '../student/entities/raise-concern.entity';
import { StudentModule } from '../student/student.module';
import { NextcloudModule } from '../nextcloud/nextcloud.module';
@Module({
  imports: [TypeOrmModule.forFeature([Book,User,Concern]),UserModule,StudentModule,NextcloudModule],
  
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
