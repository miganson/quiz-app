import React from "react";
import { useNavigate } from "react-router-dom";
import numeral from "numeral";
import "./Home.css";
import { HomeProps } from "../../types/quizInterfaces";
import { useScore, useUserResponses } from "../../context/QuizContext";
// @ts-ignore
import * as numberToWords from "number-to-words";

export const Home: React.FC<HomeProps> = ({ data }) => {
  const navigate = useNavigate();
  const { setScore } = useScore();
  const { setUserResponses } = useUserResponses();

  const handleButtonClick = (activityOrder: number) => {
    if (data) {
      const activity = data.activities.find(
        (activity) => activity.order === activityOrder
      );

      if (activity) {
        setScore(0); // reset the score
        setUserResponses([]); // reset the userResponses
        navigate("/quiz/" + activity.order);
      }
    }
  };

  const handleResultsClick = () => {
    navigate("/score");
  };

  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const numActivities =
    data && data.activities ? Math.max(5, data.activities.length) : 5;

  return (
    <div className="home-container">
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

      <div className="text-container" onClick={handleResultsClick}>
        <h3 className="results">RESULTS</h3>
      </div>
    </div>
  );
};

export default Home;
