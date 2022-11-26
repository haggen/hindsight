import * as style from "./style.module.css";

const labels = {
  "👍": "Thumbs up",
  "🎉": "Party popper",
  "😍": "Smiling face with heart eyes",
  "🤔": "Thinking face",
};

type Props = {
  emoji: string;
};

export function Emoji({ emoji }: Props) {
  return (
    <span className={style.emoji} role="img" aria-label={labels[emoji]}>
      {emoji}
    </span>
  );
}
