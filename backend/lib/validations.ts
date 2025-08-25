import { z } from "zod";

// (선택) 허용 도메인
const allowed = (process.env.ALLOWED_EMAIL_DOMAINS ?? "")
  .split(",")
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

export const registerSchema = z.object({
  email: z.string().email().transform(v => v.trim().toLowerCase()).refine(v => {
    if (!allowed.length) return true;
    const d = v.split("@")[1] ?? "";
    return allowed.includes(d);
  }, "Email domain not allowed"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must include letters")
    .regex(/\d/, "Password must include numbers"),
  name: z.string().min(2, "Please enter your full name").transform(s => s.trim()),
});

export type RegisterPayload = z.infer<typeof registerSchema>;
