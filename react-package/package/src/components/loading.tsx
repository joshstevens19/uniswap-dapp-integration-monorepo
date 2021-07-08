import React from 'react';

const Loading = (): JSX.Element => (
  <div className="uni-ic__loading">
    <svg
      className="uni-ic__loading__svg-container"
      height="100"
      width="100"
      viewBox="0 0 100 100"
    >
      <circle
        className="uni-ic__loading__svg bg"
        cx="50"
        cy="50"
        r="45"
      ></circle>
      <circle
        className="uni-ic__loading__svg animate"
        cx="50"
        cy="50"
        r="45"
      ></circle>
    </svg>
  </div>
);

export default Loading;
