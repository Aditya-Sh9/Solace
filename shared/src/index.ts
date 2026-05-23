// Standard API envelope used by all backend routes
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  date: string;
  moodScore: 1 | 2 | 3 | 4 | 5 | 6;
  energyScore: 1 | 2 | 3 | 4 | 5 | 6;
  sleepHours: number | null;
  waterGlasses: number | null;
  sunlightMinutes: number | null;
  stressLevel: 1 | 2 | 3 | 4 | 5 | null;
  notes: string | null;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  // Stored as ciphertext — never decrypted server-side
  ciphertext: string;
  iv: string;
  createdAt: string;
  updatedAt: string;
}
