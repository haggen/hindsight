import * as classes from "./style.module.css";

import { Card } from "~/src/components/Card";
import { Column } from "~/src/components/Column";
import { Flex } from "~/src/components/Flex";
import { type Id, useAwareness, useCards, useColumns } from "~/src/lib/data";

function List({ columnId }: { columnId: Id }) {
	const cards = useCards({ columnId });
	const { clientId } = useAwareness();

	return (
		<Flex as="ul" direction="column" gap="1rem">
			{cards.list.map((card) => (
				<li key={card.id}>
					<Card card={card} />
				</li>
			))}
			<li>
				<Card.New defaults={{ authorId: clientId, columnId }} />
			</li>
		</Flex>
	);
}

export function Board() {
	const [columns] = useColumns();

	return (
		<div className={classes.board}>
			{columns.map((column) => (
				<Column key={column.id} column={column}>
					<List columnId={column.id} />
				</Column>
			))}
			<Column.New />
		</div>
	);
}
