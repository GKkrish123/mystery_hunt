import { type Timestamp } from "firebase/firestore";

export interface Category {
  id: string;
  bookmarkCount: number;
  description: string;
  name: string;
  tag: string;
  themePicUrl: string;
  isBookmarked: boolean;
  viewsCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
