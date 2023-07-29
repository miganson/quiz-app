import React from "react";
import { render as rtlRender, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Score from "../components/Score/Score";
import { QuizProvider, QuizContext } from "../context/QuizContext";

// This function takes an UI, options and wrapper component and returns render result
function customRender(
  ui: React.ReactElement,
  { providerProps, ...renderOptions }: any
) {
  return rtlRender(
    <QuizContext.Provider {...providerProps}>{ui}</QuizContext.Provider>,
    renderOptions
  );
}

describe("Score component", () => {
  it("renders without crashing", () => {
    customRender(
      <MemoryRouter initialEntries={["/score"]}>
        <Routes>
          <Route path="/score" element={<Score />} />
        </Routes>
      </MemoryRouter>,
      {
        providerProps: {
          value: {
            userResponses: [],
            score: 0,
            setUserResponses: () => {},
            setScore: () => {},
          },
        },
      }
    );
  });

  it("displays the correct score", () => {
    customRender(
      <MemoryRouter initialEntries={["/score"]}>
        <Routes>
          <Route path="/score" element={<Score />} />
        </Routes>
      </MemoryRouter>,
      {
        providerProps: {
          value: {
            userResponses: [],
            score: 5,
            setUserResponses: () => {},
            setScore: () => {},
          },
        },
      }
    );
    expect(screen.getByText("Your score: 5")).toBeInTheDocument();
  });

  it("displays user responses correctly", () => {
    const userResponses = [
      { roundTitle: "Round 1", question: "Question 1", is_correct: true },
      { roundTitle: "Round 1", question: "Question 2", is_correct: false },
      { roundTitle: "Round 2", question: "Question 3", is_correct: true },
    ];

    customRender(
      <MemoryRouter initialEntries={["/score"]}>
        <Routes>
          <Route path="/score" element={<Score />} />
        </Routes>
      </MemoryRouter>,
      {
        providerProps: {
          value: {
            userResponses,
            score: 2,
            setUserResponses: () => {},
            setScore: () => {},
          },
        },
      }
    );

    expect(screen.getByText("Your score: 2")).toBeInTheDocument();

    expect(
      screen.getByText(/Q\s*1\s*:\s*Question 1\s*-\s*True/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Q\s*2\s*:\s*Question 2\s*-\s*False/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Q\s*1\s*:\s*Question 3\s*-\s*True/)
    ).toBeInTheDocument();
  });

  it("redirects to home when Go home button is clicked", async () => {
    const userResponses = [
      { roundTitle: "Round 1", question: "Question 1", is_correct: true },
      { roundTitle: "Round 1", question: "Question 2", is_correct: false },
      { roundTitle: "Round 2", question: "Question 3", is_correct: true },
    ];
    const Home = () => <div>Home Page</div>;

    customRender(
      <MemoryRouter initialEntries={["/score"]}>
        <Routes>
          <Route path="/score" element={<Score />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>,
      {
        providerProps: {
          value: {
            userResponses,
            score: 2,
            setUserResponses: () => {},
            setScore: () => {},
          },
        },
      }
    );

    const button = screen.getByRole("button", {
      name: "Go home",
    });
    fireEvent.click(button); // Click the button

    expect(await screen.findByText("Home Page")).toBeInTheDocument();
  });
});
