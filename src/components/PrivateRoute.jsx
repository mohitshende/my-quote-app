import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, token }) {
  return token ? children : <Navigate to="/login" />;
}
