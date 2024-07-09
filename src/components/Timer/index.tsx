"use client";

import { Button } from "@/components/Button";
import { type Board, type Mutation, api } from "@/lib/client/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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

  if (Date.now() >= timestamp) {
    return (
      <span className="font-mono text-lg text-white px-3 py-2 rounded-3xl bg-slate-400">
        00:00
      </span>
    );
  }

  return (
    <span className="font-mono text-lg text-white px-3 py-2 rounded-3xl bg-violet-600">
      {format(timestamp)}
    </span>
  );
}

function getTime(value: undefined | string) {
  if (!value) {
    return Date.now();
  }

  return new Date(value).getTime();
}

type Props = {
  board: Board;
};

export function Timer({ board: data }: Props) {
  const queryClient = useQueryClient();

  const { data: board } = useQuery<Board>({
    queryKey: ["boards", data.id],
    queryFn: () => api.get(`/api/boards/${data.id}`),
    initialData: data,
  });

  const { mutate } = useMutation({
    mutationKey: ["boards", board.id],
    mutationFn(data: Mutation<Board>) {
      return api.patch<Board>(`/api/boards/${board.id}`, data);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["boards", board.id] });
    },
  });

  const handleChange = async (value: null | number) => {
    mutate({ presentsAt: value ? new Date(value).toISOString() : null });
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        className="text-red-600"
        onClick={() => handleChange(null)}
        disabled={!board.presentsAt}
      >
        Clear
      </Button>

      <Display
        timestamp={board.presentsAt ? new Date(board.presentsAt).getTime() : 0}
      />

      <Button
        onClick={() =>
          handleChange(
            new Date(
              Math.max(Date.now(), getTime(board.presentsAt)),
            ).getTime() +
              1000 * 2,
          )
        }
      >
        +5 min.
      </Button>
    </div>
  );
}
