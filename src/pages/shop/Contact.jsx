// src/pages/shop/Contact.jsx

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Have a question or need support? We're here to help. Reach out to us through any of the methods below.
          </p>
          
          <div className="mt-8 space-y-6 border-t pt-6">
            <div className="flex items-start gap-4">
              <strong className="w-24 text-gray-800">Email:</strong>
              <a href="mailto:harihp0002@gmail.com" className="text-indigo-600 hover:underline break-all">
                harihp0002@gmail.com
              </a>
              <span className="text-sm text-gray-500">[Admin-NEXUS]</span>
            </div>
            
            <div className="flex items-start gap-4">
              <strong className="w-24 text-gray-800">Phone:</strong>
              <a href="tel:+919597897105" className="text-indigo-600 hover:underline">
                +91-9597897105
              </a>
               <span className="text-sm text-gray-500">- NEXUS</span>
            </div>

            <div className="flex items-start gap-4">
              <strong className="w-24 text-gray-800">Address:</strong>
              <p className="text-gray-700">
                13C-Pearl Tower Road, Nurani, Palakkad, Kerala.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;