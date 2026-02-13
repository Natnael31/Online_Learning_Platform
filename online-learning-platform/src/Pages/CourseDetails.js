import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CourseDetails({ courses, enrollCourse, completeLesson, updateLessonProgress, enrolledCourses }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const playerRef = useRef(null);
    const intervalRef = useRef(null);
    const containerRef = useRef(null);

    const course = courses.find(c => c.id === parseInt(id));
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [duration, setDuration] = useState(0);
    const [canComplete, setCanComplete] = useState(false);
    const [apiReady, setApiReady] = useState(false);
    const [playerId] = useState(`player-${Date.now()}`);

    const lesson = course?.lessons[selectedIndex];

    // Get enrolled course data
    const enrolledCourse = enrolledCourses.find(c => c.id === course?.id);

    // Check if current lesson is completed
    const isCurrentLessonCompleted = enrolledCourse?.completedLessons?.includes(lesson?.title) || false;

    // Count completed lessons count for dashboard
    const completedCount = enrolledCourse?.completedLessons?.length || 0;
    const totalLessons = course?.lessons?.length || 0;

    // Load YouTube API once
    useEffect(() => {
        const loadYouTubeAPI = () => {
            return new Promise((resolve) => {
                if (window.YT && window.YT.Player) {
                    setApiReady(true);
                    resolve();
                    return;
                }

                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';

                window.onYouTubeIframeAPIReady = () => {
                    setApiReady(true);
                    resolve();
                };

                document.body.appendChild(tag);
            });
        };

        loadYouTubeAPI();

        return () => {
            window.onYouTubeIframeAPIReady = null;
        };
    }, []);

    // Safe player cleanup function
    const safelyDestroyPlayer = () => {
        if (playerRef.current) {
            try {
                if (playerRef.current.stopVideo) {
                    playerRef.current.stopVideo();
                }
                if (playerRef.current.destroy) {
                    playerRef.current.destroy();
                }
            } catch (e) {
                console.log("Error destroying player:", e);
            } finally {
                playerRef.current = null;
            }
        }
    };

    // Initialize player on mount and lesson change
    useEffect(() => {
        if (!lesson || !apiReady) return;

        // Clean up previous player and interval
        safelyDestroyPlayer();

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Clear container
        const container = document.getElementById(playerId);
        if (container) {
            container.innerHTML = '';
        }

        // Reset canComplete for new lesson
        setCanComplete(false);
        setDuration(0);

        // Create new player
        const timer = setTimeout(() => {
            try {
                playerRef.current = new window.YT.Player(playerId, {
                    videoId: lesson.videoId,
                    width: '100%',
                    height: '400',
                    playerVars: {
                        autoplay: 0,
                        controls: 1,
                        rel: 0,
                        modestbranding: 1
                    },
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange
                    },
                });
            } catch (e) {
                console.log("Error creating player:", e);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
        // eslint-disable-next-line
    }, [lesson, apiReady, playerId, selectedIndex]);

    const onPlayerReady = (event) => {
        const videoDuration = event.target.getDuration();
        setDuration(videoDuration);

        // Restore previous progress if needed
        if (enrolledCourse?.watchedProgress?.[lesson.title]) {
            const savedProgress = enrolledCourse.watchedProgress[lesson.title];
            if (savedProgress > 0 && savedProgress < videoDuration - 1) {
                event.target.seekTo(savedProgress);
            }
        }

        // If lesson is already completed, we don't need to enable complete button
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING && duration > 0) {
            startTracking();
        } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        // Check if video ended and lesson is not already completed
        if (event.data === window.YT.PlayerState.ENDED && !isCurrentLessonCompleted) {
            setCanComplete(true);
            updateLessonProgress(course.id, lesson.title, duration);
        }
    };

    const startTracking = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                try {
                    const currentTime = playerRef.current.getCurrentTime();
                    updateLessonProgress(course.id, lesson.title, currentTime);

                    // Check if video is near the end and lesson is not completed
                    if (duration && currentTime >= duration - 1 && !isCurrentLessonCompleted) {
                        setCanComplete(true);
                    }
                } catch (e) {
                    console.log("Error tracking progress:", e);
                }
            }
        }, 1000);
    };

    const handleComplete = () => {
        // Enroll course if not already enrolled
        if (!enrolledCourse) {
            enrollCourse(course);
        }

        // Complete the lesson
        completeLesson(course.id, lesson.title);

        // Disable the complete button
        setCanComplete(false);

        // Check if all lessons are completed
        const newCompletedCount = (enrolledCourse?.completedLessons?.length || 0) + 1;

        // If all lessons are completed, you could show a message or navigate
        if (newCompletedCount === totalLessons) {
            // Optionally show a congratulatory message
            console.log("Course completed!");
        }
    };

    const handleLessonChange = (newIndex) => {
        if (newIndex >= 0 && newIndex < course.lessons.length) {
            // Clear interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            // Update selected index - this will trigger player recreation
            setSelectedIndex(newIndex);
        }
    };

    if (!course) return <h2>Course not found</h2>;

    return (
        <div className="container">
            <div className="card">
                <h1>{course.title}</h1>

                {/* Progress indicator for dashboard */}
                <div className="course-progress">
                    <p>Progress: {completedCount}/{totalLessons} lessons completed</p>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${(completedCount / totalLessons) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="lesson-nav">
                    <button
                        className="circle-btn"
                        disabled={selectedIndex === 0}
                        onClick={() => handleLessonChange(selectedIndex - 1)}
                    >
                        ←
                    </button>
                    <span>
                        Lesson {selectedIndex + 1}: {lesson?.title}
                        {isCurrentLessonCompleted && " ✓ (Completed)"}
                    </span>
                    <button
                        className="circle-btn"
                        disabled={selectedIndex === course.lessons.length - 1}
                        onClick={() => handleLessonChange(selectedIndex + 1)}
                    >
                        →
                    </button>
                </div>

                <div
                    id={playerId}
                    ref={containerRef}
                    style={{ minHeight: '400px' }}
                ></div>

                {isCurrentLessonCompleted ? (
                    <button className="completed-btn" disabled>
                        ✓ Lesson Completed
                    </button>
                ) : (
                    <button
                        disabled={!canComplete}
                        className={canComplete ? "active-btn" : "inactive-btn"}
                        onClick={handleComplete}
                    >
                        Mark Lesson Complete
                    </button>
                )}
            </div>
        </div>
    );
}

export default CourseDetails;