import React from "react";

const TranscriptEditor = ({ transcript, onEdit }) => (
    <div>
        <h2>Transcript</h2>
        <ul>
            {transcript.map((text, index) => (
                <li key={index}>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => onEdit(index, e.target.value)}
                    />
                </li>
            ))}
        </ul>
    </div>
);

export default TranscriptEditor;