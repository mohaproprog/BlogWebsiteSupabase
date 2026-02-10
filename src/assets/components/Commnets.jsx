import React, { useEffect, useState } from "react";
import useAuth from "./UseAuth";
import { supabase } from "../../supabse/supabase.client";
import Loading from "./Loading";

function Comments({ Blog }) {
  const { user, loading } = useAuth();
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [content, setContent] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null); // tracks which 3-dot menu is open
  const [editingId, setEditingId] = useState(null); // tracks which comment is being edited
  const [editContent, setEditContent] = useState(""); // content for editing

  // Fetch comments
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
  }, [Blog]);

  // Post new comment
  const handleComment = async () => {
    if (!user || !Blog || !content) return;
    const { data: newComment, error } = await supabase
      .from("comments")
      .insert({ content, forUser: user.id, forBlog: Blog.id })
      .select()
      .single();
    if (error) return console.error(error);
    setComments([newComment, ...comments]);
    setContent("");
  };

  // Save edited comment
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

  // Delete comment
  const handleDelete = async (commentId) => {
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (error) return console.error(error);
    setComments(comments.filter((c) => c.id !== commentId));
  };

  // Copy comment
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  if (loading || loadingComments) return <Loading />;

  return (
    <div className="bg-zinc-900 text-zinc-100 px-6">
      <div className="max-w-4xl mx-auto relative pb-32">
        <h2 className="text-2xl font-semibold mb-6 border-b border-zinc-700 pb-3">
          Comments
        </h2>

        {comments.length === 0 ? (
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-10 text-center">
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
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 relative"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={
                        comment.forUser?.Avatar_url ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt="userImg"
                      className="w-9 h-9 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium">{comment.forUser?.full_name || "User"}</p>
                      <p className="text-xs text-zinc-400">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* 3-dot menu */}
                    {(isCommentOwner || isBlogOwner || !isCommentOwner) && (
                      <div className="ml-auto relative">
                        <button
                          onClick={() =>
                            setMenuOpenId(isMenuOpen ? null : comment.id)
                          }
                        >
                          ⋮
                        </button>
                        {isMenuOpen && (
                          <div className="absolute right-0 top-6 bg-zinc-700 border border-zinc-600 rounded-md shadow-lg z-10 w-32">
                            <ul className="flex flex-col text-sm">
                              {isCommentOwner && (
                                <>
                                  <li
                                    className="px-3 py-2 hover:bg-zinc-600 cursor-pointer"
                                    onClick={() => {
                                      setEditingId(comment.id);
                                      setEditContent(comment.content); // Only populate textarea on edit click
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

                  {/* Content */}
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        rows="2"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 rounded-lg bg-zinc-900 text-zinc-100 border border-zinc-700 focus:ring-2 focus:ring-cyan-400"
                      />
                      <div className="flex gap-2">
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
                    <p className="text-zinc-200">{comment.content}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Fixed input */}
        <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex gap-3 items-end">
              <textarea
                placeholder="Write a comment..."
                rows="2"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 resize-none p-3 rounded-lg bg-zinc-800 text-zinc-100 outline-none border border-zinc-700 focus:ring-2 focus:ring-cyan-400 transition"
              />
              <button
                onClick={handleComment}
                className="bg-cyan-500 text-zinc-900 px-5 py-2 rounded-lg font-medium hover:bg-cyan-400 transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comments;
