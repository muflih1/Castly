import { Router } from "express";
import { createAccountHandler } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createAccountSchema } from "../../validation-schemas/user.schema.js";

const router = Router()

router.post('/signup', validate(createAccountSchema), createAccountHandler)

export default router