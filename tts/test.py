import subprocess
from pathlib import Path

MODEL_DIR = "models"
MODEL = MODEL_DIR + "/pl_PL-gosia-medium.onnx"
CONFIG = MODEL_DIR + "/pl_PL-gosia-medium.onnx.json"

sentences = [
    "Dzień dobry.",
    "To jest przykładowe zdanie.",
    "Synteza mowy działa lokalnie na komputerze."
]

output_dir = "voice"


for i, sentence in enumerate(sentences, 1):
    fn = f"{output_dir}/sentence_{i}.wav"
    print(">>>",i, sentence , "->", fn)
    subprocess.run(
        [
            "piper",
            "--model", MODEL,
            "--config", CONFIG,
            "--output_file", fn
        ],
        input=sentence,
        text=True,
        check=True
    )
