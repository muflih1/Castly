import { z } from "zod";

export const createAccountSchema = z.object({
  body: z.object({
    display_name: z.string().nonempty(),
    email: z.email().nonempty(),
    password: z.string().nonempty().min(8)
  })
})