// src/pages/shop/OrderSuccess.jsx

import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CheckCircleIcon = () => (
    <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const OrderSuccess = () => {
    const { clearCart } = useCart();
    const [searchParams] = useSearchParams();
    const billId = searchParams.get('bill_id');

    // This effect runs only once when the component loads, clearing the cart.
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
                <CheckCircleIcon />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been confirmed and a bill has been generated.</p>
                
                <div className="space-y-4">
                    {billId && (
                        <Link
                            to={`/bill/${billId}`} // Assuming you have a route to view a single bill
                            className="w-full inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                        >
                            View Your Bill
                        </Link>
                    )}
                     <Link
                        to="/customer/profile"
                        className="w-full inline-block px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        View All Orders
                    </Link>
                    <Link
                        to="/"
                        className="text-indigo-600 hover:underline block"
                    >
                        &larr; Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;