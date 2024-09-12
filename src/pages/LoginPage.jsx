import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function LoginPage({ onLogin, token }) {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    setError(""); // Clear errors

    try {
      const response = await axios.post(
        import.meta.env.VITE_LOGIN_API,
        {
          username,
          otp, //use otp as 1234 to create user
        }
      );
      const token = response.data.token;
      onLogin(token); // Store the token
      navigate("/quotes"); // Redirect to quotes page after login
    } catch (error) {
      setError(error.response.data)
      console.error("Login failed", error);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/quotes");
    }
  }, [token]);

  // return (
  //   <div className="flex items-center justify-center min-h-screen bg-gray-100">
  //     <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
  //       <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
  //       <input
  //         type="text"
  //         placeholder="Username"
  //         value={username}
  //         onChange={(e) => setUsername(e.target.value)}
  //         className="w-full p-2 mb-4 border border-gray-300 rounded"
  //       />
  //       <input
  //         type="text"
  //         placeholder="OTP"
  //         value={otp}
  //         onChange={(e) => setOtp(e.target.value)}
  //         className="w-full p-2 mb-4 border border-gray-300 rounded"
  //       />
  //       <button
  //         onClick={handleLogin}
  //         className="w-full bg-blue-500 text-white py-2 rounded"
  //       >
  //         Login
  //       </button>
  //     </div>
  //   </div>
  // );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="otp"
          >
            OTP
          </label>
          <input
            id="otp"
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-xs italic font-bold mb-4">{error}</p>}

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
