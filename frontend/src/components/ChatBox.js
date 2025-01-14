import React, { useState, useRef, useEffect } from "react";

const ChatBox = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const mediaRecorderRef = useRef(null);
    const socketRef = useRef(null);

    // WebSocket setup
    useEffect(() => {
        socketRef.current = new WebSocket("https://fantastic-funicular-rp9vpwrw5pp25pp4-8000.app.github.dev/api/v1/chat/");

        socketRef.current.onopen = () => {
            console.log("WebSocket connection established.");
        };

        socketRef.current.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socketRef.current.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                if (response.user_text) {
                    setTranscript((prev) => [...prev, { type: "user", text: response.user_text }]);
                }
                if (response.llm_text) {
                    setTranscript((prev) => [...prev, { type: "bot", text: response.llm_text }]);
                }
            } catch (e) {
                console.error("Error parsing WebSocket message:", e.message);
            }
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const handleStartListening = async () => {
        if (socketRef.current && socketRef.current.readyState !== WebSocket.OPEN) {
            console.error("Cannot start recording: WebSocket is not open.");
            return;
        }
        
        setIsListening(true);
    
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
    
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    // Ensure WebSocket is open before sending
                    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                        socketRef.current.send(event.data);
                    } else {
                        console.error("WebSocket is not ready to send data.");
                    }
                }
            };
    
            mediaRecorderRef.current.start();
            console.log("Recording started");
        } catch (error) {
            console.error("Error accessing microphone:", error);
            setIsListening(false);
        }
    };

    const handleStopListening = () => {
        setIsListening(false);

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
            mediaRecorderRef.current = null;
        }

        console.log("Recording stopped");
    };

    return (
        <div>
            <button onClick={isListening ? handleStopListening : handleStartListening}>
                {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <div className="transcript">
                {transcript.map((entry, index) => (
                    <p key={index} className={entry.type === "user" ? "user-text" : "bot-text"}>
                        {entry.text}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default ChatBox;