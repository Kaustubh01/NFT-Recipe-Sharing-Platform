import { Navigate, Outlet } from "react-router-dom"
import { isAuthenticated } from "../utils/auth"

export const ProtectedRoutes = () =>{
    return isAuthenticated() ? <Outlet/> : <Navigate to="/register" />
}