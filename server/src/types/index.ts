import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error?: any;
}
