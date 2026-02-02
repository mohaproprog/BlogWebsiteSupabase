import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabse/supabase.client";

function SignIn() {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const onsubmit = async (e) => {
    e.preventDefault(); // ✅ prevent page reload
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email: login.email,
      password: login.password,
    });

    if (error) {
      console.error(error);
      setErrorMsg("Email or password is incorrect");
      return;
    }

    console.log("Signed in successfully:", login.email);
    navigate("/blogs"); // redirect after login
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-lg p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-zinc-100 text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-zinc-400 text-center mb-8">
          Sign in to continue blogging
        </p>

        <form onSubmit={onsubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-zinc-300 mb-2 text-sm">Email</label>
            <input
              type="email"
              value={login.email}
              onChange={(e) =>
                setLogin((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-zinc-900 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-zinc-300 mb-2 text-sm">Password</label>
            <input
              type="password"
              value={login.password}
              onChange={(e) =>
                setLogin((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg bg-zinc-900 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-cyan-500 text-zinc-900 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-zinc-400 text-sm">
            Don’t have an account?{" "}
            <Link to="/signUp" className="text-cyan-400 hover:underline">
              Sign Up
            </Link>
          </p>

          <p className="text-zinc-500 text-sm hover:text-cyan-400 cursor-pointer">
            Forgot password?
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
