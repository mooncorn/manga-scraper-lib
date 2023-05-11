import { Request, Response, NextFunction } from 'express';
import { UnauthorizedRequestError } from '../errors/unauthorized-request-error';

// requireAuth assumes the request has already
// been processed by currentUser middleware
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new UnauthorizedRequestError();
  }

  next();
};
