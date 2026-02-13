import React, { useState } from "react";
import { Link } from "react-router-dom";

function Home({ setUserName }) {
    const [name, setName] = useState("");

    return (
        <div className="container">
            <h1>Welcome to SkillLearn</h1>
            <input
                placeholder="Enter your name"
                onChange={e => { setName(e.target.value); setUserName(e.target.value); }}
            />
            <div>
                <Link to="/courses"><button>Browse Courses</button></Link>
            </div>
        </div>
    );
}

export default Home;
