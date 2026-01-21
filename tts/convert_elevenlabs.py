from elevenlabs.client import ElevenLabs
from secret import ELEVENLABS_KEY


VOICE_DIR = "../voice"

VOICE = {
  #"pl-PL": ["P9yx385KN0FOmLll8Lkx","Michał K"],#<-- man 1 low 
  
  
  #"pl-PL": ["V5GZ9rfeV9jjKZE5NkT7", "adam"], # <--
  #"pl-PL": ["eJLcDj3fKW65V8WhDqPI", "null"],
  #"pl-PL": ["lehrjHysCyPSvjt0uSy6", "marta"], # <-- woman 1
 #"pl-PL": ["zzBTsLBFM6AOJtkr1e9b", "pawel pro"], # <----- man 2
 
 "pl-PL": ["aAY9hMI6VU335JUszdRs", "alexandra"], # <----- femail 2
  
  }

client = ElevenLabs(api_key=ELEVENLABS_KEY)

def convert(sentence: str, filename: str,language:str)->bool:
        
    if not ( language in VOICE):
        print(f"Language {language} not supported")
        return False
        
    voiceid = VOICE[language][0]
    voicename = VOICE[language][1]
    
    audio_generator = client.text_to_speech.convert(
        text=sentence,
        voice_id=voiceid,
        output_format="wav_22050",
    )

    audio_data = b"".join(audio_generator)
    
    audio_data = audio_data[:-100] # click wolkaround    

    with open(filename, "wb") as wav_file:
        wav_file.write(audio_data)
    
    print(f"Make ElevenLabs: {filename} <- ({language}) [{voicename}] {sentence}")
    
    return True
    
