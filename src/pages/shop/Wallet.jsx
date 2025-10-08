// src/pages/shop/Wallet.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWalletDetails, requestWithdrawalApi } from '../../api/walletApi';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const Wallet = () => {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const fetchWallet = async () => {
        try {
            setLoading(true);
            const response = await getWalletDetails();
            setWallet(response.data);
        } catch (error) {
            toast.error("Could not fetch wallet details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        const loadingToast = toast.loading("Submitting withdrawal request...");
        try {
            const response = await requestWithdrawalApi(amount);
            toast.success(response.message, { id: loadingToast });
            setWithdrawAmount('');
            fetchWallet(); // Refresh wallet balance
        } catch (error) {
            toast.error(error.response?.data?.message || "Request failed.", { id: loadingToast });
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader /></div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="mb-6">
                    <Link to="/customer/profile" className="text-indigo-600 hover:underline font-semibold">
                        &larr; Back to Profile
                    </Link>
                </div>
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-lg text-center">
                    <h2 className="text-lg font-medium opacity-80 mb-2">Wallet Balance</h2>
                    <p className="text-5xl font-bold tracking-tight">
                        ₹{wallet ? parseFloat(wallet.balance).toFixed(2) : '0.00'}
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Request Withdrawal</h3>
                    <form onSubmit={handleWithdraw} className="flex items-center gap-4">
                        <input
                            type="number"
                            placeholder="Amount to withdraw"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            step="0.01"
                            min="1"
                        />
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                            Submit
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2">Withdrawal requests will be reviewed by an administrator.</p>
                </div>
            </div>
        </div>
    );
};

export default Wallet;