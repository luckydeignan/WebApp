import './book.css';
import exampleImage from '../assets/exampleImage.png'; // replace with the actual image file
import { useEffect , useRef , useState } from 'react';
import pageOneAudio from '../assets/UROPpage1.m4a';
import pageTwoAudio from '../assets/UROPpage2.m4a';
import threePigsAudio from '../assets/books-for-kids-read-aloud.wav';
import threePigsColabAudio from '../assets/colabTimestamps.json';
import Navigation from './Navigate';
import Page from './Page';

const Book = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const voiceDemoToggle: boolean = false;

  const sentenceTimestampsPageOne = [
    {
      "text": "In the heart of a misty, forgotten town where cobblestone streets twisted like veins through the hills, there stood a tiny shop called The Clockmaker's Haven.",
      "timestamp": [0, 11.40]
    },
    {
      "text": "It belonged to an old man named Elias Hawthorn, whose hands—though wrinkled with time—still crafted timepieces with mesmerizing precision.",
      "timestamp": [11.40, 21.00]
    },
    {
      "text": "Elias was no ordinary clockmaker.",
      "timestamp": [21.00, 23.64]
    },
    {
      "text": "The townsfolk whispered that his clocks never simply told time—they held it.",
      "timestamp": [23.64, 28.32]
    },
    {
      "text": "They claimed that those who owned an Elias Hawthorn clock could hear echoes of their past or glimpse faint shadows of their future in its ticking.",
      "timestamp": [28.32, 37.00]
    },
    {
      "text": "One evening, just as Elias was about to lock up, a young woman burst into his shop, breathless and pale.",
      "timestamp": [37.00, 44.50]
    },
    {
      "text": "\"Please,\" she said, her voice trembling, \"I need a clock that can find something lost.\"",
      "timestamp": [44.50, 51.00]
    }
  ];

  const sentenceTimestampsPageTwo = [
    {
      "text": "Elias studied the woman with sharp, knowing eyes.",
      "timestamp": [0, 4.15]
    },
    {
      "text": "She was young, but her face carried the weight of someone who had lost more than she could bear.",
      "timestamp": [4.15, 8.90]
    },
    {
      "text": "Her dark hair clung to her damp forehead, and her hands trembled against the wooden counter.",
      "timestamp": [8.90, 14.00]
    },
    {
      "text": "\"A clock that finds what is lost,\" Elias repeated, his voice as measured as the ticking that filled the shop.",
      "timestamp": [14.00, 21.65]
    },
    {
      "text": "time does not return what it has taken, child.",
      "timestamp": [21.65, 24.70]
    },
    {
      "text": "The woman swallowed hard, gripping the edge of the counter.",
      "timestamp": [24.70, 27.95]
    },
    {
      "text": "This isn't about time, it's about something stolen—something that should never have been taken.",
      "timestamp": [27.95, 33.40]
    },
    {
      "text": "For a long moment, Elias said nothing. Then, with a quiet sigh, he turned toward the back of the shop.",
      "timestamp": [33.40, 40.30]
    },
    {
      "text": "Rows of intricate timepieces lined the shelves, their hands moving in perfect synchrony.",
      "timestamp": [40.30, 51.00]
    }
  ];
  
  const rawStampData = [sentenceTimestampsPageOne, sentenceTimestampsPageTwo];
  const pagesData: { text: string, timestamp: number[] }[][] = [];
  for (let i = 0; i < rawStampData.length; i++) {
    const words = [];
    for (const sentenceObj of rawStampData[i]) {
      for (const word of sentenceObj.text.split(' ')) {
        words.push({ text: word, timestamp: sentenceObj.timestamp });
      }
    }
    pagesData.push(words);
  }
  
  const audios = [pageOneAudio, pageTwoAudio];

  // Initialize the audio element
  useEffect(() => {
    audioRef.current = voiceDemoToggle 
      ? new Audio(audios[currentPageIdx]) 
      : new Audio(threePigsAudio);

    // Track the current time
    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
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
  }, [currentPageIdx, voiceDemoToggle]);

  // Play/pause handler
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Next page handler
  const nextPage = () => {
    if (currentPageIdx < pagesData.length - 1) {
      setCurrentPageIdx(currentPageIdx + 1);
      setCurrentTime(0);
      setIsPlaying(false);
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
  const currentPageData: { text: string, timestamp: number[] }[] = voiceDemoToggle 
    ? pagesData[currentPageIdx] 
    : threePigsColabAudio;

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