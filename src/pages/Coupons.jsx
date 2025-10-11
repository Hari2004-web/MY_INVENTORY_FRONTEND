// src/pages/Coupons.jsx

import { useState, useEffect } from "react";
import { createCoupon, getCoupons, deleteCoupon } from "../api/couponApi.js";
import Modal from "../components/modals";
import Button from "../components/Button";
import toast from "react-hot-toast";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    expires_at: "",
    usage_limit: "",
    customer_email: "",
  });

  const fetchCoupons = async () => {
    try {
      const response = await getCoupons();
      setCoupons(response.data || []);
    } catch (error) {
      console.error("Failed to fetch coupons:", error); // It's good practice to log the actual error
      toast.error("Failed to fetch coupons.");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenModal = () => {
    setNewCoupon({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        expires_at: "",
        usage_limit: "",
        customer_email: "",
    });
    setIsModalOpen(true);
  }
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCoupon(newCoupon);
      toast.success("Coupon created successfully!");
      fetchCoupons();
      handleCloseModal();
    } catch { // FIX: Removed the unused 'error' variable
      toast.error("Failed to create coupon.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id);
        toast.success("Coupon deleted successfully.");
        fetchCoupons();
      } catch { // FIX: Removed the unused 'error' variable
        toast.error("Failed to delete coupon.");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Manage Coupons</h1>
        <Button onClick={handleOpenModal}>+ Create Coupon</Button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Code</th>
              <th className="p-4 font-semibold text-slate-600">Assigned To</th>
              <th className="p-4 font-semibold text-slate-600">Type</th>
              <th className="p-4 font-semibold text-slate-600">Value</th>
              <th className="p-4 font-semibold text-slate-600">Expires At</th>
              <th className="p-4 font-semibold text-slate-600">Usage</th>
              <th className="p-4 font-semibold text-slate-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-800">{coupon.code}</td>
                <td className="p-4 text-slate-600">{coupon.customer_email || 'All Customers'}</td>
                <td className="p-4 text-slate-600 capitalize">{coupon.discount_type.replace('_', ' ')}</td>
                <td className="p-4 text-slate-600">
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                </td>
                <td className="p-4 text-slate-600">{new Date(coupon.expires_at).toLocaleDateString()}</td>
                <td className="p-4 text-slate-600">{`${coupon.times_used} / ${coupon.usage_limit}`}</td>
                <td className="p-4 text-center">
                  <Button onClick={() => handleDelete(coupon.id)} variant="danger">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Create New Coupon">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="code" placeholder="Coupon Code" value={newCoupon.code} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          <input type="email" name="customer_email" placeholder="Customer Email (Optional)" value={newCoupon.customer_email} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          <select name="discount_type" value={newCoupon.discount_type} onChange={handleChange} className="w-full p-2 border rounded-lg">
            <option value="percentage">Percentage</option>
            <option value="fixed_amount">Fixed Amount</option>
          </select>
          <input type="number" name="discount_value" placeholder="Discount Value" value={newCoupon.discount_value} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          <input type="date" name="expires_at" value={newCoupon.expires_at} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          <input type="number" name="usage_limit" placeholder="Usage Limit" value={newCoupon.usage_limit} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          <Button type="submit" variant="success" className="w-full">Create Coupon</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Coupons;