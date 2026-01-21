import subprocess
import os
from pathlib import Path


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



def convert(sentence: str, filename: str,language:str)->bool:
        
    if not ( language in MODEL):
        print(f"Language {language} not supported")
        return False
        
        
    model_file = MODEL_DIR+"/" + MODEL[language][0]
    config_file = MODEL_DIR+"/" + MODEL[language][1]        
    if not os.path.isfile(model_file):
        print(f"Model file {model_file} not found")
        return False
    if not os.path.isfile(config_file):
        print(f"Model configuration file {config_file} not found")
        return False
        
        
        
    print(f"Make Piper: {filename} <- ({language}) [{model_file}] {sentence}")
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
    
    return os.path.isfile(filename)
    
