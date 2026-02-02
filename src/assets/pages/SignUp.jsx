import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabse/supabase.client";

function SignUp() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [gmail, setGmail] = useState("");
  const [confirmGmail, setConfirmGmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucsecc, setSucsecc] = useState(false);

  const navigate = useNavigate();
  // submit form
  const submitForm = async (e) => {
  e.preventDefault();
  setFormError("");

  // Validation
  if (!fullName.trim()) return setFormError("Please enter your full name.");
  if (!username.trim()) return setFormError("Please enter a username.");
  if (!gmail.trim()) return setFormError("Please enter your email address.");
  if (!gmail.includes("@")) return setFormError("Please enter a valid email address.");
  if (gmail !== confirmGmail) return setFormError("Email and confirm email do not match.");
  if (!password) return setFormError("Please enter a password.");
  if (password !== confirmPassword)
    return setFormError("Password and confirm password do not match.");

  try {
    setLoading(true);

    const {data:authData,error } = await supabase.auth.signUp({
      email: gmail,
      password,
    });

    if (error) {
      setFormError(error.message);
      return;
    }
    console.log("form secsessfull...");
    const {data:profileData,error:profileError} = await supabase.from("user")
    .insert({id:authData.user.id,
      full_name:fullName,
      username,
    Avatar_url:null}
    )
    if(profileError){
      console.error(profileError);
      
    }
    console.log(profileData);
    console.log("form and user secsec...");
    setSucsecc(true);
    setTimeout(() => {
      setSucsecc(false)
      navigate("/signIn");
      
    }, 3000);

    
    

    // ✅ success → reset form
    setFullName("");
    setUsername("");
    setGmail("");
    setConfirmGmail("");
    setPassword("");
    setConfirmPassword("");

    console.log("User signed up successfully");

  } catch (err) {
    setFormError("Something went wrong. Please try again.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  if (sucsecc) return(
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-6">
  <div className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-2xl p-8 text-center shadow-lg">

    <h2 className="text-2xl font-semibold text-zinc-100 mb-3">
      Account Created
    </h2>

    <p className="text-zinc-400 text-sm leading-relaxed">
      We’ve sent a confirmation email to your inbox.
      <br />
      Please verify your email address to activate your account.
    </p>

    <div className="mt-6 text-sm text-zinc-500">
      You won’t be able to sign in until your email is confirmed.
    </div>

    <div className="mt-8">
      <button
        disabled
        className="w-full bg-cyan-500/20 text-cyan-400 py-3 rounded-lg font-semibold cursor-not-allowed"
      >
        Waiting for email confirmation
      </button>
    </div>

  </div>
</div>



  )
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-lg p-8">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-zinc-100 text-center mb-2">
          Create Account
        </h1>
        <p className="text-zinc-400 text-center mb-8">
          Join us and start sharing your blogs
        </p>

        <form className="space-y-5" onSubmit={submitForm}>
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-900 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-900 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-900 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Confirm Email */}
          <input
            type="email"
            placeholder="Confirm Email"
            value={confirmGmail}
            onChange={(e) => setConfirmGmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-900 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-900 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-900 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Error Message */}
          {formError && (
            <p className="text-red-500  text-lg text-center">
              {formError}
            </p>
          )}

          {/* Submit Button */}
          <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition
                ${loading
                  ? "bg-zinc-600 cursor-not-allowed"
                  : "bg-cyan-500 text-zinc-900 hover:bg-cyan-400"}
              `}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

        </form>

        {/* Footer */}
        <p className="text-zinc-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/signIn" className="text-cyan-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
