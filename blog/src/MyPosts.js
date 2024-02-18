import React, { useState, useEffect } from 'react';
import axiosInstance from './axios';
import { Box, Grid, Paper, IconButton, Button } from '@mui/material'; // Importing Button
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Link,useNavigate } from 'react-router-dom'; 
import './BlogList.scss';
const MyPosts = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const bufferToBase64 = buffer => {
      return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    };

    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/MyBlog');

        if (response.data && response.data.blogs) {
          const blogsData = response.data.blogs.map(blog => {
            const imageData = blog.Image && blog.Image.type === 'Buffer' && Array.isArray(blog.Image.data)
              ? bufferToBase64(blog.Image.data)
              : null;

            return {
              ...blog,
              Image: imageData ? `data:image/jpeg;base64,${imageData}` : null
            };
          });

          setBlogs(blogsData);
        } else {
          console.error('Unexpected response structure. Blogs property not found.');
        }

      } catch (error) {
        console.error('Error fetching blogs:', error.message);
        console.error(error);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (blogId) => {
    try {
      console.log('Delete URL:', `/DeleteBlog`, 'Blog ID:', blogId);
      // Make a delete request to your API endpoint with the blogId in the request body
      await axiosInstance.post('/DeleteBlog',  { blog_id: blogId });

      // Update the state to remove the deleted blog
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.blog_id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error.message);
    }
  };

  const handleUpdate = async (blogId) => {
    // Implement your logic to navigate to the update page or show a modal for updating the blog
    // You can use react-router-dom for navigation
     navigate(`/UpdateBlog/${blogId}`);
  };
  const handleLikeClick = async (blogId) => {
    try {
      // Implement your like functionality here
      console.log('Liked post:', blogId);

      // Example: make a request to update the like count on the server
      await axiosInstance.post('/LikeCount', { blog_id: blogId });

      // Update the state to reflect the like
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.blog_id === blogId ? { ...blog, LikeCount: blog.LikeCount + 1, isLiked: true } : blog
        )
      );
    } catch (error) {
      console.error('Error liking blog:', error.message);
    }
  };

  return (
    <div className="blog-container">
      <h4>Blogs</h4>
      <Grid container spacing={3}>
        {blogs.map((blog, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper elevation={3} className="blog-item">
            <h6>{blog.title}</h6>
              <p>{blog.category}</p>
              {blog.Image && <img src={blog.Image} alt={`Blog ${index}`} className="blog-image" />}
              <div className="like-and-readmore">
                <div className="like-section">
                  <IconButton
                    color={blog.isLiked ? 'primary' : 'default'}
                    aria-label="like"
                    onClick={() => handleLikeClick(blog.blog_id)}
                  >
                    <ThumbUpAltIcon />
                  </IconButton>
                  <span>{blog.LikeCount}</span>
                </div>
                <div className="read-more-section">
                <Button
  component={Link}
  to={`/BlogDetails/${blog.blog_id}`}
  variant="contained"
  style={{ backgroundColor: '#FFA500', color: 'white' }} // Use hex code for orange
>
  Read More
</Button>
                </div>
              </div>
              <Button onClick={() => handleUpdate(blog.blog_id)} variant="contained" color="primary">
                Update
              </Button>
              <Button onClick={() => handleDelete(blog.blog_id)} variant="contained" color="error">
                Delete
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MyPosts;
