import { UUID } from 'crypto';

export interface JwtPayload {
  sub: UUID;
  email: string;
  role: UserRole;
}

import { Request } from 'express';
import { UserRole } from 'src/users/entities/user.entity';

export interface RequestWithUser extends Request {
  user: {
    userId: UUID;
    email: string;
  };
}
