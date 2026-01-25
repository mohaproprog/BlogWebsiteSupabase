import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col justify-center items-center px-6">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Share Your Ideas on <span className="text-cyan-400">Bloger</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl mb-6">
          Bloger is a platform for writers, thinkers, and creators to share 
          stories, tips, tutorials, and ideas with the world.  
          Join our community and make your voice heard!
        </p>

        <Link
          to="/SignUp"
          className="bg-cyan-500 text-zinc-900 px-6 py-3 rounded-lg text-lg font-medium hover:bg-cyan-400 transition"
        >
          Join Us & Share Your Blog
        </Link>
      </div>

      {/* Optional Extra Section */}
      <div className="mt-16 max-w-4xl text-center text-zinc-400 space-y-4">
        <p>
          Connect with a community of passionate writers and readers.
        </p>
        <p>
          Explore blogs, share your knowledge, and grow your writing skills.
        </p>
        <p>
          Easy to use. Fast. Modern. Designed for creators like you.
        </p>
      </div>
    </div>
  );
}
