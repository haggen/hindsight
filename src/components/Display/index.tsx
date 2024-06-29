import { useRef } from "react";

import * as classes from "./style.module.css";

import { useRaf } from "~/src/hooks/useRaf";
import { ClassList } from "~/src/lib/classList";

function format(value: number) {
	const missing = Math.ceil((value - Date.now()) / 1000);
	const minutes = Math.floor(missing / 60).toString();
	const seconds = Math.floor(missing % 60).toString();

	if (missing < 0) {
		return "00:00";
	}
	return `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
}

type Props = {
	target: number;
	active: boolean;
};

export function Display({ target, active }: Props) {
	const elementRef = useRef<HTMLOutputElement>(null);

	useRaf(() => {
		if (!elementRef.current) {
			return;
		}
		elementRef.current.textContent = format(target);
	});

	const classList = new ClassList();
	classList.add(classes.display);
	if (active) {
		classList.add(classes.active);
	}

	return (
		<output
			ref={elementRef}
			className={classList.toString()}
			aria-label="Time left for timer to go off."
			aria-live={active ? "polite" : "off"}
		/>
	);
}
