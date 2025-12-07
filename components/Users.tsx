"use client";
import React from "react";
import toast from "react-hot-toast";

interface User {
  _id: string;
  email: string;
  password: string;
  createdAt: string | Date;
  deviceType?: string;
  updatedAt?: string;
}

interface UsersProps {
  users: User[];
}

const Users: React.FC<UsersProps> = ({ users }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch((error) => console.error("Failed to copy: ", error));
  };

  return (
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-x-auto">
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <th className="px-4 py-3">No.</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Password</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr
                key={user._id}
                className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 break-words">{user.email}</td>
                <td className="px-4 py-3 break-words">{user.password}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      copyToClipboard(`${user.email}   ${user.password}`)
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {users.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 p-5">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Users;
