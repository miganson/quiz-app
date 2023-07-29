import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { HomeProps } from "../../types/quizInterfaces";
import { useScore, useUserResponses } from "../../context/QuizContext";

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

  return (
    <div className="home-container">
      <div className="line">
        <div className="text-container">
          <h3 className="title">CAE</h3>
          <h1 className="title">Error Find</h1>
        </div>
      </div>
      {[1, 2, 3, 4, 5].map((order) => {
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
                {activity ? activity.activity_name : `Quiz ${order}`}
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
