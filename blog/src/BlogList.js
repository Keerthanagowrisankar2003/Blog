import React, { useEffect, useState } from 'react';
import axiosInstance from './axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Grid, Paper, IconButton, Button } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Link } from 'react-router-dom';
import './BlogList.scss';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/AllBlog');

        if (response.data && response.data.blogs) {
          setBlogs(response.data.blogs);
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

  const handleLikeClick = async (blogId) => {
    try {
      // Make a request to update the like count on the server
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
      <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1} autoplay autoplaySpeed={1000}>
        {blogs.map((blog, index) => (
          <div key={index}>
            {blog.Image && <img src={blog.Image} alt={`Blog ${index}`} className="carousel-image" />}
            <p className="carousel-title">{blog.title}</p>
          </div>
        ))}
      </Slider>
      <h4>Images</h4>
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
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default BlogList;
