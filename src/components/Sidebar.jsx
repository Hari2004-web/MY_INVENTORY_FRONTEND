import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const linkStyle = "flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200";
  const activeLinkStyle = "bg-gray-700 text-white";

  return (
    <aside className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="px-4 py-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Admin Portal</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}>Dashboard</NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}>Products</NavLink>
        <NavLink to="/stocks" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}>Stocks</NavLink>
        {user?.role === 'admin' && (
          <NavLink to="/managers" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}>Managers</NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;