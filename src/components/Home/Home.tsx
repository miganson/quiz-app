import React from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';  // import the CSS
import { HomeProps } from "../../types/quizInterfaces";



export const Home: React.FC<HomeProps> = ({ data }) => {
  const navigate = useNavigate();

  const handleButtonClick = (activityOrder: number) => {
    if (data) {
      const activity = data.activities.find(activity => activity.order === activityOrder);
      if (activity) navigate("/quiz/" + activity.order);
    }
  }

  return (
    <div className="home-container">
      <h1>Error Find</h1>
      {[1, 2, 3, 4, 5].map(order => {
        const activity = data?.activities.find(activity => activity.order === order);
        return (
          <div 
            key={order}
            onClick={() => handleButtonClick(order)}
            className={activity ? 'text-blue' : 'text-gray'}
          >
            {activity ? activity.activity_name : `Quiz ${order}`}
          </div>
        )
      })}
    </div>
  );
};

export default Home;
