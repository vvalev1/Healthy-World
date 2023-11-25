import { createContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as authService from "../../services/authService";
import Path from "../../paths/paths"


 const AuthContext = createContext();

export function AuthProvider({
    children,
}) {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({});

  let errorMessage = "";

  const loginSubmitHandler = async (values) => {

    let result;
    try {
      result = await authService.login(values.email, values.password);
      const token = result.accessToken;
      localStorage.setItem("auth", token);
      setAuth(token);
      navigate(Path.Home);
    } catch (e) {
      errorMessage = e.message;
      // console.log(e.message);
    }
    
  }

  const values = {
    loginSubmitHandler,
    username: auth
  };

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;