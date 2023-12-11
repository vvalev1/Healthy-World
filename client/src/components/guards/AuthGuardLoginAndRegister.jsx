import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import AuthContext from "../contexts/AuthContext";
import Path from "../../paths/paths";


export default function AuthGuardLoginAndRegister() {
    const { isAuthenticated } = useContext(AuthContext);

    const location = useLocation();

    if(isAuthenticated && (location.pathname === Path.Login || location.pathname === Path.Register)) {
        return <Navigate to={Path.Home} />
    }

    return <Outlet />
}