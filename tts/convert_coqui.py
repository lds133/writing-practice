# pip install TTS

# tts_models/pl/mai_female/vits

#pyenv activate .venv310


import os
from TTS.api import TTS



tts = TTS(
    model_name="tts_models/multilingual/multi-dataset/xtts_v2",
    gpu=True   # Force GPU usage
)




def convert(sentence: str, filename: str,language:str):
        
    if language != "pl-PL":
        print("unsupported language")
        return False
        
    print(f"Make XTTS: {filename} <- ({language}) {sentence}")
    tts.tts_to_file(
        text=sentence,
        language="pl",
        file_path=filename,
        #speaker_wav="speaker.wav",
        speaker_wav="speaker_hobbit_clean3.wav",
        #speaker_wav="speaker_marta.wav",
        temperature=0.2        
    )

    return os.path.isfile(filename)
