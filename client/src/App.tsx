// App.tsx
import { useState } from "react";
import OpeningPage from "./components/OpeningPage";
import Book from "./components/Book";
import "./App.css";

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