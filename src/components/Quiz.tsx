import React, { useState, useEffect } from "react";
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
    const updatedScore = isCorrect ? score + 1 : score;
    setScore(updatedScore);

    const currentQuestion = getCurrentQuestion();
    const questionsOrRoundsArray = desiredActivity?.questions ?? [];

    // Boolean check if we are dealing with rounds or direct questions
    const isRoundsArray = "round_title" in (questionsOrRoundsArray[0] || {});

    const currentRoundTitle = isRoundsArray
      ? (questionsOrRoundsArray[currentRoundIndex] as NestedQuestion)
          .round_title
      : "";

    const userResponse = {
      is_correct: isCorrect,
      question: currentQuestion?.stimulus || "",
      roundTitle: currentRoundTitle,
    };

    // Create a new array for the updated user responses
    const updatedUserResponses = [...userResponses, userResponse];
    setUserResponses(updatedUserResponses);

    // to check if rounds Array or straight questions Array without rounds
    if (isRoundsArray) {
      const currentRound = questionsOrRoundsArray[
        currentRoundIndex
      ] as NestedQuestion;
      const questions = currentRound?.questions ?? [];
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (currentRoundIndex < questionsOrRoundsArray.length - 1) {
        //once all questions are answered in current round, bring index back to 0 and increase round index to move to next round
        setCurrentRoundIndex(currentRoundIndex + 1);
        setCurrentQuestionIndex(0);
      } else {
        // Navigate to score after all rounds are passed through
        navigate("/score", {
          state: { userResponses: updatedUserResponses, score: updatedScore },
        });
      }
    } else {
      const questions = questionsOrRoundsArray as Question[];
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Pass the updated user responses to the "/score" page
        navigate("/score", {
          state: { userResponses: updatedUserResponses, score: updatedScore },
        });
      }
    }
  };

  const getCurrentQuestion = (): Question | undefined => {
    const questionsOrRounds = desiredActivity?.questions ?? [];

    // check if round_title is included in the array to use NestedQuestion or just Question. This is in case there are multiple rounds.
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
