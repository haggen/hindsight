import { Board } from "~/src/components/Board";
import { Presentation } from "~/src/components/Presentation";
import { usePresentation } from "~/src/lib/data";

export function Router() {
  const presentation = usePresentation();

  if (presentation.active) {
    return <Presentation />;
  }

  return <Board />;
}
