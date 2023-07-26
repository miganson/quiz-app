import React from "react";
import { useNavigate } from "react-router-dom";
import { QuizData } from "../types/quizInterfaces";

interface HomeProps {
  data: QuizData | null;
}

export const Home: React.FC<HomeProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Home</h1>
      {data &&
        data.activities.map((activity) => (
          <button
            key={activity.order}
            onClick={() => navigate("/quiz/" + activity.order)}
          >
            Start Quiz {activity.activity_name}
          </button>
        ))}
    </div>
  );
};

export default Home;
