# Overview

This is an online learning paltform that provides video tutorial for students who want to learn about the fundamentals of JS and React.js framework.

To run the project locally: - Clone the repository - Open a terminal in the project folder.
-Run:
-npm install
-npm start

The purpose of the website is to help students learn the concepts very quickly and enable them to produce output within a short period of time.

[Software Demo Video](https://youtu.be/Nhz6PteQnZU)

# Web Pages

## Home Page

    - Displays available courses dynamically.

    - Users can select a course to begin learning.

    - Course list is rendered from a JavaScript data structure.

## Course Details Page (Dynamically Generated)

    - Displays selected course lessons.

    - Loads YouTube videos dynamically based on selected lesson.

    - Tracks real-time watch progress.

    - “Mark Lesson Complete” button becomes active only after 100% watch time.

    - Navigation arrows dynamically change lessons and videos.

## Dashboard Page

    - Displays enrolled courses.

    - Shows calculated completion percentage.

    - Progress updates dynamically based on completed lessons.

    - Completion status determines certification eligibility.

## Certificate Page

    - Displays certificates awarded to the student.

Navigation between pages is handled using React Router without page reloads.

# Development Environment

## Tools Used:

    - Visual Studio Code

    - Node.js

    - npm

    - Web browser (Chrome)

## Programming Language & Libraries:

    - JavaScript (ES6)

    - React.js

    - React Router DOM

    - YouTube IFrame API

CSS3 for styling

# Useful Websites

- [React Documentation](https://react.dev/learn)
- [React Router Documentation](https://reactrouter.com/home)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [YouTube IFrame API Documentation](https://developers.google.com/youtube/iframe_api_reference)

# Future Work

    - Add backend database integration for persistent storage
    - Implement user authentication and accounts
    - Add certificate generation as downloadable PDF
