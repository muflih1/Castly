import type { Request, Response, NextFunction, RequestHandler } from "express"

export function catchAsync<T>(callback: (req: Request, res: Response, next: NextFunction) => Promise<T>): RequestHandler {
  return function handler(req, res, next) {
    Promise.resolve(callback(req, res, next)).catch(next)
  }
}