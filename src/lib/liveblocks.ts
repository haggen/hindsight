import {
  createClient,
  LiveList,
  LiveMap,
  LiveObject,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { initialPresence, initialStorage } from "./data";

const client = createClient({
  publicApiKey: process.env.LIVEBLOCKS_API_KEY,
});

export const {
  suspense: {
    RoomProvider,
    useOthers,
    useUpdateMyPresence,
    useMyPresence,
    useSelf,
    useMutation,
    useStorage,
  },
} = createRoomContext<typeof initialPresence, typeof initialStorage>(client);
