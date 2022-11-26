import { LiveMap } from "@liveblocks/client";
import { nanoid } from "nanoid";

export type Id = string;

export type TColumn = {
  id: Id;
  title: string;
};

export type TCard = {
  id: Id;
  createdAt: number;
  authorId: Id;
  columnId: Id;
  description: string;
  reactions: Record<string, number>;
  reactionCount: number;
};

export const initialPresence = {
  id: getOrCreatePresenceId(),
};

export const initialStorage = {
  timer: 0,
  cards: new LiveMap<Id, TCard>(),
  columns: new LiveMap<Id, TColumn>(),
};

function getOrCreatePresenceId() {
  const storedPresenceId = localStorage.getItem("presenceId");
  if (storedPresenceId) {
    return storedPresenceId;
  }
  const presenceId = createId();
  localStorage.setItem("presenceId", presenceId);
  return presenceId;
}

export function createId() {
  return nanoid(6);
}

export function getStoredPresence() {
  const presence = localStorage.getItem("presence");
  if (presence) {
    return JSON.parse(presence);
  }
  return { name: "Anonymous" };
}

export function storePresence(presence: typeof initialPresence) {
  localStorage.setItem("presence", JSON.stringify(presence));
}
