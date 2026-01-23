import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabse/supabase.client";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sureDelete, setSureDelete] = useState(false);

  // YOUR FUNCTION (unchanged)
  const fetchBlog = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Blog")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setBlog(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
    
  },[]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-zinc-100">
        Loading blog...
      </div>
    );
  }


//   deleting the blog
  const handleDelete = async()=>{
    const {error} = await supabase.from("Blog").delete().eq("id",id)
    if(error){
        console.error(error);
        
    }
    navigate("/blogs")
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-zinc-100">
        Blog not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 px-6 py-16 text-zinc-100">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-cyan-400 hover:underline mb-6"
        >
          ← Back to blogs
        </button>

        {/* Header Card */}
        <div className="bg-zinc-800 rounded-2xl p-8 mb-8 border border-zinc-700">
          <h1 className="text-4xl font-semibold mb-3 leading-tight">
            {blog.title}
          </h1>

          <div className="text-sm text-zinc-400">
            {blog.author || "Anonymous"} ·{" "}
            {new Date(blog.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-zinc-800 rounded-2xl p-8 border border-zinc-700 leading-relaxed whitespace-pre-line text-zinc-200">
          {blog.content}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button className="px-5 py-2 rounded-lg border border-zinc-600 text-sm hover:border-cyan-400 hover:text-cyan-400 transition">
            <Link to={`/blogs/${blog.id}/updating`}>Update</Link>
          </button>

          <button onClick={()=>setSureDelete(true)} className="px-5 py-2 rounded-lg border border-red-500/50 text-red-400 text-sm hover:bg-red-500/10 transition">
            Delete
          </button>
          {sureDelete && (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
    <div className="bg-zinc-800 border border-red-500/40 rounded-xl px-6 py-4 shadow-lg">
      <p className="text-sm text-zinc-200 mb-4">
        Are you sure you want to delete this blog?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setSureDelete(false)}
          className="px-4 py-1.5 rounded-md text-sm border border-zinc-600 hover:border-zinc-400 transition"
        >
          Cancel
        </button>

        <button onClick={handleDelete}
          className="px-4 py-1.5 rounded-md text-sm bg-red-500 text-white hover:bg-red-400 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

        </div>

      </div>
    </div>
  );
}
