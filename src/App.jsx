import { Routes, Route } from "react-router-dom"
import HomeComponent from "./components/Home"
import Footer from "./components/Footer"
import NavigationBarComponent from "./components/NavigationBar"
import NotFound from "./components/NotFound"

function App() {

  return (
    <>
      <NavigationBarComponent/>
      <Routes>
        <Route path="/" element={<HomeComponent/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
      
      <Footer/>
    </>
  )
}

export default App
