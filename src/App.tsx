import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Score from "./components/Score";

function App() {
  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    fetch("https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json")
      .then((response) => response.json())
      .then((data) => setQuizData(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    console.log(quizData);
  }, [quizData]);

  return (
    <Router>
      <Routes>
        <Route path="/quiz/:activityId/*" element={<Quiz data={quizData} />} />
        <Route path="/score" element={<Score />} />
        <Route
          path="/"
          element={quizData ? <Home data={quizData} /> : "Loading..."}
        />
      </Routes>
    </Router>
  );
}

export default App;
