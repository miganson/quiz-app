import React, { useCallback, useEffect, useState } from "react";
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
  const [hasRendered, setHasRendered] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [exiting, setExiting] = useState(false);
  const { activityId } = useParams();
  const activityIdAsNumber = activityId ? parseInt(activityId) : undefined;
  const desiredActivity: Activity | undefined = data.activities.find(
    (activity) => activity.order === activityIdAsNumber
  );

  const questionsOrRounds = desiredActivity?.questions ?? [];
  const isRounds = "round_title" in (questionsOrRounds[0] || {});

  useEffect(() => {
    // On component mount or update
    if (location.pathname.includes("/quiz")) {
      setExiting(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    setTimeout(() => {
      // this is to cancel adnvancing of rounds on load
      setHasRendered(true);
    }, 3000);
  }, []);

  useEffect(() => {
    if (isRoundTitleVisible && isRounds) {
      setTimeout(() => {
        setExiting(true); //slide in animation
        setTimeout(() => {
          setIsRoundTitleVisible(false); //will show round component
        }, 500); //timeout is for slide out animation time
      }, 2000);
    }
  }, [isRoundTitleVisible, isRounds]);

  const advanceQuestionOrRound = useCallback(() => {
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
  }, [
    currentQuestionIndex,
    currentRoundIndex,
    desiredActivity?.questions,
    navigate,
  ]);

  useEffect(() => {
    if (exiting) {
      if (!isRounds) {
        setTimeout(() => {
          setExiting(false); //slide out animation
          advanceQuestionOrRound(); //should only advance if round component is false
        }, 500);
      } else {
        setTimeout(() => {
          setExiting(false); //slide out animation
          console.log("test1", isRoundTitleVisible);
          if (!isRoundTitleVisible && hasRendered) {
            console.log("test12", isRoundTitleVisible);
            advanceQuestionOrRound(); //should only advance if round component is false
          }
        }, 500);
      }
    }
  }, [
    exiting,
    advanceQuestionOrRound,
    isRoundTitleVisible,
    isRounds,
    hasRendered,
  ]);

  if (!data) {
    navigate("/");
    return null;
  }

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
    const renderTextWithBold = (text: string) => {
      const textParts = text.split("*");

      return textParts.map((part, index) => {
        if (index % 2 === 0) {
          // Even indices are not wrapped with <strong>, wrap them with <span> to provide keys
          return <span key={index}>{part}</span>;
        } else {
          // Odd indices are wrapped with <strong>
          return <strong key={index}>{part}</strong>;
        }
      });
    };

    const currentQuestion = getCurrentQuestion();
    return (
      <div>
        <h2 className="questionNumber">Q: {currentQuestionIndex + 1}</h2>
        <p className="question">
          {renderTextWithBold(currentQuestion?.stimulus ?? "")}
        </p>
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
