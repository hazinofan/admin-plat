import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router navigation
import { login } from "../services/authService";
import { Button } from 'primereact/button';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
                className="block w-full p-1 mb-4 border border-gray-500 rounded"
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-500" htmlFor="password">
                Password
              </label>
              <input
                className="block w-full p-1 border border-gray-500 rounded"
                type="password"
                id="password"
                required
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <p className="text-xs text-center text-gray-500">
              By clicking Agree & Join, you agree to the LinkedIn
              <a className="font-medium hover:underline text-linkedin" href="#">
                User Agreement
              </a>
              ,
              <a className="font-medium hover:underline text-linkedin" href="#">
                Privacy Policy
              </a>
              , and
              <a className="font-medium hover:underline text-linkedin" href="#">
                Cookie Policy
              </a>
              .
            </p>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              className="w-full h-12 font-medium bg-purple-500/75 hover:bg-purple-700 transition-colors text-black rounded-full bg-linkedin hover:bg-linkedin-dark"
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
