import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {  } from "firebase-admin"
import { firebaseAdminApp } from "firebaseAdmin";

export const userRouter = createTRPCRouter({
  users: publicProcedure
    .query(async () => {
      try {
        const auth = firebaseAdminApp.auth();
        const users = await auth.listUsers();
        return users.users;
      } catch (error) {
        throw new Error("Error fetching users from Firebase");
      }
    })
});
