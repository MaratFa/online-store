import React from 'react';

interface RatingStarsProps {
  rating: number;
  reviews: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, reviews }) => {
  return (
    <div className="product-rating">
      <div className="stars">
        {[...Array(Math.floor(rating))].map((_, i) => (
          <i key={i} className="fas fa-star"></i>
        ))}
        {rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
      </div>
      <span className="rating-value">({reviews})</span>
    </div>
  );
};
