import { type ReactNode, useEffect } from "react";

import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";
import { Display } from "~/src/components/Display";
import { Flex } from "~/src/components/Flex";
import { useMounted } from "~/src/hooks/useMounted";
import { useAwareness, usePresentation, useTimer } from "~/src/lib/data";
import { pluralize } from "~/src/lib/pluralize";

function People() {
	const { count } = useAwareness();

	const title = pluralize(
		count,
		"There's only you.",
		`There are ${count} people connected.`,
	);

	return (
		<Flex gap=".25rem" title={title} aria-label={title}>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<path
					d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.19C2 19 3.29 20.93 5.56 21.66C6.22 21.89 6.98 22 7.81 22H16.19C17.02 22 17.78 21.89 18.44 21.66C20.71 20.93 22 19 22 16.19V7.81C22 4.17 19.83 2 16.19 2ZM20.5 16.19C20.5 18.33 19.66 19.68 17.97 20.24C17 18.33 14.7 16.97 12 16.97C9.3 16.97 7.01 18.32 6.03 20.24H6.02C4.35 19.7 3.5 18.34 3.5 16.2V7.81C3.5 4.99 4.99 3.5 7.81 3.5H16.19C19.01 3.5 20.5 4.99 20.5 7.81V16.19Z"
					fill="currentColor"
				/>
				<path
					d="M12.002 8C10.022 8 8.422 9.6 8.422 11.58C8.422 13.56 10.022 15.17 12.002 15.17C13.982 15.17 15.582 13.56 15.582 11.58C15.582 9.6 13.982 8 12.002 8Z"
					fill="currentColor"
				/>
			</svg>

			<small>×{count}</small>
		</Flex>
	);
}

function Pagination() {
	const presentation = usePresentation();

	const handleNext = () => {
		presentation.next();
	};

	const handleBack = () => {
		presentation.prev();
	};

	if (!presentation.active) {
		return (
			<menu>
				<li>
					<Button onClick={handleNext} disabled={!presentation.hasNext}>
						Start presentation →
					</Button>
				</li>
			</menu>
		);
	}

	return (
		<Flex as="menu">
			<li>
				<Button onClick={handleBack}>← Back</Button>
			</li>
			<li>
				<Button onClick={handleNext} disabled={presentation.finished}>
					Next →
				</Button>
			</li>
		</Flex>
	);
}

type Props = {
	children: ReactNode;
};

export function Layout({ children }: Props) {
	const mounted = useMounted();
	const timer = useTimer();

	useEffect(() => {
		void Notification.requestPermission();
	}, []);

	useEffect(() => {
		if (!mounted) {
			return;
		}
		if (!timer.active && timer.target > 0) {
			new Notification("Time's up!");
		}
	}, [mounted, timer.active, timer.target]);

	return (
		<div className={classes.layout}>
			<Flex as="header" className={classes.topbar}>
				<Flex justify="space-between" style={{ flex: "1 0 0" }}>
					<h1>
						<a href="/" target="_blank" rel="noreferrer">
							Hindsight
						</a>
					</h1>

					<People />
				</Flex>

				<Flex gap=".75rem">
					<Button
						onClick={() => timer.clear()}
						disabled={!timer.active}
						color="negative"
					>
						Clear
					</Button>

					<Display target={timer.target} active={timer.active} />

					<Button onClick={() => timer.add(5 * 60)}>+5 min.</Button>
				</Flex>

				<Flex justify="flex-end" style={{ flex: "1 0 0" }}>
					<Pagination />
				</Flex>
			</Flex>

			<main className={classes.main}>{children}</main>

			<footer className={classes.footer}>
				<p>
					Made by{" "}
					<a href="https://twitter.com/haggen" target="_blank" rel="noreferrer">
						me
					</a>
					. Source and feedback on{" "}
					<a
						href="https://github.com/haggen/hindsight"
						target="_blank"
						rel="noreferrer"
					>
						GitHub
					</a>
					.
				</p>
			</footer>
		</div>
	);
}
