import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateQuotePage({ token }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", file);

    if (!file) {
      setError("An image is required");
      return;
    }

    setError(""); // Clear errors

    try {
      const response = await axios.post(
        import.meta.env.VITE_IMAGE_UPLOAD_API,
        formData
      );
      setMediaUrl(response.data[0]?.url);
    } catch (error) {
      console.error("Failed to upload image", error);
    }
  };

  const createQuote = async () => {
    // Validation

    if (!text.trim() && !mediaUrl) {
      setError("Quote text and Image is required");
      return;
    }

    if (!text.trim()) {
      setError("Quote text is required");
      return;
    }
    if (!mediaUrl) {
      setError("An image is required");
      return;
    }

    setError(""); // Clear errors

    try {
      await axios.post(
        import.meta.env.VITE_POST_QUOTE_API,
        {
          text,
          mediaUrl,
        },
        {
          headers: { Authorization: token, "Content-Type": "application/json" },
        }
      );
      alert("Quote created successfully");
      navigate("/quotes");
    } catch (error) {
      console.error("Failed to create quote", error);
    }
  };

  // Back button handler
  const handleBack = () => {
    navigate("/quotes"); // Go back to the quotes page
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="self-start mb-4 text-blue-500 hover: flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a1 1 0 01-.707-.293l-7-7a1 1 0 010-1.414l7-7a1 1 0 111.414 1.414L4.414 10H18a1 1 0 110 2H4.414l6.293 6.293A1 1 0 0110 18z"
            clipRule="evenodd"
          />
        </svg>
        Back to Quotes
      </button>

      <div className="w-full lg:w-[50%] flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter your quote"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input type="file" onChange={handleFileChange} className="mb-4" />

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-xs italic m-4 font-bold">{error}</p>
        )}

        {mediaUrl && (
          <p className="text-green-500 text-xs italic m-4 font-bold">Image uploaded successfully! You can create quote now</p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 md:gap-10">
          <button
            onClick={uploadImage}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Upload Image
          </button>
          <button
            onClick={createQuote}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Quote
          </button>
        </div>
      </div>
    </div>
  );
}
