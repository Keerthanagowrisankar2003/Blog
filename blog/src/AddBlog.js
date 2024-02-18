import React, { useState } from 'react';
import axiosInstance from './axios';
import './AddBlog.scss';

const AddBlogForm = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageLink, setImageLink] = useState(''); // New state to store the image link

  const handleAddBlog = async () => {
    try {
      const formData = {
        Title: title,
        category: category,
        Description: description,
        ImageLink: imageLink, // Use the image link directly
      };

      await axiosInstance.post('/Blog', formData);

      // Clear the form after successful submission
      

      console.log('Blog added successfully');
    } catch (error) {
      console.error('Error adding Blog:', error.message);
    }
  };

  return (
    <div className="add-blog-container">
      <h2 className="add-blog-title">Add Blog</h2>
      <form className="add-blog-form">
        <label className="add-blog-label">Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="add-blog-input" />

        <label className="add-blog-label">Category:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="add-blog-input" />

        <label className="add-blog-label">Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="add-blog-textarea" />

        <label className="add-blog-label">Image Link:</label>
        <input type="text" value={imageLink} onChange={(e) => setImageLink(e.target.value)} className="add-blog-input" />

        <button type="button" onClick={handleAddBlog} className="add-blog-button">Add Blog</button>
      </form>
    </div>
  );
};

export default AddBlogForm;
