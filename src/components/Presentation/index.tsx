import * as classes from "./style.module.css";

import { Flex } from "~/src/components/Flex";
import { usePresentation } from "~/src/lib/data";

export function Presentation() {
	const presentation = usePresentation();

	if (!presentation.active) {
		return null;
	}

	if (presentation.finished) {
		return (
			<section className={classes.column}>
				<div className={classes.finish}>
					<h1>You’re all done.</h1>
					<p>Congratulations on another finished sprint.</p>
				</div>
			</section>
		);
	}

	return (
		<section className={classes.column}>
			<Flex direction="column" gap="1rem">
				<h1 className={classes.title}>{presentation.column.title}</h1>
				<article className={classes.card}>
					<p>{presentation.card.description}</p>
				</article>
			</Flex>

			<p style={{ textAlign: "center" }}>
				{presentation.index + 1} of {presentation.length}
			</p>
		</section>
	);
}
