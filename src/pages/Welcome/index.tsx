import { ArrowRightIcon, CheckCircleIcon } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "~/components/Footer";

export default function Page() {
  return (
    <div className="grid grid-rows-[1fr_auto] h-dvh">
      <div className="grid grid-rows-[1fr_auto_1fr] gap-12">
        <div className="flex flex-col items-center justify-end gap-3">
          <Link href="/">
            <h2 className="text-4xl font-black">Hindsight</h2>
          </Link>

          <p className="text-xl">
            Retrospective board for{" "}
            <strong className="text-lime-600">evergreen</strong> teams.
          </p>

          <ul className="flex gap-6 text-sm">
            <li className="flex items-center gap-1">
              <CheckCircleIcon size={20} /> Free, open-source, no sign-up
              required.
            </li>
            <li className="flex items-center gap-1">
              <CheckCircleIcon size={20} /> Locally stored, no ads, no
              telemetry.
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center justify-end">
          <Link
            href="/boards"
            className="flex items-center gap-1 px-6 text-xl font-bold text-white transition-all rounded-full shadow-xl h-14 bg-lime-600 shadow-lime-800/20 hover:bg-lime-700"
          >
            Start new board <ArrowRightIcon className="block text-2xl" />
          </Link>
        </div>

        <div className="relative overflow-hidden">
          <img
            className="absolute w-3/4 -translate-x-1/2 border-8 rounded-xl left-1/2 border-stone-100"
            src="/screenshot.webp"
            alt="Screenshot of a sample board on Hindsight."
            width={1349}
            height={785}
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-white" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
