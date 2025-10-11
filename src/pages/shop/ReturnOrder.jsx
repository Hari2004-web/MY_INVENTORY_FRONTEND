// src/pages/shop/ReturnOrder.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBillById } from '../../api/billingApi';
import { requestReturn } from '../../api/returnApi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const ReturnOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const response = await getBillById(id);
                setBill(response.data);
            } catch { // FIX: Removed unused 'error' variable
                toast.error("Could not load order details.");
            } finally {
                setLoading(false);
            }
        };
        fetchBill();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !reason) {
            toast.error("Please select a product and provide a reason for return.");
            return;
        }

        const loadingToast = toast.loading("Submitting return request...");
        try {
            await requestReturn({
                bill_id: id,
                product_id: selectedProduct,
                reason: reason,
            });
            toast.success("Return request submitted successfully!", { id: loadingToast });
            navigate(`/track-order/${id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit return request.", { id: loadingToast });
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader /></div>;
    }

    if (!bill) {
        return (
            <div className="flex flex-col h-screen items-center justify-center">
                <h1 className="text-2xl font-bold">Order not found.</h1>
                <Link to="/customer/profile?view=orders" className="mt-4 text-indigo-600 hover:underline font-semibold">
                    &larr; Back to All Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link to={`/track-order/${id}`} className="text-indigo-600 hover:underline font-semibold">
                        &larr; Back to Order Details
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Request a Return</h1>
                    <p className="text-gray-500 font-mono mb-6">{bill.bill_no}</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">Which product would you like to return?</label>
                            <select
                                id="product"
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="" disabled>Select a product</option>
                                {/* --- THIS IS THE FIX --- */}
                                {bill.items?.map(item => (
                                    <option key={item.product_id} value={item.product_id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">Reason for return</label>
                            <textarea
                                id="reason"
                                rows="4"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Please describe the issue with the product..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            ></textarea>
                        </div>
                        <div className="pt-4">
                             <button type="submit" className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                                Submit Return Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReturnOrder;