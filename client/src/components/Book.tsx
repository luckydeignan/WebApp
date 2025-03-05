import './book.css';
import image from '../assets/Green_Open_Book_PNG_Clipart-1054.png'; // replace with the actual image file
import Word from './Word';


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
  
  return (
    <div className="book-container">
      <div className="book-wrapper">
        <p className="content">
          {firstPageWords.map((word, index) => (
            <Word key={index} word={word} />
          ))}
        </p>
      </div>
    </div>
  );
};

export default Book;
