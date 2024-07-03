import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Column } from "@/components/Column";

const columns = [
  {
    id: "1",
    description: "Column 1",
    cards: [
      {
        id: "1",
        description:
          "Est assumenda a libero quisquam minus sit et, doloremque ab, quia quos blanditiis quasi quaerat alias totam recusandae quo sapiente impedit amet.",
        voters: ["1"],
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <div className="flex items-center gap-12">
        <div className="flex items-center flex-grow justify-between">
          <h1 className="text-2xl font-bold">
            <a href="/">Hindsight</a>
          </h1>

          <span>👤 ×8</span>
        </div>

        <div className="flex items-center gap-3">
          <Button className="text-red-600">Clear</Button>

          <span className="font-mono text-white px-4 py-2 rounded-3xl bg-violet-600">
            00:00
          </span>

          <Button>+5 min.</Button>
        </div>

        <div className="flex items-center flex-grow justify-end">
          <Button>Start presentation &rarr;</Button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto">
        {columns.map((column) => (
          <Column key={column.id} data={column} />
        ))}
      </div>
    </div>
  );
}
