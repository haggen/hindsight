import { useEffect, useState } from "react";

export function useWebSocket(url: string) {
  const [webSocket, setWebSocket] = useState<WebSocket>();

  useEffect(() => {
    new URL(url);

    console.log("Opening WebSocket connection to:", url);
    const webSocket = new WebSocket(url);
    setWebSocket(webSocket);

    // const handleOpen = () => {
    // };
    // webSocket.addEventListener("open", handleOpen);

    // const handleClose = () => {
    //   setWebSocket(undefined);
    // };
    // webSocket.addEventListener("close", handleClose);

    return () => {
      if (webSocket.readyState === WebSocket.OPEN) {
        console.log("Closing WebSocket connection:", url);
        webSocket.close();
      } else if (webSocket.readyState === WebSocket.CONNECTING) {
        console.log("Scheduling closure of WebSocket connection:", url);
        webSocket.addEventListener("open", () => {
          console.log("Scheduled closing WebSocket connection:", url);
          webSocket.close();
        });
      }

      // webSocket.removeEventListener("open", handleOpen);
      // webSocket.removeEventListener("close", handleClose);
    };
  }, [url]);

  return webSocket;
}
