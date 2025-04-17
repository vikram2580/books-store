import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const Hero = ({ handleOrderPopup, token }) => {
  const [books, setBooks] = useState([]);
  const [activeBook, setActiveBook] = useState(null);

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

        // Sort by year descending and take top 3
        const sortedBooks = res.data.data
          .sort((a, b) => parseInt(b.year) - parseInt(a.year))
          .slice(0, 3);

        setBooks(sortedBooks);
        setActiveBook(sortedBooks[0]);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    })();
  }, [token]);

  return (
    <section className="pb-20 pt-10 md:pt-10 xl:pb-18 xl:pt-8 xl:px-12">
      <div className="min-h-[550px] sm:min-h-[650px] flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200 bg-transparent">
        <div className="container pb-8 sm:pb-0">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Text content */}
            <div
              data-aos-once="true"
              className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1"
            >
              <h1
                data-aos="zoom-out"
                data-aos-duration="500"
                data-aos-once="true"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold"
              >
                {activeBook?.title || "Loading..."}
                <p className="bg-clip-text text-transparent bg-gradient-to-b from-primary text-right text-sm to-secondary">
                  by {activeBook?.author || "Anonymous"}
                </p>
              </h1>
              <p
                data-aos="slide-up"
                data-aos-duration="500"
                data-aos-delay="100"
                className="text-sm"
              >
                {activeBook ? (
                  <>
                    {activeBook.description}
                    <br />
                    (Published by {activeBook.publisher}, {activeBook.year})
                  </>
                ) : (
                  "Fetching book description..."
                )}
              </p>
              {/* <div>
                <button
                  onClick={handleOrderPopup}
                  className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                >
                  Order Now
                </button>
              </div> */}
            </div>

            {/* Image section */}
            <div className="min-h-[450px] sm:min-h-[450px] flex justify-center items-center relative order-1 sm:order-2">
              <div className="h-[300px] sm:h-[450px] flex justify-center items-center">
                <img
                  data-aos="zoom-in"
                  data-aos-once="true"
                  src={activeBook?.imageUrl}
                  alt={activeBook?.title}
                  className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-125 object-contain mx-auto"
                />
              </div>
              <div className="flex lg:flex-col lg:top-1/2 lg:-translate-y-1/2 lg:py-2 justify-center gap-4 absolute -bottom-[40px] lg:-right-1 rounded-full">
                {books.map((book, index) => (
                  <img
                    key={index}
                    src={book.imageUrl}
                    alt={book.title}
                    onClick={() => setActiveBook(book)}
                    className={`max-w-[100px] h-[100px] object-contain inline-block hover:scale-110 duration-200 cursor-pointer rounded-xl ${
                      activeBook?.imageUrl === book.imageUrl &&
                      "border-4 border-red-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
