#!/bin/sh

mkdir models
wget  -O models/pl_PL-gosia-medium.onnx "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/pl/pl_PL/darkman/medium/pl_PL-darkman-medium.onnx?download=true"
wget  -O models/pl_PL-gosia-medium.onnx.json "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/pl/pl_PL/gosia/medium/pl_PL-gosia-medium.onnx.json?download=true"
