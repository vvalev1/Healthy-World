import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import AuthContext from "../contexts/AuthContext";
import Path from "../../paths/paths";


export default function AuthGuard() {
    const { isAuthenticated } = useContext(AuthContext);

    if(!isAuthenticated) {
        return <Navigate to={Path.Login} />
    }

    return <Outlet />
}