import os
import json
import subprocess
from aeneas.executetask import ExecuteTask
from aeneas.task import Task

# === FILE PATHS ===
audio_path = r"C:\Users\ljdde\OneDrive\Desktop\UROPs\CataniaUROP\WebApp2\WebApp\client\src\assets\audio-book-for-children.wav"
transcript_path = r"C:\Users\ljdde\OneDrive\Desktop\UROPs\CataniaUROP\WebApp2\WebApp\whisperProgram\three_little_pigs_transcript.txt"

# === PRE‑PROCESSING: make 16 kHz mono WAV ===
processed_audio = os.path.abspath("processed.wav")
if not os.path.exists(processed_audio):
    print("Pre‑processing audio to 16 kHz mono…")
    subprocess.run([
        "ffmpeg", "-y",
        "-i", audio_path,
        "-ac", "1",        # mono
        "-ar", "16000",    # 16 kHz
        processed_audio
    ], check=True)

# === OUTPUT FILE PATHS ===
raw_output_json_path = os.path.abspath("alignment_output.json")
final_output_json_path = os.path.abspath("final_output.json")

# === CONFIGURATION ===
config_string = (
    "task_language=eng|is_text_type=plain|os_task_file_format=json|"
    "task_adjust_boundary_algorithm=rate|"
    "task_adjust_boundary_percent_value=30"
)

# === CREATE THE TASK ===
task = Task(config_string=config_string)
task.audio_file_path_absolute = processed_audio
task.text_file_path_absolute = transcript_path
task.output_file_path_absolute = raw_output_json_path

# Ensure the folder for raw_output_json_path exists (in case you change the path to a subfolder)
folder = os.path.dirname(raw_output_json_path)
if folder:
    os.makedirs(folder, exist_ok=True)

# === RUN ALIGNMENT (Aeneas) ===
print("Aligning transcript to audio...")
ExecuteTask(task).execute()

# --- MANUAL SAVE (using 'json_string' property which worked for you) ---
with open(raw_output_json_path, "w", encoding="utf-8") as f:
    f.write(task.sync_map.json_string)
print(f"Raw alignment output saved to {raw_output_json_path}")

# === REFORMAT THE RAW JSON INTO THE DESIRED STRUCTURE ===
# Desired format: { "word": "text", "time": [start, end] } for each word.
with open(raw_output_json_path, "r", encoding="utf-8") as f:
    raw_data = json.load(f)

final_data = []
for frag in raw_data.get("fragments", []):
    # Skip special HEAD and TAIL fragments or any with no text.
    if frag.get("id") in ["HEAD", "TAIL"]:
        continue
    if not frag.get("lines"):
        continue
    # Concatenate lines (should be a single word if transcript was one word per line)
    word = " ".join(frag["lines"]).strip()
    try:
        begin = float(frag["begin"])
        end = float(frag["end"])
    except (TypeError, ValueError):
        continue
    final_data.append({"word": word, "time": [begin, end]})

with open(final_output_json_path, "w", encoding="utf-8") as f:
    json.dump(final_data, f, indent=2, ensure_ascii=False)
print(f"Final formatted alignment output saved to {final_output_json_path}")
