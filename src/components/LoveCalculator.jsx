import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FaHeart } from 'react-icons/fa';
import LoveForm from './LoveForm.jsx';
import './styles/LoveCalculator.css';

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const calculateLove = (name1, name2) => {
  const combined = (name1 + name2).toLowerCase();
  let hash = 0;

  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash = hash & hash;
  }

  // Generate base percentage (0-100)
  const basePercentage = Math.abs(hash) % 100;

  // Apply a bias toward higher percentages
  // This formula shifts the distribution to favor 50-100 range
  // while still maintaining deterministic results for same name pairs
  const biasedPercentage = Math.floor(50 + (basePercentage / 2));

  return Math.min(100, Math.max(50, biasedPercentage));
};

const LoveCalculator = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loveMessages, setLoveMessages] = useState({
    perfect: [],
    high: [],
    medium: [],
    low: []
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*');

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      // Group messages by category
      const grouped = {
        perfect: [],
        high: [],
        medium: [],
        low: []
      };

      data.forEach(msg => {
        if (grouped[msg.category]) {
          grouped[msg.category].push(msg.text);
        }
      });

      setLoveMessages(grouped);
    }
  };

  const getLoveMessage = (percentage) => {
    const fallback = "Love is in the air! ❤️";

    if (percentage >= 90 && loveMessages.perfect.length > 0) return getRandomElement(loveMessages.perfect);
    if (percentage >= 70 && loveMessages.high.length > 0) return getRandomElement(loveMessages.high);
    if (percentage >= 50 && loveMessages.medium.length > 0) return getRandomElement(loveMessages.medium);
    if (loveMessages.low.length > 0) return getRandomElement(loveMessages.low);

    return fallback;
  };

  const handleCalculate = async ({ name1, name2 }) => {
    setIsLoading(true);

    // Calculate locally first (or we could move this logic to a Supabase Edge Function later)
    const percentage = calculateLove(name1, name2);
    const message = getLoveMessage(percentage);

    try {
      // Save to Supabase
      const { error } = await supabase
        .from('matches')
        .insert([
          { name1, name2, percentage, message }
        ]);

      if (error) throw error;

      setResult({ percentage, message });
    } catch (error) {
      console.error('Error saving match:', error);
      // Still show result even if save fails, but maybe alert user?
      // For now, we just show the result so the user experience isn't broken
      setResult({ percentage, message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="love-calculator">
      <h1><FaHeart className="title-heart" /> Love Match Calculator <FaHeart className="title-heart" /></h1>
      <div className="calculator-container">
        <div className="calculator-form">
          <LoveForm onCalculate={handleCalculate} />
        </div>
        <div className="calculator-result">
          <div className="result">
            {result || isLoading ? (
              <>
                <div className={`heart ${isLoading ? 'beating' : ''}`}><FaHeart /></div>
                <div className="percentage">
                  {isLoading ? '...' : `${result.percentage}%`}
                </div>
                <div className="message">
                  {isLoading ? 'Consulting the love gods...' : result.message}
                </div>
              </>
            ) : (
              <div className="message">
                Enter your names to see your love match!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoveCalculator;
