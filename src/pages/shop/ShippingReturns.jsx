const ShippingReturns = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Shipping & Returns</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Shipping Information</h2>
          <p className="text-gray-700 mt-2">
            All orders are processed within 1-2 business days. We offer standard (5-7 days) and express (1-3 days) shipping options. You will receive a tracking number once your order has shipped.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Return Policy</h2>
          <p className="text-gray-700 mt-2">
            Your satisfaction is our priority. If you are not completely satisfied with your purchase, you may return it within 30 days for a full refund or exchange. Items must be in their original, unused condition with all original packaging.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturns;