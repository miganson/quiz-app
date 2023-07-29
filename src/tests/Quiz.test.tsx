import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
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

    jest.runAllTimers();
    await waitFor(() => {
      expect(
        screen.getByText("I really enjoy *to play football* with friends.")
      ).toBeInTheDocument();
    });
  });

  it("advances to the next question on button click (no rounds)", async () => {
    const mockDataNoRounds = {
      ...mockData,
      activities: [mockData.activities[0]],
    };

    render(
      <MemoryRouter initialEntries={["/quiz/1"]}>
        <Routes>
          <Route
            path="/quiz/:activityId"
            element={<Quiz data={mockDataNoRounds} />}
          />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText("Correct");
    fireEvent.click(screen.getByText("Correct"));

    await waitFor(() => {
      expect(
        screen.getByText("My friend *like listening* to songs in English")
      ).toBeInTheDocument();
    });
  });

  it("advances to the next question on button click (with rounds)", async () => {
    const mockDataWithRounds = {
      ...mockData,
      activities: [mockData.activities[1]],
    };

    render(
      <MemoryRouter initialEntries={["/quiz/2"]}>
        <Routes>
          <Route
            path="/quiz/:activityId"
            element={<Quiz data={mockDataWithRounds} />}
          />
        </Routes>
      </MemoryRouter>
    );

    jest.runAllTimers();
    await screen.findByText("Correct");
    fireEvent.click(screen.getByText("Correct"));

    jest.runAllTimers();
    await waitFor(() => {
      expect(
        screen.getByText(
          "Watching films at home is *more cheaper* than at the cinema."
        )
      ).toBeInTheDocument();
    });
  });

  it("redirects to /score when all questions are answered", () => {
    render(
      <MemoryRouter initialEntries={["/quiz/1"]}>
        <Routes>
          <Route path="/quiz/:activityId" element={<Quiz data={mockData} />} />
          <Route path="/score" element={<div>Score Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Correct"));
    fireEvent.click(screen.getByText("Correct"));
    expect(screen.getByText("Score Page")).toBeInTheDocument();
  });
});
