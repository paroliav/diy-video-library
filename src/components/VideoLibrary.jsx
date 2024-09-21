import React from 'react';
import VideoCard from './VideoCard'; // Import the video card component
import '../styles/VideoLibrary.css'; // Import the CSS for the video library

const VideoLibrary = ({ categories, onVideoClick }) => {
    return (
      <div className="video-library">
        {Object.keys(categories).map((category) => (
          <div key={category} className="category-section">
            <h2>{category}</h2>
            <div className="video-row" style="overflow-x: auto;">
              {categories[category].map((video) => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onClick={() => onVideoClick(video)} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default VideoLibrary;
