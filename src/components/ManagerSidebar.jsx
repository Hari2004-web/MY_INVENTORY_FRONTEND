// src/components/ManagerSidebar.jsx
import { NavLink } from "react-router-dom";

// --- Icons for navigation ---
const DashboardIcon = () => <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>;
const InboxIcon = () => <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>;
const ProductIcon = () => <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>;
const StockIcon = () => <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>;
const CustomerIcon = () => <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015.537 4.097c-.94.54-1.935.896-3.037.995A5.002 5.002 0 011 16v1h6.07z"></path></svg>;
const CouponIcon = () => <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 5a3 3 0 013-3h8a3 3 0 013 3v8a3 3 0 01-3 3H8a3 3 0 01-3-3V5zm3-1a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H8z" clipRule="evenodd" /><path d="M8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /></svg>
const BannerIcon = () => <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 3 3 5-5V15z" clipRule="evenodd"></path></svg>;
const ChatIcon = () => <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path></svg>;
const ReturnIcon = () => <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15l-3-3m0 0l3-3m-3 3h12a6 6 0 010 12h-3" /></svg>;

const ManagerSidebar = () => {
  const linkStyle = "flex items-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white";
  const activeLinkStyle = "bg-gray-700 text-white";

  return (
    <aside className="w-64 h-full bg-gray-800 flex-shrink-0" aria-label="Sidebar">
      <div className="px-3 py-4 overflow-y-auto">
        <h1 className="text-xl font-bold text-white px-2 py-4">Manager Portal</h1>
        <ul className="space-y-2">
          <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}><DashboardIcon />Dashboard</NavLink></li>
          <li><NavLink to="/inbox" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}><InboxIcon />Inbox</NavLink></li>
          <li><NavLink to="/live-chat" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}><ChatIcon />Live Chat</NavLink></li>
          <li><NavLink to="/products" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}><ProductIcon />Products</NavLink></li>
          <li><NavLink to="/stocks" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}><StockIcon />Stocks</NavLink></li>
          <li><NavLink to="/customers" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}><CustomerIcon />Customers</NavLink></li>
          <li><NavLink to="/coupons" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}><CouponIcon />Coupons</NavLink></li>
          <li><NavLink to="/banners" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}><BannerIcon />Banners</NavLink></li>
          <li><NavLink to="/returns" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}><ReturnIcon />Returns</NavLink></li>
        </ul>
      </div>
    </aside>
  );
};

export default ManagerSidebar;