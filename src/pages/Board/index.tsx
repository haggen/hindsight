import { useEffect } from "react";
import { Board } from "~/components/Board";
import { Columns } from "~/components/Columns";
import { getParticipantId } from "~/lib/participantId";
import { useContext } from "~/lib/store";

export default function Page() {
  const participantId = getParticipantId();
  const { store } = useContext();

  useEffect(() => {
    store.setCell("participants", participantId, "location", "/");
  }, [store, participantId]);

  return (
    <Board>
      <Columns />
    </Board>
  );
}
