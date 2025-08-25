import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { UserRole } from '../entities/user.entity'

export class CreateUserDto {
  @IsOptional()
  name?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
  @IsString()
  @IsOptional()
  subject: string; 
 
  @IsOptional()
  isActive: boolean;
}
