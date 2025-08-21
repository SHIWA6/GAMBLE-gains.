import React, { useEffect, useState } from "react";

const Loader = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] z-50">
      {/* Floating Gradient Orbs */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-3xl opacity-30 animate-pulse top-10 left-10"></div>
      <div className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 blur-3xl opacity-30 animate-pulse bottom-16 right-16"></div>
      <div className="absolute w-52 h-52 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 blur-3xl opacity-30 animate-pulse bottom-32 left-1/3"></div>

      {/* Loader Content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Glowing Ring */}
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-purple-500 animate-spin-slow"></div>
          <div className="absolute inset-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 animate-pulse"></div>
        </div>

        {/* Fancy Text */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 animate-pulse">
          Loading...
        </h1>
        <p className="text-slate-300 text-sm tracking-wide animate-bounce">
          Made with ❤️ by Shiva
        </p>
      </div>
    </div>
  );
};

export default Loader;
