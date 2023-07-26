import React, { createContext, useState, useCallback } from "react";

interface QuizContextProps {
  children: React.ReactNode;
}

interface QuizContextState {
  score: number;
  resetQuiz: () => void;
}

// Creating context
export const QuizContext = createContext<QuizContextState | undefined>(
  undefined
);

export const QuizProvider: React.FC<QuizContextProps> = ({ children }) => {
  const [score, setScore] = useState(0);

  const resetQuiz = useCallback(() => {
    setScore(0);
    // reset other quiz states if you have here.
  }, []);

  return (
    <QuizContext.Provider value={{ score, resetQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};
