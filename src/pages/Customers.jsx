import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCustomers } from "../api/userApi";
import toast from 'react-hot-toast';
import Button from "../components/Button";

const Customers = () => {
  // --- STATE MANAGEMENT ---
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New state for search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10); // Set to 10 rows per page

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers(); 
        setCustomers(response.data || []);
      } catch (error) {
        toast.error("Failed to fetch customer data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // --- SEARCH AND FILTER LOGIC ---
  const filteredCustomers = customers.filter(customer =>
    customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- PAGINATION LOGIC ---
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- RENDER LOGIC ---
  if (loading) {
    return <div className="p-8 text-center">Loading customer data...</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Registered Customers</h1>
        <div className="w-full max-w-xs">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
          />
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Username</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.length > 0 ? currentCustomers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{customer.username}</td>
                  <td className="p-4 text-gray-600">{customer.email}</td>
                  <td className="p-4 text-center">
                    <Link 
                      to={`/customers/${customer.id}`} 
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      View History
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-600">
            Showing {indexOfFirstCustomer + 1} to {Math.min(indexOfLastCustomer, filteredCustomers.length)} of {filteredCustomers.length} customers
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;