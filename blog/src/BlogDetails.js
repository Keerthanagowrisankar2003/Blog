import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from './axios';
import { Paper, IconButton, TextField, Button } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import './BlogDetails.scss';

const BlogDetails = () => {
  const { blog_id } = useParams();
  const [blog, setBlog] = useState(null);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedback, setFeedback] = useState({
    name: '',
    comment: '',
  });

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        console.log(blog_id);
        const response = await axiosInstance.post('/FullBlog', { blog_id });

        if (response.data && response.data.blogs) {
          setBlog(response.data.blogs[0]);
        } else {
          console.error('Unexpected response structure. Blogs property not found.');
        }
      } catch (error) {
        toast.error('Please Login to see the posts', {
          theme: 'colored',
          position: 'top-center',
          autoClose: false,
          limit: 3,
          hideProgressBar: false,
          newestOnTop: false,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
          theme: 'light',
        });

        console.error('Error fetching blogs:', error.message);
      }
    };

    const fetchSimilarPosts = async () => {
      try {
        console.log('blog_id', blog_id);
        const response = await axiosInstance.post('/BlogUser', { blog_id });

        if (response.data && response.data.blogs) {
          setSimilarPosts(response.data.blogs);
        } else {
          console.error('Unexpected response structure. Blogs property not found.');
        }
      } catch (error) {
        console.error('Error fetching similar posts:', error.message);
      }
    };
    const fetchFeedback = async () => {
      try {
        const response = await axiosInstance.post('/GetFeedback', { blog_id });
        console.log('Feedback response:', response.data);

        if (response.data && response.data.feedback) {
          setFeedbackList(response.data.feedback); // Update this line
        } else {
          console.error('Unexpected response structure. Feedback property not found.');
        }
      } catch (error) {
        console.error('Error fetching feedback:', error.message);
      }
    };

    fetchBlogDetails();
    fetchSimilarPosts();
    fetchFeedback(); // Fetch feedback when the component mounts or when blog_id changes
  }, [blog_id]);

  const handleLikeClick = async (postId) => {
    // Implement your like functionality here
    console.log('Liked post:', postId);
  };

  const handleFeedbackChange = (event) => {
    const { name, value } = event.target;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
  };

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = {
        blog_id: blog_id,
        Name: feedback.name, // Use feedback.name instead of name
        feedback: feedback.comment, // Use feedback.comment instead of feedback
      };

      console.log('Feedback submitted:', formData);

      // Send the feedback data to the server
      const response = await axiosInstance.post('/Feedback', formData);

      // You might want to check the response here and handle accordingly
      console.log('Server response:', response);

      // Reset the feedback form after submission
      setFeedback({
        name: '',
        comment: '',
      });

      // Optionally, display a success message to the user
      toast.success('Feedback submitted successfully!', {
        theme: 'colored',
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: 'light',
      });
    } catch (error) {
      console.error('Error submitting feedback:', error.message);
      // Handle error, display error message to the user, etc.
      toast.error('Error submitting feedback. Please try again later.', {
        theme: 'colored',
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: 'light',
      });
    }
  };

  if (!blog) {
    return <div>Loading...</div>; // Add a loading state or component if needed
  }

  return (
    <div className="main-page-container">
      <div className="blog-details-container">
        <h2>{blog.title}</h2>
        <p>{blog.category}</p>
        <p>{blog.description}</p>
        {blog.Image && <img src={blog.Image} alt={`Blog`} className="blog-details-image" />}
        {/* Display feedback */}
        {feedbackList.length > 0 ? (
          feedbackList.map((feedbackItem) => (
            <div key={feedbackItem.id}>
              <p>Name: {feedbackItem.name || 'Anonymous'}</p>
              <p>Comment: {feedbackItem.feedback}</p>
            </div>
          ))
        ) : (
          <p>No feedback available for this post.</p>
        )}

        {/* Feedback Form */}
        <form onSubmit={handleFeedbackSubmit}>
          <TextField
            name="name"
            label="Your Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={feedback.name}
            onChange={handleFeedbackChange}
          />
          <TextField
            name="comment"
            label="Your Feedback"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={feedback.comment}
            onChange={handleFeedbackChange}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit Feedback
          </Button>
        </form>
      </div>

      {/* Display similar posts outside the main container */}
      <div className="similar-posts-container">
        <h3>Similar Posts</h3>
        {similarPosts.map((post) => (
          <Paper elevation={3} className="blog-item" key={post.blog_id}>
            <h6>{post.title}</h6>
            <p>{post.category}</p>
            {post.Image && <img src={post.Image} alt={`Blog ${post.blog_id}`} className="blog-image" />}
            <IconButton
              color={post.isLiked ? 'primary' : 'default'}
              aria-label="like"
              onClick={() => handleLikeClick(post.blog_id)}
            >
              <ThumbUpAltIcon />
            </IconButton>
            <span>{post.LikeCount}</span>
            <Button
  component={Link}
  to={`/BlogDetails/${blog.blog_id}`}
  variant="contained"
  style={{ backgroundColor: '#FFA500', color: 'white' }} // Use hex code for orange
>
  Read More
</Button>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default BlogDetails;
