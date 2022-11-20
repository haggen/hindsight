import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: process.env.LIVEBLOCKS_API_KEY,
});

export const {
  // suspense: {
  RoomProvider,
  useOthers,
  useUpdateMyPresence,
  useMutation,
  useStorage,
  // },
} = createRoomContext(client);
