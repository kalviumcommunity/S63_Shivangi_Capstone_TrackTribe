import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { FaHeadphones, FaMusic } from 'react-icons/fa';

const AnimatedHeading = ({ text }) => {
  // Updated neon party colors - removed oranges/yellows, focused on purples/blues/greens/reds/pinks
  const colors = [
    'text-pink-500',
    'text-purple-500',
    'text-blue-400',
    'text-cyan-400',
    'text-green-400',
    'text-fuchsia-500',
    'text-red-500',
    'text-violet-500',
  ];
  
  return (
    <h1 className="text-7xl md:text-8xl font-serif flex flex-wrap justify-center mb-10 text-shadow-glow drop-shadow-2xl">
      {text.split("").map((char, idx) => {
        const colorClass = colors[idx % colors.length];
        
        return (
          <span
            key={idx}
            className={`inline-block transition-all duration-300 transform hover:scale-150 hover:rotate-12 ${colorClass} hover:text-white hover:filter hover:brightness-150`}
            style={{ 
              textShadow: "0 0 15px currentColor",
              transition: `all 0.3s ease ${idx * 0.03}s`
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </h1>
  );
};

const PartyCard = ({ name, attendees, genre, image }) => {
  return (
    <div className="min-w-[300px] md:min-w-[350px] bg-black bg-opacity-80 rounded-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-purple-900">
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-pink-400">{genre}</span>
          <span className="text-cyan-400">{attendees} vibing</span>
        </div>
        <button className="mt-4 w-full py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          Join Now
        </button>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const canvasRef = useRef(null);
  const prevPos = useRef({ x: null, y: null });
  const mousePos = useRef({ x: null, y: null });
  const circlesRef = useRef([]);
  const navigate = useNavigate();
  const partiesScrollRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Full screen setup
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 2; // Extended for full page
    canvas.style.background = 'black';
    canvas.style.display = 'block';
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = 0;
    canvas.style.cursor = 'none';

    // Update mouse position on move
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (prevPos.current.x === null) {
        prevPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 2;
    };

    // Draw loop using GSAP ticker
    const draw = () => {
      const { x: currX, y: currY } = mousePos.current;
      const { x: prevX, y: prevY } = prevPos.current;

      // Only draw when the mouse has moved
      if (currX !== null && (currX !== prevX || currY !== prevY)) {
        // More neon party-focused colors
        const size = Math.random() * 20 + 20;
        const distortionX = Math.random() * 60 - 30;
        const distortionY = Math.random() * 60 - 30;
        const opacity = Math.random() * 0.5 + 0.3;
        const pulseSpeed = Math.random() * 2 + 0.5;

        // Updated color palette for neon rave theme
        const colors = [
          'rgba(255, 0, 255,',   // Magenta
          'rgba(138, 43, 226,',  // BlueViolet
          'rgba(0, 255, 255,',   // Cyan
          'rgba(0, 255, 127,',   // SpringGreen
          'rgba(255, 20, 147,',  // DeepPink
          'rgba(123, 104, 238,', // MediumSlateBlue
          'rgba(0, 191, 255,',   // DeepSkyBlue
          'rgba(255, 0, 0,',     // Red
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        circlesRef.current.push({
          x: currX + distortionX,
          y: currY + distortionY,
          size,
          time: Date.now(),
          opacity,
          pulseSpeed,
          color: randomColor,
        });

        ctx.fillStyle = `${randomColor} ${opacity})`;
        ctx.beginPath();
        ctx.ellipse(currX + distortionX, currY + distortionY, size, size, 0, 0, Math.PI * 2);
        ctx.fill();

        prevPos.current = { x: currX, y: currY };
      }

      // Fade circles after some time
      const currentTime = Date.now();
      circlesRef.current = circlesRef.current.filter(circle => {
        return currentTime - circle.time < 200;
      });

      // Clear the canvas and redraw all the recent circles with pulsing effect
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circlesRef.current.forEach((circle) => {
        const pulse = Math.sin((currentTime - circle.time) / circle.pulseSpeed) * 30 + 20;
        ctx.fillStyle = `${circle.color} ${circle.opacity})`;
        ctx.beginPath();
        ctx.ellipse(circle.x, circle.y, pulse, pulse, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Start the GSAP ticker
    gsap.ticker.add(draw);

    // Event listeners for mouse move and window resize
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Animate the parties scroll on load
    if (partiesScrollRef.current) {
      gsap.fromTo(
        partiesScrollRef.current.children,
        { x: 100, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: partiesScrollRef.current,
            start: "top 80%",
          }
        }
      );
    }

    // Cleanup on unmount
    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleHostParty = () => {
    navigate('/host');
  };

  const handleJoinParty = () => {
    navigate('/join');
  };

  // Sample party data
  const popularParties = [
    {
      id: 1,
      name: "Neon Dreams",
      attendees: 134,
      genre: "Techno",
      image: "https://source.unsplash.com/random/400x300/?rave,neon"
    },
    {
      id: 2,
      name: "Bass Drop",
      attendees: 98,
      genre: "Bass House",
      image: "https://source.unsplash.com/random/400x300/?edm,party"
    },
    {
      id: 3,
      name: "Trance State",
      attendees: 76,
      genre: "Trance",
      image: "https://source.unsplash.com/random/400x300/?trance,music"
    },
    {
      id: 4,
      name: "Future Beats",
      attendees: 112,
      genre: "Future Bass",
      image: "https://source.unsplash.com/random/400x300/?dj,club"
    },
    {
      id: 5,
      name: "Retro Wave",
      attendees: 65,
      genre: "Synthwave",
      image: "https://source.unsplash.com/random/400x300/?synthwave,retro"
    }
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-r from-purple-900 via-black to-pink-900">
      <canvas ref={canvasRef} className="fixed top-0 left-0 z-0" />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-28 pb-20 px-8 md:px-16">
        <AnimatedHeading text="Find Your Dream Party" />
        
        <p className="text-3xl md:text-4xl mb-12 text-cyan-400 italic drop-shadow-xl font-semibold max-w-3xl text-center">
          Where AI mixes, the crowd decides, and the vibe never dies.
        </p>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 justify-center mb-16">
          <button
            onClick={handleHostParty}
            className="group relative bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-6 px-10 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(147,51,234,0.7)] overflow-hidden"
          >
            <span className="flex items-center justify-center gap-3 relative z-10">
              <FaHeadphones size={24} className="animate-pulse" />
              <span className="text-xl">Host a Party</span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></span>
          </button>
          
          <button
            onClick={handleJoinParty}
            className="group relative bg-gradient-to-r from-pink-600 to-blue-600 text-white font-bold py-6 px-10 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(219,39,119,0.7)] overflow-hidden"
          >
            <span className="flex items-center justify-center gap-3 relative z-10">
              <FaMusic size={24} className="animate-bounce" />
              <span className="text-xl">Join a Party</span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></span>
          </button>
        </div>
      </section>

      {/* Popular Parties Section */}
      <section className="relative z-10 py-12 px-6 md:px-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-400">
            Popular Parties
          </span>
        </h2>
        
        {/* Horizontal scrolling parties */}
        <div className="relative max-w-7xl mx-auto">
          <div 
            ref={partiesScrollRef}
            className="flex overflow-x-auto py-6 space-x-6 snap-x scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-500"
            style={{ scrollbarWidth: 'thin' }}
          >
            {popularParties.map(party => (
              <div key={party.id} className="snap-start">
                <PartyCard {...party} />
              </div>
            ))}
          </div>
          
          {/* Gradient borders for scrolling indication */}
          <div className="hidden md:block absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-black to-transparent pointer-events-none z-10"></div>
          <div className="hidden md:block absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none z-10"></div>
        </div>
        
        <div className="flex justify-center mt-8">
          <button className="bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:border-transparent hover:text-white font-bold py-3 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            View All Parties
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto py-12 px-6 bg-black bg-opacity-70 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-purple-400 mb-4">TrackTribe</h3>
            <p className="text-gray-300">
              AI-powered collective DJ experience. Vote for songs, let the crowd decide, and experience perfectly mixed transitions powered by artificial intelligence.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-pink-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-pink-400 mb-4">Connect</h3>
            <div className="flex space-x-4 text-white text-2xl mb-4">
              <a href="#" className="hover:text-purple-400 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <i className="fab fa-discord"></i>
              </a>
            </div>
            <p className="text-gray-300">
              © 2025 TrackTribe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;