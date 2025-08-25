import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2).max(32),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const quoteCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  amount: z.number().nonnegative(),
  currency: z.enum(["KRW","USD","CNY"]).default("KRW"),
});
