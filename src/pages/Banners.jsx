// src/pages/Banners.jsx

import { useState, useEffect } from 'react';
import { getBanners, createBanner, deleteBanner } from '../api/bannerApi';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import Button from '../components/Button';
import Modal from '../components/modals';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', link: '' });
  const [imageFile, setImageFile] = useState(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await getBanners();
      setBanners(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenModal = () => {
    setNewBanner({ title: '', subtitle: '', link: '' });
    setImageFile(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => setNewBanner({ ...newBanner, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select an image for the banner.");
      return;
    }

    const formData = new FormData();
    Object.keys(newBanner).forEach(key => formData.append(key, newBanner[key]));
    formData.append('image', imageFile);

    const toastId = toast.loading("Uploading banner...");
    try {
      await createBanner(formData);
      toast.success("Banner created successfully!", { id: toastId });
      fetchBanners();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create banner.", { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteBanner(id);
        toast.success("Banner deleted successfully.");
        fetchBanners();
      } catch {
        toast.error("Failed to delete banner.");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Manage Banners</h1>
        <Button onClick={handleOpenModal}>+ Add Banner</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map(banner => (
          <div key={banner.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
            <img src={`http://localhost:5000${banner.image_url}`} alt={banner.title} className="w-full h-40 object-cover"/>
            <div className="p-4">
              <h3 className="font-bold text-lg">{banner.title}</h3>
              <p className="text-sm text-gray-600">{banner.subtitle}</p>
              <p className="text-xs text-gray-500 mt-2 truncate">Link: {banner.link || 'None'}</p>
              <Button onClick={() => handleDelete(banner.id)} variant="danger" className="mt-4 w-full">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Create New Banner">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" placeholder="Banner Title" value={newBanner.title} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          <input type="text" name="subtitle" placeholder="Subtitle (Optional)" value={newBanner.subtitle} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          <input type="text" name="link" placeholder="Link URL (Optional)" value={newBanner.link} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          <input type="file" name="image" onChange={handleFileChange} className="w-full text-sm" required />
          <Button type="submit" variant="success" className="w-full">Create Banner</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Banners;