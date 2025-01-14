from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.stt_service import STTService
from app.services.tts_service import TTSService
from app.services.llm_service import LLMService
import os
import subprocess

router = APIRouter()

# Initialize services
stt_service = STTService()
tts_service = TTSService()
llm_service = LLMService(api_key=os.getenv("OPENAI_API_KEY"))

@router.websocket("/")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        print("WebSocket connection accepted.")
        while True:
            # Receive audio data
            audio_data = await websocket.receive_bytes()
            print(f"Received audio data of size: {len(audio_data)} bytes")

            # Save the received audio data
            audio_path = "input.wav"
            with open(audio_path, "wb") as f:
                f.write(audio_data)

            # Validate audio
            validated_audio_path = validate_audio(audio_path)
            if not validated_audio_path:
                await websocket.send_json({"error": "Invalid audio format."})
                continue

            # Transcribe audio
            user_text = stt_service.transcribe_audio(validated_audio_path)

            # Generate response
            llm_response = llm_service.generate_response(user_text)

            # Generate TTS audio
            response_audio_path = "response.wav"
            tts_service.generate_audio(llm_response, response_audio_path)

            # Send the response back
            await websocket.send_json({"user_text": user_text, "llm_text": llm_response})
            with open(response_audio_path, "rb") as audio_file:
                await websocket.send_bytes(audio_file.read())

    except WebSocketDisconnect:
        print("WebSocket connection closed by the client.")
    except Exception as e:
        print(f"Error: {e}")
        try:
            await websocket.send_json({"error": str(e)})
        except RuntimeError:
            # Handle cases where the connection is already closed
            print("Cannot send error message: WebSocket is closed.")


def validate_audio(audio_path):
    """
    Validate and convert the input audio to ensure it's a proper WAV file
    with 16kHz, mono channel, and PCM encoding.
    """
    try:
        # Check if the file exists
        if not os.path.exists(audio_path):
            print("Audio file not found.")
            return None

        # Validate and convert the audio using FFmpeg
        output_path = "validated_input.wav"
        command = [
            "ffmpeg", "-i", audio_path,
            "-ar", "16000",  # Set sample rate to 16kHz
            "-ac", "1",      # Set audio to mono
            "-f", "wav",     # Ensure output format is WAV
            output_path
        ]
        subprocess.run(command, check=True, stderr=subprocess.PIPE)
        print(f"Audio validated and saved as: {output_path}")
        return output_path
    except subprocess.CalledProcessError as e:
        print(f"Error during audio validation: {e.stderr.decode()}")
        return None