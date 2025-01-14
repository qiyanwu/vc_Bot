from pydantic import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str
    whisper_model_name: str = "base"
    tts_model_name: str = "tts_models/multilingual/multi-dataset/your_tts"

    class Config:
        env_file = ".env"

settings = Settings()