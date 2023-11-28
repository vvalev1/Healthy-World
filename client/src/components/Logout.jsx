import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Path from "../paths/paths";
import * as authService from "../services/authService";
import AuthContext from "./contexts/AuthContext";

export default function Logout() {

    const navigate = useNavigate();
    const { logoutHandler } = useContext(AuthContext);

    useEffect(() => {
        authService.logout()
            .then(() => {
                logoutHandler();
                navigate(Path.Home);
            })
            .catch((err) => {
                logoutHandler();
                navigate(Path.Login);
            })
    }, []);
    
    return null;
}