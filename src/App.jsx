import React from 'react'
import Home from './assets/pages/Home'
import Navbar from './assets/components/Navbar'
import { Routes, Route } from "react-router-dom";
import Blogs from './assets/pages/Blogs';
import CreateBlog from './assets/pages/CreateBlog';
import BlogExplore from './assets/pages/BlogExplore';
import NotFound from './assets/pages/NotFound';
import SignUp from './assets/pages/SignUp';
import SignIn from './assets/pages/SignIn';
import ProtectedPage from './assets/components/ProtectedPage';
import UnAuth from './assets/components/UnAuth';
import Profile from './assets/pages/Profile';


function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="blogs" element={<Blogs/>}/> 
        <Route path="blogs/:id" element={<BlogExplore/>}/>
        <Route path="*" element={<NotFound/>}/>

        {/* unathounticated pages */}

        <Route path="/signIn" element={
          <UnAuth><SignIn/></UnAuth>
        }/>
        <Route path="/signUp" element={
          <UnAuth><SignUp/></UnAuth>
        }/>

        {/* authenticated and protected routes */}
        <Route path="createblog" element={
          <ProtectedPage>
            <CreateBlog/>
          </ProtectedPage>}/>
        <Route path="blogs/:id/:updating" element={
          <ProtectedPage>
            <CreateBlog/>
          </ProtectedPage>
          }/>
          <Route path="profile" element={
            <ProtectedPage>
            <Profile/>
          </ProtectedPage>
          }
            />
          

      </Routes>
      
    </div>
  )
}

export default App