import { twMerge as c } from "tailwind-merge";
import { useSliceRowIds } from "tinybase/ui-react";
import { Link, useRoute } from "wouter";
import { useSortedCardIds } from "~/lib/data";

function Item({ href, className }: { href: string; className?: string }) {
  const ids = useSliceRowIds("participantsByLocation", href);

  const [match] = useRoute(href);

  return (
    <li>
      <Link
        href={href}
        className={c(
          "flex flex-wrap items-center gap-px w-12 h-6 p-1 bg-stone-100 rounded-sm",
          className,
          match ? "inset-ring-2 inset-ring-amber-400" : null,
        )}
      >
        {ids.map((id) => (
          <svg
            key={id}
            viewBox="0 0 1 1"
            className="block size-1 fill-stone-600 mix-blend-multiply"
          >
            <title>Participant</title>
            <rect x={0} y={0} width={1} height={1} rx={0.5} ry={0.5} />
          </svg>
        ))}
      </Link>
    </li>
  );
}

export function Minimap() {
  const cardIds = useSortedCardIds();

  return (
    <div className="flex gap-3 items-center justify-center">
      {/* <button type="button"><ArrowLeftIcon /></button> */}

      <ul className="overflow-x-scroll grid grid-flow-col auto-cols-min gap-1">
        <Item href="/" className="" />

        {cardIds.map((cardId) => (
          <Item key={cardId} href={`/cards/${cardId}`} />
        ))}

        <Item href="/finished" />
      </ul>

      {/* <button type="button"><ArrowRightIcon /></button> */}
    </div>
  );
}
