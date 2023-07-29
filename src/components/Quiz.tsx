import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  QuizProps,
  Activity,
  Question,
  NestedQuestion,
} from "../types/quizInterfaces";
import { useScore, useUserResponses } from "../context/QuizContext";

export const Quiz: React.FC<QuizProps> = ({ data }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const { score, setScore } = useScore();
  const [isRoundTitleVisible, setIsRoundTitleVisible] = useState(true);
  const { userResponses, setUserResponses } = useUserResponses();

  const navigate = useNavigate();
  const { activityId } = useParams();
  const activityIdAsNumber = activityId ? parseInt(activityId) : undefined;

  if (!data) {
    navigate("/");
    return null;
  }

  const desiredActivity: Activity | undefined = data.activities.find(
    (activity) => activity.order === activityIdAsNumber
  );

  const questionsOrRounds = desiredActivity?.questions ?? [];
  const isRounds = "round_title" in (questionsOrRounds[0] || {});

  const handleAnswer = (isCorrect: boolean) => {
    const updatedScore = isCorrect ? (score ?? 0) + 1 : score ?? 0;
    console.log("Before setting score: ", score);
    setScore(updatedScore);
    console.log("After setting score: ", score);
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

    const updatedUserResponses = userResponses
      ? [...userResponses, userResponse]
      : [userResponse];

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
        setIsRoundTitleVisible(true); // Set the round title to visible for the next round
      } else {
        // Navigate to score after all rounds are passed through
        navigate("/score");
      }
    } else {
      const questions = questionsOrRoundsArray as Question[];
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Pass the updated user responses to the "/score" page
        navigate("/score");
      }
    }
  };

  const getCurrentQuestion = (): Question | undefined => {
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
    //check if there are rounds to show what round it is before the questions are shown.
    if (isRoundTitleVisible && "round_title" in questionsOrRounds[roundIndex]) {
      return (
        <div>
          <h1>
            {(questionsOrRounds[roundIndex] as NestedQuestion).round_title}
          </h1>
          <button onClick={() => setIsRoundTitleVisible(false)}>Next</button>
        </div>
      );
    }

    const currentQuestion = getCurrentQuestion();
    return (
      <div>
        <h2>Q: {currentQuestionIndex + 1}</h2>
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
          <h3>
            {desiredActivity.activity_name}{" "}
            {isRounds && <>/ Round: {currentRoundIndex + 1}</>}
          </h3>
          {renderQuestion(questionsOrRounds, currentRoundIndex)}
        </div>
      )}
    </div>
  );
};

export default Quiz;
