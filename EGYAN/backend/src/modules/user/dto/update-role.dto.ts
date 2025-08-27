import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
    @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
