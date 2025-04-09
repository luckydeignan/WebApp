with open("raw_transcript.txt", "r") as infile, open("three_little_pigs_transcript.txt", "w") as outfile:
    words = infile.read().split()
    for word in words:
        outfile.write(word + "\n")
