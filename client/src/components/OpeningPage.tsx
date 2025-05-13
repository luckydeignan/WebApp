import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import api from "../lib/api.ts";

export interface BookIdentifier {
  id: string;
  title: string;
  idx?: number;
}

interface OpeningPageProps {
  onBookSelect: (bookId: string) => void;
}

/**
 * Opening page component, where user can select a book
 * @param onBookSelect function to call when a book is selected, basically tells parent component to change UI state
 * @returns opening page component
 */
const OpeningPage = ({ onBookSelect }: OpeningPageProps) => {
  const [availableBooks, setAvailableBooks] = useState<BookIdentifier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the list of available books from the server
   * Sets the availableBooks state variable as an array of book identifiers that are currently stored in server
   */
  const fetchBooks = async () => {
  try {
    setLoading(true);

    // Axios returns an object: { data, status, headers, ... }
    // We only need the data payload here.
    const { data } = await api.get('/books');

    return data;        // expected shape: { books: [...] }
  } catch (err) {
    console.error('Error fetching books:', err);
    setError('Failed to load available books. Please try again.');
    return { books: [] };
  } finally {
    setLoading(false);
  }
};

  // This useEffect calls fetchBooks() when the component mounts
  useEffect(() => {
    fetchBooks().then((data) => {
      const booksWithIDs = data.books.map((book: BookIdentifier, index: number) => ({
        id: book.id,
        title: book.title,
        idx: index
      }));
      setAvailableBooks(booksWithIDs);
    });
  }, []);

  const handleBookSelection = (bookId: string) => {
    onBookSelect(bookId);
  };

  // if takes awhile to render available books, show loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner message="Loading available books..." />
      </div>
    );
  }

  // if there is an error retrieving available books, show error message
  if (error) {
    console.error(error);
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 p-4">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={() => fetchBooks()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-yellow-800">Choose a Book</h1>
      
      {availableBooks.length === 0 ? (
        <p className="text-gray-600">No books available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableBooks.map(book => (
            <div 
              key={book.id}
              onClick={() => handleBookSelection(book.id)}
              className="bg-yellow-200 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            >
              <div className="flex flex-col items-center justify-center p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h2>
                <button 
                  className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                >
                  Read Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <h1 className="text-xl font-bold mt-8 text-yellow-700">or upload an audio file to add a new book:</h1>
      <button className="mt-4 px-4 py-2 bg-yellow-200 rounded hover:bg-yellow-700 hover:text-white transition-colors">
        Upload Audio feature to be implemented
      </button>
    </div>
  );
};

export default OpeningPage; 