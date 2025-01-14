import React, { useState } from "react";
import ChatBox from "../components/ChatBox";
import TranscriptEditor from "../components/TranscriptEditor";
import AudioPlayer from "../components/AudioPlayer";

const HomePage = () => {
    const [transcript, setTranscript] = useState([]);
    const [responseAudio, setResponseAudio] = useState(null);

    const handleEditTranscript = (index, newText) => {
        const updatedTranscript = [...transcript];
        updatedTranscript[index] = newText;
        setTranscript(updatedTranscript);
    };

    return (
        <div>
            <h1>Voice Chatbot</h1>
            <ChatBox
                transcript={transcript}
                setTranscript={setTranscript}
                setResponseAudio={setResponseAudio}
            />
            <TranscriptEditor transcript={transcript} onEdit={handleEditTranscript} />
            <AudioPlayer audio={responseAudio} />
        </div>
    );
};

export default HomePage;