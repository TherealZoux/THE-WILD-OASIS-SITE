'use client'
import { useState } from 'react';

function TextExpander({ children }) {
  const [isExpanded, setIsExpanded] = useState(() => children.length <= 30);
  const displayText = isExpanded
    ? children
    : children.split(' ').slice(0, 30).join(' ') + '...';

  return (
    <span>
      {displayText}{' '}
      {
        children.length > 30 && (
          <button
            className="text-primary-700 border-b border-primary-700 leading-3 pb-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )
      }    </span >
  );
}

export default TextExpander;
