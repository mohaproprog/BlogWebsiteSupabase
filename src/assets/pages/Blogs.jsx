import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabse/supabase.client";

export default function Blogs() {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Blog")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return console.error(error);

      const blogsWithExcerpt = data.map((blog) => ({
        ...blog,
        excerpt: blog.content
          ? blog.content.split("\n")[0].slice(0, 120)
          : "",
      }));

      setBlogs(blogsWithExcerpt);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-zinc-100">
        Loading blogs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 px-6 py-16">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">All Blogs</h1>
        <p className="text-zinc-400 text-lg">
          Explore the latest blogs shared by our community.
        </p>
      </div>

      {blogs.length === 0 ? (
        <p className="text-center text-zinc-400">
          No blogs found. Be the first to create one!
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-zinc-800 rounded-xl p-6 hover:ring-2 hover:ring-cyan-400 transition"
            >
              <h2 className="text-xl font-semibold mb-2 break-words">
                {blog.title.length > 30
                  ? blog.title.slice(0, 30) + "…"
                  : blog.title}
              </h2>

              <p className="text-zinc-400 mb-4 break-words overflow-hidden">
                {blog.excerpt}
              </p>

              <div className="flex justify-between text-xs text-zinc-500 mb-4">
                <span>{blog.author || "Anonymous"}</span>
                <span>
                  {new Date(blog.created_at).toLocaleDateString()}
                </span>
              </div>

              <Link
                to={`/blogs/${blog.id}`}
                className="text-cyan-400 text-sm hover:underline"
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
