const Faq = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">What is your shipping policy?</h2>
          <p className="text-gray-700 mt-2">
            We offer standard and express shipping options. Standard shipping typically takes 5-7 business days, while express shipping takes 1-3 business days.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">What is your return policy?</h2>
          <p className="text-gray-700 mt-2">
            We accept returns within 30 days of purchase for a full refund, provided the item is in its original condition and packaging.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Faq;