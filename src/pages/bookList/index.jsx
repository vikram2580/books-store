/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newYear, setNewYear] = useState("");
  const [newPublisher, setNewPublisher] = useState("");
  const [newImage, setNewImage] = useState("");

  const apiBaseUrl =
    "https://9bjlqg9rdj.execute-api.us-east-1.amazonaws.com/dev";

  const getIdToken = async () => {
    try {
      const session = await fetchAuthSession();
      return session ? session.tokens.idToken.toString() : null;
    } catch (error) {
      console.error("Error getting idToken:", error);
    }
  };

  // Fetch books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = await getIdToken();
        const response = await axios.get(apiBaseUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  // Add Book
  const handleAddBook = async () => {
    if (!newTitle || !newAuthor || !newYear || !newPublisher) {
      alert("Please fill out all required fields.");
      return;
    }
    try {
      const token = await getIdToken();
      const newBook = {
        title: newTitle,
        author: newAuthor,
        year: newYear,
        publisher: newPublisher,
        image: newImage,
      };
      await axios.post(apiBaseUrl, newBook, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks([...books, newBook]);
      resetForm();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  // Delete Book
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
      setBooks(books.filter((book) => book.bookId !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  // Edit Book
  const handleEdit = (book) => {
    setEditingBook(book);
    setNewTitle(book.title);
    setNewAuthor(book.author);
    setNewYear(book.year);
    setNewPublisher(book.publisher);
    setNewImage(book.image || "");
  };

  // Update Book
  const handleSaveEdit = async () => {
    if (!newTitle || !newAuthor || !newYear || !newPublisher) {
      alert("Please fill out all required fields.");
      return;
    }
    if (!editingBook) return;
    try {
      const token = await getIdToken();
      const updatedBook = {
        title: newTitle,
        author: newAuthor,
        year: newYear,
        publisher: newPublisher,
        image: newImage,
      };
      await axios.put(
        `${apiBaseUrl}?bookId=${editingBook.bookId}`,
        updatedBook,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBooks(
        books.map((book) =>
          book.bookId === editingBook.bookId
            ? { ...book, ...updatedBook }
            : book
        )
      );
      resetForm(); // Reset form after updating
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  // Reset Form
  const resetForm = () => {
    setNewTitle("");
    setNewAuthor("");
    setNewYear("");
    setNewPublisher("");
    setNewImage("");
    setEditingBook(null);
  };

  return (
    <section className="overflow-hidden pb-20 pt-20 md:pt-20 xl:pb-20 xl:pt-24">
      <div className="min-h-screen  p-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          📚 Books Store
        </h1>

        <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {editingBook ? "Edit Book" : "Add a New Book"}
          </h2>
          <form action="submitt">
            <input
              className="w-full p-2 mb-2 border rounded"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <input
              className="w-full p-2 mb-2 border rounded"
              placeholder="Author"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              required
            />
            <input
              className="w-full p-2 mb-2 border rounded"
              type="number"
              placeholder="Year"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              required
            />
            <input
              className="w-full p-2 mb-2 border rounded"
              placeholder="Publisher"
              value={newPublisher}
              onChange={(e) => setNewPublisher(e.target.value)}
              required
            />
            {/* <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Image URL (Optional)"
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
        /> */}
            <button
              onClick={editingBook ? handleSaveEdit : handleAddBook}
              className={`w-full ${
                editingBook ? "bg-yellow-400" : "bg-indigo-500"
              } text-white p-2 rounded hover:opacity-90 bg-gradient-to-br from-purple-300 to-indigo-500 `}
            >
              {editingBook ? "Save Changes" : "Add Book"}
            </button>
            {editingBook && (
              <button
                onClick={resetForm}
                className="w-full mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.bookId}
              className="bg-white p-4 shadow-md rounded-lg"
            >
              <img
                src={book.image || "https://via.placeholder.com/150"}
                alt={book.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold">{book.title}</h3>
              <p className="text-gray-600">By {book.author}</p>
              <p className="text-gray-500">Published: {book.year}</p>
              <p className="text-gray-500">Publisher: {book.publisher}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleDelete(book.bookId)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(book)}
                  className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BooksList;
