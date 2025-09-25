import { useDispatch } from "react-redux";
import { login } from "../features/auth/store/authSlice";
import type { AppDispatch } from "../store";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = () => {
    dispatch(login({ role: "user", name: "Sree R One" }));
  };

  return (
    <div className="p-6 text-center">
      <button
        onClick={handleLogin}
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Mock Login
      </button>
    </div>
  );
};

export default LoginPage;
