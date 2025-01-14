import React from "react";

const AudioPlayer = ({ audio }) => {
    if (!audio) return null;

    const audioUrl = URL.createObjectURL(audio);

    return (
        <div>
            <h2>Audio Response</h2>
            <audio controls src={audioUrl}></audio>
        </div>
    );
};

export default AudioPlayer;