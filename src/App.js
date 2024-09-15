import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VideoLibrary from './components/VideoLibrary';
import VideoPlayer from './components/VideoPlayer';
import AddEditVideo from './components/AddEditVideo';
import { Menu } from 'lucide-react';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="hamburger-menu">
      <button onClick={() => setIsOpen(!isOpen)} className="menu-button">
        <Menu size={24} />
      </button>
      {isOpen && (
        <div className="menu-dropdown">
          <Link to="/add-video" onClick={() => setIsOpen(false)}>Add New Video</Link>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/.netlify/functions/getVideos');
      const data = await response.json();
      
      setVideos(data);

      // Categorize videos
      const categorizedVideos = data.reduce((acc, video) => {
        const category = video.category || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(video);
        return acc;
      }, {});
      setCategories(categorizedVideos);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleVideoClose = () => {
    setSelectedVideo(null);
  };

  const handleVideoSave = () => {
    fetchVideos(); // Refresh the video list after saving
  };

  return (
    <Router>
      <div className="app">
        <header>
          <h1>DIY Videos</h1>
          <HamburgerMenu />
        </header>
        <Routes>
          <Route path="/" element={
            <>
              {selectedVideo ? (
                <VideoPlayer video={selectedVideo} onClose={handleVideoClose} />
              ) : (
                <VideoLibrary categories={categories} onVideoClick={handleVideoClick} />
              )}
            </>
          } />
          <Route path="/add-video" element={<AddEditVideo videos={videos} onSave={handleVideoSave} />} />
          <Route path="/edit-video/:id" element={<AddEditVideo videos={videos} onSave={handleVideoSave} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;