import "./book.css";
import exampleImage from "../assets/exampleImage.png"; // replace with the actual image file
import { useEffect, useRef, useState } from "react";
import threePigsAudio from "../assets/books-for-kids-read-aloud.wav";
import threePigsTimestamps from "C:\\Users\\ljdde\\OneDrive\\Desktop\\UROPs\\CataniaUROP\\WebApp2\\WebApp\\reformatted.json";
import Navigation from "./Navigate";
import Page from "./Page";

const Book = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * Breaks an array of word-timestamp objects into batches that
   *   – contain ≥ chunkSize words
   *   – end on the first word whose text finishes with “.”
   *
   * @param jsonList  full list of {text, timestamp} items
   * @param chunkSize minimum number of words per batch (default = 160)
   * @returns         nested array: batches[batchIdx][wordIdx]
   */
  function splitJsonList(
    jsonList: { text: string; timestamp: number[] }[],
    chunkSize = 160
  ): { text: string; timestamp: number[] }[][] {
    const batches: { text: string; timestamp: number[] }[][] = [];
    let currentBatch: { text: string; timestamp: number[] }[] = [];

    for (const word of jsonList) {
      currentBatch.push(word);

      const reachedMin = currentBatch.length >= chunkSize;
      const endsSentence = word.text.trim().endsWith(".");

      if (reachedMin && endsSentence) {
        batches.push(currentBatch);
        currentBatch = [];
      }
    }

    // push any trailing words that didn’t finish with “.”
    if (currentBatch.length) batches.push(currentBatch);

    return batches;
  }

  const threePigsPages: { text: string; timestamp: number[] }[][] =
    splitJsonList(threePigsTimestamps);


  // Initialize audio only once on component mount
  useEffect(() => {
    audioRef.current = new Audio(threePigsAudio);

    const handleTimeUpdate = () => {
      const now = audioRef.current!.currentTime;
      setCurrentTime(now);
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("ended", handleAudioEnd);

    // Cleanup only on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("ended", handleAudioEnd);
        audioRef.current.pause();
      }
    };
  }, []); // Empty dependency array - runs once on mount



  // Separate effect for page boundary checking
useEffect(() => {
  if (!audioRef.current || !threePigsPages[currentPageIdx]?.length) return;
  
  const checkBoundary = () => {
    const now = audioRef.current!.currentTime;
    const page = threePigsPages[currentPageIdx];
    
    const first = page[0].timestamp[0];
    const last = page[page.length - 1].timestamp[1];
    
    if (first > now || now > last) {
      setIsPlaying(false);
      audioRef.current!.pause();
      // Optional: reset to beginning of page
      audioRef.current!.currentTime = first;
    }
  };
  
  // Check boundaries when this effect runs
  checkBoundary();
  
  // Also check on time updates
  const boundaryCheck = () => checkBoundary();
  audioRef.current.addEventListener('timeupdate', boundaryCheck);
  
  return () => {
    if (audioRef.current) {
      audioRef.current.removeEventListener('timeupdate', boundaryCheck);
    }
  };
}, [currentPageIdx]); // Rerun when page changes or time updates


  // Play/pause handler
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current!.pause();
    } else {
      audioRef.current!.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Next page handler
  const nextPage = () => {
    if (currentPageIdx < threePigsPages.length - 1) {
      const nextPageIdx = currentPageIdx + 1;
      audioRef.current!.pause();
      audioRef.current!.currentTime = threePigsPages[nextPageIdx][0].timestamp[0];
      setCurrentPageIdx(nextPageIdx);
      setIsPlaying(false); 
    }
  };

  // Prev page handler
  const prevPage = () => {
    if (currentPageIdx > 0) {
      setCurrentPageIdx(currentPageIdx - 1);
      setIsPlaying(false);
    }
  };

  // Add this function to your Book component
const setTime = (timestamp: number) => {
  if (audioRef.current) {
    // First pause any current playback
    audioRef.current.pause();
    
    // Set the time to the provided timestamp
    audioRef.current.currentTime = timestamp;
    
    // Start playing from this position
    audioRef.current.play()
      .then(() => {
        // Update playing state
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Failed to play audio:", error);
        setIsPlaying(false);
      });
  }
};

  // Get the current page data
  const currentPageData: { text: string; timestamp: number[] }[] =
    threePigsPages[currentPageIdx];

  return (
    <div className="flex flex-row w-screen relative">
      <div className="w-1/2">
        <Page
          words={currentPageData}
          currentTime={currentTime}
          isPlaying={isPlaying}
          image={exampleImage}
          callback={setTime}
        />
      </div>
      <div className="w-px bg-black absolute top-0 bottom-0 right-1/2"></div>
      <Navigation
        onPrevPage={prevPage}
        onPlayPause={togglePlayPause}
        onNextPage={nextPage}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default Book;
