"use client";
import React, { useState, FormEvent, useEffect } from "react";
import LogoutBtn from "./LogoutBtn";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { adminLogin } from "@/lib/adminSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

interface Admin {
  name: string;
  username: string;
}

const ProfileEdit: React.FC = () => {
  const { admin, isAdminLoggedIn } = useAppSelector<{
    admin: Admin | null;
    isAdminLoggedIn: boolean;
    customers: never[];
  }>((state) => state.adminAuth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [oldpassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");

  useEffect(() => {
    setMounted(true); // Fix for hydration errors
  }, []);

  useEffect(() => {
    if (!isAdminLoggedIn) router.push("/admin/login");
  }, [isAdminLoggedIn, router]);

  const handleChangeName = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty.");
    const loading = toast.loading("Updating name...");
    try {
      const res = await axios.post("/api/admin/update-name", { name });
      dispatch(adminLogin(res.data.data));
      setName("");
      toast.success("Name updated successfully", { id: loading });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong", {
        id: loading,
      });
    }
  };

  const handleChangeUsername = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!username.trim()) return toast.error("Username cannot be empty.");
    if (username.includes(" "))
      return toast.error("Username cannot contain spaces.");
    const loading = toast.loading("Updating username...");
    try {
      const res = await axios.post("/api/admin/update-username", { username });
      dispatch(adminLogin(res.data.data));
      setUsername("");
      toast.success("Username updated successfully", { id: loading });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong", {
        id: loading,
      });
    }
  };

  const handleChangePassword = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!oldpassword.trim()) return toast.error("Enter old password.");
    if (!password.trim() || !cpassword.trim())
      return toast.error("Both password fields are required.");
    if (password !== cpassword) return toast.error("Passwords do not match.");
    const loading = toast.loading("Updating password...");
    try {
      await axios.post("/api/admin/update-password", { oldpassword, password });
      toast.success("Password updated successfully", { id: loading });
      setOldPassword("");
      setPassword("");
      setCPassword("");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong", {
        id: loading,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
          Edit Profile
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={mounted ? admin?.name ?? "Name" : "Name"}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleChangeName}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors w-full sm:w-auto"
            >
              Update
            </button>
          </div>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={mounted ? admin?.username ?? "Username" : "Username"}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleChangeUsername}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors w-full sm:w-auto"
            >
              Update
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Old Password
          </label>
          <input
            type="password"
            value={oldpassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />

          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />

          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={cpassword}
            onChange={(e) => setCPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Update Password
        </button>

        <LogoutBtn />
      </div>
    </div>
  );
};

export default ProfileEdit;
