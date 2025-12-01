import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { toast } from "@/components/ui";
import { activateAccount } from "@/lib/services/activation";

const ActivateAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token =
    searchParams.get("confirmation_token") || searchParams.get("token") || "";
  const email = searchParams.get("email") ?? "";
  const [status, setStatus] = useState<"activating" | "success" | "error">(
    "activating"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setErrorMessage("Invalid activation link. Missing token or email.");
      return;
    }

    const handleActivation = async () => {
      try {
        const response = await activateAccount(token, email); // token is confirmation_token
        const redirectTo = response.data.redirect_to;

        if (redirectTo) {
          // Redirect to password set page
          setStatus("success");
          toast({
            title: "Account activated",
            description: "Redirecting to set your password...",
            variant: "success",
          });

          // Small delay to show success message, then redirect
          setTimeout(() => {
            window.location.href = redirectTo;
          }, 1000);
        } else {
          // Account already activated, redirect to login
          setStatus("success");
          toast({
            title: "Account already activated",
            description:
              response.data.message || "Your account is already active.",
            variant: "success",
          });

          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        }
      } catch (error: unknown) {
        setStatus("error");
        const errorMsg =
          (
            error as {
              response?: { data?: { error?: string } };
              message?: string;
            }
          )?.response?.data?.error ||
          (error as { message?: string })?.message ||
          "Failed to activate account. The link may be invalid or expired.";
        setErrorMessage(errorMsg);
        toast({
          title: "Activation failed",
          description: errorMsg,
          variant: "destructive",
        });
      }
    };

    handleActivation();
  }, [token, email, navigate]);

  if (status === "activating") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#fefaf5] via-white to-[#f3f0ff] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white px-10 py-12 text-center shadow-xl border border-white/40">
          <Loader2 className="h-12 w-12 animate-spin text-downy mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-charcoal mb-2">
            Activating your account
          </h1>
          <p className="text-sm text-charcoal/70">
            Please wait while we activate your Page Chat account...
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#fefaf5] via-white to-[#f3f0ff] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white px-10 py-12 text-center shadow-xl border border-white/40">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-downy/10 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-downy"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-charcoal mb-2">
              Account activated!
            </h1>
            <p className="text-sm text-charcoal/70">
              Redirecting you to set your password...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#fefaf5] via-white to-[#f3f0ff] px-4">
      <div className="w-full max-w-md space-y-4 rounded-3xl bg-white px-10 py-12 text-center shadow-xl border border-white/40">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-charcoal mb-2">
            Activation failed
          </h1>
          <p className="text-sm text-charcoal/70 mb-6">{errorMessage}</p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/signup")}
            className="w-full rounded-full bg-downy px-6 py-3 text-sm font-semibold text-white transition hover:bg-downy-dark"
          >
            Sign up again
          </button>
          <button
            onClick={() => navigate("/signin")}
            className="w-full rounded-full border border-charcoal/20 px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-charcoal/5"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;
