'use client';
import React from "react";
import { useDispatch } from "react-redux";
import { adminLogout } from "@/lib/adminSlice";
import toast from "react-hot-toast";

function LogoutBtn() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(adminLogout());
    toast.success("Logged out successfully..!");
  };
  return (
    <div
      onClick={handleLogout}
      className="px-4 py-2 cursor-pointer text-center my-2 mx-auto bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300"
    >
      Logout
    </div>
  );
}

export default LogoutBtn;
