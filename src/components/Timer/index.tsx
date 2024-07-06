"use client";

import { Button } from "@/components/Button";
import { api } from "@/lib/client/api";
import type { Board, Id } from "@/lib/server/prisma";
import { useEffect, useState } from "react";
import useSWR from "swr";

function format(timestamp: number) {
  const value = timestamp - Date.now();

  const m = Math.floor((value / 1000 / 60) % 60);
  const s = Math.floor((value / 1000) % 60);

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type DisplayProps = {
  timestamp: number;
};

function Display({ timestamp }: DisplayProps) {
  const [, update] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      update({});
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (timestamp < Date.now()) {
    return (
      <span className="font-mono text-white px-4 py-2 rounded-3xl bg-slate-600">
        00:00
      </span>
    );
  }

  return (
    <span className="font-mono text-white px-4 py-2 rounded-3xl bg-violet-600">
      {format(timestamp)}
    </span>
  );
}

type Props = {
  boardId: Id;
};

export function Timer({ boardId }: Props) {
  const {
    data: board,
    error,
    isLoading,
    mutate,
  } = useSWR<Board>(`/api/boards/${boardId}`, api.get);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!board) {
    return <div>Error!</div>;
  }

  const timestamp = board.alertsAt ?? 0;

  const onChange = async (timestamp: number) => {
    mutate(await api.patch(`/api/boards/${boardId}`, { alertsAt: timestamp }));
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        className="text-red-600"
        onClick={() => onChange(0)}
        disabled={timestamp === 0}
      >
        Clear
      </Button>

      <Display timestamp={timestamp} />

      <Button
        onClick={() => onChange((timestamp || Date.now()) + 1000 * 60 * 5)}
      >
        +5 min.
      </Button>
    </div>
  );
}
