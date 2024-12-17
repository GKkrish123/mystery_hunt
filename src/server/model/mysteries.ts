import { type Timestamp } from "firebase/firestore";

export interface Attachments {
  photos: string[];
}

export interface Mystery {
  id: string;
  title: string;
  searchKeywords: string[];
  description: string;
  question: string;
  hints: string[];
  guessCount: number;
  lastGuessedAt: Timestamp;
  lastGuessedBy: string;
  maxTries: number;
  expectedSecret: string;
  solvedBy: {
    hunterId: string;
    solvedAt: Timestamp;
    guessCount: number;
  }[];
  lastSolvedAt: Timestamp;
  solvedCount: number;
  likesCount: number;
  viewsCount: number;
  viewsInLast24Hours: number;
  tags: string[];
  thumbnailUrl: string;
  retryInterval: number;
  isLiked: boolean;
  attachments: Attachments;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
