// src/components/PaymentMethodModal.jsx

const PaymentMethodModal = ({ isOpen, onClose, onStripeCheckout, onCodCheckout, onWalletCheckout, walletBalance, cartTotal }) => {
  if (!isOpen) return null;

  const canAffordWithWallet = walletBalance >= cartTotal;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Payment Method</h2>
        <div className="space-y-4">
          <button
            onClick={onWalletCheckout}
            disabled={!canAffordWithWallet}
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Pay with Wallet (Balance: ₹{walletBalance.toFixed(2)})
          </button>
          <button
            onClick={onStripeCheckout}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
          >
            Pay with Card / UPI (Stripe)
          </button>
          <button
            onClick={onCodCheckout}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-all"
          >
            Cash on Delivery
          </button>
        </div>
        <button onClick={onClose} className="mt-6 text-sm text-gray-500 hover:underline">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodModal;