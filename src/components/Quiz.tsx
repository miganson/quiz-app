import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  QuizProps,
  Activity,
  Question,
  NestedQuestion,
} from "../types/quizInterfaces";

export const Quiz: React.FC<QuizProps> = ({ data }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userResponses, setUserResponses] = useState<
    Array<{ is_correct: boolean; question: string }>
  >([]);
  const navigate = useNavigate();
  const { activityId } = useParams();
  const activityIdAsNumber = activityId ? parseInt(activityId) : undefined;

  const desiredActivity: Activity | undefined = data.activities.find(
    (activity) => activity.order === activityIdAsNumber
  );

  const handleAnswer = (isCorrect: boolean) => {
    // Calculate the new score
    setScore(isCorrect ? score + 1 : score);

    // Update userResponses
    const currentQuestion = getCurrentQuestion();

    // Move to the next question
    const questionsOrRounds = desiredActivity?.questions ?? []; // Default to empty array if questions is undefined

    // Detect if we are dealing with rounds or direct questions
    const isRounds = "round_title" in (questionsOrRounds[0] || {});

    const currentRoundTitle = isRounds
      ? (questionsOrRounds[currentRoundIndex] as NestedQuestion).round_title
      : "";

    const userResponse = {
      is_correct: isCorrect,
      question: currentQuestion?.stimulus || "",
      roundTitle: currentRoundTitle,
    };

    // Create a new array for the updated user responses
    const updatedUserResponses = [...userResponses, userResponse];
    setUserResponses(updatedUserResponses);

    if (isRounds) {
      const currentRound = questionsOrRounds[
        currentRoundIndex
      ] as NestedQuestion;
      const questions = currentRound?.questions ?? [];

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (currentRoundIndex < questionsOrRounds.length - 1) {
        setCurrentRoundIndex(currentRoundIndex + 1);
        setCurrentQuestionIndex(0);
      } else {
        // Pass the updated user responses to the "/score" page
        navigate("/score", {
          state: { userResponses: updatedUserResponses, score },
        });
      }
    } else {
      const questions = questionsOrRounds as Question[];

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Pass the updated user responses to the "/score" page
        navigate("/score", {
          state: { userResponses: updatedUserResponses, score },
        });
      }
    }
  };

  const getCurrentQuestion = (): Question | undefined => {
    const questionsOrRounds = desiredActivity?.questions ?? [];
    const isRounds = "round_title" in (questionsOrRounds[0] || {});
    const currentQuestions = isRounds
      ? (questionsOrRounds[currentRoundIndex] as NestedQuestion).questions
      : (questionsOrRounds as Question[]);
    return currentQuestions[currentQuestionIndex];
  };

  const renderQuestion = (
    questionsOrRounds: (Question | NestedQuestion)[],
    roundIndex = 0
  ) => {
    const currentQuestion = getCurrentQuestion();

    return (
      <div>
        {"round_title" in questionsOrRounds[roundIndex] && (
          <h1>
            {(questionsOrRounds[roundIndex] as NestedQuestion).round_title}
          </h1>
        )}
        <p>{currentQuestion?.stimulus}</p>
        <button
          onClick={() => handleAnswer(currentQuestion?.is_correct ?? false)}
        >
          Correct
        </button>
        <button onClick={() => handleAnswer(!currentQuestion?.is_correct)}>
          Incorrect
        </button>
      </div>
    );
  };

  return (
    <div>
      {desiredActivity && (
        <div>
          <h1>{desiredActivity.activity_name}</h1>
          {renderQuestion(desiredActivity.questions, currentRoundIndex)}
        </div>
      )}
    </div>
  );
};

export default Quiz;
