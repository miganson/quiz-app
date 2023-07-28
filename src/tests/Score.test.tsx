import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Score from "../components/Score";

describe("Score component", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/score", state: { userResponses: [], score: 0 } },
        ]}
      >
        <Routes>
          <Route path="/score" element={<Score />} />
        </Routes>
      </MemoryRouter>
    );
  });

  it("displays the correct score", () => {
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/score", state: { userResponses: [], score: 5 } },
        ]}
      >
        <Routes>
          <Route path="/score" element={<Score />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Your score: 5")).toBeInTheDocument();
  });

  it("displays user responses correctly", () => {
    const userResponses = [
      { roundTitle: "Round 1", question: "Question 1", is_correct: true },
      { roundTitle: "Round 1", question: "Question 2", is_correct: false },
      { roundTitle: "Round 2", question: "Question 3", is_correct: true },
    ];

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/score", state: { userResponses, score: 2 } },
        ]}
      >
        <Routes>
          <Route path="/score" element={<Score />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Your score: 2")).toBeInTheDocument();
    expect(screen.getByText("Q1: Question 1 - Correct")).toBeInTheDocument();
    expect(screen.getByText("Q2: Question 2 - Incorrect")).toBeInTheDocument();
    expect(screen.getByText("Q1: Question 3 - Correct")).toBeInTheDocument();
  });

  it("redirects to home when Go home button is clicked", async () => {
    const userResponses = [
      { roundTitle: "Round 1", question: "Question 1", is_correct: true },
      { roundTitle: "Round 1", question: "Question 2", is_correct: false },
      { roundTitle: "Round 2", question: "Question 3", is_correct: true },
    ];
    const Home = () => <div>Home Page</div>;

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/score", state: { userResponses, score: 2 } },
        ]}
      >
        <Routes>
          <Route path="/score" element={<Score />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    const button = screen.getByRole("button", {
      name: "Go home",
    });
    fireEvent.click(button); // Click the button

    expect(await screen.findByText("Home Page")).toBeInTheDocument();
  });
});
