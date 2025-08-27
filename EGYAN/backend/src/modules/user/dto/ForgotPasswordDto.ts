import { IsDateString, IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;

   @IsDateString() 
  dob: string;

  @IsString()
  newPassword: string;

  @IsString()
  confirmPassword: string;
}
 