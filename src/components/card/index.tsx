import c from "classnames";

import { confirm } from "src/lib/confirm";
import { Button } from "src/components/button";
import { useCard, useProfile, useDispatch } from "src/store";

import style from "./style.module.css";

type CardProps = {
  id: string;
};

export const Card = ({ id }: CardProps) => {
  const { id: profileId } = useProfile();
  const card = useCard(id);
  const dispatch = useDispatch();

  if (!card) {
    throw new Error(`Card '${id}' not found`);
  }

  const isVoted = card.voterIds.includes(profileId);

  const onVote = () => {
    dispatch({ type: "cards/vote", payload: { id, voterId: profileId } });
  };

  const onDelete = () => {
    if (confirm("Are you sure?")) {
      dispatch({ type: "cards/delete", payload: { id } });
    }
  };

  return (
    <article className={c(style.card, style[card.color])}>
      <span className={style.content}>{card.text}</span>
      <ul className={style.toolbar}>
        <li>
          <Button tag="button" onClick={onVote}>
            {isVoted ? "Unvote" : "Vote"} ({card.voterIds.length})
          </Button>
        </li>
        <li>
          <Button tag="button" onClick={onDelete}>
            Delete
          </Button>
        </li>
      </ul>
    </article>
  );
};
