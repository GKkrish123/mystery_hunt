import { MysteryEventBasic } from "./model/events";
import {
  type CategoryInteraction,
  type MysteryInteraction,
} from "./model/hunter-trails";
import { type HunterRank } from "./model/hunters";

export enum MysteryCollections {
  mysteries = "mysteries",
  events = "events",
  hunters = "hunters",
  hunterTrails = "hunter-trails",
  secretChamber = "secret-chamber",
  categories = "categories",
  hiddenGems = "hidden-gems",
  mail = "mail",
}

export interface State {
  name: string;
  state_code: string;
}

export interface MysteryFormValues {
  topThree: HunterRank[];
  triesLeft: number;
  isSolved: boolean;
  lastTriedAt?: number;
  actualSecret?: string;
  actualPoints?: string;
  eventData?: MysteryEventBasic;
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
