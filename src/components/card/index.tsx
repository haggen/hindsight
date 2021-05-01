import c from "classnames";

import { useBoard } from "src/components/board/state";
import { confirm } from "src/lib/confirm";
import { useProfile } from "src/components/profile";
import { Button } from "src/components/button";

import style from "./style.module.css";

type CardProps = {
  id: string;
  color: string;
};

export const Card = ({ id, color }: CardProps) => {
  const { id: currentUserId } = useProfile();
  const [{ cards }, dispatch] = useBoard();

  const card = cards.find((card) => card.id === id);

  if (!card) {
    return <>Card "${id}" not found</>;
  }

  const isVoted = card.voters.includes(currentUserId);

  const onToggleVote = () => {
    dispatch({ type: "vote", cardId: id, author: currentUserId });
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
          <Button tag="button" onClick={onToggleVote}>
            {isVoted ? "Unvote" : "Vote"} ({card.voters.length})
          </Button>
        </li>
        <li>
          <Button tag="button" onClick={onRemove}>
            Delete
          </Button>
        </li>
      </ul>
    </div>
  );
};
