import React, { useState, useEffect } from 'react';
import Home from './pages/Home.jsx';
import OutfitBuilder from './pages/OutfitBuilder.jsx';
import OccasionGuide from './pages/OccasionGuide.jsx';
import AccessoryVault from './pages/AccessoryVault.jsx';
import TrendForecasting from './pages/TrendForecasting.jsx';
import Auth from './pages/Auth.jsx';
import AIChatWidget from './components/AIChatWidget';

function App() {
  // Check the browser's storage to see if they already logged in recently
  const [token, setToken] = useState(localStorage.getItem('fashion_token'));
  const [currentPage, setCurrentPage] = useState('home');

  // If there is no token, force the screen to the Auth page
  if (!token) {
    return <Auth setCurrentPage={setCurrentPage} setToken={setToken} />;
  }

  // If they have a token, render the normal application
  return (
    <>
    
      {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} setToken={setToken} />}
      {currentPage === 'builder' && <OutfitBuilder setCurrentPage={setCurrentPage} />}
      {currentPage === 'occasions' && <OccasionGuide setCurrentPage={setCurrentPage} />}
      {currentPage === 'accessories' && <AccessoryVault setCurrentPage={setCurrentPage} />}
      {currentPage === 'trends' && <TrendForecasting setCurrentPage={setCurrentPage} />}
      {currentPage === 'auth' && <Auth setCurrentPage={setCurrentPage} setToken={setToken} />}
      {currentPage !== 'auth' && <AIChatWidget />}
    </>
  );
}

export default App;