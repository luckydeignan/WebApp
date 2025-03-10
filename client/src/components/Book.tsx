import './book.css';
import image from '../assets/Green_Open_Book_PNG_Clipart-1054.png'; // replace with the actual image file
import Word from './Word';
import { useEffect } from 'react';


const Book = () => {
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
  
  useEffect(() => {
    fetch('http://localhost:3000/api/voice', {
      method: 'POST', 
      body: JSON.stringify({ content: firstPage })
    }).then(response => response.json())
    .then(data => console.log('yay', data))
    .catch(error => console.error(error));
  }, []);

  return (
    <div className='flex flex-row w-screen h-screen'>
      
      <div className='flex w-1/2 justify-center p-4 gap-x-1 flex-wrap'>
      {firstPageWords.map((word, index) => (
            <Word key={index} word={word} />
          ))}
      </div>
      <hr className='w-px bg-black h-screen'/>
      <div className='w-1/2 flex justify-center'>
        Different content
      </div>

    </div>
  );
};

export default Book;
