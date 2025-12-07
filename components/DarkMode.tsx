'use client';
import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';


function DarkMode() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        setDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setDarkMode(false);
      }
    }, []);
  
    const toggleDarkMode = () => {
      if (darkMode) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
      setDarkMode(!darkMode);
    };
  
    return (
      <button
        onClick={toggleDarkMode}
        className="p-1 m-1 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300"
      >
        {darkMode ? (
          <SunIcon className="w-5 h-5" />
        ) : (
          <MoonIcon className="w-5 h-5" />
        )}
      </button>
    );
}

export default DarkMode