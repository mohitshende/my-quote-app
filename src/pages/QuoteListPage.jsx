import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function QuoteListPage({ token }) {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  const fetchQuotes = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_QUOTES_API,
        {
          params: { limit: 20, offset: page * 20 },
          headers: { Authorization: token },
        }
      );
      if (response.data?.data?.length === 0) {
        setHasMore(false);
      } else {
        setQuotes((prev) => [...prev, ...response?.data?.data]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch quotes", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleCreateQuote = () => {
    navigate("/create-quote"); // Redirect to the quote creation page
  };

  return (
    <div className="relative min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Quotes</h1>

      {/* Quote List */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
        {quotes.map((quote, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-4">
            <div className="relative rounded-md overflow-hidden">
              <img
                src={
                  quote.mediaUrl ||
                  "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                }
                alt="Quote Media"
                className="w-full h-64 object-cover "
              />
              <div
                className="absolute bottom-0 w-full h-fit pl-4 pb-4"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, transparent, rgba(37, 37, 37, .61), #111)",
                }}
              >
                <p className="text-white font-bold text-lg truncate">
                  {quote.text}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-gray-500 mt-2 font-bold">
                {quote.username}
              </p>
              <p className="text-sm text-gray-500 mt-2 ">
                {new Date(quote.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center mt-5">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4" />
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={fetchQuotes}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Load More
          </button>
        </div>
      )}

      {/* Floating Action Button (FAB) for Create Quote */}
      <button
        onClick={handleCreateQuote}
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}
