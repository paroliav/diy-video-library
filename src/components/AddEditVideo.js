import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AddEditVideo = ({ videos, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    link: '',
    rating: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && videos) {
      const video = videos.find(v => v.id === parseInt(id));
      if (video) setFormData(video);
    }
  }, [id, videos]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : parseInt(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const dataToSend = { ...formData };
    if (id) dataToSend.id = id;

    // Log the data being sent
    console.log('Data being sent:', dataToSend);

    try {
      const response = await fetch('/.netlify/functions/saveVideo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save video');
      }

      const result = await response.json();
      console.log('Save successful:', result);
      onSave();
      navigate('/');
    } catch (error) {
      console.error('Error saving video:', error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
      <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
      <input name="link" value={formData.link} onChange={handleChange} placeholder="Video Link" />
      <input name="rating" type="number" min="0" max="5" value={formData.rating || ''} onChange={handleChange} placeholder="Rating" />
      <input name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="Thumbnail Link" />
      <button type="submit">Save</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
    </form>
  );
};

export default AddEditVideo;