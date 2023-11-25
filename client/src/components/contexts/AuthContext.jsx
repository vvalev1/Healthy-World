import { Children, createContext } from "react";
import { useState } from "react";

import * as authService from "../../services/authService";


const AuthContext = createContext();

export default function AuthProvider({
    children,
}) {
  const [auth, setAuth] = useState({});

  let errorMessage = "";

  const loginSubmitHandler = async (values) => {

    let result;
    try {
      result = await authService.login(values.email, values.password);
      const token = result.accessToken;
      localStorage.setItem("auth", token);
      setAuth(token);
    } catch (e) {
      errorMessage = e.message;
      console.log(e.message);
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