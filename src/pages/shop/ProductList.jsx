import { useState, useEffect } from "react";
import { getPublicProducts } from "../../api/publicApi";

const ProductCard = ({ product }) => (
  <div className="bg-white border rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
      <p className="text-sm text-gray-500 mt-1 h-10">{product.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xl font-bold text-blue-600">${parseFloat(product.price).toFixed(2)}</span>
        <span className={`text-sm font-semibold ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
        </span>
      </div>
      <button 
        disabled={product.quantity === 0}
        className="w-full mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Add to Cart
      </button>
    </div>
  </div>
);

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getPublicProducts();
        setProducts(response.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">My Awesome Shop</h1>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductList;