import { type ElementType, forwardRef } from "react";

import * as classes from "./style.module.css";

import { ClassList } from "~/src/lib/classList";
import type { PolymorphicPropsWithRef, PolymorphicRef } from "~/src/lib/react";

type Props = {
	color?: "active" | "negative" | "positive";
	bordered?: boolean;
};

function Button<E extends "button" | "a" = "button">(
	{ as, color, bordered, ...props }: PolymorphicPropsWithRef<E, Props>,
	ref: PolymorphicRef<E>,
) {
	const Component = as ?? ("button" as ElementType);
	const classList = new ClassList();
	classList.add(classes.button);
	if (color) {
		classList.add(classes[color]);
	}
	if (bordered) {
		classList.add(classes.bordered);
	}
	props.type ??= "button";
	props.className ??= classList.toString();
	return <Component ref={ref} {...props} />;
}

// Fix the type of the forwarded component.
const forwardRefButton = forwardRef(Button) as typeof Button;
export { forwardRefButton as Button };
