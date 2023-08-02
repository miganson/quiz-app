import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Home.css";
import { HomeProps } from "../../types/quizInterfaces";
import { useScore, useUserResponses } from "../../context/QuizContext";
// @ts-ignore
import * as numberToWords from "number-to-words";

export const Home: React.FC<HomeProps> = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setScore } = useScore();
  const { setUserResponses } = useUserResponses();
  const [exiting, setExiting] = useState(false);
  const { userResponses } = useUserResponses();


  const handleButtonClick = (activityOrder: number) => {
    if (data) {
      const activity = data.activities.find(
        (activity) => activity.order === activityOrder
      );

      if (activity) {
        setScore(0);
        setUserResponses([]);
        setExiting(true);
        setTimeout(() => navigate("/quiz/" + activity.order), 500);
      }
    }
  };

  const handleResultsClick = () => {
    setExiting(true);
    setTimeout(() => navigate("/score"), 500);
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      setExiting(false);
    }
  }, [location.pathname]);

  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const numActivities =
    data && data.activities ? Math.max(5, data.activities.length) : 5;

  return (
    <div className={`home-container ${exiting ? "slide-out" : "slide-in"}`}>
      <div className="line">
        <div className="text-container">
          <h3 className="title">CAE</h3>
          <h1 className="title">Error Find</h1>
        </div>
      </div>
      {Array.from({ length: numActivities }, (_, i) => i + 1).map((order) => {
        const activity = data?.activities.find(
          (activity) => activity.order === order
        );
        return (
          <div
            key={order}
            className="line"
            onClick={() => handleButtonClick(order)}
          >
            <div className="text-container">
              <div className={activity ? "text-blue" : "text-gray"}>
                {activity
                  ? activity.activity_name
                  : `Activity ${capitalizeWords(numberToWords.toWords(order))}`}
              </div>
            </div>
          </div>
        );
      })}

      <div
        className="text-container"
        onClick={() =>
          userResponses && userResponses.length > 0 && handleResultsClick()
        }
      >
        <h4
          className={
            userResponses && userResponses.length > 0
              ? "results"
              : "results-disabled"
          }
        >
          RESULTS
        </h4>
      </div>
    </div>
  );
};

export default Home;
