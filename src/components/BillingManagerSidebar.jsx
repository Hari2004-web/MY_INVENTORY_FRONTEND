// src/components/BillingManagerSidebar.jsx
import { NavLink } from "react-router-dom";

const DashboardIcon = () => <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>;
const BillingIcon = () => <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>;

const BillingManagerSidebar = () => {
  const linkStyle = "flex items-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white";
  const activeLinkStyle = "bg-gray-700 text-white";

  return (
    <aside className="w-64 h-full bg-gray-800 flex-shrink-0" aria-label="Sidebar">
      <div className="px-3 py-4 overflow-y-auto">
        <h1 className="text-xl font-bold text-white px-2 py-4">Billing Portal</h1>
        <ul className="space-y-2">
          <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}><DashboardIcon />Dashboard</NavLink></li>
          <li><NavLink to="/billing" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}><BillingIcon />Billing</NavLink></li>
        </ul>
      </div>
    </aside>
  );
};

export default BillingManagerSidebar;