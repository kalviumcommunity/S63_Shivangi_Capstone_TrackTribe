import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
// import SignUpLogin from './Components/SignUpLogin';
import AuthForm from './Components/SignUpLogin';
import HomePage from './Pages/HomePage';
import HostPartyPage from './Pages/HostPartyPage';
import JoinPartyPage from './Pages/JoinPartyPage';
import PartyRoomPage from './Pages/PartyRoomPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/auth" element={<AuthForm/>} />
        <Route path="/host" element={<HostPartyPage />} />
        <Route path="/join" element={<JoinPartyPage />} />
        <Route path="/party/:id" element={<PartyRoomPage />} />
      </Routes>
    </Router>
  );
}

export default App;