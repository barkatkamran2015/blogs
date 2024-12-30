import React, { useState } from 'react';
import '../StyleAdvisor.css'; // Add appropriate styling

const StyleAdvisor = () => {
  const [event, setEvent] = useState('');
  const [weather, setWeather] = useState('');
  const [gender, setGender] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [suggestions, setSuggestions] = useState(null);

  const handleGetAdvice = () => {
    const outfitSuggestions = {
      casual: {
        sunny: {
          morning: {
            male: 'T-shirt, chinos, and loafers.',
            female: 'Light blouse, shorts, and sandals.',
          },
          evening: {
            male: 'Short-sleeve shirt, jeans, and sneakers.',
            female: 'Maxi dress with comfortable flats.',
          },
        },
        rainy: {
          morning: {
            male: 'Waterproof jacket, jeans, and boots.',
            female: 'Raincoat, leggings, and ankle boots.',
          },
          evening: {
            male: 'Sweater, waterproof jacket, and sturdy boots.',
            female: 'Stylish raincoat over a casual dress and boots.',
          },
        },
      },
      formal: {
        sunny: {
          morning: {
            male: 'Light-colored suit with loafers.',
            female: 'Floral cocktail dress and heels.',
          },
          evening: {
            male: 'Classic black suit and polished shoes.',
            female: 'Elegant evening gown with accessories.',
          },
        },
        rainy: {
          morning: {
            male: 'Dark suit with a raincoat.',
            female: 'Sophisticated knee-length dress with a stylish jacket.',
          },
          evening: {
            male: 'Charcoal suit with a trench coat.',
            female: 'Formal evening dress and matching overcoat.',
          },
        },
      },
    };

    const result =
      outfitSuggestions[event]?.[weather]?.[timeOfDay]?.[gender] ||
      'Sorry, we don’t have outfit suggestions for this combination yet.';
    setSuggestions(result);
  };

  return (
    <div className="style-advisor">
      <h1>Style Advisor</h1>
      <p>Find the perfect outfit for any occasion!</p>

      <div className="form-container">
        <div className="form-group">
          <label htmlFor="event">What’s the occasion?</label>
          <select
            id="event"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          >
            <option value="">-- Select Event --</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="weather">What’s the weather?</label>
          <select
            id="weather"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
          >
            <option value="">-- Select Weather --</option>
            <option value="sunny">Sunny</option>
            <option value="rainy">Rainy</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="timeOfDay">Time of day:</label>
          <select
            id="timeOfDay"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
          >
            <option value="">-- Select Time of Day --</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="gender">Your gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">-- Select Gender --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <button onClick={handleGetAdvice} className="get-advice-button">
          Get Advice
        </button>
      </div>

      {suggestions && (
        <div className="suggestions-container">
          <h2>Outfit Suggestion:</h2>
          <p>{suggestions}</p>
        </div>
      )}
    </div>
  );
};

export default StyleAdvisor;
