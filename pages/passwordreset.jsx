import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import React, { useRef, useState } from "react";

export default function ForgotPassword() {
  const emailRef = useRef();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      const auth = getAuth();
      await sendPasswordResetEmail(auth, emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Password Reset
          </h2>
          {error && (
            <div className="p-2 w-full text-center text-red-500 border border-red-400">
              {error}
            </div>
          )}
          {message && (
            <div className="p-2 w-full text-center text-green-500 border border-green-400">
              {message}
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  ref={emailRef}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <button
                disabled={loading}
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
            </div>
          </form>
          <div className="w-full text-center mt-3">
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full text-center mt-2">
        Need an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign Up
        </Link>
      </div>
    </>
  );
}
