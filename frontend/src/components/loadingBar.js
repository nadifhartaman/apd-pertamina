"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
function LoadingBar() {
    const {loading, setLoading} = useAuth()
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(!loading) return;
        setIsLoading(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress < 95) {
                    return prevProgress + 25;
                } else {
                    clearInterval(interval);
                    return 100;
                }
            });
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [loading]);

    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                setIsLoading(false);
                setLoading(false); 
            }, 500);
        }
    }, [progress, setLoading]);

    // useEffect(() => {
    //     console.log(progress)
    // },[progress])

    return (
        isLoading && (
            <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 z-50">
                <div
                    className="h-1 bg-blue-700 transition-width duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        )
    );
}

export default LoadingBar;