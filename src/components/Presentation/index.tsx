import { useState } from "react";

import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";
import { Card } from "~/src/components/Card";
import { Column } from "~/src/components/Column";
import { Flex } from "~/src/components/Flex";
import { usePresentation } from "~/src/lib/data";

export function Presentation() {
  const presentation = usePresentation();
  const [finished, setFinished] = useState(false);

  if (!presentation.active) {
    return null;
  }

  const handleBack = () => {
    if (finished) {
      setFinished(false);
    } else {
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

  return (
    <div>
      <Column column={presentation.column} header={!finished}>
        {finished ? (
          <div className={classes.finish}>
            <h1>You’re all done.</h1>
            <figure>
              <blockquote>
                <p>Be willing to be a beginner every single morning.</p>
              </blockquote>
              <figcaption>― Meister Eckhart</figcaption>
            </figure>
          </div>
        ) : (
          <Card card={presentation.card} />
        )}

        <Flex as="ul" justify="space-between">
          <li>
            <Button onClick={handleBack} disabled={!presentation.hasPrev}>
              ← Previous
            </Button>
          </li>
          <li>
            {presentation.index + 1} of {presentation.length}
          </li>
          <li>
            <Button onClick={handleNext} disabled={finished}>
              {presentation.hasNext ? "Next" : "Finish"} →
            </Button>
          </li>
        </Flex>
      </Column>
    </div>
  );
}
