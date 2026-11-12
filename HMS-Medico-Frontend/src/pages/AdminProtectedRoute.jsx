import { Navigate } from "react-router-dom";
export default function AdminProtectedRoute({children}){
 const token=sessionStorage.getItem("adminToken"), role=sessionStorage.getItem("adminRole");
 return token && ["MAIN_ADMIN","ADMIN"].includes(role)?children:<Navigate to="/admin/login" replace />;
}
