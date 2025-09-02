import Navbar from "../components/Navbar";
import ManagerSidebar from "../components/ManagerSidebar"; // 1. Import the new sidebar

const ManagerLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-100">
    <ManagerSidebar /> {/* 2. Add the sidebar to the layout */}
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Navbar />
      <main className="p-6">
        {children} {/* This is where your pages will appear */}
      </main>
    </div>
  </div>
);

export default ManagerLayout;