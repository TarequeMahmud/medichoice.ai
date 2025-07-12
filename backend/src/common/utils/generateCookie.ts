import { Response } from 'express';

export default function generateCookie(res: Response, token: string): string {
  res.cookie('access-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24,
  });
  return token;
}
