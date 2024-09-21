import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import '../styles/VideoPlayer.css';
import InstagramEmbed from './InstagramEmbed';

const VideoPlayer = ({ video, onClose }) => {
  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    if (url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&t=0&width=800&height=400`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(video.link);

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
        {video.link.includes('instagram.com') ? (
          <InstagramEmbed url={video.link} />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={video.title}
            className="video-frame"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="fallback-container">
            <div className="fallback-content">
              <AlertCircle size={48} className="fallback-icon" />
              <p>This video cannot be embedded.</p>
              <a href={video.link} target="_blank" rel="noopener noreferrer" className="fallback-link">
                Open video in new tab
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;