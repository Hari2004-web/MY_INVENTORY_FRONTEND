import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }) => (
  <div className="flex h-screen bg-light">
    <Sidebar />
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="p-6 flex-1 overflow-y-auto">{children}</main>
    </div>
  </div>
);

export default AdminLayout;