import { useNavigate } from "react-router-dom";
import { useScore, useUserResponses } from "../context/QuizContext";
import { UserResponse } from "../types/quizInterfaces";

const Score = () => {
  const { score } = useScore(); // use context hook to get score
  const { userResponses } = useUserResponses(); // use context hook to get userResponses

  const navigate = useNavigate();

  const handleGoHomeClick = () => {
    navigate("/");
  };

  // This helper function will return responses grouped by round titles
  const getResponsesGroupedByRound = () => {
    const groupedResponses = userResponses
      ? userResponses.reduce(
          (acc: { [key: string]: UserResponse[] }, response: UserResponse) => {
            if (!acc[response.roundTitle]) {
              acc[response.roundTitle] = [];
            }
            acc[response.roundTitle].push(response);
            return acc;
          },
          {}
        )
      : {};

    return groupedResponses;
  };

  const responsesGroupedByRound = getResponsesGroupedByRound();

  return (
    <div>
      <h2>Your score: {score}</h2>
      {Object.keys(responsesGroupedByRound).map((roundTitle) => (
        <div key={roundTitle}>
          <h2>Round: {roundTitle}</h2>
          {responsesGroupedByRound[roundTitle].map(
            (response: UserResponse, index: number) => (
              <p key={index}>
                Q{index + 1}: {response.question} -{" "}
                {response.is_correct ? "Correct" : "Incorrect"}
              </p>
            )
          )}
        </div>
      ))}
      <button onClick={handleGoHomeClick}>Go home</button>
    </div>
  );
};

export default Score;
