import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]),
});

export type RegisterForm = z.infer<typeof registerSchema>;


 