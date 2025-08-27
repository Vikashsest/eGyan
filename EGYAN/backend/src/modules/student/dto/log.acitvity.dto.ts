import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ResourceType } from '../entities/student-activity.entity';
import { ActivityType } from '../entities/student-activity.entity';

export class LogActivityDto {
  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @IsEnum(ResourceType)
  @IsNotEmpty()
  resourceType: ResourceType;

  @IsOptional()
  @IsNotEmpty()
  chapterId?: number;

  @IsOptional()
  @IsEnum(ActivityType)
  activityType?: ActivityType;

  @IsOptional()
  isCompleted?: boolean;

  @IsOptional()
  @IsNumber()
  timeSpent?: number;
 @IsOptional()
  @IsInt()
  pageNumber?: number; 
}
