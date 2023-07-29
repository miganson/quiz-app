import React, { createContext, useState, useContext, ReactNode } from 'react';

type QuizContextType = {
  score: number | null;
  setScore: (score: number) => void;
  userResponses: Array<{ is_correct: boolean; question: string; roundTitle: string }> | null;
  setUserResponses: React.Dispatch<React.SetStateAction<Array<{ is_correct: boolean; question: string; roundTitle: string }>>>;
};

const QuizContext = createContext<QuizContextType>({
  score: null,
  setScore: () => {},
  userResponses: [],
  setUserResponses: () => {},
});

type QuizProviderProps = {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [score, setScore] = useState<number | null>(null);
  const [userResponses, setUserResponses] = useState<Array<{ is_correct: boolean; question: string; roundTitle: string }>>([]);
  
  return (
    <QuizContext.Provider value={{ score, setScore, userResponses, setUserResponses }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useScore = (): { score: number | null; setScore: (score: number) => void } => {
  const { score, setScore } = useContext(QuizContext);
  return { score, setScore };
};

export const useUserResponses = () => {
  const { userResponses, setUserResponses } = useContext(QuizContext);
  return { userResponses, setUserResponses };
};
