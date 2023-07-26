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
    Array<{ is_correct: boolean; question: string; roundTitle: string }>
  >([]);
  const navigate = useNavigate();
  const { activityId } = useParams();
  const activityIdAsNumber = activityId ? parseInt(activityId) : undefined;

  const desiredActivity: Activity | undefined = data.activities.find(
    (activity) => activity.order === activityIdAsNumber
  );

  const handleAnswer = (isCorrect: boolean) => {
    setScore((prevScore) => (isCorrect ? prevScore + 1 : prevScore));

    const currentQuestion = getCurrentQuestion();
    const currentRoundTitle =
      desiredActivity &&
      ("round_title" in desiredActivity?.questions[currentRoundIndex] ?? {})
        ? (desiredActivity.questions[currentRoundIndex] as NestedQuestion)
            .round_title
        : "";
    const userResponse = {
      is_correct: isCorrect,
      question: currentQuestion?.stimulus || "",
      roundTitle: currentRoundTitle,
    };
    setUserResponses((prevResponses) => [...prevResponses, userResponse]);

    const questionsOrRounds = desiredActivity?.questions ?? [];
    const currentQuestionsOrRounds = questionsOrRounds[currentRoundIndex];

    if ("questions" in currentQuestionsOrRounds) {
      // This is a round
      const questions = (currentQuestionsOrRounds as NestedQuestion).questions;
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        if (currentRoundIndex < questionsOrRounds.length - 1) {
          setCurrentRoundIndex((prevIndex) => prevIndex + 1);
          setCurrentQuestionIndex(0);
        } else {
          navigate("/score", { state: { userResponses, score } });
        }
      }
    } else {
      // This is a question
      if (currentQuestionIndex < questionsOrRounds.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        navigate("/score", { state: { userResponses, score } });
      }
    }
  };

  useEffect(() => {
    if (currentQuestionIndex >= (desiredActivity?.questions ?? []).length) {
      navigate("/score", { state: { userResponses, score } });
    }
  }, [currentQuestionIndex, desiredActivity?.questions, navigate, score, userResponses]);

  const getCurrentQuestion = () => {
    const questionsOrRounds = desiredActivity?.questions ?? [];
    const currentQuestionsOrRounds = questionsOrRounds[currentRoundIndex];

    if ("questions" in currentQuestionsOrRounds) {
      // This is a round
      const questions = (currentQuestionsOrRounds as NestedQuestion).questions;
      return questions[currentQuestionIndex];
    } else {
      // This is a question
      return currentQuestionsOrRounds;
    }
  };

  const currentQuestion = getCurrentQuestion();

  return (
    <div>
      {desiredActivity && (
        <div>
          <h1>{desiredActivity.activity_name}</h1>
          <p>{currentQuestion?.stimulus}</p>
          <button onClick={() => handleAnswer(true)}>Correct</button>
          <button onClick={() => handleAnswer(false)}>Incorrect</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
