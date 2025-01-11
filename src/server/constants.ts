import {
  type CategoryInteraction,
  type MysteryInteraction,
} from "./model/hunter-trails";
import { type HunterRank } from "./model/hunters";

export enum MysteryCollections {
  mysteries = "mysteries",
  hunters = "hunters",
  hunterTrails = "hunter-trails",
  secretChamber = "secret-chamber",
  categories = "categories",
  hiddenGems = "hidden-gems",
}

export interface State {
  name: string;
  state_code: string;
}

export interface MysteryFormValues {
  topThree: HunterRank[];
  triesLeft: number;
}

export const defaultMysteryInteraction: MysteryInteraction = {
  isLiked: false,
  lastGuessedAt: null,
  lastViewedAt: null,
  likedAt: null,
  viewCount: 0,
  guessCount: 0,
  isSolved: false,
};

export const defaultCategoryInteraction: CategoryInteraction = {
  lastViewedAt: null,
  viewCount: 0,
  isBookmarked: false,
  bookmarkedAt: null,
};

export const proPicUpdateCooldown = 24 * 60 * 60 * 1000; // 24 hours
export const feedbackAddCooldown = 24 * 60 * 60 * 1000; // 24 hours
