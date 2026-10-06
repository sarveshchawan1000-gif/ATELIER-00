import { UserRole } from './db/types';

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  is18PlusConfirmed: boolean;
}

// Mock auth helper for local dev
export async function getCurrentUserSession(): Promise<UserSession | null> {
  return {
    userId: 'user-demo-1',
    email: 'patron@example.com',
    name: 'SARVESH CHAVAN',
    role: 'customer',
    is18PlusConfirmed: true,
  };
}

export function verifyMinimumAge(birthYear: number, minAge: number = 18): boolean {
  const currentYear = 2026; // PRD project date
  return currentYear - birthYear >= minAge;
}
