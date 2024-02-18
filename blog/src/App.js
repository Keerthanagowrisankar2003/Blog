import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './Navbar.js';
import Login from './Login.js';
import Signup from './Signup.js';
import MainContent from './BlogList.js';
import BlogList from './BlogList.js';
import AddBlogForm from './AddBlog.js';
import MyPosts from './MyPosts.js';
import BlogDetails from './BlogDetails.js';
import UpdateBlog from './UpdateBlog.js';




// Create a new component for the page for displayig all the blogs
const Home = () => {
  return (
    <div>
      <BlogList />
    
    </div>
  );
};

function App() {
  return (
    <Router>
      <div>
        <ToastContainer
          position="top-center"
          autoClose={500}
          limit={3}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/AddBlog" element={<AddBlogForm />} />
          <Route path="/MyBlogs" element={<MyPosts />} />
          <Route path="/BlogDetails/:blog_id" element={<BlogDetails />} />
          <Route path="/UpdateBlog/:blogId" element={<UpdateBlog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;