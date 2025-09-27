import React from "react";

const SignInPage: React.FC = () => {
  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center bg-gray-50"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center">
          {/* <img
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Logo"
            className="mb-6 h-10"
          /> */}
          <h1 className="text-4xl font-bold text-red-600">ExploreSG</h1>

          <h2 className="mt-4 mb-2 text-center text-xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a href="#" className="font-medium text-[#6366f1] hover:underline">
              Start a 14-day free trial
            </a>
          </p>
        </div>
        <form className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-[#6366f1] focus:ring-[#6366f1] focus:outline-none"
              autoComplete="email"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-[#6366f1] focus:ring-[#6366f1] focus:outline-none"
              autoComplete="current-password"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#6366f1] focus:ring-[#6366f1]"
              />
              <span className="ml-2 text-sm text-gray-700">Remember me</span>
            </label>
            <a
              href="#"
              className="text-sm font-medium text-[#6366f1] hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#6366f1] px-4 py-2 font-semibold text-white transition hover:bg-[#4f46e5] focus:ring-2 focus:ring-[#6366f1] focus:outline-none"
          >
            Sign in
          </button>
        </form>
        <div className="my-8 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-sm text-gray-400">Or continue with</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        <div className="flex justify-center gap-4">
          <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 transition hover:bg-gray-50">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
            <span className="font-medium">Google</span>
          </button>
          <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 transition hover:bg-gray-50">
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.338 4.695-4.566 4.944.359.309.678.919.678 1.853 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
