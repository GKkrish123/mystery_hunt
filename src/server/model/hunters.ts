import { type Timestamp } from "firebase/firestore";

export type Gender = "Male" | "Female" | "Transgender" | "Rainbow";

export interface Hunter {
  id: string;
  country: string;
  city: string;
  dob: Timestamp;
  email: string;
  gender: Gender;
  name: string;
  phoneNo: string;
  proPicUrl: string;
  state: string;
  scoreBoard: {
    totalScore: number;
    lastScoredAt: Timestamp;
    eventScores: Record<string, number>
  };
  userId: string;
  disabled: boolean;
  proPicUpdatedAt: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HunterRank {
  score: number;
  country: string;
  city: string;
  name: string;
  proPicUrl: string;
  state: string;
  rank: number;
}

export interface HunterEssentials {
  country: string;
  city: string;
  dob: Timestamp;
  email: string;
  gender: Gender;
  name: string;
  phoneNo: string;
  proPicUrl: string;
  proPicUpdatedAt: number;
  state: string;
  scoreBoard: {
    totalScore: number;
    lastScoredAt: Timestamp;
    eventScores: Record<string, number>
  };
}
