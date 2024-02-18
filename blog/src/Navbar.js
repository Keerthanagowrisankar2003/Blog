import React, { useState, useEffect } from 'react';
import axiosInstance from './axios';
import './Navbar.scss';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Grid, Paper } from '@mui/material';

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/AllBlog', {
          params: {
            searchQuery: searchTerm, // Include the search term in the request
          },
        });

        if (response.data && response.data.blogs) {
           const uniqueCategories = [...new Set(response.data.blogs.map(blog => blog.category))];
          setCategories(uniqueCategories);
          // setBlogs(response.data.blogs); // Update blogs with the fetched data
        } else {
          console.error('Unexpected response structure. Blogs property not found.');
        }
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };

    fetchCategories();
  }, [searchTerm]);

  const handleCategoryClick = async (category) => {
    try {
      const response = await axiosInstance.post('/BlogCategory', { category, searchTerm });

      if (response.data && response.data.blogs) {
       
        setBlogs(prevBlogs => [...prevBlogs, ...response.data.blogs]);

      } else {
        console.error('Unexpected response structure. Blogs property not found.');
      }
    } catch (error) {
      console.error('Error fetching blogs for category:', error.message);
    }
  };

  const handleSearchChange = async () => {
    const query = {
      searchQuery: searchTerm,
    };
    console.log(query);
  
    try {
      const response = await axiosInstance.post('/SearchBlog', query);
      console.log('Search API Response:', response);
  
      if (response.status === 200) {
        const responseData = response.data;
  
        console.log('Response Data:', responseData);
  
        // Update the state with the new blogs array
        setBlogs(responseData);
      } else {
        console.error('Invalid response status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error.message);
      console.error(error);
    };
  };
  


      // If you want to navigate to a different page displaying the blogs, you can use navigate
  //     //navigate(`/BlogCategories/${category}`);
  //   } catch (error) {
  //     console.error('Error fetching blogs for category:', error.message);
  //   }
  // };

  return (
    <>
    <nav className="navbar">
      <div className="title">WeBlog</div>
      <div className="search">
      <input
  type="text"
  placeholder="Search"
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    handleSearchChange(); // Invoke handleSearchChange on each change
  }}
/>

      </div>
      <ul className="links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/AddBlog">Write</Link>
        </li>
        <li>
          <Link to="/MyBlogs">MyPost</Link>
        </li>
        <li className="dropdown">
        <Link to="/Categories"> <span>Categories</span></Link>
          <ul className="dropdown-content">
            {categories.map((category, index) => (
              <li key={index}>
                {/* Pass the category directly as a prop */}
                <button onClick={() => handleCategoryClick(category)}>{category}</button>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <Link to="/Login">Login</Link>
        </li>
      </ul>
    </nav>
    <div className="blog-container">
      {/* <h4>Blogs</h4> */}
      <Grid container spacing={3}>
      {blogs && blogs.map((blog, index) => (
  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
    <Paper elevation={3} className="blog-item">
      <h6>{blog.Title}</h6>
      <p>{blog.category}</p>
      <p>{blog.Description}</p>
      {blog.Image && <img src={blog.Image} alt={`Blog ${index}`} className="blog-image" />}
      <p>Like Count: {blog.LikeCount}</p>
    </Paper>
  </Grid>
))}
      </Grid>
    </div>
    </>
  );
};

export default Navbar;
