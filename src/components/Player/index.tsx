import YouTube, { YouTubePlayerProps } from "react-player/youtube";
import { ChangeEvent, FormEvent, useEffect, useReducer, useRef } from "react";

import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { usePlayer } from "~/src/lib/data";
import { ClassList } from "~/src/lib/classList";

const scale = (value: number) => {
  if (value > 0) {
    return (Math.pow(10, value) - 1) / 9;
  }
  return 0;
};

export function Player() {
  const player = usePlayer();
  const [isQueueOpen, setQueueOpen] = useReducer(
    (prev: boolean, next: boolean | undefined) => next ?? !prev,
    false
  );
  const queueRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          setQueueOpen(false);
          break;
        default:
          return;
      }
      e.preventDefault();
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!e.target) {
        return;
      }
      if (queueRef.current?.parentElement?.contains(e.target as Node)) {
        return;
      }
      setQueueOpen(false);
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    const input = volumeRef.current;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        input?.stepDown();
      } else {
        input?.stepUp();
      }
      input?.dispatchEvent(new Event("change", { bubbles: true }));
      e.preventDefault();
    };
    input?.addEventListener("wheel", handleWheel);
    return () => {
      input?.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handlePlay = () => {
    if (!player.url) {
      player.next();
    } else if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleVolume = (e: ChangeEvent<HTMLInputElement>) => {
    player.setVolume(e.currentTarget.valueAsNumber);
  };

  const handleMute = () => {
    if (player.muted) {
      player.unmute();
    } else {
      player.mute();
    }
  };

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    const inputs = e.currentTarget.elements as unknown as {
      url: HTMLInputElement;
    };
    player.add(inputs.url.value);
    e.preventDefault();
    e.currentTarget.reset();
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      e.currentTarget.setCustomValidity("");

      const url = new URL(e.currentTarget.value);

      if (
        /(www\.)?youtube\.com/.exec(url.hostname) &&
        url.searchParams.get("v")
      ) {
        return;
      }
      if (url.hostname === "youtu.be" && url.pathname.length > 1) {
        return;
      }

      e.currentTarget.setCustomValidity("Not an YouTube video URL.");
    } catch (err) {
      // If we can't parse the URL the user might not have finished typing it yet.
    } finally {
      e.currentTarget.reportValidity();
    }
  };

  const queueClassList = new ClassList();
  queueClassList.add(classes.queue);
  if (isQueueOpen) {
    queueClassList.add(classes.open);
  }

  const props: YouTubePlayerProps = {
    width: "0",
    height: "0",
    ref: player.ref,
    url: player.url,
    playing: player.playing,
    muted: player.muted,
    volume: scale(player.volume),
    progressInterval: 1000,
    onProgress: player.handleProgress,
    onEnded: player.handleEnded,
  };

  return (
    <Flex as="menu" style={{ paddingInlineStart: "3rem" }}>
      <li aria-hidden>
        <YouTube {...props} />
      </li>
      <li>
        <Button
          color={player.playing ? "active" : undefined}
          onClick={handlePlay}
          disabled={player.queue.length === 0}
        >
          {player.playing ? "Pause" : "Play"}
        </Button>
      </li>
      <li style={{ position: "relative" }}>
        <Button
          onClick={() => setQueueOpen(undefined)}
          color={isQueueOpen ? "active" : undefined}
        >
          Queue ⏑
        </Button>
        {isQueueOpen ? (
          <div ref={queueRef} className={queueClassList.toString()}>
            <ol role="dialog" aria-label="Song queue list">
              {player.queue.map((url) => (
                <li
                  key={url}
                  className={player.url === url ? classes.active : undefined}
                >
                  <span>{url}</span>
                  <Button onClick={() => player.play(url)}>
                    {player.url === url ? "Rewind" : "Play"}
                  </Button>
                  <Button onClick={() => player.remove(url)}>Del.</Button>
                </li>
              ))}
              <li>
                <form onSubmit={handleAdd}>
                  <input
                    type="url"
                    name="url"
                    required
                    placeholder="YouTube video URL…"
                    aria-label="YouTube video URL…"
                    autoFocus
                    autoComplete="off"
                    onChange={handleUrlChange}
                  />
                  <Button type="submit" aria-label="Add song to queue">
                    Add
                  </Button>
                </form>
              </li>
            </ol>
          </div>
        ) : null}
      </li>
      <li>
        <Button
          color={player.muted ? "active" : undefined}
          onClick={handleMute}
        >
          {player.muted ? "Unmute" : "Mute"}
        </Button>
        <input
          ref={volumeRef}
          type="range"
          className={classes.volume}
          min="0"
          max="1"
          step="0.1"
          onChange={handleVolume}
          value={player.volume}
        />
      </li>
    </Flex>
  );
}
