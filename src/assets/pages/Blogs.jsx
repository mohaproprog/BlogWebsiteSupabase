import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabse/supabase.client";
import Loading from "../components/Loading";

export default function Blogs() {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);

  // fetch blogs with user info
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Blog")
        .select(`
          id,
          title,
          content,
          created_at,
          Author,
          user:Author (
            id,
            username,
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) return console.error(error);

      // create excerpt for preview
      const blogsWithExcerpt = data.map(blog => ({
        ...blog,
        excerpt: blog.content ? blog.content.split("\n")[0].slice(0, 120) : "",
      }));

      setBlogs(blogsWithExcerpt);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();

    // realtime subscription
    const channel = supabase
      .channel("blog-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Blog" },
        async payload => {
          const { eventType, new: newBlog, old: oldBlog } = payload;

          // handle INSERT
          if (eventType === "INSERT") {
            // fetch user info for the new blog
            const { data: userData } = await supabase
              .from("user")
              .select("*")
              .eq("id", newBlog.Author)
              .single();

            setBlogs(prev => [
              { ...newBlog, user: userData, excerpt: newBlog.content?.split("\n")[0].slice(0, 120) || "" },
              ...prev,
            ]);
          }

          // handle UPDATE
          if (eventType === "UPDATE") {
            const { data: userData } = await supabase
              .from("user")
              .select("*")
              .eq("id", newBlog.Author)
              .single();

            setBlogs(prev =>
              prev.map(blog =>
                blog.id === newBlog.id
                  ? { ...newBlog, user: userData, excerpt: newBlog.content?.split("\n")[0].slice(0, 120) || "" }
                  : blog
              )
            );
          }

          // handle DELETE
          if (eventType === "DELETE") {
            setBlogs(prev => prev.filter(blog => blog.id !== oldBlog.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <Loading />;

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
          {blogs.map(blog => (
            <div
              key={blog.id}
              className="bg-zinc-800 rounded-xl p-6 hover:ring-2 hover:ring-cyan-400 transition"
            >
              <h2 className="text-xl font-semibold mb-2 break-words">
                {blog.title.length > 30 ? blog.title.slice(0, 30) + "…" : blog.title}
              </h2>

                <div className="overflow-x-hidden w-full">
                  <p className="text-zinc-400 mb-4 break-words break-all">
                    {blog.excerpt}
                  </p>
                </div>


              <div className="flex justify-between text-xs text-zinc-500 mb-4">
                <span>{blog.user?.full_name || "Anonymous"}</span>
                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
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
