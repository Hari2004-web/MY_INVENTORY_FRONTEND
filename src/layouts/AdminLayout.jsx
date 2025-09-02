import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
const AdminLayout = ({ children }) => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="p-4 bg-gray-100 flex-1">{children}</main>
    </div>
  </div>
);
export default AdminLayout;
