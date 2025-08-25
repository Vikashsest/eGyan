import { IsEnum, IsString } from 'class-validator';
import { ConcernStatus } from '../entities/raise-concern.entity';

export class CreateConcernDto {
  @IsString()
  subject: string;

  @IsString()
  issueType: string;

  @IsString()
  priority: string;

  @IsString()
  message: string;

}
