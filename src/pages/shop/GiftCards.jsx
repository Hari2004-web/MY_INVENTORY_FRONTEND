// src/pages/shop/GiftCards.jsx
import { useState, useEffect } from 'react';
import { getMyCoupons } from '../../api/couponApi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const GiftCard = ({ coupon }) => {
  const isExpired = new Date() > new Date(coupon.expires_at);
  const isUsedUp = coupon.times_used >= coupon.usage_limit;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    toast.success("Coupon code copied!");
  };

  return (
    <div className={`relative p-6 rounded-lg shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden transition-all duration-300 ${isExpired || isUsedUp ? 'opacity-50 grayscale' : 'hover:scale-105'}`}>
      {(isExpired || isUsedUp) && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase z-10">
          {isExpired ? 'Expired' : 'Used'}
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-wider">{coupon.code}</h3>
        <p className="text-sm opacity-80">
          Expires on: {new Date(coupon.expires_at).toLocaleDateString()}
        </p>
      </div>
      <div className="text-center bg-white/20 rounded-md p-4 mb-4 backdrop-blur-sm">
        <p className="text-4xl font-extrabold">
          {coupon.discount_type === 'percentage'
            ? `${coupon.discount_value}% OFF`
            : `₹${parseFloat(coupon.discount_value).toFixed(2)} OFF`}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-center opacity-70">
          Usage: {coupon.times_used} / {coupon.usage_limit}
        </p>
        <button onClick={handleCopyCode} className="bg-white/30 text-white text-xs font-bold px-3 py-1 rounded-md hover:bg-white/50 transition-colors">
          Copy Code
        </button>
      </div>
    </div>
  );
};

const GiftCards = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCoupons = async () => {
      try {
        const response = await getMyCoupons();
        setCoupons(response.data || []);
      } catch (error) { // FIX: Using the 'error' variable for logging
        console.error("Failed to fetch gift cards:", error);
        toast.error("Could not fetch your gift cards.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyCoupons();
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
          <h1 className="text-4xl font-bold text-gray-800 mt-2">My Vouchers & Gift Cards</h1>
        </div>
        {coupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.map(coupon => (
              <GiftCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <p className="text-gray-600">You don't have any gift cards or vouchers assigned to you yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCards;