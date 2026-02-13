import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ enrolledCourses, userName }) {
    const navigate = useNavigate();

    // Calculate progress for each course
    const getCourseProgress = (course) => {
        const completedCount = course.completedLessons?.length || 0;
        const totalLessons = course.lessons?.length || 0;
        const percent = totalLessons > 0
            ? Math.round((completedCount / totalLessons) * 100)
            : 0;

        return {
            completedCount,
            totalLessons,
            percent
        };
    };

    // Check if all lessons in a course are completed
    const isCourseCompleted = (course) => {
        const completedCount = course.completedLessons?.length || 0;
        const totalLessons = course.lessons?.length || 0;
        return completedCount === totalLessons && totalLessons > 0;
    };

    if (enrolledCourses.length === 0) {
        return (
            <div className="container">
                <h1>{userName}'s Dashboard</h1>
                <div className="card">
                    <p>You haven't enrolled in any courses yet.</p>
                    <button onClick={() => navigate("/courses")}>
                        Browse Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>{userName}'s Dashboard</h1>

            {enrolledCourses.map(course => {
                const progress = getCourseProgress(course);
                const completed = isCourseCompleted(course);

                return (
                    <div key={course.id} className="card">
                        <h2>{course.title}</h2>

                        {/* Progress details */}
                        <div className="progress-details">
                            <p>
                                {progress.completedCount} of {progress.totalLessons} lessons completed
                                ({progress.percent}%)
                            </p>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progress.percent}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* List of lessons with completion status */}
                        <div className="lesson-list">
                            <h3>Lessons:</h3>
                            <ul>
                                {course.lessons.map((lesson, index) => (
                                    <li key={index} className="lesson-item">
                                        <span>
                                            {index + 1}. {lesson.title}
                                        </span>
                                        {course.completedLessons?.includes(lesson.title) ? (
                                            <span className="completed-badge">✓ Completed</span>
                                        ) : (
                                            <span className="pending-badge">Not started</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action buttons */}
                        <div className="dashboard-actions">
                            <button
                                onClick={() => navigate(`/courses/${course.id}`)}
                                className="secondary-btn"
                            >
                                Continue Learning
                            </button>

                            {completed && (
                                <button
                                    onClick={() => navigate(`/certificate/${course.id}`)}
                                    className="certificate-btn"
                                >
                                    View Certificate
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Dashboard;