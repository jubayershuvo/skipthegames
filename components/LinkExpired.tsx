"use client";

import { AlertCircle } from "lucide-react";


export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <AlertCircle className="mx-auto text-red-500" size={60} />
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          Oops, link expired
        </h1>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          The link you followed is no longer valid. Please request a new one.
        </p>

      </div>
    </div>
  );
}
