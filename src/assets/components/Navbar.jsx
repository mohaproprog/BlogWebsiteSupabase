import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "./UseAuth"; // hook import

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth(); // use the hook

  if (loading) return <p>Loading...</p>; // optional loading state

  return (
    <nav className="bg-zinc-900 text-zinc-100 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="text-xl font-semibold tracking-wide">
            <span className="text-cyan-400">Blog</span>er
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="relative hover:after:w-full">Home</Link>
            <Link to="/blogs" className="relative hover:after:w-full">Blogs</Link>

            {user ? (
              <>
                <Link to="/createblog" className="rounded-md bg-cyan-500 px-4 py-2 text-zinc-900 hover:bg-cyan-400 transition">
                  Create Blog
                </Link>
                <Link to="/profile">
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="Profile"
                    className="w-9 h-9 rounded-full border border-zinc-700 hover:ring-2 hover:ring-cyan-400 transition"
                  />
                </Link>
              </>
            ) : (
              <>
                <Link to="/signIn" className="text-zinc-300 hover:text-cyan-400">Sign In</Link>
                <Link to="/signUp" className="border border-cyan-500 px-4 py-2 rounded-md text-cyan-400 hover:bg-cyan-500 hover:text-zinc-900 transition">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">☰</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-6 py-4 space-y-4">
          <Link to="/" className="block hover:text-cyan-400">Home</Link>
          <Link to="/blogs" className="block hover:text-cyan-400">Blogs</Link>

          {user ? (
            <>
              <Link to="/createblog" className="block bg-cyan-500 text-zinc-900 text-center py-2 rounded-md font-medium">
                Create Blog
              </Link>
              <Link to="/profile" className="flex justify-center">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-zinc-700"
                />
              </Link>
            </>
          ) : (
            <>
              <Link to="/signIn" className="block text-center hover:text-cyan-400">Sign In</Link>
              <Link to="/signUp" className="block border border-cyan-500 text-cyan-400 text-center py-2 rounded-md hover:bg-cyan-500 hover:text-zinc-900 transition">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
