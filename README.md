# WebApp
WebApp Book Component for Catania UROP



 projectOverview: Book Component for Catania UROP
 author: Lucky Deignan
 version: 1.0

Setup/Info:

 client/src:
 - contains primary React program displaying UI
 - src/assets contains audios/images/timestamp data

 whisperProgram:
 - run whisperProgram/timestamp_creator.py [path_to_file] to create audio timestamps
 - timestamp_data will be saved to WebApp/output directory
 - run whisperProgram/reformat.py [path_to_input_file] -o [path_to_output_file]
    - if no output file provided, reformatted JSON will just print to stdout
    - if output file provided, will dump JSON to whisperProgram/[output_file] 
 - from here, change file_path in line "import threePigsTimestamps from [file_path]" in client/src/components/Book.tsx


 