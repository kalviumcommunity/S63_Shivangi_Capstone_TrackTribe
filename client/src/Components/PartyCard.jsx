import React from 'react';

const PartyCard = ({ party }) => {
  // Helper function to get cover image URL
  const getCoverImageUrl = (party) => {
    if (party.coverImage) {
      return `http://localhost:5000/api/parties/${party.id}/cover`;
    }
    return null;
  };

  return (
    <div className="bg-black bg-opacity-70 backdrop-blur-lg rounded-xl shadow-xl border border-purple-500 border-opacity-30 overflow-hidden">
      {/* Cover Image */}
      {party.coverImage ? (
        <div className="relative h-48 w-full">
          <img 
            src={getCoverImageUrl(party)}
            alt={`${party.name} cover`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback gradient background */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center"
            style={{ display: 'none' }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-purple-300 text-sm">No Cover Image</p>
            </div>
          </div>
        </div>
      ) : (
        /* Default gradient when no cover image */
        <div className="h-48 w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-purple-300 text-sm">No Cover Image</p>
          </div>
        </div>
      )}

      {/* Party Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white truncate">{party.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            party.privacy === 'private' 
              ? 'bg-red-600 text-red-100' 
              : 'bg-green-600 text-green-100'
          }`}>
            {party.privacy}
          </span>
        </div>

        <div className="flex items-center mb-3">
          <span className="bg-purple-600 text-purple-100 px-2 py-1 rounded-full text-xs font-medium">
            {party.genre}
          </span>
        </div>

        {party.description && (
          <p className="text-purple-300 text-sm mb-4 line-clamp-2">
            {party.description}
          </p>
        )}

        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300">
          Join Party
        </button>
      </div>
    </div>
  );
};

export default PartyCard;
