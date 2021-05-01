import { useCallback, useEffect, useRef } from "react";

const getStatus = (readyState: number | undefined) => {
  switch (readyState) {
    default:
      return "idle";
    case WebSocket.OPEN:
      return "open";
    case WebSocket.CONNECTING:
      return "connecting";
    case WebSocket.CLOSED:
      return "closed";
    case WebSocket.CLOSING:
      return "closing";
  }
};

export const useWebSocket = <T = unknown>(
  url: string,
  onMessage: (data: T) => void,
  onOpen?: () => void
) => {
  const webSocketRef = useRef<WebSocket>();
  const statusRef = useRef<ReturnType<typeof getStatus>>("idle");

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

  statusRef.current = getStatus(webSocketRef.current?.readyState);

  const send = useCallback((data: T) => {
    if (statusRef.current === "open") {
      webSocketRef.current?.send(JSON.stringify(data));
    }
  }, []);

  return { status: statusRef.current, send };
};
