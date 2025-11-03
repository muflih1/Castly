import { z } from "zod"

const schema = z.object({
  PORT: z.string().nonempty().default("5000"),
  DATABASE_URL: z.url().nonempty(),
  SESSION_SECRET: z.string().nonempty().min(32)
})

export type Environment = z.infer<typeof schema>

const { success, data, error } = await schema.safeParseAsync(process.env)

if (!success) {
  console.error(`[FATAL] [ENV] Missing environment variable:`, error.format())
  throw new Error('Missing environment variables')
}

export const env = data

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Environment { }
  }
}