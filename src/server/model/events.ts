import { type Timestamp } from "firebase/firestore";
import { type Mystery } from "./mysteries";

export interface MysteryEvent {
  id: string;
  name: string;
  imageUrl: string;
  mysteries: Mystery[];
  scheduledFrom: Timestamp;
  scheduledTo: Timestamp;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MysteryEventBasic {
  scheduledFrom: Timestamp;
  scheduledTo: Timestamp;
  expiresAt: Timestamp;
}

export interface MysteryEventWithData extends MysteryEvent {
  mysteries: Mystery[];
}
