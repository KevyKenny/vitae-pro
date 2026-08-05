import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (v) => !v || /^https?:\/\/.+/i.test(v) || /^[\w.-]+\.[a-z]{2,}/i.test(v),
    "Enter a valid URL",
  );

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  title: z.string().trim().min(2, "Professional title is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(6, "Enter a valid phone number"),
  location: z.string().trim().min(2, "Location is required"),
  country: z.string().min(2, "Select a country"),
  linkedin: optionalUrl,
  portfolio: optionalUrl,
  github: optionalUrl,
  website: optionalUrl,
  careerLevel: z.enum([
    "student",
    "graduate",
    "junior",
    "mid-level",
    "senior",
    "executive",
  ]),
  industry: z.enum([
    "technology",
    "finance",
    "healthcare",
    "marketing",
    "design",
    "engineering",
  ]),
  yearsExperience: z.number().min(0, "Enter years of experience").max(50),
  employmentStatus: z.string().min(1, "Select employment status"),
  careerGoals: z.string().max(500, "Keep under 500 characters"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;
