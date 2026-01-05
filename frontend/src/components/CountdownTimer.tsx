import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    onResend: () => void;
    resendText: string;
    timerText: string;
    storageKey: string;
    userEmail?: string;
}

export const CountdownTimer = ({
    onResend,
    resendText,
    timerText,
    storageKey,
    userEmail,
}: CountdownTimerProps) => {
    const uniqueKey = userEmail ? `${storageKey}_${userEmail}` : storageKey;
    const TOTAL_SECONDS = 120;
    
    const [seconds, setSeconds] = useState(() => {
        const savedExpiry = localStorage.getItem(uniqueKey);
        
        if (savedExpiry) {
            const remaining = Math.floor((Number(savedExpiry) - Date.now()) / 1000);
            
            if (remaining > 0) {
                return remaining;
            }
        }
        
        const newExpiry = Date.now() + (TOTAL_SECONDS * 1000);
        localStorage.setItem(uniqueKey, newExpiry.toString());
        return TOTAL_SECONDS;
    });

    useEffect(() => {
        if (seconds <= 0) return;

        const timer = setInterval(() => {
            setSeconds(prev => {
                const newSeconds = prev - 1;
                
                if (newSeconds <= 0) {
                    clearInterval(timer);
                    localStorage.removeItem(uniqueKey);
                    return 0;
                }
                
                return newSeconds;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds, uniqueKey]);

    const handleResend = () => {
        const newExpiry = Date.now() + (TOTAL_SECONDS * 1000);
        localStorage.setItem(uniqueKey, newExpiry.toString());
        setSeconds(TOTAL_SECONDS);
        onResend();
    };

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="text-center">
            {seconds > 0 ? (
                <div className="text-sm text-gray-600">
                    {timerText} <span className="font-semibold text-primary">{formatTime(seconds)}</span>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-primary font-medium underline cursor-pointer hover:text-orange-600 transition-colors"
                >
                    {resendText}
                </button>
            )}
        </div>
    );
};