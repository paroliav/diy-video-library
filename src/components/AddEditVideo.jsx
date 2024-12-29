// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// const AddEditVideo = ({ videos, onSave }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     category: '',
//     link: '',
//     rating: '',
//   });
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (id && videos) {
//       const video = videos.find(v => v.id === parseInt(id));
//       if (video) setFormData(video);
//     }
//   }, [id, videos]);

//   const handleChange = (e) => {
//     const { name, value, type } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'number' ? (value === '' ? null : parseInt(value)) : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     const dataToSend = { ...formData };
//     if (id) dataToSend.id = id;

//     // Log the data being sent
//     console.log('Data being sent:', dataToSend);

//     try {
//       const response = await fetch('/.netlify/functions/saveVideo', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dataToSend),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to save video');
//       }

//       const result = await response.json();
//       console.log('Save successful:', result);
//       onSave();
//       navigate('/');
//     } catch (error) {
//       console.error('Error saving video:', error);
//       setError(error.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
//       <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
//       <input name="link" value={formData.link} onChange={handleChange} placeholder="Video Link" />
//       <input name="rating" type="number" min="0" max="5" value={formData.rating || ''} onChange={handleChange} placeholder="Rating" />
//       <input name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="Thumbnail Link" />
//       <button type="submit">Save</button>
//       {error && <div style={{color: 'red'}}>{error}</div>}
//     </form>
//   );
// };

// export default AddEditVideo;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../AdminForm.css';

const AddEditVideo = ({ videos, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    link: '',
    rating: '',
    thumbnail: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/.netlify/functions/getCategories');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

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

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    if (value === 'add-new') {
      setIsAddingCategory(true);
    } else {
      setFormData(prev => ({ ...prev, category: value }));
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const response = await fetch('/.netlify/functions/addCategory', {
        method: 'POST',
        body: JSON.stringify({ name: newCategory })
      });
      
      if (!response.ok) throw new Error('Failed to add category');
      
      setCategories(prev => [...prev, newCategory]);
      setFormData(prev => ({ ...prev, category: newCategory }));
      setIsAddingCategory(false);
      setNewCategory('');
    } catch (err) {
      setError('Failed to add new category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/.netlify/functions/saveVideo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save video');
      }

      setSuccess(true);
      onSave();
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">{id ? 'Edit Video' : 'Add New Video'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter video title"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          {isAddingCategory ? (
            <div className="category-input-group">
              <input
                className="form-input"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category"
              />
              <button
                type="button"
                className="button"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>
          ) : (
            <select
              className="form-select"
              value={formData.category}
              onChange={handleCategorySelect}
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="add-new">+ Add New Category</option>
            </select>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Video Link</label>
          <input
            className="form-input"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Enter video URL"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Rating</label>
          <input
            className="form-input"
            name="rating"
            type="number"
            min="0"
            max="5"
            value={formData.rating || ''}
            onChange={handleChange}
            placeholder="Rate from 0-5"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Thumbnail URL</label>
          <input
            className="form-input"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="Enter thumbnail URL"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Video saved successfully!</div>}

        <div className="button-group">
          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate('/')}
          >
            Back
          </button>
          <button
            type="submit"
            className="button flex-grow"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Video'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditVideo;