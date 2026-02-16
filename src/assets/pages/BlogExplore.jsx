import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabse/supabase.client";
import Loading from "../components/Loading";
import useAuth from "../components/UseAuth";
import Commnets from "../components/Commnets";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sureDelete, setSureDelete] = useState(false);
  const [commentShow, setCommentShow] = useState(false);

  // fetch blog
  const fetchBlog = async () => {
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
  }, []);

  // delete blog
  const handleDelete = async () => {
    const { error } = await supabase
      .from("Blog")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    navigate("/blogs");
  };

  if (loading) return <Loading />;

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-zinc-100 px-4">
        Blog not found
      </div>
    );
  }

  const isAuthor = user?.id === blog.Author;

  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-8 sm:px-6 md:px-8 text-zinc-100">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-cyan-400 hover:underline text-left"
        >
          ← Back to blogs
        </button>

        {/* Header */}
        <div className="bg-zinc-800 rounded-2xl p-6 sm:p-8 border border-zinc-700">
          <h1 className="text-2xl sm:text-4xl font-semibold mb-2 break-words">
            {blog.title}
          </h1>
          <div className="text-sm text-zinc-400">
            {blog.user?.full_name || "Anonymous"} ·{" "}
            {new Date(blog.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Content */}
        <div className="bg-zinc-800 rounded-2xl p-6 sm:p-8 border border-zinc-700 leading-relaxed whitespace-pre-line text-zinc-200 break-words break-all">
          {blog.content}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-2">
          {/* Comment (everyone) */}
          <button
            onClick={() => setCommentShow(!commentShow)}
            className="px-4 py-2 rounded-lg border border-zinc-600 text-sm hover:border-cyan-400 hover:text-cyan-400 transition"
          >
            {commentShow ? "Hide Comments" : "Comment"}
          </button>

          {/* Author Only */}
          {isAuthor && (
            <>
              <Link
                to={`/blogs/${blog.id}/updating`}
                className="px-4 py-2 rounded-lg border border-zinc-600 text-sm hover:border-cyan-400 hover:text-cyan-400 transition"
              >
                Update
              </Link>

              <button
                onClick={() => setSureDelete(true)}
                className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 text-sm hover:bg-red-500/10 transition"
              >
                Delete
              </button>
            </>
          )}
        </div>

        {/* Delete Confirmation */}
        {sureDelete && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
            <div className="bg-zinc-800 border border-red-500/40 rounded-xl px-6 py-4 shadow-lg">
              <p className="text-sm text-zinc-200 mb-4">
                Are you sure you want to delete this blog?
              </p>

              <div className="flex justify-end gap-3 flex-wrap">
                <button
                  onClick={() => setSureDelete(false)}
                  className="px-4 py-1.5 rounded-md text-sm border border-zinc-600 hover:border-zinc-400 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="px-4 py-1.5 rounded-md text-sm bg-red-500 text-white hover:bg-red-400 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Comments */}
      {commentShow && <Commnets Blog={blog} />}
    </div>
  );
}
