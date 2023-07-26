import { useNavigate, useLocation } from "react-router-dom";
import { UserResponse } from "../types/quizInterfaces"; // ensure correct path

const Score = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { userResponses, score } = location.state as {
    userResponses: UserResponse[];
    score: number;
  };

  const handleGoHomeClick = () => {
    navigate("/");
  };

  // This helper function will return responses grouped by round titles
  const getResponsesGroupedByRound = () => {
    const groupedResponses = userResponses.reduce(
      (acc: { [key: string]: UserResponse[] }, response: UserResponse) => {
        if (!acc[response.roundTitle]) {
          acc[response.roundTitle] = [];
        }
        acc[response.roundTitle].push(response);
        return acc;
      },
      {}
    );

    return groupedResponses;
  };

  const responsesGroupedByRound = getResponsesGroupedByRound();

  return (
    <div>
      <h2>Your score: {score}</h2>
      {Object.keys(responsesGroupedByRound).map((roundTitle) => (
        <div key={roundTitle}>
          <h2>Round: {roundTitle}</h2>
          {responsesGroupedByRound[roundTitle].map((response: UserResponse, index: number) => (
            <p key={index}>
              Q{index + 1}: {response.is_correct ? "Correct" : "Incorrect"}
            </p>
          ))}
        </div>
      ))}
      <button onClick={handleGoHomeClick}>Go Home</button>
    </div>
  );
};

export default Score;
