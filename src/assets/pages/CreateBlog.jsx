import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabse/supabase.client";
import useAuth from "../components/UseAuth";
import Loading from "../components/Loading";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogLoading, setBlogLoading] = useState(false);
  const navigate = useNavigate();

  const {user,loading} = useAuth();
  // updating blog
  const prams = useParams();
  const {id} = prams;
  console.log(id || "not updating");
  const UpdatingSubmit = async (e) => {
    e.preventDefault();
    setBlogLoading(true)
    try {
      const {data:updateBlog,error} = await supabase.from("Blog")
      .update({title,content,Author:user.id})
      .eq("id",id)
      if(error){
        console.error(error);
        return
        
      }
      console.log("edited and updated the blog");
      console.log("updateBlog",updateBlog);
      
      
      
    } catch (error) {
      console.error(error);
      
      
    }finally{
      setBlogLoading(false)
    }
    
    

    // For now, just log the blog to console
    console.log( title, content );

    // Reset form
    setTitle("");
    setContent("");

    // Navigate to blogs page (you can change this later)
    navigate("/blogs/"+id,{replace:true});
  };

    
  
  // getting the old content before update
  
  useEffect(()=>{
    if(!id) return
    const fetchOldBlog = async()=>{
      setBlogLoading(true)
    try {
      const {data,error} = await supabase.from("Blog")
    .select("*")
    .eq("id",id)
    .single();
    if(error){
      console.error(error);
      return;
      
    }
    console.log(data);
    setTitle(data.title || "")
    setContent(data.content || "")
    
      
    } catch (error) {
      console.error(error);
      
      
    }
    finally{
      setBlogLoading(false)
    }
  }

    fetchOldBlog()
  },[id])

  
  
  
  // writing new blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBlogLoading(true)
    
    try {
      const {error} = await supabase.from("Blog").insert({title,content,Author:user.id})
      if(error){
        console.error(error);
        return
        
      }
      console.log("added new blog");
      
      
    } catch (error) {
      console.error(error);
      
      
    }finally{
      setBlogLoading(false)
    }
    
    

    // For now, just log the blog to console
    console.log( title, content );

    // Reset form
    setTitle("");
    setContent("");

    // Navigate to blogs page (you can change this later)
    navigate("/blogs");
  };
  
  if(loading) return <Loading/>
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 px-6 py-16 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {!id? "Create a New Blog":" Updating The Blog"}
        </h1>

        <form onSubmit={!id? handleSubmit:UpdatingSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-zinc-300 mb-2 font-medium">
              Blog Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="w-full p-3 rounded-lg bg-zinc-800 text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-400 transition"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-zinc-300 mb-2 font-medium">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
              placeholder="Write your blog..."
              className="w-full p-3 rounded-lg bg-zinc-800 text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-400 transition"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          {!id? <button
            type="submit"
            className="w-full bg-cyan-500 text-zinc-900 px-6 py-3 rounded-lg font-medium hover:bg-cyan-400 transition"
          >
            {blogLoading? "Publishing....":"Publish Blog"}
          </button>:
          <button
            type="submit"
            className="w-full bg-red-400 text-zinc-900 px-6 py-3 rounded-lg font-medium hover:bg-cyan-400 transition"
          >
            {blogLoading? "updating....":"Update The Blog"}
          </button>}
        </form>
      </div>
    </div>
  );
}


export default CreateBlog