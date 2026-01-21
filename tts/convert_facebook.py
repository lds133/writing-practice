
import torch
from transformers import VitsModel, AutoTokenizer
import soundfile as sf










model_name = "facebook/mms-tts-pol"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = VitsModel.from_pretrained(model_name)



def convert(sentence: str, filename: str,language:str):
    

    if language != "pl-PL":
        print("unsupported language")
        return False

    inputs = tokenizer(sentence, return_tensors="pt")




    with torch.no_grad():
        output = model(**inputs).waveform

    print(f"Make FB: {filename} <- ({language}) {sentence}")

    waveform = output.squeeze().cpu().numpy()


    sf.write(
        filename,
        waveform,
        samplerate=16000
    )

    return True
