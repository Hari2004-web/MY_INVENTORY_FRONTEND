import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// --- High-Quality Icons for a Professional Look ---
const ProfileIcon = () => <svg className="w-5 h-5 mr-2 text-gray-400 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const PasswordIcon = () => <svg className="w-5 h-5 mr-2 text-gray-400 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const LogoutIcon = () => <svg className="w-5 h-5 mr-2 text-gray-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/portal/login");
  };

  // Effect to close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const avatarSrc = user?.avatar_url
    ? `http://localhost:5000${user.avatar_url}`
    : `https://ui-avatars.com/api/?name=${user?.username}&background=4f46e5&color=fff`;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-end h-16 px-6">
        <div className="relative" ref={dropdownRef}>
          {/* --- Avatar Button --- */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-200 hover:scale-110"
          >
            <img className="w-9 h-9 rounded-full object-cover" src={avatarSrc} alt="user photo" />
          </button>

          {/* --- Animated Dropdown Menu --- */}
          <div 
            className={`absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-out
            ${isDropdownOpen ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95 pointer-events-none'}`}
          >
            <div className="py-1">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">Signed in as</p>
                <p className="text-sm text-gray-700 font-medium truncate">{user?.username}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="p-2">
                <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <ProfileIcon />
                  View Profile
                </Link>
                <Link to="/change-password" onClick={() => setIsDropdownOpen(false)} className="group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <PasswordIcon />
                  Change Password
                </Link>
              </div>
              <div className="p-2 border-t border-gray-200">
                 <button onClick={handleLogout} className="group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">
                   <LogoutIcon />
                   Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;