import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlay, FaPause, FaForward, FaMusic, FaVolumeUp, FaThumbsUp, FaSearch, FaUserFriends, FaComments } from 'react-icons/fa';

const PartyRoomPage = () => {
  const { id: partyId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('queue');
  
  // Mock data
  const [currentTrack, setCurrentTrack] = useState({
    id: 't1',
    title: 'Clarity',
    artist: 'Zedd ft. Foxes',
    cover: 'https://source.unsplash.com/random/200x200/?edm',
    duration: 271,
    votes: 24
  });
  
  const [queue, setQueue] = useState([
    { id: 't2', title: 'Levels', artist: 'Avicii', cover: 'https://source.unsplash.com/random/200x200/?dj', duration: 215, votes: 18 },
    { id: 't3', title: 'Titanium', artist: 'David Guetta ft. Sia', cover: 'https://source.unsplash.com/random/200x200/?concert', duration: 245, votes: 15 },
    { id: 't4', title: 'Strobe', artist: 'deadmau5', cover: 'https://source.unsplash.com/random/200x200/?rave', duration: 423, votes: 12 },
    { id: 't5', title: 'Insomnia', artist: 'Faithless', cover: 'https://source.unsplash.com/random/200x200/?techno', duration: 208, votes: 9 },
  ]);
  
  const [searchResults] = useState([
    { id: 's1', title: 'The Middle', artist: 'Zedd, Maren Morris & Grey', cover: 'https://source.unsplash.com/random/200x200/?music' },
    { id: 's2', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', cover: 'https://source.unsplash.com/random/200x200/?pop' },
    { id: 's3', title: 'One More Time', artist: 'Daft Punk', cover: 'https://source.unsplash.com/random/200x200/?electronic' },
    { id: 's4', title: 'Don\'t You Worry Child', artist: 'Swedish House Mafia', cover: 'https://source.unsplash.com/random/200x200/?house' },
  ]);
  
  const [participants] = useState([
    { id: 'u1', name: 'DJ_Cosmic', isHost: true },
    { id: 'u2', name: 'RaveLover94' },
    { id: 'u3', name: 'BeatJunkie' },
    { id: 'u4', name: 'DanceQueen' },
    { id: 'u5', name: 'TechnoTim' },
    { id: 'u6', name: 'BassHead' },
    { id: 'u7', name: 'VibeChaser' },
    { id: 'u8', name: 'MelodyMaster' },
  ]);
  
  const [messages, setMessages] = useState([
    { id: 'm1', user: 'DJ_Cosmic', text: 'Welcome to the party! Vote for your favorite tracks!', timestamp: Date.now() - 300000 },
    { id: 'm2', user: 'BeatJunkie', text: 'This AI DJ is amazing! The transitions are so smooth', timestamp: Date.now() - 180000 },
    { id: 'm3', user: 'RaveLover94', text: 'Can someone vote for Strobe? It\'s a classic!', timestamp: Date.now() - 60000 },
    { id: 'm4', user: 'DanceQueen', text: 'The BPM matching is perfect tonight 🔥', timestamp: Date.now() - 30000 },
  ]);
  
  const progressRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSkip = useCallback(() => {
    if (queue.length > 0) {
      // Move current song to history or remove
      // Set new song from queue
      setCurrentTrack(queue[0]);
      
      // Remove from queue
      setQueue(prevQueue => prevQueue.slice(1));
      
      // Start playing
      setIsPlaying(true);
    }
  }, [queue]);

  // Mock timer for demo
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            handleSkip();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isPlaying, duration, handleSkip]);
  
  useEffect(() => {
    // Set duration when current track changes
    if (currentTrack) {
      setDuration(currentTrack.duration);
      setCurrentTime(0);
    }
  }, [currentTrack]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleVote = (id) => {
    setQueue(prevQueue => 
      prevQueue.map(track => 
        track.id === id ? { ...track, votes: track.votes + 1 } : track
      ).sort((a, b) => b.votes - a.votes) // Sort by votes
    );
  };
  
  const handleProgressChange = (e) => {
    const progressBar = progressRef.current;
    if (progressBar) {
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const newTime = clickPosition * duration;
      setCurrentTime(newTime);
    }
  };
  
  const handleAddToQueue = (track) => {
    setQueue(prevQueue => [
      ...prevQueue, 
      { ...track, votes: 1, duration: Math.floor(Math.random() * 200) + 180 } // Random duration
    ].sort((a, b) => b.votes - a.votes));
    setSearchQuery('');
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, you would search your music API here
    console.log("Searching for:", searchQuery);
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: `m${messages.length + 1}`,
        user: 'You', // In real app, use authenticated user
        text: message,
        timestamp: Date.now()
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };
  
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-black to-pink-900 flex flex-col">
      {/* Top bar with party info */}
      <div className="bg-black bg-opacity-90 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 flex items-center justify-center">
            <FaMusic className="text-white" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-white">Party #{partyId}</h1>
            <p className="text-purple-400 text-sm">Hosted by DJ_Cosmic • {participants.length} participants</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowChat(!showChat)}
            className="md:hidden bg-purple-900 p-2 rounded-full text-white"
          >
            <FaComments />
          </button>
          
          <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium">
            Leave Party
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Now playing section */}
          <div className="bg-black bg-opacity-70 p-6 border-b border-purple-900">
            <h2 className="text-lg font-medium text-purple-400 mb-4">Now Playing</h2>
            <div className="flex items-center space-x-6">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title} 
                className="w-24 h-24 object-cover rounded-lg shadow-lg"
              />
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{currentTrack.title}</h3>
                <p className="text-cyan-400 mb-2">{currentTrack.artist}</p>
                
                <div 
                  ref={progressRef}
                  className="h-2 bg-gray-700 rounded-full cursor-pointer mt-4 overflow-hidden"
                  onClick={handleProgressChange}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-sm text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handlePlayPause}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white h-12 w-12 rounded-full flex items-center justify-center hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300"
                >
                  {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                </button>
                
                <button 
                  onClick={handleSkip}
                  className="bg-purple-900 bg-opacity-70 text-white h-10 w-10 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300"
                >
                  <FaForward />
                </button>
              </div>
            </div>
            
            {/* Volume control */}
            <div className="flex items-center mt-4">
              <FaVolumeUp className="text-gray-400 mr-2" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full max-w-xs h-2 bg-gray-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
              />
            </div>
          </div>
          
          {/* Tabs for Queue and Search */}
          <div className="flex bg-black bg-opacity-80">
            <button 
              onClick={() => setActiveTab('queue')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'queue' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400'}`}
            >
              Next in Queue
            </button>
            <button 
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'search' ? 'text-cyan-400 border-b-2 border-cyan-500' : 'text-gray-400'}`}
            >
              Add Songs
            </button>
          </div>
          
          {/* Queue list or Search based on active tab */}
          <div className="flex-1 overflow-y-auto p-4 bg-black bg-opacity-50">
            {activeTab === 'queue' ? (
              <div className="space-y-4">
                {queue.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Queue is empty. Add some songs!</p>
                  </div>
                ) : (
                  queue.map((track) => (
                    <div key={track.id} className="flex items-center p-3 bg-black bg-opacity-70 rounded-lg">
                      <img 
                        src={track.cover} 
                        alt={track.title} 
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="text-white font-medium">{track.title}</h4>
                        <p className="text-gray-400 text-sm">{track.artist}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-purple-400 font-medium mr-2">{track.votes}</span>
                        <button 
                          onClick={() => handleVote(track.id)}
                          className="bg-purple-900 bg-opacity-70 text-white h-8 w-8 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300"
                        >
                          <FaThumbsUp />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div>
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="flex items-center bg-black bg-opacity-70 rounded-lg overflow-hidden border border-purple-900">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for songs, artists, or albums..."
                      className="flex-1 px-4 py-3 bg-transparent text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="p-3 text-white"
                    >
                      <FaSearch />
                    </button>
                  </div>
                </form>
                
                <div className="space-y-3">
                  {searchResults.map((track) => (
                    <div key={track.id} className="flex items-center p-3 bg-black bg-opacity-70 rounded-lg">
                      <img 
                        src={track.cover} 
                        alt={track.title} 
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="text-white font-medium">{track.title}</h4>
                        <p className="text-gray-400 text-sm">{track.artist}</p>
                      </div>
                      <button 
                        onClick={() => handleAddToQueue(track)}
                        className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-3 py-1 rounded-full hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300 text-sm font-medium"
                      >
                        Add to Queue
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Chat and participants sidebar - visible based on showChat state on mobile */}
        <div className={`${showChat ? 'block' : 'hidden'} md:block w-full md:w-80 bg-black bg-opacity-80 border-l border-purple-900`}>
          <div className="p-4 border-b border-purple-900 flex items-center">
            <FaUserFriends className="text-purple-400 mr-2" />
            <h2 className="text-lg font-medium text-white">Participants ({participants.length})</h2>
          </div>
          
          <div className="h-32 overflow-y-auto p-2">
            {participants.map((user) => (
              <div key={user.id} className="px-3 py-2 flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0)}
                </div>
                <span className="ml-2 text-white">
                  {user.name} {user.isHost && <span className="text-xs text-purple-400 ml-1">(Host)</span>}
                </span>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-b border-purple-900">
            <h2 className="text-lg font-medium text-white">Chat</h2>
          </div>
          
          <div className="flex flex-col h-[calc(100%-24rem)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <span className="font-medium text-purple-400">{msg.user}</span>
                    <span className="text-xs text-gray-500 ml-2">{formatMessageTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-white">{msg.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Auto-scroll ref */}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-900">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-l-lg focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-r-lg hover:shadow-[0_0_10px_rgba(139,92,246,0.4)] transition-all duration-300"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyRoomPage;