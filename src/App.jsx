import React from 'react'
import Home from './assets/pages/Home'
import Navbar from './assets/components/Navbar'
import { Routes, Route } from "react-router-dom";
import Blogs from './assets/pages/Blogs';
import CreateBlog from './assets/pages/CreateBlog';
import BlogExplore from './assets/pages/BlogExplore';
import NotFound from './assets/pages/NotFound';


function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="blogs" element={<Blogs/>}/>
        <Route path="createblog" element={<CreateBlog/>}/>
        <Route path="blogs/:id" element={<BlogExplore/>}/>
        <Route path="blogs/:id/:updating" element={<CreateBlog/>}/>
        <Route path="*" element={<NotFound/>}/>

      </Routes>
      
    </div>
  )
}

export default App