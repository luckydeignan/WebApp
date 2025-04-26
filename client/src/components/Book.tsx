import './book.css';
import exampleImage from '../assets/exampleImage.png'; // replace with the actual image file
import { useEffect , useRef , useState } from 'react';
import pageOneAudio from '../assets/UROPpage1.m4a';
import pageTwoAudio from '../assets/UROPpage2.m4a';
import threePigsAudio from '../assets/books-for-kids-read-aloud.wav';
import threePigsColabAudio from '../assets/colabTimestamps.json';
import threePigsTimestamps from 'C:\\Users\\ljdde\\OneDrive\\Desktop\\UROPs\\CataniaUROP\\WebApp2\\WebApp\\reformatted.json';
import Navigation from './Navigate';
import Page from './Page';

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
      const endsSentence = word.text.trim().endsWith('.');

      if (reachedMin && endsSentence) {
        batches.push(currentBatch);
        currentBatch = [];
      }
    }

    // push any trailing words that didn’t finish with “.”
    if (currentBatch.length) batches.push(currentBatch);

    return batches;
  }

  const threePigsPages: { text: string, timestamp: number[] }[][] = splitJsonList(threePigsTimestamps);


  // Initialize the audio element
  useEffect(() => {
    audioRef.current = new Audio(threePigsAudio);

    // Helper function to get page bounds of timestamps
    const getPageBounds = (pageIdx: number) => {
      const page = threePigsPages[pageIdx];
      if (!page?.length) return [0, Infinity];
      const first = page[0].timestamp[0];
      const last  = page[page.length - 1].timestamp[1];
      return [first, last];
    };

    // Track the current time
    const handleTimeUpdate = () => {
      const now = audioRef.current!.currentTime;
      setCurrentTime(now);

    // FEATURE FOR AUTO-ADVANCE PAGES BASED ON AUDIO TIME -- DISABLED BC AUDIOREF auto-reset upon page change
    //   const [pageStart, pageEnd] = getPageBounds(currentPageIdx);

    
    // // past the end → go forward
    // if (now > pageEnd && currentPageIdx < threePigsPages.length - 1) {
    //   nextPage();
    //   return;                       
    // }

    // // before the start → go back
    // if (now < pageStart && currentPageIdx > 0) {
    //   setCurrentPageIdx(p => p - 1);
    // }
    };

    // Stop playback when audio ends
    const handleAudioEnd = () => {
      setIsPlaying(false);
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleAudioEnd);

    // Cleanup on component unmount or page change
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleAudioEnd);
        audioRef.current.pause();
      }
    };
  }, [currentPageIdx]);

  // Play/pause handler
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = threePigsPages[currentPageIdx][0].timestamp[0];
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Next page handler
  const nextPage = () => {
    if (currentPageIdx < threePigsPages.length - 1) {
      setCurrentPageIdx(currentPageIdx + 1);
      setCurrentTime(0);
      setIsPlaying(false); // TOGGLE BASED ON DESIRED FEATURE
    }
  };

  // Prev page handler
  const prevPage = () => {
    if (currentPageIdx > 0) {
      setCurrentPageIdx(currentPageIdx - 1);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  // Get the current page data
  const currentPageData: { text: string, timestamp: number[] }[] = threePigsPages[currentPageIdx];

  return (
    <div className='flex flex-row w-screen relative'>
      <div className='w-1/2'>
        <Page 
          words={currentPageData}
          currentTime={currentTime}
          isPlaying={isPlaying}
          image={exampleImage}
        />
      </div>
      <div className='w-px bg-black absolute top-0 bottom-0 right-1/2'></div>
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