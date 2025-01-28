import { type Timestamp } from "firebase/firestore";

export interface Trail {
  guessCount: number;
  guessedAt: Timestamp;
  guessedValue: string;
  isSolved: boolean;
  mysteryId: string;
  points?: number;
  achievement?: string
}

export interface Achievement {
  guessCount: number;
  guessedAt: Timestamp;
  guessedValue: string;
  name: string;
  imgUrl: string;
  points: number;
  achievement: string
}

export interface MysteryInteraction {
  isLiked: boolean;
  isSolved: boolean;
  lastGuessedAt: Timestamp | null;
  lastViewedAt: Timestamp | null;
  likedAt: Timestamp | null;
  viewCount: number;
  guessCount: number;
}

export interface CategoryInteraction {
  isBookmarked: boolean;
  lastViewedAt: Timestamp | null;
  bookmarkedAt: Timestamp | null;
  viewCount: number;
}

export interface ToolsInteraction {
  torch: number | null;
  eye: number | null;
  brush: number | null;
  axe: number | null;
}

export interface Interactions {
  mysteries: Record<string, MysteryInteraction>;
  categories: Record<string, CategoryInteraction>;
  tools: ToolsInteraction;
}

export interface HunterTrail {
  id: string;
  hunterId: string;
  trails: Trail[];
  interactions: Interactions;
  feedbacks: string[];
  lastFeedbackAt: number | null;
}
