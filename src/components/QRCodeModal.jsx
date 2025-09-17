import Button from './Button'; // Assuming you have a reusable Button component

const QRCodeModal = ({ isOpen, onClose, qrCodeImage, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white text-gray-800 w-full max-w-sm rounded-2xl shadow-2xl p-8 text-center" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">Complete Your Purchase</h2>
        <p className="text-gray-600 mb-6">Scan the QR code with your payment app to finalize the order.</p>

        <div className="p-4 bg-gray-100 rounded-lg inline-block">
          {qrCodeImage ? (
            <img src={qrCodeImage} alt="Payment QR Code" className="w-48 h-48 mx-auto" />
          ) : (
            <div className="w-48 h-48 mx-auto flex items-center justify-center bg-gray-200">
              <p>Loading QR Code...</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-4">After payment, click the button below to confirm.</p>
          <Button onClick={onConfirm} variant="success" className="w-full">
            I Have Paid
          </Button>
          <button onClick={onClose} className="mt-2 text-sm text-gray-500 hover:underline">
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;