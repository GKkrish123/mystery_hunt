import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import {
  collection,
  documentId,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebase-user";
import { MysteryCollections } from "@/server/constants";
import { snapshotsToMysteries } from "../helpers/mystery";
import { snapshotsToEvents } from "../helpers/events";
import { type MysteryEventWithData } from "@/server/model/events";

export const eventsRouter = createTRPCRouter({
  getEvents: privateProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const eventsCollection = collection(db, MysteryCollections.events);
    const eventsQuery = query(
      eventsCollection,
      orderBy("scheduledFrom", "asc"),
      where("expiresAt", ">", now),
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    const mysteryEvents = await snapshotsToEvents(eventsSnapshot);
    const mysteriesCollection = collection(db, MysteryCollections.mysteries);
    const eventsWithMysteries = await Promise.all(
      mysteryEvents.map(async (event) => {
        const eventMysteriesQuery = query(
          mysteriesCollection,
          where(documentId(), "in", event.mysteries),
          orderBy("createdAt", "desc"),
        );
        const querySnapshot = await getDocs(eventMysteriesQuery);
        return {
          ...event,
          mysteries: await snapshotsToMysteries(
            querySnapshot,
            ctx.redis,
            ctx.user.hunterId,
          ),
        } as MysteryEventWithData;
      }),
    );
    return eventsWithMysteries;
  }),

  getCompletedEvents: privateProcedure.query(async () => {
    const now = new Date();
    const eventsCollection = collection(db, MysteryCollections.events);
    const eventsQuery = query(
      eventsCollection,
      orderBy("scheduledTo", "desc"),
      where("scheduledTo", "<", now),
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    const mysteryEvents = await snapshotsToEvents(eventsSnapshot);
    return mysteryEvents;
  }),
});
