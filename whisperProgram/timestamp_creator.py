#!/usr/bin/env python3

import os
import argparse
import torch
import numpy as np
from tqdm import tqdm
import whisper
import soundfile as sf
from whisper.utils import get_writer


def load_audio_with_soundfile(file_path, sample_rate=16000):
    """
    Load audio file using soundfile instead of relying on ffmpeg.
    
    Args:
        file_path (str): Path to the audio file
        sample_rate (int): Target sample rate
    
    Returns:
        numpy.ndarray: Audio data as a 1D numpy array
    """
    print(f"Loading audio file {file_path} with soundfile...")
    try:
        # Read audio data with original sample rate
        audio_data, orig_sr = sf.read(file_path)
        
        # Convert stereo to mono if needed
        if len(audio_data.shape) > 1:
            audio_data = audio_data.mean(axis=1)
        
        # Resample if necessary
        if orig_sr != sample_rate:
            print(f"Resampling from {orig_sr}Hz to {sample_rate}Hz...")
            # Use a simple resampling approach
            import librosa
            audio_data = librosa.resample(
                audio_data, orig_sr=orig_sr, target_sr=sample_rate
            )
        
        # Normalize audio
        if audio_data.dtype != np.float32:
            audio_data = audio_data.astype(np.float32)
        
        if np.abs(audio_data).max() > 1.0:
            audio_data = audio_data / np.abs(audio_data).max()
            
        return audio_data
    
    except Exception as e:
        print(f"Error loading audio: {e}")
        # Fallback to original Whisper method if available
        try:
            print("Trying fallback to whisper's audio loading...")
            from whisper.audio import load_audio
            return load_audio(file_path)
        except Exception as e2:
            print(f"Fallback also failed: {e2}")
            raise e


class WhisperTranscriber:
    def __init__(self, model_size="medium", device=None):
        """
        Initialize the Whisper transcriber with the specified model size.
        
        Args:
            model_size (str): Size of the Whisper model to use ('tiny', 'base', 'small', 
                              'medium', 'large', 'large-v2', 'large-v3')
            device (str): Device to use for computation ('cuda', 'mps', 'cpu', or None for auto-detection)
        """
        self.model_size = model_size
        
        # Set device
        if device is None:
            if torch.cuda.is_available():
                self.device = "cuda"
            elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
                self.device = "mps"
            else:
                self.device = "cpu"
        else:
            self.device = device
            
        print(f"Loading Whisper {model_size} model on {self.device}...")
        self.model = whisper.load_model(model_size).to(self.device)
        print("Model loaded successfully.")

    def transcribe(self, audio_path, language=None, word_timestamps=True, output_dir="./output"):
        """
        Transcribe an audio file with word-level timestamps.
        
        Args:
            audio_path (str): Path to the audio file
            language (str): Language code (e.g., 'en', 'fr', None for auto-detection)
            word_timestamps (bool): Whether to generate word-level timestamps
            output_dir (str): Directory to save output files
            
        Returns:
            dict: The transcription result containing segments with word-level timing
        """
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")
        
        print(f"Transcribing {audio_path}...")
        
        # Load audio using our custom function
        audio_data = load_audio_with_soundfile(audio_path)
        
        # Prepare transcription options
        transcribe_options = {
            "task": "transcribe",
            "language": language,
            "word_timestamps": word_timestamps,
            "verbose": True if self.model_size == "large" else None,
        }
        
        # Run the transcription with loaded audio
        result = self.model.transcribe(audio_data, **transcribe_options)
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Get base filename without extension
        base_filename = os.path.splitext(os.path.basename(audio_path))[0]
        
        # Create writers with proper output_dir parameter
        writers = {
            "json": get_writer("json", output_dir),
            "txt": get_writer("txt", output_dir),
            "vtt": get_writer("vtt", output_dir),
            "srt": get_writer("srt", output_dir),
            "tsv": get_writer("tsv", output_dir),
        }
        
        # Save results in different formats
        for ext, writer in writers.items():
            try:
                output_file = os.path.join(output_dir, f"{base_filename}.{ext}")
                writer(result, audio_path)
                print(f"Saved transcription to {output_file}")
            except Exception as e:
                print(f"Error saving {ext} format: {e}")
        
        return result
    
    def print_word_timestamps(self, result):
        """
        Print word-level timestamps from the transcription result.
        
        Args:
            result (dict): The transcription result from whisper.transcribe()
        """
        print("\nWord-level timestamps:")
        print("-" * 60)
        print(f"{'Word':<20} {'Start (s)':<15} {'End (s)':<15}")
        print("-" * 60)
        
        for segment in result["segments"]:
            for word in segment.get("words", []):
                word_text = word["word"].strip()
                start = word["start"]
                end = word["end"]
                print(f"{word_text:<20} {start:<15.2f} {end:<15.2f}")


def main():
    parser = argparse.ArgumentParser(description="Transcribe audio using Whisper with word-level timestamps")
    
    parser.add_argument("audio_path", type=str, help="Path to the audio file")
    parser.add_argument("--model", type=str, default="medium", 
                        choices=["tiny", "base", "small", "medium", "large", "large-v2", "large-v3"],
                        help="Whisper model size")
    parser.add_argument("--language", type=str, default=None,
                        help="Language code (e.g., 'en', 'fr', None for auto-detection)")
    parser.add_argument("--device", type=str, default=None,
                        choices=["cuda", "mps", "cpu", None],
                        help="Device to use (cuda, mps, cpu, or None for auto-detection)")
    parser.add_argument("--output-dir", type=str, default="./output",
                        help="Directory to save output files")
    
    args = parser.parse_args()
    
    # Initialize transcriber
    transcriber = WhisperTranscriber(model_size=args.model, device=args.device)
    
    # Run transcription
    result = transcriber.transcribe(
        audio_path=args.audio_path,
        language=args.language,
        output_dir=args.output_dir
    )
    
    # Print word timestamps
    transcriber.print_word_timestamps(result)
    
    # Print a summary
    total_duration = result["segments"][-1]["end"] if result["segments"] else 0
    total_words = sum(len(segment.get("words", [])) for segment in result["segments"])
    
    print("\nTranscription Summary:")
    print(f"Total duration: {total_duration:.2f} seconds")
    print(f"Total words: {total_words}")
    print(f"Average words per second: {total_words / total_duration:.2f}" if total_duration > 0 else "N/A")
    
    print(f"\nOutput files saved to {args.output_dir}")
    print(f"Main formats: {args.output_dir}/{os.path.splitext(os.path.basename(args.audio_path))[0]}.[json|txt|vtt|srt|tsv]")


if __name__ == "__main__":
    main()