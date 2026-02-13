import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ userName, enrolledCourses }) {
    const navigate = useNavigate();

    const hasCertificates = enrolledCourses.some(
        course => course.completedLessons.length === course.lessons.length
    );

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    <Link to="/">SkillLearn</Link>
                </div>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/courses" className="nav-link">Courses</Link>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>

                    <div className="nav-dropdown">
                        <button className="nav-link dropdown-btn">
                            Certificate ▼
                        </button>
                        <div className="dropdown-content">
                            {hasCertificates ? (
                                enrolledCourses
                                    .filter(course => course.completedLessons.length === course.lessons.length)
                                    .map(course => (
                                        <Link
                                            key={course.id}
                                            to={`/certificate/${course.id}`}
                                            className="dropdown-item"
                                        >
                                            {course.title}
                                        </Link>
                                    ))
                            ) : (
                                <span className="dropdown-item disabled">
                                    None awarded yet
                                </span>
                            )}
                        </div>
                    </div>

                    <span className="nav-user">
                        Welcome, {userName}!
                    </span>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;