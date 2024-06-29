import { type ReactNode, useState } from "react";

import { Edit } from "./Edit";
import { New } from "./New";
import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";
import { ClassList } from "~/src/lib/classList";
import type { TColumn } from "~/src/lib/data";

type Props = {
	className?: string;
	column: TColumn;
	children: ReactNode;
};

export function Column({ className, column, children }: Props) {
	const [isEditing, setEditing] = useState(false);

	const handleEdit = () => {
		setEditing(true);
	};

	const handleFinishEditing = () => {
		setEditing(false);
	};

	const classList = new ClassList();
	classList.add(classes.column);
	if (className) {
		classList.add(className);
	}

	return (
		<section className={classList.toString()}>
			{isEditing ? (
				<Edit column={column} onFinish={handleFinishEditing} />
			) : (
				<header className={classes.header}>
					<h1 className={classes.title}>{column.title}</h1>

					<menu>
						<li className={classes.contextual}>
							<Button onClick={handleEdit}>Edit</Button>
						</li>
					</menu>
				</header>
			)}

			{children}
		</section>
	);
}

Column.New = New;
