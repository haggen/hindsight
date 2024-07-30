import { Board } from "~/components/Board";
import { Columns } from "~/components/Columns";

// type Props = {
//   params: { boardId: string };
// };

export default function Page() {
  return (
    <Board>
      <Columns />
    </Board>
  );
}
