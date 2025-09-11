import Navbar from "../components/Navbar";
import BillingManagerSidebar from "../components/BillingManagerSidebar";

const BillingManagerLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-100">
    <BillingManagerSidebar />
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Navbar />
      <main className="p-6">
        {children}
      </main>
    </div>
  </div>
);

export default BillingManagerLayout;