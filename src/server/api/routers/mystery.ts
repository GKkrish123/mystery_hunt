import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { collection, getDocs } from "firebase/firestore";
import { db } from "firebase";

export const mysteryRouter = createTRPCRouter({
  mysteries: publicProcedure
    // .input(z.object({ text: z.string() }))
    .query(async () => {
      const usersCollection = collection(db, 'mysteries');
      const querySnapshot = await getDocs(usersCollection);
      const mysteries = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return mysteries;
    })
});
