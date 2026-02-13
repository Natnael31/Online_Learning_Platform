// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import CourseList from "./Pages/CourseList";
import CourseDetails from "./Pages/CourseDetails";
import Dashboard from "./Pages/Dashboard";
import Certificate from "./Pages/Certificate";
import Navbar from "./Components/Navbar";
import "./App.css";

function App() {
  const [userName, setUserName] = useState("Student");

  const defaultCourses = [
    {
      id: 1,
      title: "React Basics",
      description: "Master modern React from beginner to advanced.",
      lessons: [
        { title: "What is React?", videoId: "Ke90Tje7VS0" },
        { title: "JSX Explained", videoId: "bMknfKXIFA8" },
        { title: "Functional Components", videoId: "Y2hgEGPzTZY" },
        { title: "React Hooks", videoId: "f687hBjwFcM" },
        { title: "useEffect Deep Dive", videoId: "0ZJgIjIuY7U" }
      ]
    },
    {
      id: 2,
      title: "JavaScript Essentials",
      description: "Complete modern JavaScript mastery.",
      lessons: [
        { title: "JS Fundamentals", videoId: "W6NZfCO5SIk" },
        { title: "Functions & Scope", videoId: "PoRJizFvM7s" },
        { title: "Objects & Arrays", videoId: "vEROU2XtPR8" },
        { title: "Async JavaScript", videoId: "PoRJizFvM7s" },
        { title: "ES6 Features", videoId: "NCwa_xi0Uuc" }
      ]
    }
  ];

  const [courses] = useState(defaultCourses);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // enroll course and track watched lessons
  const enrollCourse = (course) => {
    if (!enrolledCourses.find(c => c.id === course.id)) {
      setEnrolledCourses([
        ...enrolledCourses,
        {
          ...course,
          completedLessons: [],
          watchedProgress: {} // track per lesson watch time
        }
      ]);
    }
  };

  const completeLesson = (courseId, lessonTitle) => {
    setEnrolledCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? {
            ...course,
            completedLessons: [
              ...new Set([...course.completedLessons, lessonTitle])
            ]
          }
          : course
      )
    );
  };

  const updateLessonProgress = (courseId, lessonTitle, progress) => {
    setEnrolledCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? {
            ...course,
            watchedProgress: {
              ...course.watchedProgress,
              [lessonTitle]: progress
            }
          }
          : course
      )
    );
  };

  return (
    <Router>
      <Navbar userName={userName} enrolledCourses={enrolledCourses} />
      <Routes>
        <Route path="/" element={<Home setUserName={setUserName} />} />
        <Route path="/courses" element={<CourseList courses={courses} />} />
        <Route
          path="/courses/:id"
          element={
            <CourseDetails
              courses={courses}
              enrollCourse={enrollCourse}
              completeLesson={completeLesson}
              updateLessonProgress={updateLessonProgress}
              enrolledCourses={enrolledCourses}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              enrolledCourses={enrolledCourses}
              userName={userName}
            />
          }
        />
        <Route
          path="/certificate/:id"
          element={
            <Certificate
              enrolledCourses={enrolledCourses}
              userName={userName}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;