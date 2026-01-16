#!/bin/sh

set -e


BASE="https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0"
MODEL_DIR="models"

mkdir -p "$MODEL_DIR"
cd "$MODEL_DIR"

echo "Downloading Piper TTS models..."

# ---------------------
# English (US) – Amy Medium
# ---------------------
wget -c "$BASE/en/en_US/amy/medium/en_US-amy-medium.onnx?download=true" -O en_US-amy-medium.onnx
wget -c "$BASE/en/en_US/amy/medium/en_US-amy-medium.onnx.json?download=true" -O en_US-amy-medium.onnx.json

# ---------------------
# German (DE) – Thorsten Medium
# ---------------------
wget -c "$BASE/de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx?download=true" -O de_DE-thorsten-medium.onnx
wget -c "$BASE/de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx.json?download=true" -O de_DE-thorsten-medium.onnx.json

# ---------------------
# Spanish (ES) – Davefx Medium (Spain)
# ---------------------
wget -c "$BASE/es/es_ES/davefx/medium/es_ES-davefx-medium.onnx?download=true" -O es_ES-davefx-medium.onnx
wget -c "$BASE/es/es_ES/davefx/medium/es_ES-davefx-medium.onnx.json?download=true" -O es_ES-davefx-medium.onnx.json

# ---------------------
# Polish (PL) – Darkman Medium
# ---------------------
wget -c "$BASE/pl/pl_PL/darkman/medium/pl_PL-darkman-medium.onnx?download=true" -O pl_PL-darkman-medium.onnx
wget -c "$BASE/pl/pl_PL/darkman/medium/pl_PL-darkman-medium.onnx.json?download=true" -O pl_PL-darkman-medium.onnx.json
wget -c "$BASE/pl/pl_PL/darkman/medium/pl_PL-darkman-medium.onnx?download=true" -O pl_PL-gosia-medium.onnx 
wget -c "$BASE/pl/pl_PL/gosia/medium/pl_PL-gosia-medium.onnx.json?download=true" -O pl_PL-gosia-medium.onnx.json 




echo "Download complete! All models are in the \"$MODEL_DIR\" folder."
