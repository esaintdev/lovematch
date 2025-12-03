import React from 'react';

const LoveForm = ({ onCalculate }) => {
  const [names, setNames] = React.useState({ name1: '', name2: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNames(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (names.name1.trim() && names.name2.trim()) {
      onCalculate(names);
    }
  };

  return (
    <form className="love-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="name1">Your Name</label>
        <input
          type="text"
          id="name1"
          name="name1"
          value={names.name1}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
      </div>
      <div className="emoji">+</div>
      <div className="input-group">
        <label htmlFor="name2">Your Crush's Name</label>
        <input
          type="text"
          id="name2"
          name="name2"
          value={names.name2}
          onChange={handleChange}
          placeholder="Enter their name"
          required
        />
      </div>
      <button type="submit">Calculate Love</button>
    </form>
  );
};

export default LoveForm;
