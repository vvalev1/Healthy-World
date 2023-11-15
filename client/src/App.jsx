// import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from "react-router-dom";
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



function App() {

  return (
    <>
      <NavigationBarComponent/>
     
      <Routes>
        <Route path="/" element={<HomeComponent/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/create" element={<CreateProduct/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/products/details" element={<Details/>} />

        <Route path="*" element={<NotFound/>} />
      </Routes>
      
      <Footer/>
    </>
  )
}

export default App
