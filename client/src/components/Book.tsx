import { useEffect, useRef, useState } from "react";
import Navigation from "./Navigate";
import Page from "./Page";
import LoadingSpinner from "./LoadingSpinner";
import api from "../lib/api.ts";

interface TimestampWord {
  text: string;
  timestamp: number[];
}

interface BookProps {
  bookId: string;
  onBackToBookSelection: () => void;
}

const Book = ({ bookId, onBackToBookSelection }: BookProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [bookPages, setBookPages] = useState<TimestampWord[][]>([]);
  const [bookImage, setBookImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // function to load book data from the server
  const loadBookData = async (bookId: string) => {
  if (!bookId) return;

  setLoading(true);
  setError(null);

  try {
    /** ───── 1. GET word‑level timestamps ───── */
    const { data: timestampData } = await api.get<TimestampWord[]>(
      `/book/${bookId}/timestamps`
    );

    // Turn the flat word list into pages
    const pages = splitJsonList(timestampData);
    setBookPages(pages);

    /** ───── 2. GET book image ───── */
    const base = api.defaults.baseURL || '';
    setBookImage(`${base}/book/${bookId}/image`);

    // Initialise audio
    if (audioRef.current) {
      audioRef.current.src = `${base}/book/${bookId}/audio`;
      audioRef.current.load();
    }

    /** ───── 3. Reset playback state ───── */
    setCurrentPageIdx(0);
    setCurrentTime(0);
    setIsPlaying(false);
  } catch (err) {
    console.error('Error loading book data:', err);
    setError('Failed to load book. Please try again.');
  } finally {
    setLoading(false);
  }
};

  /**
   * Breaks an array of word-timestamp objects into batches that
   *   – contain ≥ chunkSize words
   *   – end on the first word whose text finishes with "."
   *
   * @param jsonList  full list of {text, timestamp} items
   * @param chunkSize minimum number of words per batch (default = 160)
   * @returns         nested array: batches[batchIdx][wordIdx]
   */
  function splitJsonList(
    jsonList: TimestampWord[] | null,
    chunkSize = 160
  ): TimestampWord[][] {
    if (!jsonList || !Array.isArray(jsonList)) return [];
    
    const batches: TimestampWord[][] = [];
    let currentBatch: TimestampWord[] = [];

    for (let i=0; i<jsonList.length; i++) {
      const word = jsonList[i];
      currentBatch.push(word);

      const reachedMin = currentBatch.length >= chunkSize;
      const endsSentence = word.text.trim().endsWith(".");

      if (reachedMin && endsSentence) {
        batches.push(currentBatch);
        currentBatch = [];
      }
    }

    // push any trailing words that didn't finish with "."
    if (currentBatch.length) batches.push(currentBatch);

    return batches;
  }

  // Initialize audio element and event listeners
  useEffect(() => {
    audioRef.current = new Audio();

    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current!.currentTime);
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("ended", handleAudioEnd);

    // Cleanup on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("ended", handleAudioEnd);
        audioRef.current.pause();
      }
    };
  }, []); // Empty dependency array - runs once on mount

  // Load book data when component mounts or bookId changes
  useEffect(() => {
    if (bookId) {
      loadBookData(bookId);
    }
  }, [bookId]); // Reload if bookId changes

  // Page boundary checking effect
  useEffect(() => {
    if (!audioRef.current || !bookPages[currentPageIdx]?.length) return;

    const checkBoundary = () => {
      const now = audioRef.current!.currentTime;
      const page = bookPages[currentPageIdx];
      
      // Check boundaries
      const first = page[0].timestamp[0];
      const last = page[page.length - 1].timestamp[1];

      if (first > now || now > last) {
        setIsPlaying(false);
        audioRef.current!.pause();
        // Optional: reset to beginning of page
        audioRef.current!.currentTime = first;
      }
    };

    // Only run this if book has loaded 
    if (!bookPages[currentPageIdx]?.length) return;

    // Check boundaries when this effect runs
    checkBoundary();

    // Also check on time updates
    const boundaryCheck = () => checkBoundary();
    audioRef.current.addEventListener("timeupdate", boundaryCheck);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", boundaryCheck);
      }
    };
  }, [currentPageIdx, bookPages]); // Rerun when page changes or book pages update

  // Play/pause handler
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        setError("Failed to play audio. Please try again.");
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Next page handler
  const nextPage = () => {
    if (currentPageIdx < bookPages.length - 1) {
      const nextPageIdx = currentPageIdx + 1;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = bookPages[nextPageIdx][0].timestamp[0];
      }
      setCurrentPageIdx(nextPageIdx);
      setIsPlaying(false);
    }
  };

  // Prev page handler
  const prevPage = () => {
    if (currentPageIdx > 0) {
      const prevPageIdx = currentPageIdx - 1;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = bookPages[prevPageIdx][0].timestamp[0];
      }
      setCurrentPageIdx(prevPageIdx);
      setIsPlaying(false);
    }
  };

  // Function to set time position in audio
  const setTime = (timestamp: number) => {
    if (audioRef.current) {
      // First pause any current playback
      audioRef.current.pause();

      // Set the time to the provided timestamp
      audioRef.current.currentTime = timestamp;

      // Start playing from this position
      audioRef.current
        .play()
        .then(() => {
          // Update playing state
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Failed to play audio:", error);
          setIsPlaying(false);
          setError("Failed to play audio at the selected position.");
        });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner message="Loading book data..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 p-4">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Book</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <div className="flex space-x-4">
          <button 
            onClick={() => bookId ? loadBookData(bookId) : null} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
          <button
            onClick={onBackToBookSelection}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  // If no book data yet
  if (!bookPages.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4">No book data available.</p>
        <button
          onClick={onBackToBookSelection}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Choose a Book
        </button>
      </div>
    );
  }

  // Get the current page data
  const currentPageData = bookPages[currentPageIdx];

  return (
    <div className="flex flex-row w-screen relative">
      <div className="w-2/3 bg-yellow-100">
        <Page
          words={currentPageData}
          currentTime={currentTime}
          isPlaying={isPlaying}
          image={bookImage}
          callback={setTime}
        />
      </div>
      <div className="w-1/3 flex justify-center bg-yellow-600">
        <Navigation
          onPrevPage={prevPage}
          onPlayPause={togglePlayPause}
          onNextPage={nextPage}
          isPlaying={isPlaying}
          chosenBook={true}
          toggleChosenBook={onBackToBookSelection}
        />
      </div>
    </div>
  );
};

export default Book;