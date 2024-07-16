import { useEffect, useState } from "react";

export function useWebSocket(url: string) {
  const [webSocket, setWebSocket] = useState<WebSocket>();

  useEffect(() => {
    if (!url) {
      return;
    }

    const webSocket = new WebSocket(url);

    const handleOpen = () => {
      setWebSocket(webSocket);
    };
    webSocket.addEventListener("open", handleOpen);

    const handleClose = () => {
      setWebSocket(undefined);
    };
    webSocket.addEventListener("close", handleClose);

    return () => {
      if (webSocket.readyState === WebSocket.OPEN) {
        webSocket.close();
      } else if (webSocket.readyState === WebSocket.CONNECTING) {
        webSocket.addEventListener("open", () => {
          webSocket.close();
        });
      }

      webSocket.removeEventListener("open", handleOpen);
      webSocket.removeEventListener("close", handleClose);
    };
  }, [url]);

  return webSocket;
}
