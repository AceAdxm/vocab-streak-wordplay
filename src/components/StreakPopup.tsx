
import React, { useEffect, useState } from 'react';

interface StreakPopupProps {
  streak: number;
  isVisible: boolean;
  onHide: () => void;
}

const StreakPopup = ({ streak, isVisible, onHide }: StreakPopupProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg shadow-lg animate-scale-in">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔥</span>
          <div>
            <div className="font-bold text-lg">Streak: {streak}</div>
            <div className="text-sm opacity-90">Keep it up!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakPopup;
