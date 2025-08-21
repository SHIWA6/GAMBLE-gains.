import React from "react";
import avatar from "../assets/avatar.svg";
import ruppee from "../assets/ruppee.svg";
import { Link } from "react-router-dom";

const Appbar = () => {
  return (
    <div className="sticky top-0 left-0 right-0 z-50">
      {/* Outer Glow Line */}
      

      <div className="bg-gradient-to-r from-[#0f2027]/95 via-[#203a43]/95 to-[#2c5364]/95 shadow-lg shadow-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-screen-xl m-auto flex justify-between items-center py-3 px-6">
          
          {/* Logo */}
          <Link to={"/"}>
            <h1 className="text-white flex items-center gap-3 font-pacifico font-medium text-3xl px-3 hover:text-pink-400 transition-colors duration-300">
              Satta
              <span>
                <img
                  className="w-12 h-12 rounded-full border-2 border-white/30 shadow-lg hover:scale-110 hover:shadow-pink-500/40 transition-all duration-300"
                  src={avatar}
                  alt="avatar"
                />
              </span>
            </h1>
          </Link>

          {/* Center Text */}
          <div className="hidden md:flex text-white text-lg font-semibold tracking-wide">
            <div className="relative group">
              <div className="bg-white/10 backdrop-blur-lg px-6 py-2 rounded-full shadow-md border border-white/10 flex items-center gap-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-pink-500/40">
                <span>Made with ❤️ by Shiva</span>
              </div>
              {/* Underline Glow */}
              <div className="absolute left-0 right-0 -bottom-1 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></div>
            </div>
          </div>

          {/* Wallet Button */}
          <button className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg hover:shadow-pink-400/40 hover:scale-105 transition-all duration-300 overflow-hidden">
            <span className="relative z-10">Wallet</span>
            {/* Shiny Light Effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appbar;

