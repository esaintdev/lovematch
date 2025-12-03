import React from 'react';

const LoveResult = ({ percentage, message, isLoading }) => (
  <div className={`result ${isLoading ? 'loading' : ''}`}>
    <div className={`heart ${isLoading ? 'beating' : ''}`}>❤️</div>
    <div className="percentage">
      {isLoading ? '...' : `${percentage}%`}
    </div>
    <div className="message">
      {isLoading ? 'Consulting the love gods...' : message}
    </div>
  </div>
);

export default LoveResult;
