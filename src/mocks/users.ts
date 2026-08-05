import type { User } from "@/types";

export const mockCurrentUser: User = {
  id: "user_kennedy",
  name: "Kennedy Sithole",
  email: "kennedy.Sithole@example.com",
  avatarInitials: "KS",
  plan: "pro",
  createdAt: "2025-11-12T09:00:00.000Z",
  streakDays: 12,
  profileCompletion: 78,
};

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: "user_jordan",
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
    plan: "pro",
    createdAt: "2025-08-03T14:20:00.000Z",
    profileCompletion: 92,
  },
  {
    id: "user_priya",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    plan: "team",
    createdAt: "2024-12-18T11:05:00.000Z",
    profileCompletion: 64,
  },
];
