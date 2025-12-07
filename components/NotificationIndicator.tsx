'use client';
import React from "react";

// Define props interface
interface NotificationIndicatorProps {
  count: number;
  handleClick: () => void;
}

const NotificationIndicator: React.FC<NotificationIndicatorProps> = ({ count, handleClick }) => {
  return (
    <div className="relative inline-block w-full">
      {/* Notification Icon */}
      <button
        onClick={handleClick}
        className="absolute  cursor-pointer right-4 flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800 dark:text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-2.21-1.343-4-3-4V6a3 3 0 00-6 0v1c-1.657 0-3 1.79-3 4v3.159c0 .538-.214 1.056-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
          />
        </svg>
        {/* Notification Count */}
        {count > 0 && (
          <span className="absolute top-0 right-0 block w-5 h-5 text-sm font-bold text-white bg-red-600 rounded-full">
            {count}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationIndicator;
