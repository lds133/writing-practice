import subprocess
import os
import json
from pathlib import Path

MODEL_DIR = "models"
MODEL = MODEL_DIR + "/pl_PL-gosia-medium.onnx"
CONFIG = MODEL_DIR + "/pl_PL-gosia-medium.onnx.json"
DATA_DIR = "../data"
VOICE_DIR = "voice"





def convert(sentence: str, filename: str):
    print(f"Converting: {filename} -> {text}")
    
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

    file_path = os.path.join(DATA_DIR, file_name)
    base_name = os.path.splitext(file_name)[0]

    with open(file_path, "r", encoding="utf-8") as f:
        content = json.load(f)

    for idx, item in enumerate(content.get("data", [])):
        text = item.get("text")
        if text is None:
            continue

        index_str = f"{idx:04d}"
        output_filename = f"{VOICE_DIR}/{base_name}_{index_str}.wav"

        convert(text, output_filename)



