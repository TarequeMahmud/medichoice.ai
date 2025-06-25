import { UUID } from 'crypto';

export interface JwtPayload {
  sub: UUID;
  email: string;
}
