import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsNumber } from 'class-validator';

export class CreateBookDto {
  
@IsString()
bookName: string;
@IsOptional()
@IsString()
chapter?: number;
@IsString()
subject: string;
@IsString()
category:string;
@IsString()
educationLevel: string;
@IsString()
language: string;
@IsString()
@IsOptional()
stateBoard?: string;
@IsString()
resourceType: string;
@IsOptional()
fileUrl?: string;
@IsOptional()
fileType?: string;
@IsOptional()
thumbnail?: string;
@IsOptional()
@Type(() => Number) 
@IsInt({ message: 'totalPages must be an integer number' }) 
totalPages?: number;
}
