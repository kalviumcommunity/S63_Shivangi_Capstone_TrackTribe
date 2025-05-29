import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const Navbar = () => {
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const indicatorRef = useRef(null);
  const burgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const location = useLocation();
  const isMenuOpen = useRef(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const particles = useRef([]);
  const requestRef = useRef();
  const logoHovered = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check if user prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => {
      setReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const navLinks = useMemo(() => [
    { path: '/', label: 'Home' },
    { path: '/discover', label: 'Discover' },
    { path: '/host', label: 'Host Party' },
    { path: '/join', label: 'Join Party' },
    { path: '/trending', label: 'Trending' },
  ], []);

  // Enhanced particle system with more vibrant colors and optimized for performance
  const createParticle = useCallback((x, y, color) => {
    return {
      x,
      y,
      size: Math.random() * 5 + 2, // Larger particles
      speedX: Math.random() * 4 - 2, // More horizontal speed
      speedY: Math.random() * 4 - 2, // More vertical speed
      color,
      life: 100 + Math.random() * 50, // Longer life
      opacity: Math.random() * 0.7 + 0.3 // Higher opacity
    };
  }, []);

  // Throttle function to limit particle creation on lower-end devices
  const throttle = useCallback((func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Detect device performance
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  useEffect(() => {
    // Simple heuristic for detecting low-end devices
    const memory = navigator.deviceMemory;
    const concurrency = navigator.hardwareConcurrency;
    if (memory && memory <= 4) setIsLowEndDevice(true);
    else if (concurrency && concurrency <= 4) setIsLowEndDevice(true);
  }, []);

  // Particle animation system with cleanup
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match navbar with proper device pixel ratio
    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = 120 * pixelRatio; // Taller canvas for particles to flow more
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = '120px';
      
      if (ctx) {
        ctx.scale(pixelRatio, pixelRatio);
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Skip animation if user prefers reduced motion
    if (reducedMotion) {
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }

    // Use a more efficient animation approach
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), 
                          canvas.height / (window.devicePixelRatio || 1));
      
      // Use a safer approach to avoid array mutation during iteration
      const remainingParticles = [];
      
      particles.current.forEach((particle) => {
        // Update particle position with slight drift effect
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.speedY += 0.01; // Gentle gravity effect
        particle.life -= isLowEndDevice ? 1.2 : 0.8; // Faster life reduction on low-end devices
        particle.opacity -= isLowEndDevice ? 0.01 : 0.005; // Faster fade on low-end devices
        
        // Only apply glow on high-end devices
        if (!isLowEndDevice) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = particle.color;
        }
        
        // Draw particle
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        if (!isLowEndDevice) {
          ctx.shadowBlur = 0; // Reset shadow
        }
        
        // Keep alive particles
        if (particle.life > 0 && particle.opacity > 0) {
          remainingParticles.push(particle);
        }
      });
      
      particles.current = remainingParticles;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resizeCanvas);
      particles.current = []; // Clear particles on unmount
    };
  }, [reducedMotion, isLowEndDevice]);

  // Initial animations with performance considerations
  useEffect(() => {
    if (!navbarRef.current || !logoRef.current || !linksRef.current.length) return;
    
    // Skip animations if user prefers reduced motion
    if (reducedMotion) {
      // Just set final state
      if (indicatorRef.current && navbarRef.current) {
        const activeIndex = navLinks.findIndex(link => link.path === location.pathname);
        if (activeIndex >= 0 && linksRef.current[activeIndex]) {
          const linkBounds = linksRef.current[activeIndex].getBoundingClientRect();
          const navBounds = navbarRef.current.getBoundingClientRect();
          
          gsap.set(indicatorRef.current, {
            width: linkBounds.width + 10,
            x: linkBounds.left - navBounds.left - 5,
            opacity: 1,
          });
        }
      }
      return;
    }

    // Initial navbar animation with more dramatic entry
    gsap.fromTo(
      navbarRef.current,
      { y: -150, opacity: 0, rotationX: 60 },
      { y: 0, opacity: 1, rotationX: 0, duration: isLowEndDevice ? 1.0 : 1.5, ease: "elastic.out(1, 0.5)" }
    );

    // Logo animation with intense glow effect
    const logoTl = gsap.timeline();
    logoTl.fromTo(
      logoRef.current,
      { scale: 0, rotation: -60, filter: 'blur(20px)', opacity: 0 },
      { scale: 1, rotation: 0, filter: 'blur(0px)', opacity: 1, duration: isLowEndDevice ? 1.2 : 1.8, ease: "elastic.out(1.2, 0.4)" }
    );
    
    // Only add extra effects on high-end devices
    if (!isLowEndDevice) {
      logoTl.to(logoRef.current, {
        boxShadow: '0 0 25px rgba(255,0,255,0.8), 0 0 40px rgba(86,30,255,0.5)',
        repeat: 2,
        yoyo: true,
        duration: 0.7
      });
    }

    // Links animation with staggered 3D effect
    gsap.fromTo(
      linksRef.current,
      { y: -30, opacity: 0, rotationY: 60, scale: 0.8 },
      { 
        y: 0, 
        opacity: 1, 
        rotationY: 0, 
        scale: 1,
        duration: isLowEndDevice ? 0.7 : 1.0, 
        stagger: isLowEndDevice ? 0.1 : 0.15, 
        ease: "back.out(2)" 
      }
    );

    // Handle scrolling effects with more dramatic color changes
    const handleScroll = () => {
      if (!navbarRef.current) return;
      
      const scrollY = window.scrollY;
      const navbarHeight = navbarRef.current.offsetHeight;
      
      if (scrollY > navbarHeight && !isScrolled) {
        gsap.to(navbarRef.current, {
          background: 'linear-gradient(180deg, rgba(30,0,60,0.95) 0%, rgba(0,0,0,0.9) 100%)',
          backdropFilter: 'blur(18px)',
          boxShadow: '0 5px 25px rgba(148,0,255,0.25), 0 0 10px rgba(255,0,234,0.15)',
          height: '80px',
          duration: 0.4,
          ease: "power2.out"
        });
        setIsScrolled(true);
      } else if (scrollY <= navbarHeight && isScrolled) {
        gsap.to(navbarRef.current, {
          background: 'linear-gradient(180deg, rgba(40,0,70,0.8) 0%, rgba(0,0,0,0.7) 100%)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 15px rgba(138,0,255,0.1)',
          height: '90px',
          duration: 0.4,
          ease: "power2.out"
        });
        setIsScrolled(false);
      }
    };

    // Throttle scroll handler for performance
    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledHandleScroll);
    
    // Update active link indicator initially with glow
    const activeIndex = navLinks.findIndex(link => link.path === location.pathname);
    if (activeIndex >= 0 && linksRef.current[activeIndex] && indicatorRef.current && navbarRef.current) {
      const linkBounds = linksRef.current[activeIndex].getBoundingClientRect();
      const navBounds = navbarRef.current.getBoundingClientRect();
      
      gsap.set(indicatorRef.current, {
        width: linkBounds.width + 10,
        x: linkBounds.left - navBounds.left - 5,
        opacity: 1,
        boxShadow: isLowEndDevice ? 
                  '0 0 8px rgba(255,0,255,0.7)' : 
                  '0 0 15px rgba(255,0,255,0.8), 0 0 25px rgba(157,0,255,0.5)',
      });
    }

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [isScrolled, location.pathname, navLinks, throttle, reducedMotion, isLowEndDevice]);

  // Update indicator when route changes with more animated effect
  useEffect(() => {
    const activeIndex = navLinks.findIndex(link => link.path === location.pathname);
    
    if (
      activeIndex >= 0 && 
      linksRef.current[activeIndex] && 
      indicatorRef.current && 
      navbarRef.current
    ) {
      // Delay the calculation slightly to ensure DOM is fully updated
      const updateIndicator = () => {
        if (!linksRef.current[activeIndex] || !indicatorRef.current || !navbarRef.current) return;
        
        const linkBounds = linksRef.current[activeIndex].getBoundingClientRect();
        const navBounds = navbarRef.current.getBoundingClientRect();
        
        gsap.to(indicatorRef.current, {
          width: linkBounds.width + 10,
          x: linkBounds.left - navBounds.left - 5,
          duration: reducedMotion ? 0.1 : 0.5,
          ease: reducedMotion ? "power1.out" : "elastic.out(1.2, 0.6)",
          boxShadow: isLowEndDevice ? 
                    '0 0 8px rgba(255,0,255,0.7)' : 
                    '0 0 15px rgba(255,0,255,0.8), 0 0 25px rgba(157,0,255,0.5)',
        });
        
        // Update active link color with appropriate glow effect
        linksRef.current.forEach((link, idx) => {
          if (link) {
            gsap.to(link, {
              color: idx === activeIndex ? "#ff00ff" : "rgba(255, 255, 255, 0.8)",
              duration: 0.3,
              textShadow: idx === activeIndex && !reducedMotion ? 
                        '0 0 10px rgba(255,0,255,0.8), 0 0 20px rgba(157,0,255,0.5)' : 
                        'none'
            });
          }
        });
      };
      
      setTimeout(updateIndicator, 50);
      
      // Also update on resize to ensure proper positioning
      const handleResize = throttle(updateIndicator, 100);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [location.pathname, navLinks, throttle, reducedMotion, isLowEndDevice]);

  // Burger menu animation with accessibility improvements
  const handleBurgerClick = useCallback(() => {
    if (!burgerRef.current || !mobileMenuRef.current) return;
    
    isMenuOpen.current = !isMenuOpen.current;
    
    // Set ARIA attributes for accessibility
    burgerRef.current.setAttribute('aria-expanded', isMenuOpen.current.toString());
    
    const tl = gsap.timeline();
    
    if (isMenuOpen.current) {
      // Animate burger to X with neon light effect
      tl.to(burgerRef.current.children[0], { 
        y: 8, rotate: 45, duration: reducedMotion ? 0.2 : 0.3, ease: "power2.out",
        backgroundColor: "#ff00ff",
        boxShadow: !isLowEndDevice && !reducedMotion ? '0 0 8px rgba(255,0,255,0.8)' : 'none',
      }, 0);
      tl.to(burgerRef.current.children[2], { 
        y: -8, rotate: -45, duration: reducedMotion ? 0.2 : 0.3, ease: "power2.out",
        backgroundColor: "#9d00ff",
        boxShadow: !isLowEndDevice && !reducedMotion ? '0 0 8px rgba(157,0,255,0.8)' : 'none',
      }, 0);
      tl.to(burgerRef.current.children[1], { 
        scaleX: 0, opacity: 0, duration: 0.2 
      }, 0);
      
      // Show mobile menu with wave effect
      tl.to(mobileMenuRef.current, { 
        height: "auto", 
        opacity: 1, 
        duration: 0.5,
        background: 'linear-gradient(180deg, rgba(40,0,70,0.9) 0%, rgba(0,0,0,0.95) 100%)',
        backdropFilter: 'blur(15px)',
        boxShadow: !isLowEndDevice && !reducedMotion ? 
                  '0 10px 30px rgba(148,0,255,0.3)' : 
                  '0 5px 15px rgba(0,0,0,0.3)',
        ease: "power2.out" 
      });
      
      if (!reducedMotion) {
        tl.fromTo(
          mobileMenuRef.current.children, 
          { x: -30, opacity: 0, skewX: isLowEndDevice ? 0 : 10 }, 
          { x: 0, opacity: 1, skewX: 0, stagger: 0.08, duration: 0.5, ease: "back.out(1.7)" }, 
          "-=0.3"
        );
      } else {
        tl.to(mobileMenuRef.current.children, { opacity: 1, duration: 0.2 });
      }
    } else {
      // Animate X back to burger with color transition
      if (!reducedMotion) {
        tl.to(mobileMenuRef.current.children, { 
          x: 30, opacity: 0, stagger: -0.05, duration: 0.3 
        });
      } else {
        tl.to(mobileMenuRef.current.children, { opacity: 0, duration: 0.2 });
      }
      
      tl.to(mobileMenuRef.current, { 
        height: 0, 
        opacity: 0, 
        duration: reducedMotion ? 0.2 : 0.4, 
        ease: "power3.in" 
      });
      tl.to(burgerRef.current.children, {
        backgroundColor: "#aa26ff",
        boxShadow: 'none',
        duration: 0.3,
      }, "-=0.3");
      tl.to(burgerRef.current.children[0], { 
        y: 0, rotate: 0, duration: reducedMotion ? 0.2 : 0.4, ease: "back.out(1.5)" 
      }, "-=0.2");
      tl.to(burgerRef.current.children[2], { 
        y: 0, rotate: 0, duration: reducedMotion ? 0.2 : 0.4, ease: "back.out(1.5)" 
      }, "-=0.4");
      tl.to(burgerRef.current.children[1], { 
        scaleX: 1, opacity: 1, duration: 0.3 
      }, "-=0.2");
    }
  }, [reducedMotion, isLowEndDevice]);

  // Enhanced hover effects for links with performance optimizations
  const handleLinkHover = useCallback((index) => {
    if (reducedMotion || !linksRef.current[index] || !indicatorRef.current) return;
    
    setHoverIndex(index);
    
    const linkBounds = linksRef.current[index].getBoundingClientRect();
    
    // Emit more intense particles at link position - reduced for low-end devices
    const particleCount = isLowEndDevice ? 8 : 20;
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        if (hoverIndex !== index) return; // Check if we're still hovering this element
        
        const x = linkBounds.left + linkBounds.width / 2 + (Math.random() * 60 - 30);
        const y = linkBounds.top + linkBounds.height / 2 + (Math.random() * 15 - 7);
        
        // Expanded color palette with more vibrant Malang movie inspired neon colors
        const neonColors = [
          `rgba(255, 0, 255, ${Math.random() * 0.7 + 0.3})`, // Magenta
          `rgba(157, 0, 255, ${Math.random() * 0.7 + 0.3})`, // Purple
          `rgba(0, 240, 255, ${Math.random() * 0.7 + 0.3})`, // Cyan
          `rgba(0, 255, 157, ${Math.random() * 0.7 + 0.3})`, // Neon Green
          `rgba(255, 0, 128, ${Math.random() * 0.7 + 0.3})`, // Hot Pink
          `rgba(0, 102, 255, ${Math.random() * 0.7 + 0.3})`, // Electric Blue
        ];
        const randomNeonColor = neonColors[Math.floor(Math.random() * neonColors.length)];
        
        particles.current.push({
          x,
          y,
          size: Math.random() * 5 + 2,
          speedX: Math.random() * 3 - 1.5,
          speedY: Math.random() * 4 - 3,
          color: randomNeonColor,
          life: isLowEndDevice ? 50 + Math.random() * 30 : 70 + Math.random() * 50,
          opacity: Math.random() * 0.7 + 0.3
        });
      }, i * (isLowEndDevice ? 25 : 15));
    }
  
    // Animate the hovered link with intense glow
    gsap.to(linksRef.current[index], {
      scale: isLowEndDevice ? 1.1 : 1.18,
      color: "#ffffff",
      textShadow: isLowEndDevice ? 
                "0 0 8px rgba(255,0,255,0.8)" : 
                "0 0 12px rgba(255,0,255,0.9), 0 0 25px rgba(157,0,255,0.7), 0 0 40px rgba(0,240,255,0.5)",
      duration: 0.4,
      ease: "power2.out"
    });
  
    // Liquid effect on the indicator with more dramatic elastic movement
    gsap.to(indicatorRef.current, {
      scaleX: isLowEndDevice ? 1.3 : 1.5,
      scaleY: isLowEndDevice ? 1.5 : 1.8,
      backgroundColor: "rgba(255,0,255,0.8)",
      boxShadow: isLowEndDevice ? 
                "0 0 10px rgba(255,0,255,0.6)" : 
                "0 0 20px rgba(255,0,255,0.7), 0 0 35px rgba(157,0,255,0.6)",
      duration: 0.5,
      ease: "elastic.out(1.1, 0.4)"
    });
  
    // Scale down other links more dramatically
    linksRef.current.forEach((link, idx) => {
      if (idx !== index && link) {
        gsap.to(link, {
          scale: isLowEndDevice ? 0.95 : 0.9,
          opacity: 0.6,
          filter: isLowEndDevice ? 'none' : 'blur(1px)',
          duration: 0.4
        });
      }
    });
  }, [isLowEndDevice, hoverIndex, reducedMotion]);

  const handleLinkHoverExit = useCallback((index) => {
    if (reducedMotion || !linksRef.current[index] || !indicatorRef.current) return;
    
    setHoverIndex(null);
    
    gsap.to(linksRef.current[index], {
      scale: 1,
      color: location.pathname === navLinks[index].path ? "#ff00ff" : "rgba(255, 255, 255, 0.8)",
      textShadow: location.pathname === navLinks[index].path ? 
                 (isLowEndDevice ? 
                  '0 0 8px rgba(255,0,255,0.7)' : 
                  '0 0 10px rgba(255,0,255,0.8), 0 0 20px rgba(157,0,255,0.5)') : 
                 'none',
      duration: 0.4
    });
  
    // Restore indicator with subtle animation
    gsap.to(indicatorRef.current, {
      scaleX: 1,
      scaleY: 1,
      backgroundColor: "rgba(255,0,255,0.6)",
      boxShadow: isLowEndDevice ? 
                "0 0 8px rgba(255,0,255,0.4)" : 
                "0 0 12px rgba(255,0,255,0.5), 0 0 20px rgba(157,0,255,0.3)",
      duration: 0.4,
      ease: "power2.out"
    });
  
    // Restore other links with smooth transition
    linksRef.current.forEach((link, idx) => {
      if (idx !== index && link) {
        gsap.to(link, {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.3
        });
      }
    });
  }, [location.pathname, navLinks, isLowEndDevice, reducedMotion]);
  
  // Enhanced logo hover effect with performance optimizations
  const handleLogoHover = useCallback(() => {
    if (reducedMotion || !logoRef.current) return;
    
    logoHovered.current = true;
    
    // Create pulsating intense glow effect
    gsap.to(logoRef.current, {
      textShadow: isLowEndDevice ? 
                "0 0 10px rgba(255,0,255,0.8)" : 
                "0 0 15px rgba(255,0,255,0.9), 0 0 30px rgba(157,0,255,0.7), 0 0 50px rgba(0,240,255,0.5)",
      scale: isLowEndDevice ? 1.1 : 1.15,
      duration: 0.5,
      ease: "power2.out"
    });
    
    // Skip particles on low-end devices or reduced motion
    if (isLowEndDevice) return;
    
    // Emit particles from logo with burst effect
    const logoRect = logoRef.current.getBoundingClientRect();
    const centerX = logoRect.left + logoRect.width / 2;
    const centerY = logoRect.top + logoRect.height / 2;
    
    // Circular particle burst with more particles
    const particleCount = isLowEndDevice ? 15 : 30;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = Math.random() * 20 + 5;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      setTimeout(() => {
        if (!logoHovered.current) return; // Check if still hovering
        
        // Malang palette colors
        const colors = [
          'rgba(255,0,255,0.8)', // Magenta
          'rgba(157,0,255,0.8)', // Purple
          'rgba(0,240,255,0.8)', // Cyan
          'rgba(255,0,128,0.8)', // Hot Pink
          'rgba(0,255,157,0.8)'  // Neon Green
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particles.current.push({
          x,
          y,
          size: Math.random() * 4 + 2,
          speedX: Math.cos(angle) * (Math.random() * 3 + 2),
          speedY: Math.sin(angle) * (Math.random() * 3 + 2),
          color,
          life: isLowEndDevice ? 50 + Math.random() * 40 : 70 + Math.random() * 60,
          opacity: Math.random() * 0.8 + 0.2
        });
      }, i * (isLowEndDevice ? 30 : 20));
    }
  }, [isLowEndDevice, reducedMotion]);
  
  const handleLogoHoverExit = useCallback(() => {
    if (reducedMotion || !logoRef.current) return;
    
    logoHovered.current = false;
    
    gsap.to(logoRef.current, {
      textShadow: "0 0 5px rgba(255,0,255,0.5), 0 0 10px rgba(157,0,255,0.3)",
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    });
  }, [reducedMotion]);

  // Handle mobile menu keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isMenuOpen.current) {
      handleBurgerClick();
    }
  }, [handleBurgerClick]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMenuOpen.current) {
      handleBurgerClick();
    }
  }, [location.pathname, handleBurgerClick]);

  return (
    <>
      <canvas 
        ref={particleCanvasRef} 
        className="fixed top-0 left-0 w-full h-28 z-50 pointer-events-none"
        aria-hidden="true"
      />
      
      <nav 
        ref={navbarRef} 
        className="fixed top-0 left-0 w-full z-40 px-4 sm:px-8 py-4 sm:py-5 backdrop-blur-lg bg-gradient-to-b from-[rgba(40,0,70,0.8)] to-[rgba(0,0,0,0.7)] transition-all duration-300"
        style={{
          boxShadow: "0 0 20px rgba(157,0,255,0.2), 0 0 40px rgba(0,0,0,0.5)",
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Desktop navbar */}
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link 
            to="/"
            ref={logoRef} 
            className="text-transparent font-bold text-2xl sm:text-3xl cursor-pointer transition-all duration-300 px-2 sm:px-3 py-1 rounded-lg"
            onMouseEnter={handleLogoHover}
            onMouseLeave={handleLogoHoverExit}
            style={{ 
              textShadow: "0 0 5px rgba(255,0,255,0.5), 0 0 10px rgba(157,0,255,0.3)" 
            }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] via-[#aa26ff] to-[#00f0ff] transition-all duration-500">
              TRACKTRIBE
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-16 relative">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                ref={el => linksRef.current[index] = el}
                onMouseEnter={() => handleLinkHover(index)}
                onMouseLeave={() => handleLinkHoverExit(index)}
                className={`text-lg font-medium tracking-wider transition-all duration-300 px-3 py-2 ${
                  location.pathname === link.path 
                    ? 'text-[#ff00ff] text-shadow-neon' 
                    : 'text-white hover:text-[#00f0ff]'
                }`}
                style={{
                  textShadow: location.pathname === link.path && !reducedMotion
                    ? '0 0 10px rgba(255,0,255,0.8), 0 0 20px rgba(157,0,255,0.5)' 
                    : 'none'
                }}
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Animated indicator for active link */}
            <div 
              ref={indicatorRef}
              className="absolute -bottom-3 h-1 bg-[#ff00ff] rounded-full transition-all duration-300 opacity-0"
              style={{ 
                boxShadow: "0 0 12px rgba(255,0,255,0.5), 0 0 20px rgba(157,0,255,0.3)" 
              }}
              aria-hidden="true"
            />
          </div>

          {/* Auth button */}
          <div className="hidden md:block">
            <Link 
              to="/auth"
              className="relative overflow-hidden bg-gradient-to-r from-[#9d00ff] to-[#ff0080] text-white px-6 py-2 sm:px-7 sm:py-2.5 rounded-full 
                         hover:shadow-[0_0_20px_rgba(255,0,128,0.7),0_0_40px_rgba(157,0,255,0.4)] transition-all duration-300 transform hover:scale-105 group"
            >
              <span className="relative z-10 font-medium tracking-wider">Sign In</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] to-[#ff00ff] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></span>
            </Link>
          </div>

          {/* Mobile menu burger */}
          <button 
            ref={burgerRef}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5"
            onClick={handleBurgerClick}
            aria-label="Toggle navigation menu"
            aria-expanded="false"
            aria-controls="mobile-menu"
          >
            <span className="w-full h-0.5 bg-[#aa26ff] rounded-full transform transition-all duration-300"
                  style={{ boxShadow: "0 0 5px rgba(157,0,255,0.8)" }}></span>
            <span className="w-full h-0.5 bg-[#aa26ff] rounded-full transform transition-all duration-300"
                  style={{ boxShadow: "0 0 5px rgba(157,0,255,0.8)" }}></span>
            <span className="w-full h-0.5 bg-[#aa26ff] rounded-full transform transition-all duration-300"
                  style={{ boxShadow: "0 0 5px rgba(157,0,255,0.8)" }}></span>
          </button>
        </div>
      </nav>

      {/* Mobile menu with accessibility improvements */}
      <div 
        id="mobile-menu"
        ref={mobileMenuRef}
        className="fixed top-20 left-0 w-full bg-black bg-opacity-95 backdrop-blur-lg z-40 
                   flex flex-col items-center space-y-4 sm:space-y-6 py-6 sm:py-8 overflow-hidden opacity-0 h-0"
        style={{
          boxShadow: "0 10px 30px rgba(148,0,255,0.3)"
        }}
        role="menu"
        aria-labelledby="menu-button"
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-xl font-medium tracking-wider px-6 py-3 w-full max-w-xs text-center transform transition-all duration-300 hover:scale-110 ${
              location.pathname === link.path 
                ? 'text-[#ff00ff] text-shadow-neon' 
                : 'text-white hover:text-[#00f0ff]'
            }`}
            style={{
              textShadow: location.pathname === link.path && !reducedMotion 
                ? '0 0 10px rgba(255,0,255,0.8), 0 0 20px rgba(157,0,255,0.5)' 
                : 'none'
            }}
            onClick={handleBurgerClick}
            role="menuitem"
            aria-current={location.pathname === link.path ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
        <Link 
          to="/auth"
          className="bg-gradient-to-r from-[#9d00ff] to-[#ff0080] text-white px-8 py-3 rounded-full mt-4
                     transform transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,0,128,0.7),0_0_40px_rgba(157,0,255,0.4)] font-medium tracking-wider"
          onClick={handleBurgerClick}
          role="menuitem"
        >
          Sign In
        </Link>
      </div>
      
      {/* Add global styles for text shadow */}
      <style jsx="true">{`
        .text-shadow-neon {
          text-shadow: 0 0 10px rgba(255,0,255,0.8), 0 0 20px rgba(157,0,255,0.5);
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.001ms !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;