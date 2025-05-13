// App.tsx
import { useState } from "react";
import OpeningPage from "./components/OpeningPage";
import Book from "./components/Book";
import "./App.css";

/**
 * Main app component, contains two main components to display: the opening page or the book
 * Upon mount, the opening page is displayed which contains options of books to choose from
 * Once a book is selected, the book component is displayed
 * @returns main app component
 */
const App = () => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  
  const handleBookSelect = (bookId: string) => {
    setSelectedBookId(bookId);
  };
  
  const handleBackToSelection = () => {
    setSelectedBookId(null);
  };
  
  return (
    <div>
      {selectedBookId ? (
        <Book 
          bookId={selectedBookId} 
          onBackToBookSelection={handleBackToSelection} 
        />
      ) : (
        <OpeningPage onBookSelect={handleBookSelect} />
      )}
    </div>
  );
};

export default App;