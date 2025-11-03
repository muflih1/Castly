import type { RequestHandler } from "express";
import type { ZodObject } from "zod";

export function validate(schema: ZodObject): RequestHandler {
  return function handler(req, _res, next) {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params })
      next()
    } catch (error) {
      next(error)
    }
  }
}