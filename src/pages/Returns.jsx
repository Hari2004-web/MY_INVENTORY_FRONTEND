// src/pages/Returns.jsx
import { useState, useEffect } from 'react';
import { getReturns, updateReturn } from '../api/returnApi';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Returns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReturns = async () => {
        try {
            const response = await getReturns();
            setReturns(response.data || []); // Ensure returns is an array
        } catch {
            toast.error("Failed to fetch return requests.");
            setReturns([]); // Set to empty array on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    const handleStatusChange = async (id, status) => {
        const loadingToast = toast.loading("Updating status...");
        try {
            await updateReturn(id, { status });
            toast.success("Status updated successfully!", { id: loadingToast });
            fetchReturns();
        } catch {
            toast.error("Failed to update status.", { id: loadingToast });
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader /></div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Manage Returns</h1>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Order ID</th>
                                <th className="p-4 font-semibold text-slate-600">Customer</th>
                                <th className="p-4 font-semibold text-slate-600">Product</th>
                                <th className="p-4 font-semibold text-slate-600">Reason</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* --- THIS IS THE FIX --- */}
                            {returns.length > 0 ? (
                                returns.map((request) => (
                                    <tr key={request.id} className="border-b hover:bg-slate-50">
                                        <td className="p-4 font-mono text-sm">{request.bill_no}</td>
                                        <td className="p-4">{request.customer_name}</td>
                                        <td className="p-4">{request.product_name}</td>
                                        <td className="p-4 text-sm text-slate-600 max-w-xs truncate">{request.reason}</td>
                                        <td className="p-4 capitalize">{request.status}</td>
                                        <td className="p-4 text-center">
                                            <select
                                                value={request.status}
                                                onChange={(e) => handleStatusChange(request.id, e.target.value)}
                                                className="text-sm font-semibold rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 capitalize"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">
                                        There are no return requests to display.
                                    </td>
                                </tr>
                            )}
                             {/* --- END OF FIX --- */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Returns;