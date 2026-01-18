# TTS



## download models

```
./download_models.sh
```



## envirionment

tested on Python 3.10

```
sudo apt install -y python3 python3-venv python3-pip espeak-ng ffmpeg
```

```
python3 -m venv .venv
source .venv/bin/activate
```

```
pip install piper-tts
pip install pydub
```
or 
```
pip install -r requirements.txt
```

## test (optoinal)


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


## pyenv


1) install pyenv

2)
```

pyenv install 3.10.14
pyenv virtualenv 3.10.14 tts-env
pyenv activate tts-env

```


3)
```
python --version
```

4) tts

```
pip install --upgrade pip setuptools wheel
pip install TTS
```

  
  
  