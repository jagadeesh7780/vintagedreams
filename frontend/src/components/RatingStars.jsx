import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RatingStars = ({ rating = 0, count, size = 14 }) => {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2;

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(<FaStar key={i} size={size} className="text-amber-400 fill-current" />);
    } else if (i - 0.5 === roundedRating) {
      stars.push(<FaStarHalfAlt key={i} size={size} className="text-amber-400 fill-current" />);
    } else {
      stars.push(<FaRegStar key={i} size={size} className="text-gray-300" />);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">{stars}</div>
      {count !== undefined && (
        <span className="text-xs text-gray-500 font-medium">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
