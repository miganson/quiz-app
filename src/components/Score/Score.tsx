import { useNavigate, useLocation } from "react-router-dom";
import { useScore, useUserResponses } from "../../context/QuizContext";
import { UserResponse } from "../../types/quizInterfaces";
import "./Score.css";
import React, { useState, useEffect } from "react";

const Score = () => {
  const { score } = useScore();
  const { userResponses } = useUserResponses();
  const navigate = useNavigate();
  const location = useLocation();
  const [exiting, setExiting] = useState(false);

  const handleGoHomeClick = () => {
    setExiting(true);
    setTimeout(() => navigate("/"), 500);
  };

  useEffect(() => {
    if (location.pathname !== "/score") {
      setExiting(false);
    }
  }, [location.pathname]);
  // This helper function will return responses grouped by round titles
  const getResponsesGroupedByRound = () => {
    const groupedResponses = userResponses
      ? (userResponses as UserResponse[]).reduce<{
          [key: string]: UserResponse[];
        }>((acc, response: UserResponse) => {
          const roundTitle = response.roundTitle;
          if (!acc[roundTitle]) {
            acc[roundTitle] = [];
          }
          acc[roundTitle].push(response);

          return acc;
        }, {})
      : {};

    return groupedResponses;
  };

  const activityNumber =
    userResponses && userResponses.length > 0
      ? userResponses[0].activityNumber
      : null;

  const responsesGroupedByRound = getResponsesGroupedByRound();

  // can add response.question to add the specific question in mind
  return (
    <div className={`centered-container ${exiting ? "slide-out" : "slide-in"}`}>
      <h2 className="text-padding">Activity: {activityNumber}</h2>
      <h1 className="text-padding">Results</h1>
      <div className="scrollable-container">
        {Object.keys(responsesGroupedByRound).map((roundTitle) => (
          <div key={roundTitle}>
            <h2 className="round-padding">{roundTitle}</h2>
            {responsesGroupedByRound[roundTitle].map(
              (response: UserResponse, index: number) => (
                <div className="question-response-container" key={index}>
                  <p className="text-padding">Q{index + 1}</p>
                  <span className="bold-text text-padding">
                    {response.isUserAnswerCorrect
                      ? "Correct"
                      : response.is_correct
                      ? "True"
                      : "False"}
                  </span>
                </div>
              )
            )}
          </div>
        ))}
      </div>

      <h2 className="text-padding">Your score: {score}</h2>
      <div className="text-container" onClick={handleGoHomeClick}>
        <h3 className="results">HOME</h3>
      </div>
    </div>
  );
};

export default Score;
