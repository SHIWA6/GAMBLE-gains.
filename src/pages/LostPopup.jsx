import React from "react";
import sukunaLaugh from "../assets/sukunaLaugh.svg";

const LostPopup = ({ hidden }) => {
  return (
    <div
      hidden={hidden}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 border-4 border-red-500 rounded-xl animate-popup"
    >
      <div className="bg-[#10242f] text-red-500 w-fit rounded-xl opacity-100 relative py-4 px-7 flex flex-col justify-center items-center">
        <div className="sm:text-3xl text-xl font-bold">Oops!!</div>
        <div className="mt-3 mb-2">
          <img src={sukunaLaugh} className="w-20 h-20"></img>
        </div>
        <div className="text-xl font-bold ">You Lost</div>
      </div>
    </div>
  );
};

export default LostPopup;