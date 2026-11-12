import { Navigate } from "react-router-dom";
export default function StaffProtectedRoute({children,roles=[]}){
 const token=sessionStorage.getItem("adminToken");
 const role=sessionStorage.getItem("adminRole");
 return token && roles.includes(role) ? children : <Navigate to="/admin/login" replace />;
}
