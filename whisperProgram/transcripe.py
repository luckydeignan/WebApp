import torchaudio
import json
from transformers import pipeline
import torch

# Use GPU if available
device = "cuda:0" if torch.cuda.is_available() else "cpu"

# Load mono audio (use first channel if stereo)
path = "C:\\Users\\ljdde\\OneDrive\\Desktop\\UROPs\\CataniaUROP\\WebApp2\\WebApp\\client\\src\\assets\\threelittlepigsshortened.wav"
waveform, sample_rate = torchaudio.load(path)
mono_waveform = waveform[0].numpy()  # assume left channel is sufficient

# Only do first 60 seconds
mono_waveform = mono_waveform[:int(sample_rate * 60)]

# Transcription pipeline
pipe = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-large-v2",
    return_timestamps="word",  # get word-level timestamps
    chunk_length_s=30,
    device=device,
)

# Run transcription
output = pipe(mono_waveform)

# Save output
output_path = "threePigs_LargeV2_WordTimestamps.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"Transcription saved to {output_path}")
