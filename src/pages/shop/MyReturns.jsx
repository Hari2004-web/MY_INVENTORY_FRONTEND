// src/pages/shop/MyReturns.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyReturns } from '../../api/returnApi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        default: 'bg-gray-100 text-gray-800',
    };
    const style = statusStyles[status] || statusStyles.default;
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${style}`}>
            {status}
        </span>
    );
};

const MyReturns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyReturns = async () => {
            try {
                const response = await getMyReturns();
                setReturns(response.data || []);
            } catch {
                toast.error("Could not fetch your return requests.");
            } finally {
                setLoading(false);
            }
        };
        fetchMyReturns();
    }, []);

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader /></div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link to="/customer/profile" className="text-indigo-600 hover:underline font-semibold">
                        &larr; Back to Profile
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-800 mt-2">My Return Requests</h1>
                </div>

                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Order ID</th>
                                    <th className="p-4 font-semibold text-slate-600">Product</th>
                                    <th className="p-4 font-semibold text-slate-600">Reason</th>
                                    <th className="p-4 font-semibold text-slate-600">Requested On</th>
                                    <th className="p-4 font-semibold text-slate-600 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {returns.length > 0 ? (
                                    returns.map((request) => (
                                        <tr key={request.id} className="border-b hover:bg-slate-50">
                                            <td className="p-4 font-mono text-sm text-indigo-600">
                                                <Link to={`/track-order/${request.bill_id}`}>{request.bill_no}</Link>
                                            </td>
                                            <td className="p-4 font-medium">{request.product_name}</td>
                                            <td className="p-4 text-sm text-slate-600 max-w-xs truncate">{request.reason}</td>
                                            <td className="p-4 text-sm">{new Date(request.requested_at).toLocaleDateString()}</td>
                                            <td className="p-4 text-center capitalize">
                                                <StatusBadge status={request.status} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500">
                                            You have not made any return requests.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyReturns;