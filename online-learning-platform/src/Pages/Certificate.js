import React from "react";
import { useParams } from "react-router-dom";

function Certificate({ enrolledCourses, userName }) {
    const { id } = useParams();
    const course = enrolledCourses.find(c => c.id === parseInt(id));

    if (!course) return <h2>No certificate available.</h2>;

    return (
        <div className="container">
            <div className="certificate">
                <h1>Certificate of Completion</h1>
                <p>This certifies that</p>
                <h2>{userName}</h2>
                <p>has successfully completed</p>
                <h2>{course.title}</h2>
                <p>Congratulations!</p>
            </div>
        </div>
    );
}

export default Certificate;
