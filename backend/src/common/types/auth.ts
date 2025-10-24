import { UUID } from 'crypto';

export interface JwtPayload {
  sub: UUID;
  email: string;
  full_name: string;
  role: UserRole;
}

import { Request } from 'express';
import { Socket } from 'socket.io';
import { UserRole } from 'src/users/entities/user.entity';

export interface RequestWithUser extends Request {
  user: {
    userId: UUID;
    full_name: string;
    email: string;
  };
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface AuthenticatedSocket extends Socket {
  data: {
    user: JwtPayload;
    room: string;
  };
}
