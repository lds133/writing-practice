# TTS



## download model

```
./download_models.sh
```


*pl_PL-gosia-medium.onnx* and  *pl_PL-gosia-medium.onnx.json* should appear in the *models* folder


## envirionment

```
sudo apt install -y python3 python3-venv python3-pip espeak-ng ffmpeg
```


```
apt-get install python3-virtualenv
python3 -m venv .venv
source .venv/bin/activate
pip install piper-tts
```


## test


```
source .venv/bin/activate

piper \
  --model ~/TTS/voxpolska/pl_PL-gosia-medium.onnx \
  --config ~/TTS/voxpolska/pl_PL-gosia-medium.onnx.json \
  --output_file test.wav \
  --text "To jest test syntezy mowy w języku polskim."
  
```  

```
aplay test.wav
```

Note: It is okay if the word "text" is heard before the sentence.


## run conversion

```
source .venv/bin/activate

python convert.py
```


  
  
  