import c from "classnames";

import { useBoard } from "src/lib/board";
import { confirm } from "src/lib/confirm";
import { useCurrentUser } from "src/lib/current-user";

import style from "./style.module.css";

type CardProps = {
  id: string;
  color: string;
};

export const Card = ({ id, color }: CardProps) => {
  const { id: currentUserId } = useCurrentUser();
  const [{ cards }, dispatch] = useBoard();

  const card = cards.find((card) => card.id === id);

  if (!card) {
    return <>Card "${id}" not found</>;
  }

  const isVoted = card.voters.includes(currentUserId);

  const onToggleVote = () => {
    dispatch({ type: "toggleVote", cardId: id, author: currentUserId });
  };

  const onRemove = () => {
    if (confirm("Are you sure?")) {
      dispatch({ type: "remove", cardId: id });
    }
  };

  return (
    <div className={c(style.card, style[color])}>
      <span className={style.content}>{card.content}</span>
      <ul className={style.toolbar}>
        <li>
          <button onClick={onToggleVote}>
            {isVoted ? "Unvote" : "Vote"} ({card.voters.length})
          </button>
        </li>
        <li>
          <button onClick={onRemove}>Delete</button>
        </li>
      </ul>
    </div>
  );
};
