"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import {
  Delete,
  type Mutation,
  type Column as TColumn,
  api,
} from "@/lib/client/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, type ReactNode, useState } from "react";

type FrameProps = {
  children: ReactNode;
};

function Frame({ children }: FrameProps) {
  return (
    <div className="flex flex-col gap-3 bg-slate-100 rounded-lg p-6 basis-96 shrink-0">
      {children}
    </div>
  );
}

type HeaderProps = {
  data: TColumn;
  onEdit: () => void;
};

function Header({ data, onEdit }: HeaderProps) {
  return (
    <div className="flex items-center justify-between group">
      <h2 className="text-lg font-bold">{data.description}</h2>

      <menu className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100">
        <li>
          <Button onClick={onEdit}>Edit</Button>
        </li>
      </menu>
    </div>
  );
}

type ExistingProps = {
  data: TColumn;
};

function Existing({ data: initialData }: ExistingProps) {
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: column } = useQuery<TColumn>({
    queryKey: ["columns", initialData?.id],
    queryFn: () => api.get(`/api/columns/${initialData?.id}`),
    initialData,
  });

  const { mutate: updateColumn } = useMutation({
    mutationFn(data?: Partial<TColumn>) {
      return api.patch<TColumn>(`/api/columns/${column.id}`, data);
    },
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["columns", data.id] });
    },
  });

  const { mutate: deleteColumn } = useMutation({
    mutationFn() {
      return api.delete(`/api/columns/${column.id}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleDelete = () => {
    deleteColumn();
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fields = event.currentTarget.elements as unknown as {
      description: HTMLInputElement;
    };

    updateColumn({
      description: fields.description.value,
    });

    setEditing(false);
  };

  if (!column) {
    return <Frame>Loading...</Frame>;
  }

  return (
    <Frame>
      {editing ? (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            name="description"
            placeholder="Type something..."
            defaultValue={column?.description}
            aria-label="Column name"
            className="text-lg font-bold"
            autoComplete="off"
            // biome-ignore lint/a11y/noAutofocus: <explanation>
            autoFocus
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
      ) : (
        <Header data={column} onEdit={handleEdit} />
      )}

      {column.cards.map((card) => (
        <Card.Existing key={card.id} data={card} />
      ))}
      <Card.New defaults={{ columnId: column.id }} />
    </Frame>
  );
}

type NewProps = {
  defaults: Partial<TColumn>;
};

function New({ defaults }: NewProps) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["columns"],
    mutationFn(data: Partial<TColumn>) {
      return api.post("/api/columns", { ...defaults, ...data });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["boards", defaults.boardId] });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { currentTarget } = event;

    const fields = currentTarget.elements as unknown as {
      description: HTMLInputElement;
    };

    mutate({
      description: fields.description.value,
    });

    currentTarget.reset();
  };

  return (
    <Frame>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          name="description"
          placeholder="Type something..."
          className="text-lg font-bold"
          autoComplete="off"
        />

        <footer className="flex justify-end">
          <Button className="text-green-600" type="submit">
            Create column
          </Button>
        </footer>
      </form>
    </Frame>
  );
}

export const Column = {
  Existing,
  New,
};
