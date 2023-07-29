import { useNavigate } from "react-router-dom";
import { useScore, useUserResponses } from "../../context/QuizContext";
import { UserResponse } from "../../types/quizInterfaces";

const Score = () => {
  const { score } = useScore(); // use context hook to get score
  const { userResponses } = useUserResponses(); // use context hook to get userResponses

  console.log(userResponses);

  const navigate = useNavigate();

  const handleGoHomeClick = () => {
    navigate("/");
  };

  // This helper function will return responses grouped by round titles
  const getResponsesGroupedByRound = () => {
    const groupedResponses = userResponses
      ? (userResponses as UserResponse[]).reduce<{
          [key: string]: UserResponse[];
        }>((acc, response: UserResponse) => {
          const key = response.roundTitle;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(response);
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

  return (
    <div>
      <h2>Results</h2>
      <div>Activity: {activityNumber}</div>
      {Object.keys(responsesGroupedByRound).map((roundTitle) => (
        <div key={roundTitle}>
          <h2>{roundTitle}</h2>
          {responsesGroupedByRound[roundTitle].map(
            (response: UserResponse, index: number) => (
              <p key={index}>
                Q{index + 1}: {response.question} -{" "}
                {response.isUserAnswerCorrect ? "Correct" : (response.is_correct ? "True" : "False")}
              </p>
            )
          )}
        </div>
      ))}
      <h2>Your score: {score}</h2>
      <button onClick={handleGoHomeClick}>Go home</button>
    </div>
  );
};

export default Score;
