import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LoginPage from './pages/LoginPage';
import QuoteListPage from './pages/QuoteListPage';
import CreateQuotePage from './pages/CreateQuotePage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || ''); // Get the token from localStorage

  // Handle storing token in localStorage
  const handleLogin = (authToken) => {
    localStorage.setItem('token', authToken); // Save token to localStorage
    setToken(authToken);
  };

  // Handle logout (clears token and redirects to login page)
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setToken('');
  };

  // Set up axios interceptor to catch 401 Unauthorized errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          handleLogout(); // Log out user if any API returns 401 Unauthorized
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor); // Clean up the interceptor on unmount
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Route for Login */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} token={token} />} />

        {/* Protected Routes */}
        <Route
          path="/quotes"
          element={
            <PrivateRoute token={token}>
              <QuoteListPage token={token} />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-quote"
          element={
            <PrivateRoute token={token}>
              <CreateQuotePage token={token} />
            </PrivateRoute>
          }
        />

        {/* Redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
