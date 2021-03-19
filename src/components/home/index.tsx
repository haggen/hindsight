import { nanoid } from "nanoid";
import { useEffect } from "react";
import { useLocation } from "wouter";

export const Home = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(`/b/${nanoid()}`, { replace: true });
  });

  return null;
};
