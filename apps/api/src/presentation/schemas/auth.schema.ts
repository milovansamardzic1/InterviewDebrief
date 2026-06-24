import { z } from "zod";

export const LoginBodySchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;

export const RegisterBodySchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(1).max(120).optional(),
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
