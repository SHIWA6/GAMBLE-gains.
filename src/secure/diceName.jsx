// components/DiceNumber.jsx
import React from "react";

const DiceNumber = ({ w, hidden, amount, win }) => {
  if (hidden) return null; // Don't render if hidden

  return (
    <div
      className="absolute -top-16 flex justify-center"
      style={{ width: `${w}px` }}
    >
      <div
        className={`px-4 py-2 rounded-full font-bold text-lg shadow-lg ${
          win ? "bg-green-500 text-black" : "bg-red-500 text-white"
        }`}
      >
        {amount}
      </div>
    </div>
  );
};

export default DiceNumber;
