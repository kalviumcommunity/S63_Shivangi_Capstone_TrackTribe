import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const HostPartyPage = () => {
  const navigate = useNavigate();
  const [partyDetails, setPartyDetails] = useState({
    name: '',
    genre: 'Electronic',
    privacy: 'public',
    password: '',
    description: '',
    initialPlaylist: 'empty',
    coverImage: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPartyDetails({
      ...partyDetails,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadError('');

    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setUploadError('File size must be less than 5MB');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      setPartyDetails({
        ...partyDetails,
        coverImage: file
      });
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setPartyDetails({
      ...partyDetails,
      coverImage: null
    });
    setUploadError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', partyDetails.name);
      formData.append('genre', partyDetails.genre);
      formData.append('privacy', partyDetails.privacy);
      formData.append('password', partyDetails.password);
      formData.append('description', partyDetails.description);
      formData.append('initialPlaylist', partyDetails.initialPlaylist);
      
      if (partyDetails.coverImage) {
        formData.append('coverImage', partyDetails.coverImage);
      }

      // Send to backend
      const response = await fetch('http://localhost:5000/api/parties', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      });

      const result = await response.json();

      if (result.success) {
        console.log('Party created successfully:', result.data);
        // Navigate to the party room with the actual party ID
        navigate(`/party/${result.data.id}`);
      } else {
        console.error('Error creating party:', result.message);
        alert('Error creating party: ' + result.message);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check if the server is running.');
    }
  };

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gradient-to-r from-indigo-900 via-black to-pink-900">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-8 text-white text-center">Host Your Party</h1>
          
          <div className="bg-black bg-opacity-70 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-purple-500 border-opacity-30">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-purple-300 block mb-2 font-medium">Party Name</label>
                <input 
                  type="text"
                  name="name"
                  value={partyDetails.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-transparent border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Give your party a catchy name"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="text-purple-300 block mb-2 font-medium">Party Cover Image</label>
                <div className="space-y-4">
                  {!imagePreview ? (
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="cover-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-purple-500 border-dashed rounded-lg cursor-pointer bg-transparent hover:bg-purple-900 hover:bg-opacity-20 transition-colors duration-300">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-purple-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-purple-300">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-purple-400">PNG, JPG, GIF or WebP (MAX. 5MB)</p>
                        </div>
                        <input 
                          id="cover-upload" 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Party cover preview" 
                        className="w-full h-64 object-cover rounded-lg border border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                  {uploadError && (
                    <p className="text-red-400 text-sm mt-2">{uploadError}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-purple-300 block mb-2 font-medium">Genre</label>
                <select
                  name="genre"
                  value={partyDetails.genre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-transparent border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Electronic">Electronic</option>
                  <option value="House">House</option>
                  <option value="Techno">Techno</option>
                  <option value="Trance">Trance</option>
                  <option value="Drum & Bass">Drum & Bass</option>
                  <option value="Hip-Hop">Hip-Hop</option>
                  <option value="Pop">Pop</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              
              <div>
                <label className="text-purple-300 block mb-2 font-medium">Privacy</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={partyDetails.privacy === 'public'}
                      onChange={handleChange}
                      className="text-purple-600"
                    />
                    <span className="ml-2 text-white">Public</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      checked={partyDetails.privacy === 'private'}
                      onChange={handleChange}
                      className="text-purple-600"
                    />
                    <span className="ml-2 text-white">Private</span>
                  </label>
                </div>
              </div>
              
              {partyDetails.privacy === 'private' && (
                <div>
                  <label className="text-purple-300 block mb-2 font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={partyDetails.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-transparent border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Set a password for your party"
                  />
                </div>
              )}
              
              <div>
                <label className="text-purple-300 block mb-2 font-medium">Description</label>
                <textarea
                  name="description"
                  value={partyDetails.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-transparent border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 h-32"
                  placeholder="Describe your party vibes and what guests can expect"
                ></textarea>
              </div>
              
              <div>
                <label className="text-purple-300 block mb-2 font-medium">Initial Playlist</label>
                <select
                  name="initialPlaylist"
                  value={partyDetails.initialPlaylist}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-transparent border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="empty">Start with empty queue</option>
                  <option value="spotify">Import from Spotify</option>
                  <option value="youtube">Import from YouTube</option>
                  <option value="soundcloud">Import from SoundCloud</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300"
              >
                Create Party Room
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default HostPartyPage;