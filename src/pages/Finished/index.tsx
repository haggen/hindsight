import { Board } from "~/components/Board";

// type Props = {
//   params: { boardId: string };
// };

export default function Page() {
  return (
    <Board>
      <div className="flex flex-col gap-3 items-center justify-center text-center h-full bg-stone-100 rounded">
        <h2 className="text-3xl font-black">All done.</h2>
        <p>Congratulations on finishing another cycle!</p>
      </div>
    </Board>
  );
}
