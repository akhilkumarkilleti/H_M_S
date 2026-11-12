import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("doctorToken");
  return token ? children : <Navigate to="/admin/login" replace />;
}

export default ProtectedRoute;
