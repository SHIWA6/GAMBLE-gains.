import React from "react"
import mineThumbnail from "../assets/mineThumbnail.png"
import diceThumbnail from "../assets/diceThumbnail.png"
import hilothumbnail from "../assets/hiloThumbnail.png"
import {Link} from "react-router-dom"
import Loader from "../secure/component/Loader"

const Home = () => {

    return(<div className="bg-[#1a2c38] h-full pt-8 px-3">
        <Loader> </Loader>
        <div className="bg-[#0f212e] max-w-screen-lg m-auto rounded-lg overflow-hidden max-h-[85vh] h-full flex sm:flex-row flex-col items-center justify-evenly ">

           

             <Link className="rounded-xl overflow-hidden hover:translate-y-2 cursor-pointer duration-300 sm:auto " to="/Mines"> <img className="w-55 h-64 object-cover rounded-2xl shadow-lg" src={mineThumbnail}></img> 
             </Link>

              <Link to="/Dice"
            className="rounded-xl overflow-hidden hover:translate-y-2 cursor-pointer duration-300 sm:w-auto w-36"
            >
             <img className="w-55 h-64 object-cover rounded-2xl shadow-lg" src= { diceThumbnail}></img> </Link>

              <Link className="rounded-xl overflow-hidden hover:translate-y-2 cursor-pointer duration-300 sm:auto " to="/hilo"> <img className="w-55 h-64 object-cover rounded-2xl shadow-lg" src={hilothumbnail}></img> 
             </Link>
             
                        </div> 
            </div>)
}

export default Home;