import { RefObject, useCallback, useRef } from "react";

/**
 * Get a method that replays CSS animations on the refering element.
 */
export const useReplay = <T extends HTMLElement>(
  existingRef?: RefObject<T>
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ref = existingRef ?? useRef<T>(null);

  const replay = useCallback(() => {
    // @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Tips#run_an_animation_again
    requestAnimationFrame(() => {
      if (!ref.current) {
        return;
      }
      ref.current.style.animation = "none";

      requestAnimationFrame(() => {
        if (!ref.current) {
          return;
        }
        ref.current.style.animation = "";
      });
    });
  }, [ref]);

  return [replay, ref];
};
