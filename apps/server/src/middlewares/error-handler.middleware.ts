import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(error: any, req: Request, res: Response, _: NextFunction) {
  console.error(`[FATAL] ${req.path}:`, error)
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: error.issues.map(e => ({
        message: e.message,
        code: e.code,
        path: e.path.join('.')
      }))
    })
  }
  return res.status(500).json({ error: { message: 'Internal server error' } })
}