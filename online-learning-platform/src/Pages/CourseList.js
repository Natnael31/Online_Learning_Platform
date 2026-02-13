import React from "react";
import { Link } from "react-router-dom";

function CourseList({ courses }) {
    return (
        <div className="container">
            <h1>Courses</h1>
            {courses.map(course => (
                <div key={course.id} className="card">
                    <h2>{course.title}</h2>
                    <p>{course.description}</p>
                    <Link to={`/courses/${course.id}`}><button>View Course</button></Link>
                </div>
            ))}
        </div>
    );
}

export default CourseList;
