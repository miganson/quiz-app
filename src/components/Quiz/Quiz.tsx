import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  QuizProps,
  Activity,
  Question,
  NestedQuestion,
} from "../../types/quizInterfaces";
import { useScore, useUserResponses } from "../../context/QuizContext";
import "./Quiz.css";

export const Quiz: React.FC<QuizProps> = ({ data }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const { score, setScore } = useScore();
  const [isRoundTitleVisible, setIsRoundTitleVisible] = useState(true);
  const { userResponses, setUserResponses } = useUserResponses();
  const [advanceCheck, setAdvanceCheck] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [exiting, setExiting] = useState(false);
  const { activityId } = useParams();
  const activityIdAsNumber = activityId ? parseInt(activityId) : undefined;

  useEffect(() => {
    // On component mount or update
    if (location.pathname.includes("/quiz")) {
      setExiting(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isRoundTitleVisible) {
      console.log('test1')
      setTimeout(() => {
        setExiting(true); //slide in animation
        setTimeout(() => {
          setIsRoundTitleVisible(false); //will show round component
        }, 500); //timeout is for slide out animation time
      }, 2000);
    }
  }, [isRoundTitleVisible]);

  useEffect(() => {
    if (exiting) {
      console.log("test2");
      setTimeout(() => {
        setExiting(false); //slide out animation
        if (!isRoundTitleVisible) {
          advanceQuestionOrRound(); //should only advance if round component is false
        }
      }, 500);
    }
  }, [exiting]);

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
      is_correct: currentQuestion?.is_correct ?? false, // the actual answer
      isUserAnswerCorrect: isCorrect,
      question: currentQuestion?.stimulus || "",
      roundTitle: currentRoundTitle,
      activityNumber: activityIdAsNumber || 0,
    };

    const updatedUserResponses = userResponses
      ? [...userResponses, userResponse]
      : [userResponse];

    setUserResponses(updatedUserResponses);

    setExiting(true);
  };

  const advanceQuestionOrRound = () => {
    const questionsOrRoundsArray = desiredActivity?.questions ?? [];
    const isRoundsArray = "round_title" in (questionsOrRoundsArray[0] || {});

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
    if (isRoundTitleVisible && "round_title" in questionsOrRounds[roundIndex]) {
      return (
        <div className="roundTitle">
          <h1>
            {(questionsOrRounds[roundIndex] as NestedQuestion).round_title}
          </h1>
        </div>
      );
    }

    const currentQuestion = getCurrentQuestion();
    return (
      <div>
        <h2 className="questionNumber">Q: {currentQuestionIndex + 1}</h2>
        <p className="question">{currentQuestion?.stimulus}</p>
        <div className="answers">
          <div
            onClick={() => handleAnswer(currentQuestion?.is_correct ?? false)}
          >
            Correct
          </div>
          <div onClick={() => handleAnswer(!currentQuestion?.is_correct)}>
            Incorrect
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`container ${exiting ? "slide-out" : "slide-in"}`}>
      {desiredActivity && (
        <div>
          <h3 className="activityName">
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
