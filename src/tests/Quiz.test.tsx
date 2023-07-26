
import React from 'react';
import { render, screen } from '@testing-library/react';
import Quiz from '../components/Quiz';

// Mock your quizData
const mockData = {
  name: "Mock Quiz",
  heading: "Mock Heading",
  activities: [{
    activity_name: "Mock Activity",
    order: 1,
    questions: [{
      is_correct: true,
      stimulus: "Mock question?",
      order: 1,
      user_answers: [
        {
          text: "Mock answer",
          isCorrect: true
        }
      ],
      feedback: "Mock feedback"
    }]
  }]
}
