"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblock";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import { redirect } from "next/navigation";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    });

    revalidatePath("/");

    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while creating a room: ${error}`);
  }
};

export const getDocument = async ({
  userId,
  roomId,
}: {
  userId: string;
  roomId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    // if (!hasAccess) {
    //   return new Error("You do not have access to this document");
    // }
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happend while fetching a room: ${error}`);
  }
};
export const deleteDocument = async (id: string) => {
  try {
    const deletedRoom = await liveblocks.deleteRoom(id);
    revalidatePath("/documents");
    redirect("/");
  } catch (error) {
    console.log(`Error happend while deleting a room: ${error}`);
  }
};
export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });
    revalidatePath(`/documts/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happened while updating a doc title: ${error}`);
  }
};

export const getDocuments = async (email: string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email });

    return parseStringify(rooms);
  } catch (error) {
    console.log(`Error happend while fetching a rooms: ${error}`);
  }
};

export const updateDocumentAccess = async ({
  roomId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
  try {
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };
    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    });
    if (room) {
      const notificationId = nanoid();
      await liveblocks.triggerInboxNotification({
        userId: email,
        kind: "$documentAccess",
        subjectId: notificationId,
        activityData: {
          userType,
          title: `You have been granted ${userType} access to the document by  ${updatedBy.name}.`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          emial: updatedBy.email,
        },
        roomId,
      });
    }
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while updating room access:`, error);
  }
};

export const removeUser = async ({
  roomId,
  email,
}: {
  email: string;
  roomId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    if (room.metadata.email === email) {
      throw new Error("You can't remove yourself from the room");
    }
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    });
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happend while removing user a room:`, error);
  }
};
