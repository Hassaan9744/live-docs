"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { getDocuments } from "./room.actions";
import { liveblocks } from "../liveblock";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    const { data } = await clerkClient().users.getUserList({
      emailAddress: userIds,
    });
    const users = data.map((user) => ({
      id: user.id,
      user: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));
    const sortedUser = userIds.map((email) =>
      users.find((user) => user.email === email)
    );
    return parseStringify(sortedUser);
  } catch (error) {
    console.log("error", error);
  }
};

export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    const users = Object.keys(room.usersAccesses).filter(
      (email) => email !== currentUser
    );
    if (Text.length) {
      const lowerCaseText = text.toLowerCase();
      const filteredUsers = users.filter((user) =>
        user.toLowerCase().includes(lowerCaseText)
      );
      return parseStringify(filteredUsers);
    }
    return parseStringify(users);
  } catch (error) {
    console.log(`Eror fetching document users: ${error}`);
  }
};
