import { useEffect, useRef, useState } from "react";
import Navigation from "./Navigate";
import Page from "./Page";
import LoadingSpinner from "./LoadingSpinner"; // Create this component for better UX
import ChooseBookButton from "./ChooseBookButton";

interface TimestampWord {
  text: string;
  timestamp: number[];
}

export interface BookIdentifier {
  id: string;
  title: string;
  idx?: number;
}

const Book = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  //const [bookData, setBookData] = useState<TimestampWord[] | null>(null);
  const [bookPages, setBookPages] = useState<TimestampWord[][]>([]);
  const [bookImage, setBookImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [chosenBook, setChosenBook] = useState<boolean>(false);
  const [availableBooks, setAvailableBooks] = useState<BookIdentifier[]>([]);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/books");
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data)
      return data;
    } catch (err) {
      console.error("Error fetching books:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchBooks().then((data) => {
      console.log(data);
      const booksWithIDs = data.books.map((book: BookIdentifier, index: number) => ({
        id: book.id,
        title: book.title,
        idx: index
      }));
      setAvailableBooks(booksWithIDs);
    });
  }, []);

  // Function to load book data from the server
  const loadBookData = async (bookId: string = "three-pigs") => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch timestamp data
      const timestampResponse = await fetch(`http://localhost:3000/api/book/${bookId}/timestamps`);
      if (!timestampResponse.ok) {
        throw new Error(`Failed to fetch timestamps: ${timestampResponse.statusText}`);
      }
      const timestampData: TimestampWord[] = await timestampResponse.json();
            
      // Set book data
      // setBookData(timestampData);
      
      // Process
      const pages = splitJsonList(timestampData);
      setBookPages(pages);
      
      // Set image URL
      setBookImage(`http://localhost:3000/api/book/${bookId}/image`);
      
      // Initialize audio with the correct URL
      if (audioRef.current) {
        audioRef.current.src = `http://localhost:3000/api/book/${bookId}/audio`;
        audioRef.current.load();
      }
      
      setCurrentPageIdx(0);
      setCurrentTime(0);
      setIsPlaying(false);
      
    } catch (err) {
      console.error("Error loading book data:", err);
      setError(`Failed to load book`); //todo error message
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
      console.log("Current time:", audioRef.current!.currentTime);
      setCurrentTime(audioRef.current!.currentTime);
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("ended", handleAudioEnd);

    // Load the book data when component mounts
    loadBookData();

    // Cleanup on component unmount
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

  // toggle chosen book
  const toggleChosenBook = () => {
    setChosenBook(!chosenBook);
  }


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
        <button 
          onClick={() => loadBookData()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // If no book data yet
  if (!bookPages.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button 
          onClick={() => loadBookData()} 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Load Three Pigs Story
        </button>
      </div>
    );
  }

  // Get the current page data
  const currentPageData = bookPages[currentPageIdx];

  return (
    <div className="flex flex-row w-screen relative">
      <div className="w-2/3 bg-yellow-100">
        {chosenBook 
        ?
          <Page
          words={currentPageData}
          currentTime={currentTime}
          isPlaying={isPlaying}
          image={bookImage}
          callback={setTime}
        /> 
        :
        <div className="flex flex-col items-center justify-center h-screen">
          <p>Choose a book to read</p>
          {availableBooks.map(book => (
            <ChooseBookButton
              key={book.id}   /* or whatever uniquely identifies the book */
              representingBook={book}
              onChooseBook={()=> {
                toggleChosenBook();
              }}
            />
          ))}
        </div>
}
      </div>
      <div className="w-1/3 flex justify-center bg-yellow-600">
        <Navigation
          onPrevPage={prevPage}
          onPlayPause={togglePlayPause}
          onNextPage={nextPage}
          isPlaying={isPlaying}
          chosenBook={chosenBook}
          toggleChosenBook={toggleChosenBook}
        />
      </div>
    </div>
  );
};

export default Book;