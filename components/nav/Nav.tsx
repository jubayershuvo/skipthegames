"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

import {
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  LinkIcon,
  UserIcon,
  WrenchIcon,
  GlobeAltIcon
  
} from "@heroicons/react/24/solid";


import DarkMode from "@/components/DarkMode";
import { Toaster } from "react-hot-toast";
import { Mail } from "lucide-react";

interface AdminNavbarProps {
  children: ReactNode;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdminLoggedIn } = useAppSelector((state) => state.adminAuth);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push("/admin/login");
    }
  }, [isAdminLoggedIn, router]);

  const navItems = [
    // { name: "Dashboard", icon: ChartBarIcon, href: "/admin/dashboard" },
    { name: "Links", icon: LinkIcon, href: "/admin/dashboard/links" },
    { name: "Domains", icon: GlobeAltIcon, href: "/admin/dashboard/domains" },
    { name: "Profile", icon: UserIcon, href: "/admin/dashboard/profile" },
    { name: "Mails", icon: Mail, href: "/admin/dashboard/emails" },
    { name: "Settings", icon: WrenchIcon, href: "/admin/dashboard/settings" },
  ];



  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      <Toaster position="top-center" />

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 h-screen fixed shadow-lg">
        <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-700">
          <Link href="/admin/dashboard">
            <img src="/logo.png" alt="Logo" className="h-12" />
          </Link>
          <DarkMode />
        </div>
        <nav className="flex-grow px-4 py-6">
          <Link
            key="Dashboard"
            href="/admin/dashboard"
            className="flex mb-3 items-center px-2 py-2 rounded-lg transition-colors bg-blue-100 dark:bg-orange-700 text-orange-700 dark:text-white font-semibold"
          >
            <ChartBarIcon className="h-6 w-6 mr-2" />
            Dashboard
          </Link>
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex mb-3 items-center px-2 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon className="h-6 w-6 mr-2" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile navbar */}
      <div className="md:hidden flex items-center w-full bg-white dark:bg-gray-900 px-4 py-3 border-b dark:border-gray-700 fixed z-20">
        <Link href="/">
          <img src="/logo.png" alt="Logo" className="h-6" />
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-900 dark:text-white mx-2 focus:outline-none"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
        <DarkMode />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 flex">
          <div className="w-64 bg-white dark:bg-gray-900 h-screen shadow-lg backdrop-blur-sm">
            <nav className="flex-grow px-4 py-6">
              <Link
                key="Dashboard"
                href="/admin/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="flex mb-3 items-center px-2 py-2 rounded-lg transition-colors bg-blue-100 dark:bg-orange-700 text-orange-700 dark:text-white font-semibold"
              >
                <ChartBarIcon className="h-6 w-6 mr-2" />
                Dashboard
              </Link>
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex mb-3 items-center px-2 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <item.icon className="h-6 w-6 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          {/* Semi-transparent backdrop */}
          <div
            className="flex-grow bg-opacity-30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div key="content" className="flex-grow ml-0 md:ml-64 pt-16 md:pt-0 w-full dark:bg-gray-900 dark:text-gray-200 text-black bg-white">
        {children}
      </div>
    </div>
  );
};

export default AdminNavbar;
