# pip install TTS

# tts_models/pl/mai_female/vits

#pyenv activate .venv310


import subprocess
import os
import json
from pathlib import Path
from pydub import AudioSegment
from TTS.api import TTS



tts = TTS(
    #model_name="tts_models/pl/mai_female/vits",
    model_name="tts_models/multilingual/multi-dataset/xtts_v2",
    gpu=True   # Force GPU usage
)








DATA_DIR = "../data"
VOICE_DIR = "../voice"



def convert(sentence: str, filename: str,language:str,model_file,config_file):
        
    #if sentence.endswith('.'):
    #    sentence  += ".."
        
    print(f"Make: {filename} <- ({language}) {sentence}")
    tts.tts_to_file(
        text=sentence,
        language="pl",
        file_path=filename,
        #speaker_wav="speaker.wav",
        speaker_wav="speaker_hobbit_clean3.wav",
        #speaker_wav="speaker_marta.wav",
        temperature=0.2        
    )


    

if not os.path.exists(VOICE_DIR):
    os.makedirs(VOICE_DIR)


for file_name in os.listdir(DATA_DIR):
    if not file_name.endswith(".json"):
        continue
        
    print(">>>",file_name)

    file_path = os.path.join(DATA_DIR, file_name)
    base_name = os.path.splitext(file_name)[0]

    with open(file_path, "r", encoding="utf-8") as f:
        content = json.load(f)

    language = content.get("language","en-US")

    for idx, item in enumerate(content.get("data", [])):
        text = item.get("text")
        if text is None:
            continue

        index_str = f"{idx:04d}"
        output_filename = f"{VOICE_DIR}/{base_name}_{index_str}.ogg"
        
        if os.path.isfile(output_filename):
            print("Skip: "+ output_filename)
            continue
        
            
        model_file = None
        config_file = None

        tmp_filename = "tmp_voice.wav"
        if os.path.isfile(tmp_filename):
            os.remove(tmp_filename) 
        convert(text, tmp_filename,language,model_file,config_file)
        
        
        
        
        # Add half a second of silence at the end, then convert to OGG.
        print(f"Convert: {tmp_filename} -> {output_filename}")
        audio = AudioSegment.from_wav(tmp_filename)
        silence = AudioSegment.silent(duration=500)
        audio_with_silence = audio + silence
        audio_with_silence.export(
            output_filename,
            format="ogg",
            codec="libopus",
            bitrate="48k"
        )
        #os.remove(tmp_filename)   
        
        
        



