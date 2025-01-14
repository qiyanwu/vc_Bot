import whisper

class STTService:
    def __init__(self, model_name="base"):
        self.model = whisper.load_model(model_name)

    def transcribe_audio(self, audio_path: str) -> str:
        """
        Transcribe the given audio file to text.
        """
        try:
            result = self.model.transcribe(audio_path)
            return result.get("text", "")
        except Exception as e:
            print(f"Error during transcription: {e}")
            return "Error: Unable to transcribe audio."