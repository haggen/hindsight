import { useState } from "react";

import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { usePresentation } from "~/src/lib/data";

export function Presentation() {
  const presentation = usePresentation();
  const [finished, setFinished] = useState(false);

  const handleBack = () => {
    if (finished) {
      setFinished(false);
    } else if (presentation.hasPrev) {
      presentation.prev();
    }
  };

  const handleNext = () => {
    if (presentation.hasNext) {
      presentation.next();
    } else {
      setFinished(true);
    }
  };

  if (!presentation.active) {
    return null;
  }

  return (
    <section className={classes.column}>
      {finished ? (
        <div className={classes.finish}>
          <h1>You’re all done.</h1>
          <p>Congratulations on another finished sprint.</p>
        </div>
      ) : (
        <Flex direction="column" gap="1rem">
          <h1 className={classes.title}>{presentation.column.title}</h1>
          <article className={classes.card}>
            <p>{presentation.card.description}</p>
          </article>
        </Flex>
      )}

      <Flex as="ul" justify="space-between">
        <li style={{ flex: "0 0 10rem" }}>
          <Button
            onClick={handleBack}
            disabled={!finished && !presentation.hasPrev}
          >
            ← Back
          </Button>
        </li>
        <li>
          {presentation.index + 1} of {presentation.length}
        </li>
        <li style={{ flex: "0 0 10rem", textAlign: "end" }}>
          <Button onClick={handleNext} disabled={finished}>
            {presentation.hasNext ? "Next" : "Finish"} →
          </Button>
        </li>
      </Flex>
    </section>
  );
}
