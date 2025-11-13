import React from 'react';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 
                    flex flex-col justify-between 
                    transition-all duration-300 
                    hover:shadow-xl hover:-translate-y-1">
      
      {/* 1. La description */}
      <blockquote className="text-zinc-600 italic mb-4">
        "{review.description}"
      </blockquote>

      {/* 2. La note  */}
      <div className="flex items-center">
        <span className="text-amber-500 font-bold text-lg">
          {review.note} / 5 
        </span>
        {/* On pourrait ajouter des icônes d'étoiles ici plus tard */}
      </div>
    </div>
  );
};

export default ReviewCard;