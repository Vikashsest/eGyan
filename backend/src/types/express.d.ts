import { UserRole } from '../../modules/user/entities/user.entity';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      role: UserRole;
    }
  }
}

export {};
