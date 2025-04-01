import './book.css';
import exampleImage from '../assets/exampleImage.png'; // replace with the actual image file
import Word from './Word';
import { useEffect , useRef , useState } from 'react';
import pageOneAudio from '../assets/UROPpage1.m4a';
import pageTwoAudio from '../assets/UROPpage2.m4a';

const Book = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [currentAudio, setCurrentAudio] = useState(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const voiceDemoToggle = true


  // Dummy reading data
  const firstPage: string = `In the heart of a misty, forgotten town, where cobblestone streets twisted like 
  veins through the hills, there stood a tiny shop called The Clockmaker’s Haven. 
  It belonged to an old man named Elias Hawthorne, whose hands, though wrinkled with time, 
  still crafted timepieces with mesmerizing precision. Elias was no ordinary clockmaker. \
  The townsfolk whispered that his clocks never simply told time; they held it. 
  They claimed that those who owned an Elias Hawthorne clock could hear echoes of their past or 
  glimpse faint shadows of their future in its ticking. One evening, just as Elias was about 
  to lock up, a young woman burst into his shop, breathless and pale. “Please,” 
  she said, her voice trembling. “I need a clock that can find something lost.”`

  const secondPage: string = `Elias studied the woman with sharp, knowing eyes. She was young, but her face carried the weight of someone who had lost more than she could bear. Her dark hair clung to her damp forehead, and her hands trembled against the wooden counter.
  “A clock that finds what is lost?” Elias repeated, his voice as measured as the ticking that filled the shop. “Time does not return what it has taken, child.”
  The woman swallowed hard, gripping the edge of the counter. “This isn’t about time. It’s about something stolen—something that should never have been taken.”
  For a long moment, Elias said nothing. Then, with a quiet sigh, he turned toward the back of the shop. Rows of intricate timepieces lined the shelves, their hands moving in perfect synchrony.` 
  
  const thirdPage = `But he passed them all, reaching instead for a small, unassuming wooden clock nestled in the shadows. He carried it back with care, placing it gently before her.
  “This clock does not count hours,” he murmured. “It follows echoes. Hold it close, listen well, and it may guide you where you need to go.”
  The woman hesitated before picking up the clock. The wood was warm beneath her fingers, its gears humming softly, almost like a whisper. She looked up at Elias, her breath uneven. “And what if I don’t like what I find?”
  His gaze didn’t waver. “Then you must decide whether some things are better left lost.”`

  const fourthPage: string = `The woman left the shop with the clock cradled against her chest, its faint ticking almost soothing. Outside, the mist curled around her ankles, the gas lamps flickering in the growing darkness. She turned down the narrow streets, moving without thought, trusting the unseen pull of the clock in her hands.
  At first, she heard nothing but the distant sounds of the town—horses’ hooves, the murmur of voices behind closed doors. But then, as she stepped onto an unfamiliar path, something changed. The ticking deepened, like a pulse beneath her fingers, and a faint whisper threaded through the silence.
  A name. Her breath hitched.`
  
  const fifthPage: string = `The name was one she had not spoken in years, a name that had been stolen from her lips the same night something else had vanished—something precious, something she had spent every waking moment searching for.
  Heart pounding, she followed the whisper, her steps quickening. The fog thickened, the world narrowing to the space between heartbeats. And then, just ahead, she saw it.
  A lone house stood at the end of the path, its windows dark, its door slightly ajar. The clock’s ticking grew insistent, its whispers swirling around her like ghosts.
  She had found what was lost. But as she stepped forward, she wondered if she had been ready to find it at all.`

  const firstPageWords = firstPage.split(' ');
  const secondPageWords = secondPage.split(' ');
  const thirdPageWords = thirdPage.split(' ');
  const fourthPageWords = fourthPage.split(' ');
  const fifthPageWords = fifthPage.split(' ');

  const pages = [firstPageWords, secondPageWords, thirdPageWords, fourthPageWords, fifthPageWords];


  const sentenceTimestamps = [
    {
      "text": "In the heart of a misty, forgotten town where cobblestone streets twisted like veins through the hills, there stood a tiny shop called The Clockmaker's Haven.",
      "time": [0, 11.40]
    },
    {
      "text": "It belonged to an old man named Elias Hawthorn, whose hands—though wrinkled with time—still crafted timepieces with mesmerizing precision.",
      "time": [11.40, 21.00]
    },
    {
      "text": "Elias was no ordinary clockmaker.",
      "time": [21.00, 23.64]
    },
    {
      "text": "The townsfolk whispered that his clocks never simply told time—they held it.",
      "time": [23.64, 28.32]
    },
    {
      "text": "They claimed that those who owned an Elias Hawthorn clock could hear echoes of their past or glimpse faint shadows of their future in its ticking.",
      "time": [28.32, 37.00]
    },
    {
      "text": "One evening, just as Elias was about to lock up, a young woman burst into his shop, breathless and pale.",
      "time": [37.00, 44.50]
    },
    {
      "text": "“Please,” she said, her voice trembling, “I need a clock that can find something lost.”",
      "time": [44.50, 51.00]
    }
  ]

  const words = [];
  for (const sentenceObj of sentenceTimestamps) {
    for (const word of sentenceObj.text.split(' ')) {
      words.push({ text: word, time: sentenceObj.time });
    }
  }
  
  
  

  // useEffect that initializes the audio element
  useEffect(() => {
    audioRef.current = new Audio(pageOneAudio); // Path to your audio file

    // Add a timeupdate event listener to track the current time
    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime); // Update state with current time
    };

      // Add an ended event listener to stop playback when audio ends
  const handleAudioEnd = () => {
    setIsPlaying(false); // Set isPlaying to false when audio ends
  };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleAudioEnd);

    // Cleanup on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play/pause handler
  const togglePlayPause = () => {
    console.log(audioRef.current)
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Next page handler
  const nextPage = () => {
    if (currentPageIdx < pages.length - 1) {
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

  return (
    <div className='flex flex-row w-screen relative'>
      
      <div className='w-1/2 '>
        <div className='flex w-full justify-center p-4 flex-wrap'>
          {voiceDemoToggle ? words.map((wordObj, index) => (
                <Word key={index} word={wordObj.text} isHighlighted={wordObj.time[0] <= currentTime && currentTime < wordObj.time[1] && isPlaying}/>
              )) : pages[currentPageIdx].map((word, index) => (
                <Word key={index} word={word} isHighlighted={false}/>
              ))
              }
            <img className='w-1/2 m-4' src={exampleImage}></img>
        </div>
      </div>
      <div className='w-px bg-black absolute top-0 bottom-0 right-1/2'></div>
      <div className='w-1/2 h-screen flex justify-center items-center gap-x-4'>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={prevPage}>Prev Page</button>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={nextPage}>Next Page</button>
      </div>

    </div>
  );
};

export default Book;
