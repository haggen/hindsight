import { nanoid } from "nanoid";
import { useEffect } from "react";
import { useLocation } from "wouter";

export const Start = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(`/b/${nanoid()}`, { replace: true });
  });

  return null;
};
