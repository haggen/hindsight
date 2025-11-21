import type { ReactNode } from "react";
import { Link } from "wouter";
import { Audience } from "~/components/Audience";
import { Footer } from "~/components/Footer";
import { Minimap } from "~/components/Minimap";
import { Timer } from "~/components/Timer";

type BoardProps = {
  children: ReactNode;
};

export function Board({ children }: BoardProps) {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] px-6 h-dvh">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-12 h-24">
        <div>
          <h1 className="text-2xl font-black">
            <Link href="~/">Hindsight</Link>
          </h1>
        </div>

        <div>
          <Timer />
        </div>

        <div className="justify-self-end">
          <Audience />
        </div>
      </div>

      <div className="grid grid-rows-[auto_1fr_auto] gap-3">
        <Minimap />

        <div className="overflow-auto grow">{children}</div>
      </div>

      <Footer />
    </div>
  );
}
