import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home/Home";
import Quiz from "./components/Quiz/Quiz";
import Score from "./components/Score/Score";
import { QuizProvider } from "./context/QuizContext";
import { apiData } from "./data";

function App() {
  // const [quizData, setQuizData] = useState<any>(null);
  const [quizData, setQuizData] = useState<any>(apiData);


  // useEffect(() => {
  //   const API_URL = process.env.REACT_APP_API_URL;
  //   if (!API_URL) {
  //     throw new Error('API is not defined');
  //   }
  //   fetch(API_URL)
  //     .then((response) => response.json())
  //     .then((data) => setQuizData(data))
  //     .catch((error) => console.log(error));
  // }, []);

  // useEffect(() => {
  //   const API_URL = `https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json`;
  //   fetch(API_URL)
  //     .then((response) => response.json())
  //     .then((data) => setQuizData(data))
  //     .catch((error) => console.log(error));
  // }, []);

  // setQuizData(apiData);

  return (
    <QuizProvider>
      <Router>
        <Routes>
          <Route
            path="/quiz/:activityId/*"
            element={<Quiz data={quizData} />}
          />
          <Route path="/score" element={<Score />} />
          <Route
            path="/"
            element={quizData ? <Home data={quizData} /> : "Loading..."}
          />
        </Routes>
      </Router>
    </QuizProvider>
  );
}

export default App;
