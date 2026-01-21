from elevenlabs.client import ElevenLabs
from secret import ELEVENLABS_KEY


VOICE_DEFAULT = "m0"

VOICE_DIR = "../voice"

VOICE = [
  ["pl-PL", "P9yx385KN0FOmLll8Lkx","Michał K","m0"],#<-- man 1 low 
  ["pl-PL", "V5GZ9rfeV9jjKZE5NkT7", "adam", "m2"], # <--
  ["pl-PL", "eJLcDj3fKW65V8WhDqPI", "null","m3"],# <-   male 
  ["pl-PL", "lehrjHysCyPSvjt0uSy6", "marta", "f0"], # <-- woman 1
  ["pl-PL", "zzBTsLBFM6AOJtkr1e9b", "pawel pro", "m1"], # <----- man 2
  ["pl-PL", "aAY9hMI6VU335JUszdRs", "alexandra","f1"], # <----- femail 2
  
  ]

client = ElevenLabs(api_key=ELEVENLABS_KEY)



def find_voice(language:str,voicetype:str):

    for d in VOICE:
      if (d[0]==language) and (d[3]==voicetype):
          return d;
    return None


def convert(sentence: str, filename: str,language:str,voicetype:str=None)->bool:
    
    if voicetype==None:
        voicetype = VOICE_DEFAULT;
        
    d = find_voice(language,voicetype)
    
    if d==None:
        print(f"Voice {language} - {voicetype} not supported")
        return False
        
        
        
    voiceid = d[1]
    voicename = d[2]
   
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
    
