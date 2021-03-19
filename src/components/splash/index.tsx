import { ReactNode } from "react";

import style from "./style.module.css";

type Props = {
  title: ReactNode;
  description: ReactNode;
  size?: number;
};

export const Splash = ({ title, description, size = 1 }: Props) => {
  return (
    <div className={style.splash} style={{ fontSize: `${size}em` }}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};
