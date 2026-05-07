import { Request } from 'express';

export type JwtPayload = {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
};

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};
