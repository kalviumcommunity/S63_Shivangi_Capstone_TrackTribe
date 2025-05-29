import React from 'react';
import LandingPage from '../Components/LandingPage';
import SignUpLogin from '../Components/SignUpLogin';
import Navbar from '../Components/Navbar';
import { Routes, Route } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <LandingPage />
    </>
  );
};

export default HomePage;