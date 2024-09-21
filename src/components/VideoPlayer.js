import React from 'react';
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
  const renderEmbed = () => {
    const url = video.link;
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return <YouTubeEmbed url={url} width={800} height={450} />;
    }
    if (url.includes('facebook.com')) {
      return <FacebookEmbed url={url} width={800} />;
    }
    if (url.includes('instagram.com')) {
      return <InstagramEmbed url={url} width={800} />;
    }
    if (url.includes('linkedin.com')) {
      return <LinkedInEmbed url={url} width={800} height={570} />;
    }
    if (url.includes('pinterest.com')) {
      return <PinterestEmbed url={url} width={800} height={600} />;
    }
    if (url.includes('tiktok.com')) {
      return <TikTokEmbed url={url} width={800} />;
    }
    if (url.includes('twitter.com') || url.includes('x.com')) {
      return <XEmbed url={url} width={800} />;
    }
    
    // Fallback for unsupported platforms
    return (
      <div className="fallback-container">
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
      <div className="video-container">
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