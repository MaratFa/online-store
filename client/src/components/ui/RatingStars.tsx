import React from 'react';

interface RatingStarsProps {
  rating: number;
  reviews: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, reviews }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
  }

  // Add empty stars for the remaining rating
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
  }

  return (
    <div className="product-rating">
      <div className="stars">
        {stars}
      </div>
      <span className="rating-value">({reviews})</span>
    </div>
  );
};
