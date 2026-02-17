import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "./UseAuth";
import { supabase } from "../../supabse/supabase.client";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(()=>{
    const fetchingProfile = async () => {
    if (!user) return;

    try {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from("user")
        .select()
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Navbar profile fetch failed", error);
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProfile(false);
    }
  };

  fetchingProfile()
  },[user,loading])


  return (
    <nav className="bg-zinc-900 text-zinc-100 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="text-xl font-semibold">
            <span className="text-cyan-400">Blog</span>er
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
            <Link to="/blogs" className="hover:text-cyan-400 transition">Blogs</Link>

            {!loading && user ? (
              <>
                <Link
                  to="/createblog"
                  className="bg-cyan-500 px-4 py-2 rounded-md text-zinc-900 hover:bg-cyan-400 transition"
                >
                  Create Blog
                </Link>

                <Link to="/profile">
                  {loadingProfile || loading ? (
                    <div className="w-8 h-8 border-2 border-zinc-600 border-t-cyan-400 rounded-full animate-spin" />
                  ) : (
                    <img
                      src={
                        profile?.Avatar_url ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt="Profile"
                      className="w-9 h-9 rounded-full border border-zinc-700 hover:ring-2 hover:ring-cyan-400 transition"
                    />
                  )}
                </Link>
              </>
            ) : (
              !loading && (
                <>
                  <Link to="/signIn" className="hover:text-cyan-400 transition">
                    Sign In
                  </Link>
                  <Link
                    to="/signUp"
                    className="border border-cyan-500 px-4 py-2 rounded-md text-cyan-400 hover:bg-cyan-500 hover:text-zinc-900 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl text-zinc-200"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-900 px-6 py-6">
          <div className="space-y-4">

            <Link
              to="/"
              className="block text-lg font-medium text-zinc-200 hover:text-cyan-400 transition"
            >
              Home
            </Link>

            <Link
              to="/blogs"
              className="block text-lg font-medium text-zinc-200 hover:text-cyan-400 transition"
            >
              Blogs
            </Link>

            <div className="h-px bg-zinc-800 my-4" />

            {!loading && user ? (
              <>
                <Link
                  to="/createblog"
                  className="block w-full bg-cyan-500 text-zinc-900 text-center py-3 rounded-xl font-semibold hover:bg-cyan-400 transition"
                >
                  Create Blog
                </Link>

                <Link
                  to="/profile"
                  className="flex flex-col items-center gap-2 mt-6"
                >
                  {loadingProfile ? (
                    <div className="w-10 h-10 border-2 border-zinc-600 border-t-cyan-400 rounded-full animate-spin" />
                  ) : (
                    <>
                      <img
                        src={
                          profile?.Avatar_url ||
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="Profile"
                        className="w-14 h-14 rounded-full border-2 border-zinc-700"
                      />
                      <span className="text-sm text-zinc-400">
                        View Profile
                      </span>
                    </>
                  )}
                </Link>
              </>
            ) : (
              !loading && (
                <div className="space-y-3">
                  <Link
                    to="/signIn"
                    className="block w-full text-center py-3 rounded-xl border border-zinc-700 text-zinc-200 hover:text-cyan-400 hover:border-cyan-400 transition"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signUp"
                    className="block w-full text-center py-3 rounded-xl bg-cyan-500 text-zinc-900 font-semibold hover:bg-cyan-400 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
