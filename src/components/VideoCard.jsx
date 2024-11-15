import React from 'react';
import { Star } from 'lucide-react';
import '../styles/VideoCard.css';

const VideoCard = ({ video, onClick }) => {
  const getVideoThumbnail = (url, thumbnail) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1] || url.split('/').pop();
      return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://vumbnail.com/${videoId}.jpg`;
    }
    if (url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${url}&show_text=false&appId`;
    }
    if (url.includes('instagram.com')) {
      return thumbnail;
    }
    return 'https://placehold.co/300x600';
  };

  const thumbnail = getVideoThumbnail(video.link, video.thumbnail);

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg" onClick={onClick}>
      {
      thumbnail.includes('facebook.com') ? (
        <iframe
          src={thumbnail}
          title={`Video: ${thumbnail}`}
          className="w-full h-full object-cover"
          style={{ border: 'none', overflow: 'hidden' }}
          width="200"
          height="300"
          allowFullScreen={true}
        />
      ) : (
        <img src={thumbnail} alt={video.title} className="w-full h-full object-cover" width="200" height="300" />
      )
      }
      <div className="video-info">
        <p className="video-title">{video.title}</p>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < video.rating ? 'currentColor' : 'none'}
              className={i < video.rating ? 'text-yellow-400' : 'text-gray-300'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;