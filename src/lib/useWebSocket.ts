import { useEffect, useState } from "react";

export function useWebSocket(url: string) {
  const [webSocket, setWebSocket] = useState<WebSocket>();

  useEffect(() => {
    const webSocket = new WebSocket(url);

    setWebSocket(webSocket);

    return () => {
      if (webSocket.readyState === WebSocket.OPEN) {
        webSocket.close();
      } else if (webSocket.readyState === WebSocket.CONNECTING) {
        webSocket.addEventListener("open", () => {
          webSocket.close();
        });
      }
    };
  }, [url]);

  return webSocket;
}
