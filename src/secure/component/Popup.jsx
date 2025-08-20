import React from "react";
import ruppee from "./ruppee.svg";

const Popup = ({ hidden, profitRatio, totalWin }) => {
  return (
    <div
      hidden={hidden}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 border-4 border-[#1fde23] rounded-xl animate-popup"
    >
      <div className="bg-[#10242f] text-[#1fde23] w-fit rounded-xl opacity-100 relative py-4 px-7 flex flex-col justify-center items-center">
        <div className="text-3xl font-bold">
          {profitRatio}
          <span className="font-extrabold">&times;</span>
        </div>
        <div className="w-10 h-0.5 rounded-full bg-[#2a3e49] mt-3 mb-2"></div>
        <div className="text-lg font-bold flex items-center gap-1.5">
          &#8377;{totalWin}
          <img className="h-5 w-5" src={ruppee}></img>
        </div>
      </div>
    </div>
  );
};

export default Popup;