import React, { useState } from "react";

export type SignInFormData = {
  email: string;
  password: string;
  remember: boolean;
};

type Props = {
  onSubmit: (data: SignInFormData) => void;
  submitLabel?: string;
};

const SignInForm: React.FC<Props> = ({ onSubmit, submitLabel = "Sign in" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    onSubmit({ email, password, remember });
  };

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit}
      aria-label="sign-in-form"
    >
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-[#6366f1] focus:ring-[#6366f1] focus:outline-none"
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-[#6366f1] focus:ring-[#6366f1] focus:outline-none"
          autoComplete="current-password"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center" htmlFor="remember">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#6366f1] focus:ring-[#6366f1]"
          />
          <span className="ml-2 text-sm text-gray-700">Remember me</span>
        </label>
        <a
          href="#"
          className="text-sm font-medium text-[#6366f1] hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-[#6366f1] px-4 py-2 font-semibold text-white transition hover:bg-[#4f46e5] focus:ring-2 focus:ring-[#6366f1] focus:outline-none"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default SignInForm;
