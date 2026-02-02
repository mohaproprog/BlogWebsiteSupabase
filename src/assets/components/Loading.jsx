import React from "react";

function Loading({ text = "Loading..." }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-zinc-100">
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
      </div>

      {/* Text */}
      <p className="text-sm tracking-wide text-zinc-400">
        {text}
      </p>
    </div>
  );
}

export default Loading;
