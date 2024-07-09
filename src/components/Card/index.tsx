"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/Button";
import { type Card as TCard, type Vote, api } from "@/lib/client/api";
import { useUserId } from "@/lib/client/globalContext";

type FrameProps = {
  children: ReactNode;
};

function Frame({ children }: FrameProps) {
  return (
    <div className="bg-white rounded-lg p-6 drop-shadow-sm group">
      {children}
    </div>
  );
}

type ExistingProps = {
  data: TCard;
};

function Existing({ data: initialData }: ExistingProps) {
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();
  const userId = useUserId();

  const { data: card } = useQuery<TCard>({
    queryKey: ["cards", initialData?.id],
    queryFn() {
      return api.get(`/api/cards/${initialData?.id}`);
    },
    initialData,
  });

  const vote = card?.votes.find((vote) => vote.voterId === userId);

  const { mutate: updateCard } = useMutation({
    mutationFn(data?: Partial<TCard>) {
      return api.patch(`/api/cards/${card.id}`, data);
    },
    onSuccess(_, data) {
      queryClient.invalidateQueries({ queryKey: ["cards", card.id] });
    },
  });

  const { mutate: deleteCard } = useMutation({
    mutationFn() {
      return api.delete(`/api/cards/${card.id}`);
    },
    onSuccess(_, data) {
      queryClient.invalidateQueries({ queryKey: ["columns", card.columnId] });
    },
  });

  const { mutate: createVote } = useMutation({
    mutationFn() {
      return api.post<Vote>("/api/votes", { cardId: card.id, userId });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["cards", card.id] });
    },
  });

  const { mutate: deleteVote } = useMutation({
    mutationFn() {
      return api.delete(`/api/votes/${vote?.id}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["cards", card.id] });
    },
  });

  const handleVote = () => {
    createVote();
  };

  const handleUnvote = () => {
    deleteVote();
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleDelete = () => {
    deleteCard();
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fields = event.currentTarget.elements as unknown as {
      description: HTMLInputElement;
    };

    updateCard({
      description: fields.description.value,
    });

    setEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  if (!card) {
    return <Frame>Loading...</Frame>;
  }

  if (editing) {
    return (
      <Frame>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <textarea
            rows={3}
            name="description"
            placeholder="Type something..."
            defaultValue={card?.description}
            aria-label="Card description"
            autoComplete="off"
            // biome-ignore lint/a11y/noAutofocus: <explanation>
            autoFocus
            onKeyDown={handleKeyDown}
          />

          <footer className="flex justify-between">
            <Button className="text-red-600" onClick={handleDelete}>
              Delete
            </Button>

            <div className="flex gap-3">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button className="text-green-600" type="submit">
                Save
              </Button>
            </div>
          </footer>
        </form>
      </Frame>
    );
  }

  return (
    <Frame>
      <div className="flex flex-col gap-3">
        <p>{card.description}</p>

        <div className="flex justify-between">
          <menu className="flex gap-3">
            <li>
              {vote ? (
                <Button className="text-purple-600" onClick={handleUnvote}>
                  Unvote ({card.votes.length})
                </Button>
              ) : (
                <Button onClick={handleVote}>Vote ({card.votes.length})</Button>
              )}
            </li>
          </menu>

          <menu className="flex gap-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
            <li>
              <Button onClick={handleEdit}>Edit</Button>
            </li>
          </menu>
        </div>
      </div>
    </Frame>
  );
}

type NewProps = {
  defaults: Partial<TCard>;
};

function New({ defaults }: NewProps) {
  const queryClient = useQueryClient();

  const { mutate: createCard } = useMutation({
    mutationFn(data: Partial<TCard>) {
      return api.post<TCard>("/api/cards", data);
    },
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ["columns", data.columnId],
      });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { currentTarget } = event;

    const fields = currentTarget.elements as unknown as {
      description: HTMLInputElement;
    };

    createCard({
      columnId: defaults.columnId,
      description: fields.description.value,
    });

    currentTarget.reset();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <Frame>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <textarea
          rows={3}
          name="description"
          placeholder="Type something..."
          aria-label="Card description"
          autoComplete="off"
          onKeyDown={handleKeyDown}
        />

        <footer className="flex justify-end">
          <div className="flex gap-3">
            <Button className="text-green-600" type="submit">
              Create card
            </Button>
          </div>
        </footer>
      </form>
    </Frame>
  );
}

export const Card = { Existing, New };
