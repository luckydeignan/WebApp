import './book.css';
import exampleImage from '../assets/exampleImage.png'; // replace with the actual image file
import Word from './Word';
import { useEffect , useRef , useState } from 'react';
import dummyData from '../assets/DummyReadingData.wav';

const Book = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const demoToggle = false

  const firstPage: string = `In the heart of a misty, forgotten town, where cobblestone streets twisted like 
  veins through the hills, there stood a tiny shop called The Clockmaker’s Haven. 
  It belonged to an old man named Elias Hawthorne, whose hands, though wrinkled with time, 
  still crafted timepieces with mesmerizing precision. Elias was no ordinary clockmaker. \
  The townsfolk whispered that his clocks never simply told time; they held it. 
  They claimed that those who owned an Elias Hawthorne clock could hear echoes of their past or 
  glimpse faint shadows of their future in its ticking. One evening, just as Elias was about 
  to lock up, a young woman burst into his shop, breathless and pale. “Please,” 
  she said, her voice trembling. “I need a clock that can find something lost.”`

  const firstPageWords = firstPage.split(' ');

  

  const wordsData = [
    { text: "In", time: [2.21, 3.5] },
    { text: "The", time: [3.5, 4.6] },
    { text: "Heart", time: [4.6, 5.8] },
    { text: "Of", time: [5.8, 6.85] },
    { text: "A", time: [6.85, 7.7] },
    { text: "Misty,", time: [7.7, 8.63] },
    { text: "Forgotten", time: [8.63, 9.93] },
    { text: "Town,", time: [9.93, 11.15] },
    { text: "Where", time: [11.15, 12.23] },
    { text: "cobblestone", time: [12.23, 13.42] },
    { text: "streets", time: [13.42, 14.6] },
    { text: "twisted", time: [14.6, 15.63] },
    { text: "like", time: [15.63, 16.7] },
    { text: "veins", time: [16.7, 17.67] },
    { text: "through", time: [17.67, 18.67] },
    { text: "the", time: [18.67, 19.74] },
    { text: "Hills,", time: [19.74, 20.84] },
    { text: "There", time: [20.84, 21.83] },
    { text: "Stood", time: [21.83, 23.08] },
    { text: "A", time: [23.08, 24.02] },
    { text: "Tiny", time: [24.02, 24.79] },
    { text: "Shop", time: [24.79, 25.78] },
    { text: "Called", time: [25.78, 26.7] },
    { text: "The", time: [26.7, 27.73] },
    { text: "Clockmaker’s", time: [27.73, 29.59] },
    { text: "Haven.", time: [29.59, 30.59] } // Added +1 second buffer for last word
  ];
  
  
  
  
  useEffect(() => {
    fetch('http://localhost:3000/api/voice', {
      method: 'POST', 
      body: JSON.stringify({ content: firstPage })
    }).then(response => response.json())
    .then(data => console.log('yay', data))
    .catch(error => console.error(error))
  }, []);

  // useEffect that initializes the audio element
  useEffect(() => {
    audioRef.current = new Audio(dummyData); // Path to your audio file

    // Add a timeupdate event listener to track the current time
    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime); // Update state with current time
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

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

  return (
    <div className='flex flex-row w-screen h-screen'>
      
      <div className='flex w-1/2 justify-center p-4 gap-x-1 flex-wrap'>
      {demoToggle ? wordsData.map((wordObj, index) => (
            <Word key={index} word={wordObj.text} isHighlighted={wordObj.time[0] <= currentTime && currentTime < wordObj.time[1] && isPlaying}/>
          )) : firstPageWords.map((word, index) => (
            <Word key={index} word={word} isHighlighted={false}/>
          ))
          }
          {!demoToggle && <img src={exampleImage}></img>}
      </div>
      <hr className='w-px bg-black h-screen'/>
      <div className='w-1/2 flex justify-center items-center'>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      </div>

    </div>
  );
};

export default Book;
