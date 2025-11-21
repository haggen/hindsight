import { UserSquareIcon } from "lucide-react";
import { useParticipantIds } from "~/lib/data";

export function Audience() {
  const participantIds = useParticipantIds();

  return (
    <div className="flex items-center gap-1">
      <UserSquareIcon
        className="text-2xl"
        aria-label={`${participantIds.length} people connected.`}
      />
      &times;{participantIds.length}
    </div>
  );
}
