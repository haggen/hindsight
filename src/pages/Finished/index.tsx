import { useEffect } from "react";
import { Board } from "~/components/Board";
import { getParticipantId } from "~/lib/participantId";
import { useContext } from "~/lib/store";

export default function Page() {
  const participantId = getParticipantId();
  const { store } = useContext();

  useEffect(() => {
    store.setCell("participants", participantId, "location", `/finished`);
  }, [store, participantId]);

  return (
    <Board>
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center rounded bg-stone-100">
        <h2 className="text-3xl font-black">All done.</h2>
        <p>Congratulations on finishing another cycle!</p>
      </div>
    </Board>
  );
}
