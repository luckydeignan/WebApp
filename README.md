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


 # Whisper Program WorkFlow
 - run whisperProgram/timestamp_creator.py [path_to_file] to create audio timestamps
 - timestamp_data will be saved to WebApp/output directory
 - run whisperProgram/reformat.py [path_to_input_file] -o [path_to_output_file]
    - if no output file provided, reformatted JSON will just print to stdout
    - if output file provided, will dump JSON to whisperProgram/[output_file] 
 - from here, change file_path in line "import threePigsTimestamps from [file_path]" in client/src/components/Book.tsx


 
