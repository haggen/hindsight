import { useCallback, useEffect, useRef } from "react";

type Options<T> = {
  url: string;
  onOpen?: () => void;
  onMessage: (data: T) => void;
};

export const useWebSocket = <T = unknown>({
  url,
  onOpen,
  onMessage,
}: Options<T>) => {
  const webSocketRef = useRef<WebSocket>();

  useEffect(() => {
    if (url) {
      webSocketRef.current = new WebSocket(url);
    }
    return () => {
      webSocketRef.current?.close();
    };
  }, [url]);

  useEffect(() => {
    if (!webSocketRef.current) {
      return;
    }

    webSocketRef.current.onopen = () => {
      onOpen?.();
    };
    webSocketRef.current.onmessage = (e) => {
      onMessage(JSON.parse(e.data));
    };
  }, [onOpen, onMessage]);

  const dispatch = useCallback((data: T) => {
    webSocketRef.current?.send(JSON.stringify(data));
  }, []);

  return [webSocketRef.current?.readyState, dispatch] as const;
};
