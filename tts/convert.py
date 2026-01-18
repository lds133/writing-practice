import subprocess
import os
import json
from pathlib import Path
from pydub import AudioSegment



MODEL_DIR = "models"
DATA_DIR = "../data"
VOICE_DIR = "../voice"
MODEL = {
  "pl-PL": ["pl_PL-darkman-medium.onnx","pl_PL-darkman-medium.onnx.json"],
  #"pl-PL": ["pl_PL-gosia-medium.onnx","pl_PL-gosia-medium.onnx.json"],  
  #"pl-PL": ["pl_PL-mc_speech-medium.onnx","pl_PL-mc_speech-medium.onnx.json"],
  "es-ES":["es_ES-davefx-medium.onnx", "es_ES-davefx-medium.onnx.json"  ],
  "de-DE":["de_DE-thorsten-medium.onnx","de_DE-thorsten-medium.onnx.json"],
  "en-US":["en_US-amy-medium.onnx","en_US-amy-medium.onnx.json"],
  
  }



def convert(sentence: str, filename: str,language:str,model_file,config_file):
        
    print(f"Make: {filename} <- ({language}) [{model_file}] {text}")
    subprocess.run(
        [
            "piper",
            "--model", model_file,
            "--config",config_file,
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
        
        if not ( language in MODEL):
            print(f"Language {language} not supported")
            continue
            
        model_file = MODEL_DIR+"/" + MODEL[language][0]
        config_file = MODEL_DIR+"/" + MODEL[language][1]        
        if not os.path.isfile(model_file):
            print(f"Model file {model_file} not found")
            continue
        if not os.path.isfile(config_file):
            print(f"Model configuration file {config_file} not found")
            continue

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
        os.remove(tmp_filename)   
        
        
        



