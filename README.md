# Quiz App

Quiz App is an interactive application designed to test your grammar skills. The application fetches a list of activities from an API, where each activity presents a series of true or false questions about grammar.

## Features

- A home page that lists available activities.
- Quiz component that handles the logic for displaying questions, accepting answers, and navigating through questions.
- Score page that shows your score after you've completed an activity.
- Context API for managing state across components.
- Routing and navigation via react-router-dom.
- Smooth transition and animations when navigating between questions and activities.
- Supports fetching and displaying dynamic content from an API.

## Installation

To run this project:

1. Clone the repository to your local machine using: `git clone https://github.com/miganson/quiz-app.git`
2. Install dependencies with `npm install`
3. Start the local server with `npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Testing

This project uses Jest and @testing-library/react for testing. There are tests covering rendering and functionality of the Home, Quiz, and Score components, as well as navigation between them.

To run the tests, you can use `npm test` in the project directory. This will launch the test runner in the interactive watch mode. 

### Home Component
- It checks if the component renders without crashing
- It verifies that the "Activity One" and "Activity Two" buttons are present
- It checks if clicking the "Activity One" button navigates to the quiz page

### Quiz Component
- It checks if the component renders without crashing
- It verifies that the "Activity One" is displayed as the activity name
- It verifies that the current question is displayed and updates correctly on answering
- It checks if the component redirects to "/score" when all questions are answered

### Score Component
- It checks if the component renders without crashing
- It verifies that the correct score is displayed
- It checks if the user responses are displayed correctly
- It checks if clicking the "HOME" button navigates back to the home page

## Usage

After launching the app, you will be presented with a list of available activities on the Home page. Select an activity to start the quiz. Each statement in the quiz needs to be classified as 'correct' or 'incorrect'. After answering all the questions, you will be redirected to the Score page, where you can see your score for the activity. 
