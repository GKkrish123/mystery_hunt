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
    points: number;
  }[];
  lastSolvedAt: Timestamp;
  solvedCount: number;
  firstViewedAt: Timestamp | null;
  linkedEvent?: string;
  maxPoints: number;
  minPoints: number;
  preFindCooldown: number;
  preFindCooldownCut: number;
  postFindCooldown: number;
  postFindCooldownCut: number;
  likesCount: number;
  viewsCount: number;
  viewsInLast24Hours: number;
  tags: string[];
  thumbnailUrl: string;
  retryInterval: number;
  isLiked: boolean;
  attachments: Attachments;
  scheduledAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
