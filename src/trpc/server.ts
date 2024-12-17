import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cookies, headers } from "next/headers";
import { cache } from "react";

import { createCaller, type AppRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { createQueryClient } from "./query-client";
import { redirect } from "next/navigation";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");
  const token = (await cookies()).get("token")?.value;

  if (token) {
    heads.set("Authorization", `Bearer ${token}`);
  } else {
    redirect("/login");
  }
  return createTRPCContext({
    headers: heads,
  });
};

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
