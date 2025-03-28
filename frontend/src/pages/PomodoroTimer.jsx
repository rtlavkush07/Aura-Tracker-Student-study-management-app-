import React, { useState, useEffect, useRef } from 'react';

const PomodoroTimer = () => {
    const [time, setTime] = useState(2 * 60); // Default 2 minutes for Pomodoro
    const [isActive, setIsActive] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0); // To track the number of tab switches
    const startTimeRef = useRef(null); // To store the starting time

    const totalTime = 2 * 60; // Total time for Pomodoro (2 minutes)

    // Fullscreen function to toggle full screen mode
    const enterFullScreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
    };

    useEffect(() => {
        if (isActive) {
            startTimeRef.current = Date.now() - (totalTime - time) * 1000; // Initialize start time
            const timer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                setTime(totalTime - elapsed);
            }, 1000);

            return () => clearInterval(timer); // Clear interval on cleanup
        }
    }, [isActive, time]);

    useEffect(() => {
        if (time <= 0) {
            alert("Time's up! Take a break!");
            resetTimer(); // Reset to 2 minutes after Pomodoro ends
        }
    }, [time]);

    // Pause the timer when the tab is switched or the browser loses focus
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isActive) { // Only increment tabSwitchCount if the timer is active
                setTabSwitchCount(prevCount => prevCount + 1); // Increment tab switch count when tab is hidden
                alert("You've switched tabs!"); // Alert on every tab switch
                if (tabSwitchCount >= 2) {
                    alert("You've switched tabs more than 2 times! Resetting Pomodoro timer.");
                    resetTimer(); // Reset the timer if switched more than 2 times
                }
                setIsActive(false); // Pause the timer when the tab is hidden
            } else if (!document.hidden && isActive) {
                startTimeRef.current = Date.now() - (totalTime - time) * 1000; // Resume the timer when the tab becomes visible
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange); // Cleanup event listener
        };
    }, [isActive, time, tabSwitchCount]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const resetTimer = () => {
        setTime(2 * 60); // Reset to 2 minutes
        setIsActive(false);
        setTabSwitchCount(0); // Reset tab switch count
        startTimeRef.current = null;
    };

    const handleStartPause = () => {
        setIsActive(!isActive);
        if (!isActive) {
            enterFullScreen(); // Request full-screen mode when the timer starts
            startTimeRef.current = Date.now();
        }
    };

    const handlePause = () => {
        setIsActive(false); // Pause the timer
    };

    const handleReset = () => {
        resetTimer(); // Reset the timer
    };

    // Calculate the stroke offset for the progress circle
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (time / totalTime) * circumference;

    return (
        <div className=''>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
                <h1 className="text-6xl font-bold mb-6">Pomodoro</h1>
                <div className="relative flex items-center justify-center w-48 h-48 mb-8">
                    <svg className="absolute w-full h-full transform -rotate-90">
                        <circle
                            cx="50%"
                            cy="50%"
                            r={radius}
                            strokeWidth="8"
                            className="text-gray-600"
                            stroke="currentColor"
                            fill="transparent"
                        />
                        <circle
                            cx="50%"
                            cy="50%"
                            r={radius}
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="text-red-500"
                            strokeLinecap="round"
                            fill="transparent"
                            stroke="currentColor"
                        />
                    </svg>
                    <div className="flex flex-col items-center justify-center text-3xl font-semibold">
                        {formatTime(time)}
                        <span className="text-sm text-gray-400">{isActive ? "PAUSE" : "START"}</span>
                    </div>
                </div>
                <div className="flex space-x-4 mb-4">
                    {/* Show Start button if not active */}
                    {!isActive && (
                        <button onClick={handleStartPause} className="px-8 py-2 bg-teal-500 rounded-full text-lg font-semibold">
                            Start
                        </button>
                    )}

                    {/* Show Pause and Reset buttons if active */}
                    {isActive && (
                        <>
                            <button onClick={handlePause} className="px-8 py-2 bg-yellow-500 rounded-full text-lg font-semibold">
                                Pause
                            </button>
                            <button onClick={handleReset} className="px-8 py-2 bg-gray-700 rounded-full text-lg font-semibold">
                                Reset
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PomodoroTimer;
