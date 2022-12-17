import { useState } from "react";

import { Edit } from "./Edit";
import { New } from "./New";
import * as style from "./style.module.css";

import { Button } from "~/src/components/Button";
import { TCard, useCards } from "~/src/lib/data";
import { Reaction } from "~/src/components/Reaction";

const availableReactions = ["👍", "🎉", "😍", "😂", "😔", "🤔"];

type Props = {
  card: TCard;
};

export function Card({ card }: Props) {
  const [isEditing, setEditing] = useState(false);
  const presence = { id: "123" };
  const cards = useCards();

  if (isEditing) {
    return (
      <article className={style.card}>
        <Edit card={card} onFinish={() => setEditing(false)} />
      </article>
    );
  }

  const handleEdit = () => {
    setEditing(true);
  };

  const handleReaction = (reaction: string) => {
    if ("id" in card) {
      cards.react(card.id, reaction);
    }
  };

  return (
    <article className={style.card}>
      <p>{card.description}</p>

      <menu className={style.menu}>
        <li>
          <ul>
            {availableReactions.map((reaction) => (
              <li key={reaction}>
                <Reaction
                  reaction={reaction}
                  count={card.reactions[reaction]}
                  onClick={handleReaction}
                />
              </li>
            ))}
          </ul>
        </li>

        <li className={style.contextual}>
          {card.authorId === presence.id ? (
            <Button onClick={handleEdit}>Edit</Button>
          ) : null}
        </li>
      </menu>
    </article>
  );
}

Card.New = New;
