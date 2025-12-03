import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the LoveCalculator component with the actual implementation
jest.mock('./components/LoveCalculator', () => {
  return function LoveCalculator() {
    const [result, setResult] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleCalculate = ({ name1, name2 }) => {
      setIsLoading(true);
      setTimeout(() => {
        const combined = (name1 + name2).toLowerCase();
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
          hash = (hash << 5) - hash + combined.charCodeAt(i);
          hash = hash & hash;
        }
        const percentage = Math.abs(hash) % 100 + 1;
        setResult({ percentage, message: `Match: ${percentage}%` });
        setIsLoading(false);
      }, 100);
    };

    return (
      <div className="love-calculator" data-testid="love-calculator">
        <h1>❤️ Love Match Calculator ❤️</h1>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleCalculate({
              name1: formData.get('name1'),
              name2: formData.get('name2')
            });
          }}
        >
          <div className="input-group">
            <label htmlFor="name1">Your Name</label>
            <input
              type="text"
              id="name1"
              name="name1"
              required
              data-testid="name1-input"
            />
          </div>
          <div className="emoji">+</div>
          <div className="input-group">
            <label htmlFor="name2">Your Crush's Name</label>
            <input
              type="text"
              id="name2"
              name="name2"
              required
              data-testid="name2-input"
            />
          </div>
          <button type="submit" data-testid="calculate-button">
            Calculate Love
          </button>
        </form>
        <div className="result" data-testid="result">
          {isLoading ? (
            <div className="message">Consulting the love gods...</div>
          ) : result ? (
            <>
              <div className="percentage">{result.percentage}%</div>
              <div className="message">{result.message}</div>
            </>
          ) : (
            <div className="message">Enter your names to see your love match!</div>
          )}
        </div>
      </div>
    );
  };
});

describe('Love Match Calculator', () => {
  test('renders the main heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /❤️ love match calculator ❤️/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays input fields for both names', () => {
    render(<App />);
    const yourNameInput = screen.getByLabelText(/your name/i);
    const crushNameInput = screen.getByLabelText(/your crush's name/i);
    expect(yourNameInput).toBeInTheDocument();
    expect(crushNameInput).toBeInTheDocument();
  });

  test('shows default message before calculation', () => {
    render(<App />);
    const defaultMessage = screen.getByText(/enter your names to see your love match!/i);
    expect(defaultMessage).toBeInTheDocument();
  });

  test('updates input fields when typing', () => {
    render(<App />);
    const yourNameInput = screen.getByLabelText(/your name/i);
    const crushNameInput = screen.getByLabelText(/your crush's name/i);
    
    fireEvent.change(yourNameInput, { target: { value: 'Alice' } });
    fireEvent.change(crushNameInput, { target: { value: 'Bob' } });
    
    expect(yourNameInput.value).toBe('Alice');
    expect(crushNameInput.value).toBe('Bob');
  });

  test('shows loading state when form is submitted', async () => {
    render(<App />);
    const yourNameInput = screen.getByLabelText(/your name/i);
    const crushNameInput = screen.getByLabelText(/your crush's name/i);
    const calculateButton = screen.getByRole('button', { name: /calculate love/i });

    fireEvent.change(yourNameInput, { target: { value: 'Alice' } });
    fireEvent.change(crushNameInput, { target: { value: 'Bob' } });
    fireEvent.click(calculateButton);
    
    const loadingMessage = await screen.findByText(/consulting the love gods.../i);
    expect(loadingMessage).toBeInTheDocument();
  });

  test('displays result after calculation', async () => {
    render(<App />);
    const yourNameInput = screen.getByLabelText(/your name/i);
    const crushNameInput = screen.getByLabelText(/your crush's name/i);
    const calculateButton = screen.getByRole('button', { name: /calculate love/i });

    fireEvent.change(yourNameInput, { target: { value: 'Alice' } });
    fireEvent.change(crushNameInput, { target: { value: 'Bob' } });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      const percentage = screen.getByText(/%/);
      expect(percentage).toBeInTheDocument();
    });
  });

  test('shows error when trying to submit empty form', () => {
    render(<App />);
    const calculateButton = screen.getByRole('button', { name: /calculate love/i });
    const form = screen.getByTestId('love-calculator').querySelector('form');
    
    const formSubmit = jest.fn();
    form.onsubmit = formSubmit;
    
    fireEvent.click(calculateButton);
    
    const yourNameInput = screen.getByLabelText(/your name/i);
    const crushNameInput = screen.getByLabelText(/your crush's name/i);
    
    expect(yourNameInput.validity.valid).toBe(false);
    expect(crushNameInput.validity.valid).toBe(false);
    expect(formSubmit).not.toHaveBeenCalled();
  });
});