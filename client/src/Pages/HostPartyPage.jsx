import React, { useState } from 'react';
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
    initialPlaylist: 'empty'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPartyDetails({
      ...partyDetails,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would create the party on your backend
    // For now we'll just simulate by navigating to a party room with ID 1
    navigate('/party/1');
  };

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