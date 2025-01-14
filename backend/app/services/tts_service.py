from TTS.api import TTS

class TTSService:
    def __init__(self, model_name="tts_models/multilingual/multi-dataset/your_tts"):
        self.tts = TTS(model_name=model_name)

    def generate_audio(self, text: str, output_path: str):
        self.tts.tts_to_file(text=text, file_path=output_path)
        return output_path