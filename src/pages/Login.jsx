import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../core/services/authService";
import "primeicons/primeicons.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center h-screen mt-16 font-display">
      <div className="flex flex-col items-center w-8/12 space-y-6">
        <img src="/assets/favicon.png" alt="Platinium Logo" />
        <p className="text-4xl font-semibold">Login To PLATINIUM Admin Panel</p>

        <div className="p-5 bg-white rounded-md w-96">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-0.5">
              <label className="text-sm text-gray-500" htmlFor="email">
                Email
              </label>
              <input
                className="block w-full p-2 border border-gray-500 rounded"
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative space-y-1">
              <label className="text-sm text-gray-500" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="block w-full p-2 border border-gray-500 rounded pr-10"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  minLength="6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <i className="pi pi-eye"></i> : <i className="pi pi-eye-slash"></i>}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              className="w-full h-12 font-medium bg-purple-500/75 hover:bg-purple-700 transition-colors text-black rounded-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center">
            Request An Account?{" "}
            <a className="font-medium hover:underline text-linkedin" href="#">
              Request Registration
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
