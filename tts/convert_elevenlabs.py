from elevenlabs.client import ElevenLabs
from secret import ELEVENLABS_KEY


VOICE_DEFAULT = "m0"

VOICE_DIR = "../voice"

VOICE = [
  ["pl-PL", "P9yx385KN0FOmLll8Lkx", "Michał K",   "m","0"],#<-- man 1 low 
  ["pl-PL", "V5GZ9rfeV9jjKZE5NkT7", "adam",       "m","2"], # <-- male
  ["pl-PL", "eJLcDj3fKW65V8WhDqPI", "null",       "m","3"],# <-   male 
  ["pl-PL", "lehrjHysCyPSvjt0uSy6", "marta",      "f","0"], # <-- woman 1
  ["pl-PL", "zzBTsLBFM6AOJtkr1e9b", "pawel pro",  "m","1"], # <----- man 2
  ["pl-PL", "aAY9hMI6VU335JUszdRs", "alexandra",  "f","1"], # <----- female 2
  
  ["fr-FR","or4EV8aZq78KWcXw48wd", "rachel_fr","f","0" ],
  ["es-ES","6wMKsI8ig8FZUfpyZDIY", "nadia_es","f","0" ],
  ["de-DE","7eVMgwCnXydb3CikjV7a","lea_de","f","0"],
  ["en-US","uhHbrbsgQVJnH4Sne0ij","anya_en","f","0"],
  
  ]

client = ElevenLabs(api_key=ELEVENLABS_KEY)



def find_voice(language:str,voicetype:str):

    voice_gender = voicetype[0]
    voice_index = voicetype[1]
    v0 = None
    v1 = None
    v2 = None
    for d in VOICE:
      if (language==d[0]):
        v0 = d
        if (voice_gender==d[3]):
          v1 = d
          if (voice_index==d[4]):
             v2 = d
             break
          
    return v2 if v2!=None else (v1 if v1!=None else v0)


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
    
