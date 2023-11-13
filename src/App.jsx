import { Routes, Route } from "react-router-dom";
import HomeComponent from "./components/Home";
import Footer from "./components/Footer";
import NavigationBarComponent from "./components/NavigationBar";
import NotFound from "./components/NotFound";
import About from "./components/About";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import AddItem from "./components/FruitsAndVegatables/AddItem";
import Products from "./components/FruitsAndVegatables/Products";
import Details from "./components/FruitsAndVegatables/Details";


function App() {

  return (
    <>
      <NavigationBarComponent/>
     
      <Routes>
        <Route path="/" element={<HomeComponent/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/create" element={<AddItem/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/details" element={<Details/>} />

        <Route path="*" element={<NotFound/>} />
      </Routes>
      
      <Footer/>
    </>
  )
}

export default App
