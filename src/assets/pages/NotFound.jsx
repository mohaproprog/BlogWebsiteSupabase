import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-zinc-400 text-lg mb-8 text-center">
        Oops! The page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-cyan-500 hover:bg-cyan-400 text-zinc-900 px-6 py-3 rounded-lg font-medium transition"
      >
        Go Back Home
      </button>
    </div>
  );
}
