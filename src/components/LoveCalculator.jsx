import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FaHeart } from 'react-icons/fa';
import LoveForm from './LoveForm.jsx';
import './styles/LoveCalculator.css';

const defaultMessages = {
  perfect: [
    "STOP EVERYTHING! Y'all are literally PERFECT together! Like, I'm not even joking, you should probably already have 3 kids and a golden retriever by now! 💍👶🐕",
    "Okay so like... 100%?? That's INSANE! You two are literally soulmates and I'm pretty sure the universe planned this before you were even born. Start planning the wedding ASAP! 💒✨",
    "I'm literally SCREAMING! This is the kind of love that makes people write songs and cry at weddings! You better name your first child after me for revealing this cosmic truth! 🎵😭"
  ],
  high: [
    "Okay okay okay, so like... this is REALLY good! I'm talking 'already planning couple Halloween costumes' good! You two need to stop playing around and just admit you're obsessed with each other! 🎃💕",
    "Not gonna lie, this percentage is giving 'already sharing Netflix passwords and arguing about what to watch' energy! That's basically marriage in 2024, so congrats! 📺💑",
    "Listen, I've seen a LOT of matches, and this? This is the 'texting each other memes at 3am' kind of connection. That's literally the foundation of true love, no cap! 📱✨"
  ],
  medium: [
    "Okay so it's not BAD, but like... it's giving 'we'd be cute together if we both tried' vibes. Maybe start with coffee? Or like, at least follow each other on Instagram? ☕📸",
    "Hmm, this is the 'could work but someone's gonna have to make the first move' situation. And by someone, I mean YOU. Stop being shy and shoot your shot! 🎯💪",
    "Not terrible! It's like when you match on a dating app and the conversation is okay but not amazing. Could be something? Maybe? Give it a shot and see what happens! 🤷‍♀️💬"
  ],
  low: [
    "Oof... okay so like, I'm not saying it's IMPOSSIBLE, but... actually yeah, I kinda am. This is giving 'better as friends' energy and honestly? That's valid too! 👥😅",
    "Listen, I'm gonna be real with you... this ain't it. Like, you'd have better chemistry with a random person at the grocery store. Maybe try the produce section? 🥕🛒",
    "Yikes on bikes! This match is giving 'we'd argue about literally everything' vibes. Like, y'all probably can't even agree on pizza toppings. Just... maybe keep swiping? 🍕👎"
  ]
};

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
  const [loveMessages, setLoveMessages] = useState(defaultMessages);

  useEffect(() => {
    // Load custom messages if available
    const customMessages = localStorage.getItem('customMessages');
    if (customMessages) {
      setLoveMessages(JSON.parse(customMessages));
    }
  }, []);

  const getLoveMessage = (percentage) => {
    if (percentage >= 90) return getRandomElement(loveMessages.perfect);
    if (percentage >= 70) return getRandomElement(loveMessages.high);
    if (percentage >= 40) return getRandomElement(loveMessages.medium);
    return getRandomElement(loveMessages.low);
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
