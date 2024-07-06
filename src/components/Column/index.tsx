"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import type { Column as TColumn } from "@/lib/server/prisma";
import { type FormEvent, useState } from "react";

type FormProps = {
  data: TColumn;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

function Form({ data, onSubmit, onCancel }: FormProps) {
  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit}>
      <input placeholder="Type something..." defaultValue={data.description} />

      <footer className="flex justify-between">
        <Button className="text-red-600" onClick={onCancel}>
          Delete
        </Button>

        <div className="flex gap-3">
          <Button onClick={onCancel}>Cancel</Button>
          <Button className="text-green-600" type="submit">
            Save
          </Button>
        </div>
      </footer>
    </form>
  );
}

type HeadProps = {
  data: TColumn;
  onEdit: () => void;
};

function Head({ data, onEdit }: HeadProps) {
  return (
    <div className="flex justify-between group">
      <h2 className="text-lg font-bold">{data.description}</h2>

      <menu className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100">
        <li>
          <Button onClick={onEdit}>Edit</Button>
        </li>
      </menu>
    </div>
  );
}

type ColumnProps = {
  data: TColumn;
};

export function Column({ data }: ColumnProps) {
  const [editing, setEditing] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  return (
    <div className="flex flex-col gap-3 bg-slate-100 rounded-lg p-6 basis-96 shrink-0">
      {editing ? (
        <Form data={data} onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : (
        <Head data={data} onEdit={handleEdit} />
      )}

      {data.cards.map((card) => (
        <Card key={card.id} data={card} />
      ))}
    </div>
  );
}
