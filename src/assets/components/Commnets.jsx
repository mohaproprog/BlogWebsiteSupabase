import React, { useEffect, useState } from "react";
import useAuth from "./UseAuth";
import { supabase } from "../../supabse/supabase.client";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

function Comments({ Blog }) {
  const { user, loading } = useAuth();
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [content, setContent] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isUser, setIsUser] = useState(user?.id || null);
  const navigate = useNavigate();
  


  useEffect(() => {
    if (!Blog) return;

    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const { data, error } = await supabase
          .from("comments")
          .select("*, forUser(id, Avatar_url, full_name)")
          .eq("forBlog", Blog.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setComments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();

    const channel = supabase
      .channel("blog-realtime-comments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        async (payload) => {
          const { eventType, new: newComment, old: oldComment } = payload;

          if (eventType === "INSERT") {
            const { data: userData } = await supabase
              .from("user")
              .select("*")
              .eq("id", newComment.forUser)
              .single();
            setComments((prev) => [{ ...newComment, forUser: userData }, ...prev]);
          }

          if (eventType === "UPDATE") {
            const { data: userData } = await supabase
              .from("user")
              .select("*")
              .eq("id", newComment.forUser)
              .single();
            setComments((prev) =>
              prev.map((c) => (c.id === newComment.id ? { ...newComment, forUser: userData } : c))
            );
          }

          if (eventType === "DELETE") {
            setComments((prev) => prev.filter((c) => c.id !== oldComment.id));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [Blog]);

  const handleComment = async () => {
    if (!user || !Blog || !content){
        setIsUser(null)
        return navigate("/signIn");

    } 
    const { error } = await supabase
      .from("comments")
      .insert({ content, forUser: user.id, forBlog: Blog.id })
      .single();
    if (error) return console.error(error);
    setContent("");
  };

  const handleSaveEdit = async (commentId) => {
    const { error } = await supabase
      .from("comments")
      .update({ content: editContent })
      .eq("id", commentId);
    if (error) return console.error(error);
    setComments(
      comments.map((c) => (c.id === commentId ? { ...c, content: editContent } : c))
    );
    setEditingId(null);
    setEditContent("");
  };

  const handleDelete = async (commentId) => {
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (error) return console.error(error);
    setComments(comments.filter((c) => c.id !== commentId));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  if (loading || loadingComments) return <Loading />;

  return (
    <div className="bg-zinc-900 text-zinc-100 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto relative pb-32">
        <h2 className="text-2xl font-semibold mb-6 border-b border-zinc-700 pb-3">
          Comments
        </h2>

        {comments.length === 0 ? (
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-zinc-700/50">
              💬
            </div>
            <p className="text-lg font-medium">No comments yet</p>
            <p className="text-sm text-zinc-400 mt-2">
              Be the first to comment!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const isCommentOwner = user?.id === comment.forUser?.id;
              const isBlogOwner = user?.id === Blog?.Author;
              const isEditing = editingId === comment.id;
              const isMenuOpen = menuOpenId === comment.id;

              return (
                <div
                  key={comment.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 relative break-words"
                >
                  <div className="flex flex-wrap items-start gap-3 mb-2">
                    <img
                      src={
                        comment.forUser?.Avatar_url ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt="userImg"
                      className="w-9 h-9 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{comment.forUser?.full_name || "User"}</p>
                      <p className="text-xs text-zinc-400 truncate">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {(isCommentOwner || isBlogOwner) && (
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpenId(isMenuOpen ? null : comment.id)}
                          className="ml-auto px-1"
                        >
                          ⋮
                        </button>
                        {isMenuOpen && (
                          <div className="absolute right-0 top-6 bg-zinc-700 border border-zinc-600 rounded-md shadow-lg z-10 w-36 sm:w-40">
                            <ul className="flex flex-col text-sm">
                              {isCommentOwner && (
                                <>
                                  <li
                                    className="px-3 py-2 hover:bg-zinc-600 cursor-pointer"
                                    onClick={() => {
                                      setEditingId(comment.id);
                                      setEditContent(comment.content);
                                      setMenuOpenId(null);
                                    }}
                                  >
                                    Edit
                                  </li>
                                  <li
                                    className="px-3 py-2 hover:bg-zinc-600 cursor-pointer"
                                    onClick={() => {
                                      handleDelete(comment.id);
                                      setMenuOpenId(null);
                                    }}
                                  >
                                    Delete
                                  </li>
                                  <li
                                    className="px-3 py-2 hover:bg-zinc-600 cursor-pointer"
                                    onClick={() => {
                                      handleCopy(comment.content);
                                      setMenuOpenId(null);
                                    }}
                                  >
                                    Copy
                                  </li>
                                </>
                              )}
                              {!isCommentOwner && isBlogOwner && (
                                <li
                                  className="px-3 py-2 hover:bg-zinc-600 cursor-pointer"
                                  onClick={() => {
                                    handleDelete(comment.id);
                                    setMenuOpenId(null);
                                  }}
                                >
                                  Delete
                                </li>
                              )}
                              {!isCommentOwner && !isBlogOwner && (
                                <li
                                  className="px-3 py-2 hover:bg-zinc-600 cursor-pointer"
                                  onClick={() => {
                                    handleCopy(comment.content);
                                    setMenuOpenId(null);
                                  }}
                                >
                                  Copy
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        rows="2"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 rounded-lg bg-zinc-900 text-zinc-100 border border-zinc-700 focus:ring-2 focus:ring-cyan-400 break-words"
                      />
                      <div className="flex flex-wrap gap-2 mt-1">
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="px-3 py-1 bg-cyan-500 text-zinc-900 rounded hover:bg-cyan-400 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-zinc-700 text-zinc-200 rounded hover:bg-zinc-600 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-200 break-words">{comment.content}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Fixed Input */}
        <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex gap-3 items-end">
            <textarea
              placeholder="Write a comment..."
              rows="2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 resize-none p-3 rounded-lg bg-zinc-800 text-zinc-100 outline-none border border-zinc-700 focus:ring-2 focus:ring-cyan-400 break-words"
            />
            <div>
             
            </div>
            <button
              onClick={handleComment}
              className="bg-cyan-500 text-zinc-900 px-5 py-2 rounded-lg font-medium hover:bg-cyan-400 transition shrink-0"
            >
              {isUser? "Post":"Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comments;
