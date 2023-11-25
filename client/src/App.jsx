// import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useParams } from "react-router-dom";


import { AuthProvider } from "./components/contexts/AuthContext";
import Path from "./paths/paths"

import HomeComponent from "./components/Home";
import Footer from "./components/Footer";
import NavigationBarComponent from "./components/NavigationBar";
import NotFound from "./components/NotFound";
import About from "./components/About";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import CreateProduct from "./components/Products/create/CreateProduct";
import Products from "./components/Products/Products";
import Details from "./components/Products/details/Details";
import EditProduct from "./components/Products/edit/EditProduct";
import Logout from "./components/Logout";



function App() {
  return (
    <AuthProvider>
        <NavigationBarComponent />
        
        <Routes>
          <Route path={Path.Home} element={<HomeComponent />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/create" element={<CreateProduct />} />
          <Route path="/edit" element={<EditProduct />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/vegetables" element={<Products />} />
          <Route path="/products/details" element={<Details />} />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
    </AuthProvider>
  )
}

export default App
