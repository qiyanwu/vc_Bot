export const fetchTranscript = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    const response = await fetch("https://fantastic-funicular-rp9vpwrw5pp25pp4-8000.app.github.dev/api/v1/transcribe", {
        method: "POST",
        body: formData,
    });

    return response.json();
};