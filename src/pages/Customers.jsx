import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCustomers } from "../api/userApi"; // MODIFIED: Import getCustomers instead of getUsers
import toast from 'react-hot-toast';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // MODIFIED: This now calls the correct, dedicated API function
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

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Registered Customers</h1>
      <div className="bg-white shadow-lg rounded-xl">
        <ul className="divide-y divide-gray-200">
          {customers.length > 0 ? customers.map((customer) => (
            <li key={customer.id}>
              <Link to={`/customers/${customer.id}`} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-lg text-gray-800">{customer.username}</p>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">View History &rarr;</span>
                </div>
              </Link>
            </li>
          )) : (
            <li className="p-4 text-center text-gray-500">No customers have registered yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Customers;