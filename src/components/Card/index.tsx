import { useState } from "react";

import { Edit } from "./Edit";
import { New } from "./New";
import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";
import { type TCard, useAwareness, useCards } from "~/src/lib/data";

type Props = {
	card: TCard;
};

export function Card({ card }: Props) {
	const [isEditing, setEditing] = useState(false);
	const { clientId } = useAwareness();
	const cards = useCards();
	const voted = card.votes.includes(clientId);

	if (isEditing) {
		return (
			<article className={classes.card}>
				<Edit card={card} onFinish={() => setEditing(false)} />
			</article>
		);
	}

	const handleEdit = () => {
		setEditing(true);
	};

	const handleToggleVote = () => {
		if (voted) {
			cards.unvote({ id: card.id, clientId });
		} else {
			cards.vote({ id: card.id, clientId });
		}
	};

	return (
		<article className={classes.card}>
			<p>{card.description}</p>

			<menu className={classes.menu}>
				<li>
					<Button
						onClick={handleToggleVote}
						color={voted ? "active" : undefined}
					>
						{voted ? "Unvote" : "Vote"} ({card.votes.length})
					</Button>
				</li>

				<li className={classes.contextual}>
					<Button onClick={handleEdit}>Edit</Button>
				</li>
			</menu>
		</article>
	);
}

Card.New = New;
