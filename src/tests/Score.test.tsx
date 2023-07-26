import React from 'react';
import { render, screen } from '@testing-library/react';
import { QuizContext } from '../context/QuizContext';
import Score from '../components/Score';

test('renders Score component', () => {
  const mockResetQuiz = jest.fn();
  render(
    <QuizContext.Provider value={{ score: 5, resetQuiz: mockResetQuiz }}>
      <Score />
    </QuizContext.Provider>
  );
  const scoreElement = screen.getByText(/Your Score is: 5/i);
  expect(scoreElement).toBeInTheDocument();
});
