import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2 2 0 01-2.828 2.828l-1.514-1.514a4 4 0 00-1.01-4.434L4.93 4.93a10.075 10.075 0 015.07-1.932 10.007 10.007 0 012.23.355l-1.64 1.641a4 4 0 00-2.33 2.33z" clipRule="evenodd" /><path d="M10 12a2 2 0 110-4 2 2 0 010 4z" /></svg>;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/20">
        <h1 className="text-3xl font-bold text-center text-white">Welcome</h1>
        <p className="text-center text-slate-300">Sign in to access your portal</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 text-white bg-slate-900/50 border border-slate-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 text-white bg-slate-900/50 border border-slate-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-cyan-400">
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {error && <p className="text-sm text-fuchsia-400 text-center">{error.message}</p>}
          <Button type="submit" className="w-full py-3">Login</Button>
        </form>
        <div className="text-center">
          <Link to="/forgot-password" className="text-sm text-slate-300 hover:text-cyan-400">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;