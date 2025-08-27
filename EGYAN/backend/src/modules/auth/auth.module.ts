import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
@Module({
    imports: [
    TypeOrmModule.forFeature([User])  ,
      UserModule, 
      PassportModule
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
   exports: [TypeOrmModule,PassportModule,AuthService],
})
export class AuthModule {}
