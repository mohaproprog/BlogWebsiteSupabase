import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-zinc-900 text-zinc-100 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="text-xl font-semibold tracking-wide">
            <span className="text-cyan-400">Blog</span>er
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full"
            >
              Home
            </Link>

            <Link
              to="blogs"
              className="relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full"
            >
              Blogs
            </Link>

            <Link
              to="createblog"
              className="rounded-md bg-cyan-500 px-4 py-2 text-zinc-900 font-medium hover:bg-cyan-400 transition"
            >
              Create Blog
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-6 py-4 space-y-4">
          <Link to="/" className="block hover:text-cyan-400">Home</Link>
          <Link to="blogs" className="block hover:text-cyan-400">Blogs</Link>
          <Link
            to="createblog"
            className="block bg-cyan-500 text-zinc-900 text-center py-2 rounded-md font-medium"
          >
            Create Blog
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
