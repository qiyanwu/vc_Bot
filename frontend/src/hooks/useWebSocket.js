import { useRef, useEffect } from "react";

export const useWebSocket = (url) => {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => console.log("WebSocket connection established.");
        socketRef.current.onclose = () => console.log("WebSocket connection closed.");
        socketRef.current.onerror = (error) => console.error("WebSocket error:", error);

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [url]);

    const sendAudio = (audioBlob) => {
        return new Promise((resolve, reject) => {
            if (socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(audioBlob);

                socketRef.current.onmessage = (event) => {
                    try {
                        resolve(JSON.parse(event.data));
                    } catch (error) {
                        reject(new Error("Invalid JSON response."));
                    }
                };

                socketRef.current.onerror = (error) => {
                    reject(error);
                };
            } else {
                reject(new Error("WebSocket is not open."));
            }
        });
    };

    return { sendAudio };
};