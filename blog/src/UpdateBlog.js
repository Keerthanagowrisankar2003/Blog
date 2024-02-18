import React, { useState, useEffect } from 'react';
import axiosInstance from './axios';
import { TextField, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import './BlogList.scss';

const UpdateBlog = () => {
  const { blog_id } = useParams();
  const [blog, setBlog] = useState({});
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedImageLink, setUpdatedImageLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axiosInstance.put('/UpdateBlog');

        if (response.data && response.data.blogs && response.data.blogs.length > 0) {
          const fetchedBlog = response.data.blogs[0];
          setBlog(fetchedBlog);
          setUpdatedTitle(fetchedBlog.title);
          setUpdatedCategory(fetchedBlog.category);
          setUpdatedDescription(fetchedBlog.description);
          setUpdatedImageLink(fetchedBlog.imageLink);
        } else {
          console.error('Unexpected response structure. Blogs property not found.');
        }
      } catch (error) {
        console.error('Error fetching blog details:', error.message);
      }
    };

    fetchBlogDetails();
  }, [blog_id]);

  const handleTitleChange = (event) => {
    setUpdatedTitle(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setUpdatedCategory(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setUpdatedDescription(event.target.value);
  };

  const handleImageLinkChange = (event) => {
    setUpdatedImageLink(event.target.value);
  };

  const handleUpdate = async () => {
    try {
      const formData = {
        updatedTitle,
        updatedCategory,
        updatedDescription,
        updatedImageLink,
      };

      await axiosInstance.put('/UpdateBlog', { blog_id: blog.blog_id, ...formData });

      navigate('/MyPosts'); // Redirect to the MyPosts page after updating
    } catch (error) {
      console.error('Error updating blog:', error.message);
    }
  };

  return (
    <div>
      <h2>Update Blog</h2>
      <TextField
        label="Updated Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={updatedTitle}
        onChange={handleTitleChange}
      />
      <TextField
        label="Updated Category"
        variant="outlined"
        fullWidth
        margin="normal"
        value={updatedCategory}
        onChange={handleCategoryChange}
      />
      <TextField
        label="Updated Description"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        margin="normal"
        value={updatedDescription}
        onChange={handleDescriptionChange}
      />
      <TextField
        label="Updated Image Link"
        variant="outlined"
        fullWidth
        margin="normal"
        value={updatedImageLink}
        onChange={handleImageLinkChange}
      />
      <Button variant="contained" color="primary" onClick={handleUpdate}>
        Update Blog
      </Button>
    </div>
  );
};

export default UpdateBlog;
