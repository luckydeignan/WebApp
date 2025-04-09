import os
from aeneas.executetask import ExecuteTask
from aeneas.task import Task

# === FILE PATHS ===
audio_path = r"C:\Users\ljdde\OneDrive\Desktop\UROPs\CataniaUROP\WebApp2\WebApp\client\src\assets\threelittlepigsshortened.wav"
transcript_path = r"C:\Users\ljdde\OneDrive\Desktop\UROPs\CataniaUROP\WebApp2\WebApp\whisperProgram\three_little_pigs_transcript.txt"
output_json_path = os.path.abspath("alignment_output.json")

# === CONFIG ===
config_string = "task_language=eng|is_text_type=plain|os_task_file_format=json"

# === TASK ===
task = Task(config_string=config_string)
task.audio_file_path_absolute = audio_path
task.text_file_path_absolute = transcript_path
task.output_file_path_absolute = output_json_path

print("Aligning transcript to audio...")
ExecuteTask(task).execute()

# === MANUAL SAVE to fix Windows path bug ===
with open(output_json_path, "w", encoding="utf-8") as f:
    f.write(task.sync_map.json_string)  # Changed to_json_string() to json_string()

print(f"✅ Alignment saved to {output_json_path}")