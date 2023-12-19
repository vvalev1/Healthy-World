import { createContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import usePersistedState from "../hooks/usePersistedState";

import * as authService from "../../services/authService";
import Path from "../../paths/paths"


 const AuthContext = createContext();


export function AuthProvider({
    children,
}) {
  const navigate = useNavigate();

  const [auth, setAuth] = usePersistedState("auth", {});

  const [errorMessage, setErrorMessage] = useState("");


  const loginSubmitHandler = async (values) => {

    if(!values.email) {
      
      return setErrorMessage("Email is required!");
    }

    if(!values.password) {
      
      return setErrorMessage("Password is required!");
    }

    let result;
    try {
      result = await authService.login(values.email, values.password);
      const token = result.accessToken;
      
      setAuth(result);
      navigate(Path.Home);
    } catch (e) {
        setErrorMessage("Email or password is incorrect!");
        // setErrorMessage(e.message);
    }
    
  }

  const registerSubmitHandler = async (values) => {

    let result;

    if(!values.email) {
      
      return setErrorMessage("Email is required!");
    }

    if(!values.password) {

      return setErrorMessage("Password is required!");
    }

   if(values.password !== values.repeatPassword) {

      return setErrorMessage("Password and Repeat Password should be equal!");
    } 

    try {
      result = await authService.register(values.email, values.password);
      const token = result.accessToken;

      setAuth(result);
      navigate(Path.Home);
    } catch (e) {
      
      // setErrorMessage("Email or password is incorrect!");
      setErrorMessage(e.message);
    }

  }

  const logoutHandler = () => {
    setAuth({});
    localStorage.removeItem("auth");
  }

  const values = {
    loginSubmitHandler,
    registerSubmitHandler,
    logoutHandler,
    username: auth.username || auth.email,
    email: auth.email,
    isAuthenticated: auth.accessToken,
    userId: auth._id,
    errorMsg: errorMessage,
    setErrorMessage,

  };

  console.log(auth.accessToken)

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;