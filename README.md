# WebApp
WebApp Book Component for Catania UROP


# Important Directories:

**/client**:
 - ./src contains front-end react components
 - this program uses tailwind CSS for design

 **/server**:
 - ./server.js contains Express initialization and API route endpoints
 - ./assets contains image/audio data for books
 - ./data contains timestamp data
 - Note: a book id as used in the code is simply the string of the name of the file as stored in ./assets and ./data

 **whisperProgram**:
 - ./timestamp_creator.py Runs OpenAI whisper speech-to-text model to create word level timestamps of given audio file
 - ./convert_whisper_words.py Converts the raw whisper output into flat list of WordObjects, used for data representation in server


 # Next Steps:
 - A potential next feature to implement is allowing the user to upload an audio file, then running the whisper program and saving the audio book data to server
 - For now, implementer can simply just add new books as they see fit given an audio file, the workflow to do which described below


 # Workflow for adding new book to server
 - run whisperProgram/timestamp_creator.py [path_to_audio_file] to create audio timestamps
 - timestamp_data will be saved to ./output directory
 - run whisperProgram/reformat.py [path_to_input_file] -o [path_to_output_file]
    - if no output file provided, reformatted JSON will just print to stdout
    - if output file provided, will dump JSON to whisperProgram/[output_file] 
 - from here, move timestamp_data into WebApp/server/data and move audio/image data into WebApp/server/assets
 - Note: as of now, the title displayed in UI is based on filenames. Accordingly name your files following the format:
      - If your title is Three Pigs, title the files Three-Pigs.[json/png/wav/etc]
      - If your title is Moon and Mountains, title the files Moon-and-Mountains.[json/png/wav/etc]
      - examples are provided in current repo


 
