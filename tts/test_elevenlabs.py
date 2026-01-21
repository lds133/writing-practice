
from elevenlabs.client import ElevenLabs
from secret import ELEVENLABS_KEY

client = ElevenLabs(api_key=ELEVENLABS_KEY)

audio_generator = client.text_to_speech.convert(
    text="Codziennie rano wstaję bardzo wcześnie.",
    #voice_id="P9yx385KN0FOmLll8Lkx",
    #voice_id="zzBTsLBFM6AOJtkr1e9b",
    voice_id="V5GZ9rfeV9jjKZE5NkT7",
    #voice_id="eJLcDj3fKW65V8WhDqPI",
    output_format="wav_22050",
)

audio_data = b"".join(audio_generator)

audio_data = audio_data[:-100] # click wolkaround

with open("tmp_output.wav", "wb") as wav_file:
    wav_file.write(audio_data)
    
    
    
# ['alaw_8000', 'm4a_aac_44100_128', 'mp3_22050_32', 'mp3_24000_48', 'mp3_44100_128', 'mp3_44100_192', 'mp3_44100_32', 'mp3_44100_64', 'mp3_44100_96', 'opus_48000_128', 'opus_48000_192', 'opus_48000_32', 'opus_48000_64', 'opus_48000_96', 'pcm_16000', 'pcm_22050', 'pcm_24000', 'pcm_32000', 'pcm_44100', 'pcm_48000', 'pcm_8000', 'ulaw_8000', 'wav_16000', 'wav_22050', 'wav_24000', 'wav_32000', 'wav_44100', 'wav_48000', 'wav_8000']"}}
    