import React from 'react';
import LandingPage from '../Components/landingPage';
import SignUpLogin from '../Components/SignUpLogin';
import Navbar from '../Components/Navbar';
import { Routes, Route } from 'react-router-dom';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  return (
    <>
      <Navbar />
      <LandingPage />
    </>
  );
};

export default HomePage;