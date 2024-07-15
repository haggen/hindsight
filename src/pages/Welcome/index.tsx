import { Link } from "wouter";
import { Footer } from "~/components/Footer";
import { Icon } from "~/components/Icon";

export default function Page() {
  return (
    <div className="grid grid-rows-[1fr_auto] h-dvh">
      <div className="grid grid-rows-[1fr_1fr] gap-9">
        <div className="flex flex-col items-center justify-end gap-9">
          <div className="flex flex-col items-center gap-1.5">
            <Link href="/">
              <h2 className="text-4xl font-black">Hindsight</h2>
            </Link>

            <p className="text-xl">
              Retrospective board for{" "}
              <strong className="text-lime-600">evergreen</strong> teams.
            </p>

            <ul className="text-sm flex gap-6">
              <li className="flex items-center gap-1">
                <Icon symbol="check-square" className="text-xl" /> Free,
                open-source, no sign-up required.
              </li>
              <li className="flex items-center gap-1">
                <Icon symbol="check-square" className="text-xl" /> Locally
                stored, no ads, no telemetry.
              </li>
            </ul>
          </div>

          <Link
            href="/boards"
            className="flex items-center gap-1 px-6 h-14 rounded-full bg-stone-500 shadow-xl shadow-stone-200 text-xl text-white font-bold transition-all hover:bg-stone-600"
          >
            Start new board{" "}
            <Icon symbol="arrow-right" className="text-2xl block" />
          </Link>
        </div>

        <div className="relative overflow-hidden">
          <img
            className="rounded-xl w-3/4 -translate-x-1/2 left-1/2 border-stone-100 border-8 absolute"
            src="/screenshot.webp"
            alt="Screenshot of a sample board on Hindsight."
            width={1349}
            height={785}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
