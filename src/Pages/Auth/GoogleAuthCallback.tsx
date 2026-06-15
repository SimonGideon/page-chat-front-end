/**
 * GoogleAuthCallback
 *
 * After the user approves on Google's page, Rails:
 *   1. Gets the user's profile from Google
 *   2. Finds or creates a User in the DB
 *   3. Generates a JWT
 *   4. Redirects here: /auth/google/callback?token=<JWT>
 *
 * This page:
 *   1. Reads the token from the URL
 *   2. Stores it (localStorage + Redux)
 *   3. Fetches the current user profile
 *   4. If the user is missing required profile details (phone, address, etc.)
 *      → redirects to /complete-profile so they can fill them in
 *   5. Otherwise → navigates straight to the dashboard
 */
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { setToken, getCurrentUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import type { User } from "@/types";

/** Returns true if the user is missing any required profile fields */
const isProfileIncomplete = (user: User) =>
  !user.phone || !user.address || !user.country_code || !user.city_id || !user.date_of_birth;

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const dispatch       = useAppDispatch();
  const navigate       = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      navigate("/signin?error=" + error, { replace: true });
      return;
    }

    if (!token) {
      navigate("/signin?error=no_token", { replace: true });
      return;
    }

    // Store the JWT — identical to how a normal login stores it
    dispatch(setToken(token));

    // Fetch the user's full profile using the new token
    dispatch(getCurrentUser())
      .unwrap()
      .then((response) => {
        const user = response.data as User;

        if (isProfileIncomplete(user)) {
          // New Google user — they need to fill in phone, address, etc.
          navigate("/complete-profile", { replace: true });
        } else {
          // Returning Google user with a complete profile
          navigate("/dashboard", { replace: true });
        }
      })
      .catch(() => {
        navigate("/signin?error=auth_failed", { replace: true });
      });
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#fefaf5] to-white">
      <div className="h-10 w-10 rounded-full border-4 border-downy border-t-transparent animate-spin" />
      <p className="text-sm text-charcoal/60">Signing you in with Google…</p>
    </div>
  );
};

export default GoogleAuthCallback;
