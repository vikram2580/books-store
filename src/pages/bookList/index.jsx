import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { Link } from "react-router-dom";

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const apiBaseUrl =
    "https://9bjlqg9rdj.execute-api.us-east-1.amazonaws.com/dev";

  const getIdToken = async () => {
    const session = await fetchAuthSession();
    return session?.tokens.idToken.toString() ?? "";
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await getIdToken();
        const res = await axios.get(`${apiBaseUrl}/getBooks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(res.data.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    })();
  }, []);

  const handleDelete = async (bookId) => {
    try {
      const token = await getIdToken();
      await axios.delete(apiBaseUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { bookId },
      });
      setBooks((b) => b.filter((book) => book.bookId !== bookId));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  return (
    <section className="pt-20 p-8 h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">📚 All Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.bookId} className="bg-white p-4 shadow rounded">
            {/* <img
              src={book.image || "https://via.placeholder.com/150"}
              alt={book.title}
              className="w-full h-48 object-cover rounded mb-4"
            /> */}
            <h3 className="text-xl font-semibold">{book.title}</h3>
            <p>By {book.author}</p>
            <p>Published: {book.year}</p>
            <p>Publisher: {book.publisher}</p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleDelete(book.bookId)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
              <Link
                to={`/edit-book/${book.bookId}`}
                className="bg-yellow-400 text-white px-3 py-1 rounded"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BooksList;
