import subprocess
import os
import json
from pathlib import Path
from pydub import AudioSegment



MODEL_DIR = "models"
MODEL = MODEL_DIR + "/pl_PL-gosia-medium.onnx"
CONFIG = MODEL_DIR + "/pl_PL-gosia-medium.onnx.json"
DATA_DIR = "../data"
VOICE_DIR = "../voice"





def convert(sentence: str, filename: str):

    if os.path.isfile(filename):
        print(f"Skip : {filename} <- {text}")
        return
        
    print(f"Make: {filename} -> {text}")
    subprocess.run(
        [
            "piper",
            "--model", MODEL,
            "--config", CONFIG,
            "--output_file", filename
        ],
        input=sentence,
        text=True,
        check=True
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

    for idx, item in enumerate(content.get("data", [])):
        text = item.get("text")
        if text is None:
            continue

        index_str = f"{idx:04d}"
        output_filename = f"{VOICE_DIR}/{base_name}_{index_str}.ogg"
        
        if os.path.isfile(output_filename):
            print("Skip: "+ output_filename)
            continue



        
        tmp_filename = "tmp_voice.wav"
        if os.path.isfile(tmp_filename):
            os.remove(tmp_filename) 
        convert(text, tmp_filename)
        
        # add a half of second of silence at the end and convert to ogg
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
        os.remove(tmp_filename)   
        
        
        



