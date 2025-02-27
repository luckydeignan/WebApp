import './book.css';
import image from '../assets/Green_Open_Book_PNG_Clipart-1054.png'; // replace with the actual image file

const Book = () => {
  return (
    <div className="book-container">
      <div className="book-wrapper">
        <img src={image} alt="Book" className="book-image" />
        <p className="content">Book</p>
      </div>
    </div>
  );
};

export default Book;
