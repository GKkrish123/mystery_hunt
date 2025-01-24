import { type DocumentData, type QuerySnapshot } from "firebase/firestore";
import { parseSnapshotDoc } from "./query";
import { type MysteryEvent } from "@/server/model/events";

export async function snapshotsToEvents(
  snapshots: QuerySnapshot<DocumentData, DocumentData>,
) {
  return await Promise.all(
    snapshots.docs.map(async (doc) => {
      const data = parseSnapshotDoc(doc.data()) as MysteryEvent;
      return {
        ...data,
        id: doc.id,
      } as MysteryEvent;
    }),
  );
}
