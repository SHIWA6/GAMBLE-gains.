import Dice from "./pages/Dice";
import Home from "./pages/Home"
import Appbar from "./pages/Appbar"
import { BrowserRouter, Route, Routes } from "react-router-dom";



export default function App(){




  return(<BrowserRouter>
  <div className="h-dvh flex flex-col bg-[#1a2c38]">
 <Appbar></Appbar>
 <Routes>
<Route path="/" element={<Home></Home>} > </Route>
<Route path="/Dice" element={ <Dice></Dice>} > </Route>

 </Routes>


  </div>
           </BrowserRouter>

  )
}
