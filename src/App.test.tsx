import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { mockData } from "./tests/mocks/mockData";

describe("App component", () => {
  let mockFetch: jest.SpyInstance;

  beforeEach(() => {
    mockFetch = jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      } as Response)
    );
  });

  afterEach(() => {
    mockFetch.mockRestore();
  });

  it("fetches data and renders Home on initial load", async () => {
    render(<App />);

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    // Use the `findByText` query to find the text and wait until it appears in the document
    const caeText = await screen.findByText("CAE");
    expect(caeText).toBeInTheDocument();

    const errorFindText = await screen.findByText("Error Find");
    expect(errorFindText).toBeInTheDocument();
  });

  // More tests can be added here to check other routes, error handling, etc.
});
