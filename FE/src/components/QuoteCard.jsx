import React, { useState } from 'react';
import { FiRefreshCw, FiHeart } from 'react-icons/fi';
import './QuoteCard.css';

const MOTIVATIONAL_QUOTES = [
  { text: "Small steps every day create big results.", author: "Anonymous" },
  { text: "Consistency beats intensity.", author: "Bruce Lee" },
  { text: "Progress is better than perfection.", author: "Sheryl Sandberg" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Dream big, start small, act now.", author: "Robin Sharma" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" }
];

const QuoteCard = () => {
  const [quoteIdx, setQuoteIdx] = useState(
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  );

  const rotateQuote = () => {
    let nextIdx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    while (nextIdx === quoteIdx) {
      nextIdx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    }
    setQuoteIdx(nextIdx);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIdx];

  return (
    <div className="glass-panel quote-card-container fade-in">
      <div className="quote-header">
        <FiHeart className="quote-heart-icon" />
        <span className="quote-label">Daily Spark</span>
      </div>
      
      <p className="quote-text">"{currentQuote.text}"</p>
      
      <div className="quote-footer">
        <span className="quote-author">— {currentQuote.author}</span>
        <button onClick={rotateQuote} className="quote-refresh-btn" aria-label="New Quote">
          <FiRefreshCw size={14} />
        </button>
      </div>
    </div>
  );
};

export default QuoteCard;
