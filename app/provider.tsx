"use client";
import Loader from "@/components/loader";
import { getClerkUsers, getDocumentUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { ReactNode } from "react";

const Provider = async ({ children }: { children: ReactNode }) => {
  const clerkUser = await currentUser();
  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers({ userIds });

        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({
          text,
          roomId,
          currentUser: clerkUser?.emailAddresses[0].emailAddress || "",
        });
        return roomUsers;
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
