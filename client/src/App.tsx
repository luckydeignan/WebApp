import { useState, useEffect } from "react";
import "./App.css";
import Book from "./components/Book";

function App() {
  useEffect(() => {
    fetch("http://localhost:3000/api/data")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      });
  }, []);

  return (
    <>
      <div>
        <Book />
      </div>
    </>
  );
}

export default App;
