import React, { useState, useEffect } from 'react';
import { getCustomerProfile, updateCustomerProfile, uploadCustomerAvatar } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';
import toast from 'react-hot-toast';

// Icons
const EditIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>;
const SaveIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 00-1.414-1.414L10 12.586l-2.293-2.293z"></path></svg>;
const CancelIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>;
const PhotoIcon = () => <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 3 3 5-5V15zM11 9a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>;

const CustomerDetails = () => {
    // FIX: Use 'updateUserInContext' instead of misusing the 'login' function
    const { user, updateUserInContext } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ username: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // FIX: Correctly handle the response from the API call
                const response = await getCustomerProfile();
                if (response.success) {
                    setProfile(response.data);
                    setEditForm({ username: response.data.username });
                } else {
                    toast.error("Failed to load profile details.");
                }
            } catch (error) {
                // This will trigger the redirect to the login page if the token is expired
                console.error("Error fetching customer profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const loadingToast = toast.loading("Updating profile...");
        try {
            const response = await updateCustomerProfile(editForm);
            const updatedUserData = response.data.user;
            setProfile(updatedUserData);
            updateUserInContext(updatedUserData); // Correctly update the global user state
            toast.success("Profile updated successfully!", { id: loadingToast });
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile.", { id: loadingToast });
        }
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        const loadingToast = toast.loading("Uploading picture...");
        try {
            const response = await uploadCustomerAvatar(formData);
            const updatedUserData = response.data.user;
            setProfile(updatedUserData);
            updateUserInContext(updatedUserData); // Correctly update the global user state
            toast.success("Profile picture updated!", { id: loadingToast });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload avatar.", { id: loadingToast });
        }
    };

    const avatarSrc = profile?.avatar_url
        ? `http://localhost:5000${profile.avatar_url}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.username || 'C')}&background=4f46e5&color=fff&size=128`;

    if (loading) {
        return <div className="p-8 flex justify-center items-center h-64"><Loader /></div>;
    }

    if (!profile) {
        return <div className="p-8 text-center text-red-600">Could not load customer profile. You may need to log in again.</div>;
    }

    return (
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-gray-800">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex flex-col items-center flex-shrink-0">
                    <div className="relative group">
                        <img src={avatarSrc} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg" />
                        <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full">
                            <PhotoIcon /> <span className="ml-1 text-sm font-semibold">Change</span>
                        </label>
                        <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </div>
                </div>
                <div className="flex-grow w-full md:w-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            {isEditing ? (
                                <input type="text" name="username" value={editForm.username} onChange={handleEditChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                            ) : (
                                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.username}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address (Cannot be changed)</label>
                            <p className="mt-1 text-lg text-gray-500 bg-gray-100 p-2 rounded-md">{profile.email}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                                    <CancelIcon /> <span className="ml-2">Cancel</span>
                                </button>
                                <button onClick={handleSave} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                    <SaveIcon /> <span className="ml-2">Save</span>
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                                <EditIcon /> <span className="ml-2">Edit Profile</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetails;