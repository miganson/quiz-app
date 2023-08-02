import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Quiz } from "../components/Quiz/Quiz";
import { mockData } from "./mocks/mockData";

jest.useFakeTimers();

describe("Quiz component", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Quiz data={mockData} />
      </MemoryRouter>
    );
  });

  it("displays the correct activity name", async () => {
    render(
      <MemoryRouter initialEntries={["/quiz/1"]}>
        <Routes>
          <Route path="/quiz/:activityId" element={<Quiz data={mockData} />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText("Activity One")).toBeInTheDocument();
  });

  it("displays the current question", async () => {
    render(
      <MemoryRouter initialEntries={["/quiz/1"]}>
        <Routes>
          <Route path="/quiz/:activityId" element={<Quiz data={mockData} />} />
        </Routes>
      </MemoryRouter>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(await screen.findByText(/I really enjoy/i)).toBeInTheDocument();
    expect(await screen.findByText(/to play football/i)).toBeInTheDocument();
    expect(await screen.findByText(/with friends./i)).toBeInTheDocument();
  });

  it("correctly updates the question on answering", async () => {
    render(
      <MemoryRouter initialEntries={["/quiz/1"]}>
        <Routes>
          <Route path="/quiz/:activityId" element={<Quiz data={mockData} />} />
        </Routes>
      </MemoryRouter>
    );
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const [correctButton, incorrectButton] = screen.getAllByText(/Correct/i);
    fireEvent.click(correctButton);
    act(() => {
      jest.advanceTimersByTime(500);
    });

    const questionNumberHeading = await screen.findByText(/Q: 2/i);
    expect(questionNumberHeading).toBeInTheDocument();
  });

  it("redirects to /score when all questions are answered", async () => {
    // Added async here
    render(
      <MemoryRouter initialEntries={["/quiz/1"]}>
        <Routes>
          <Route path="/quiz/:activityId" element={<Quiz data={mockData} />} />
          <Route path="/score" element={<div>Score Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    act(() => {
      jest.runAllTimers();
    });

    await screen.findByText("Correct");

    fireEvent.click(screen.getByText("Correct")); // Answer the first question
    act(() => {
      jest.runAllTimers();
    });

    expect(await screen.findByText(/My friend/i)).toBeInTheDocument();
    expect(await screen.findByText(/like listening/i)).toBeInTheDocument();
    expect(await screen.findByText(/to songs in English/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Correct")); // Answer the second question
    act(() => {
      jest.runAllTimers();
    });

    await screen.findByText("Score Page");
  });
});
