"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/Button";

type FormProps = {
  data: any;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

function Form({ data, onSubmit, onCancel }: FormProps) {
  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit}>
      <textarea
        rows={5}
        placeholder="Type something..."
        defaultValue={data.description}
      />

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

type ContentProps = {
  data: any;
  onEdit: () => void;
};

function Content({ data, onEdit }: ContentProps) {
  return (
    <div className="flex flex-col gap-3">
      <p>{data.description}</p>

      <div className="flex justify-between">
        <menu className="flex gap-3">
          <li>
            <Button>Vote ({data.voters.length})</Button>
          </li>
        </menu>
        <menu className="flex gap-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
          <li>
            <Button onClick={onEdit}>Edit</Button>
          </li>
        </menu>
      </div>
    </div>
  );
}

type CardProps = { data: any };

export function Card({ data }: CardProps) {
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
    <div className="bg-white rounded-lg p-6 drop-shadow-sm group">
      {editing ? (
        <Form data={data} onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : (
        <Content data={data} onEdit={handleEdit} />
      )}
    </div>
  );
}
