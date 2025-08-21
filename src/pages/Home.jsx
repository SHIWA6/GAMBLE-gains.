import React from "react";
import mineThumbnail from "../assets/mineThumbnail.png";
import diceThumbnail from "../assets/diceThumbnail.png";
import hilothumbnail from "../assets/hiloThumbnail.png";
import { Link } from "react-router-dom";
import Loader from "../secure/component/Loader";

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] min-h-screen pt-10 px-4">
      <Loader />

      {/* Main Container */}
      <div className="max-w-screen-xl m-auto rounded-3xl overflow-hidden min-h-[80vh] flex sm:flex-row flex-col items-center justify-evenly gap-6 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/30">

        {/* Mines Card */}
        <Link
          to="/Mines"
          className="group relative rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-pink-500/40"
        >
          <img
            className="w-56 h-72 object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:rotate-1"
            src={mineThumbnail}
            alt="Mines"
          />
          <div className="absolute bottom-0 w-full py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-center text-white text-lg font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            Mines
          </div>
        </Link>

        {/* Dice Card */}
        <Link
          to="/Dice"
          className="group relative rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-indigo-500/40"
        >
          <img
            className="w-56 h-72 object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:-rotate-1"
            src={diceThumbnail}
            alt="Dice"
          />
          <div className="absolute bottom-0 w-full py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-center text-white text-lg font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            Dice
          </div>
        </Link>

        {/* Hilo Card */}
        <Link
          to="/hilo"
          className="group relative rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-green-500/40"
        >
          <img
            className="w-56 h-72 object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:rotate-2"
            src={hilothumbnail}
            alt="HiLo"
          />
          <div className="absolute bottom-0 w-full py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-center text-white text-lg font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            HiLo
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
