import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import '../styles/VideoPlayer.css';
import { 
  FacebookEmbed, 
  InstagramEmbed, 
  LinkedInEmbed,
  PinterestEmbed,
  TikTokEmbed,
  XEmbed,
  YouTubeEmbed
} from 'react-social-media-embed';

const VideoPlayer = ({ video, onClose }) => {
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 0.9);

  useEffect(() => {
    const handleResize = () => {
      setMaxHeight(window.innerHeight * 0.9);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderEmbed = () => {
    const url = video.link;
    const width = Math.min(800, window.innerWidth * 0.9);
    const height = Math.min(450, maxHeight - 60); // 60px for padding and close button

    const commonProps = {
      url,
      // width,
      style: { maxHeight: maxHeight - 20, overflow: 'auto' }
    };
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return <YouTubeEmbed {...commonProps} height={height} />;
    }
    if (url.includes('facebook.com')) {
      return <FacebookEmbed {...commonProps} />;
    }
    if (url.includes('instagram.com')) {
      return <InstagramEmbed {...commonProps} />;
    }
    if (url.includes('linkedin.com')) {
      return <LinkedInEmbed {...commonProps} height={height} />;
    }
    if (url.includes('pinterest.com')) {
      return <PinterestEmbed {...commonProps} height={height} />;
    }
    if (url.includes('tiktok.com')) {
      return <TikTokEmbed {...commonProps} />;
    }
    if (url.includes('twitter.com') || url.includes('x.com')) {
      return <XEmbed {...commonProps} />;
    }
    
    // Fallback for unsupported platforms
    return (
      <div className="fallback-container" style={{ maxHeight: height, overflow: 'auto' }}>
        <div className="fallback-content">
          <AlertCircle size={48} className="fallback-icon" />
          <p>This video cannot be embedded.</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="fallback-link">
            Open video in new tab
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="video-player-overlay">
      <div className="video-container" style={{ maxHeight }}>
        <button
          onClick={onClose}
          className="close-button"
          aria-label="Close video"
        >
          <X size={24} />
        </button>
        {renderEmbed()}
      </div>
    </div>
  );
};

export default VideoPlayer;