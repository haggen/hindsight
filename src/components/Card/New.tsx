import type { FormEvent, KeyboardEvent } from "react";

import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";
import { type TCard, useCards } from "~/src/lib/data";

type Props = {
	defaults: Omit<Semipartial<TCard, "columnId" | "authorId">, "id">;
	onFinish?: () => void;
};

export function New({ defaults, onFinish }: Props) {
	const cards = useCards();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const inputs = e.currentTarget.elements as unknown as {
			description: HTMLTextAreaElement;
		};

		cards.create({
			columnId: defaults.columnId,
			authorId: defaults.authorId,
			description: inputs.description.value,
		});

		e.currentTarget.reset();

		onFinish?.();
	};

	const handleCancel = () => {
		onFinish?.();
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		switch (e.key) {
			case "Escape": {
				handleCancel();
				break;
			}
			case "Enter": {
				e.currentTarget.form?.requestSubmit();
				break;
			}
			default:
				return;
		}

		e.preventDefault();
	};

	return (
		<div className={classes.placeholder}>
			<form className={classes.form} onSubmit={handleSubmit}>
				<textarea
					name="description"
					placeholder="Type something…"
					rows={3}
					onKeyDown={handleKeyDown}
					maxLength={112}
					defaultValue={defaults.description}
					required
				/>
				<menu className={classes.menu}>
					<li>
						<Button type="submit">Create new card</Button>
					</li>
				</menu>
			</form>
		</div>
	);
}
