import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { useNavigate, useParams } from "react-router-dom";

const apiBaseUrl = "https://9bjlqg9rdj.execute-api.us-east-1.amazonaws.com/dev";

export default function AddBook() {
  const { id } = useParams(); // if present → edit mode
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    year: "",
    publisher: "",
    description: "",
    image: "",
    imageBase64: "",
    imagePreview: "",
  });

  const getIdToken = async () => {
    const session = await fetchAuthSession();
    return session?.tokens.idToken.toString() ?? "";
  };

  // If editing, fetch the existing book
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const token = await getIdToken();
        const res = await axios.get(
          `${apiBaseUrl}/getBooks/bookId?bookId=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setForm((prevForm) => ({
          ...prevForm,
          ...res.data,
          imagePreview: res.data.imageUrl || "", // show existing image
        }));
      } catch (err) {
        console.error("Error loading book:", err);
      }
    })();
  }, [id]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = await getIdToken();
  //   try {
  //     if (id) {
  //       // Edit
  //       await axios.put(`${apiBaseUrl}?bookId=${id}`, form, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     } else {
  //       // Add
  //       await axios.post(apiBaseUrl, {
  //         title: form.title,
  //         author: form.author,
  //         year: form.year,
  //         publisher: form.publisher,
  //         imageBase64: form.imageBase64,
  //       }, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     }
  //     navigate("/", { replace: true }); // go back home
  //   } catch (err) {
  //     console.error("Error saving book:", err);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getIdToken();

    const payload = {
      title: form.title,
      author: form.author,
      year: form.year,
      publisher: form.publisher,
      description: form.description,
    };

    if (form.imageBase64) {
      payload.imageBase64 = form.imageBase64;
    }

    try {
      if (id) {
        await axios.put(`${apiBaseUrl}?bookId=${id}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(apiBaseUrl, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error saving book:", err);
    }
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // remove data:image/...;base64,
      setForm((f) => ({
        ...f,
        imageBase64: base64String,
        imagePreview: reader.result,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="overflow-hidden pb-20 pt-20 md:pt-20 xl:pb-20 xl:pt-24">
      <div className="min-h-screen  p-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          📚 {id ? "Edit Book" : "Add a New Book"}
        </h1>
        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md ">
            {["title", "authors", "year", "publisher"].map((field) => (
              <input
                key={field}
                name={field}
                type={field === "year" ? "number" : "text"}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            ))}
            <textarea
              key={"description"}
              name={"description"}
              type={"text"}
              placeholder={"Description"}
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {form.imagePreview && (
              <img
                src={form.imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded mb-2"
              />
            )}
            {form.imagePreview && (
              <button
                type="button"
                className="text-sm text-red-500 underline mb-2"
                onClick={() =>
                  setForm((f) => ({ ...f, imageBase64: "", imagePreview: "" }))
                }
              >
                Remove selected image
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="w-full p-2 border rounded bg-white"
            />
            <div className="flex space-x-4">
              <button
                type="submit"
                className={`flex-1 p-2 rounded text-white ${
                  id ? "bg-yellow-500" : "bg-indigo-600"
                }`}
              >
                {id ? "Save Changes" : "Add Book"}
              </button>

              {id && (
                <button
                  type="button"
                  onClick={() => navigate("/", { replace: true })}
                  className="flex-1 p-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
