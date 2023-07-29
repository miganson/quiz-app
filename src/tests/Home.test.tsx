import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Home } from "../components/Home/Home";
import { mockData } from "./mocks/mockData";

describe("Home component", () => {
  it("renders page", () => {
    render(
      <MemoryRouter>
        <Home data={mockData} />
      </MemoryRouter>
    );
  });

  it("displays quiz buttons", () => {
    render(
      <MemoryRouter>
        <Home data={mockData} />
      </MemoryRouter>
    );
    expect(screen.getByText("Activity One")).toBeInTheDocument();
    expect(screen.getByText("Activity Two")).toBeInTheDocument();
  });

  it("navigates to quiz on button click", async  () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Home data={mockData} />} />
          <Route path="/quiz/:activityId" element={<div>Quiz Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Activity One"));
    expect(await screen.findByText("Quiz Page")).toBeInTheDocument();
  });
});
