import os

def save_audio_file(audio_data: bytes, output_path: str):
    with open(output_path, "wb") as f:
        f.write(audio_data)

def load_env_variable(key: str, default=None):
    return os.getenv(key, default)