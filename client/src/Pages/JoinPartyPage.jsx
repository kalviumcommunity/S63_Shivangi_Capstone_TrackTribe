import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const PartyCard = ({ id, name, host, genre, listeners, isPrivate, onJoin }) => {
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  
  const handleJoinClick = () => {
    if (isPrivate && !showPasswordInput) {
      setShowPasswordInput(true);
      return;
    }
    
    onJoin(id, isPrivate ? password : null);
  };
  
  return (
    <div className="bg-black bg-opacity-80 backdrop-blur-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] border border-purple-900 border-opacity-50">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
          {isPrivate && (
            <span className="bg-purple-900 text-xs text-white px-2 py-1 rounded-full">Private</span>
          )}
        </div>
        
        <p className="text-gray-300 mb-2">Hosted by: {host}</p>
        <p className="text-purple-400 mb-2">Genre: {genre}</p>
        <p className="text-cyan-400 mb-4">{listeners} listeners</p>
        
        {showPasswordInput && isPrivate ? (
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter party password"
              className="w-full px-3 py-2 bg-transparent border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        ) : null}
        
        <button
          onClick={handleJoinClick}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
        >
          {showPasswordInput && isPrivate ? "Join Party" : "Join Now"}
        </button>
      </div>
    </div>
  );
};

const JoinPartyPage = () => {
  const navigate = useNavigate();
  const [partyCode, setPartyCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data for active parties
  const activeParties = [
    { id: '1', name: 'Neon Dreams', host: 'DJ_Cosmic', genre: 'Techno', listeners: 134, isPrivate: false },
    { id: '2', name: 'Bass Drop', host: 'WaveMaster', genre: 'Bass House', listeners: 98, isPrivate: false },
    { id: '3', name: 'Trance State', host: 'PsyMind', genre: 'Trance', listeners: 76, isPrivate: true },
    { id: '4', name: 'Future Beats', host: 'Rhythm_X', genre: 'Future Bass', listeners: 112, isPrivate: false },
    { id: '5', name: 'Retro Wave', host: 'SynthQueen', genre: 'Synthwave', listeners: 65, isPrivate: true },
    { id: '6', name: 'Deep House Vibes', host: 'Grove_Master', genre: 'Deep House', listeners: 89, isPrivate: false },
  ];
  
  const handleJoinWithCode = (e) => {
    e.preventDefault();
    if (partyCode) {
      navigate(`/party/${partyCode}`);
    }
  };
  
  const handleJoinParty = (id) => {
    navigate(`/party/${id}`);
  };
  
  // Filter parties based on search query
  const filteredParties = activeParties.filter(party => 
    party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    party.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    party.host.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gradient-to-r from-indigo-900 via-black to-pink-900">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-8 text-white text-center">Join a Party</h1>
          
          {/* Join with code section */}
          <div className="bg-black bg-opacity-70 backdrop-blur-lg rounded-xl p-6 mb-10 border border-purple-500 border-opacity-30">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">Have a party code?</h2>
            <form onSubmit={handleJoinWithCode} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={partyCode}
                onChange={(e) => setPartyCode(e.target.value)}
                placeholder="Enter party code"
                className="flex-1 px-4 py-3 bg-transparent border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300"
              >
                Join
              </button>
            </form>
          </div>
          
          {/* Search active parties */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parties by name, genre, or host..."
              className="w-full px-4 py-3 bg-black bg-opacity-70 border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          
          {/* Active parties list */}
          <h2 className="text-2xl font-semibold mb-6 text-cyan-300">Active Parties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParties.map(party => (
              <PartyCard 
                key={party.id}
                {...party}
                onJoin={handleJoinParty}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinPartyPage;