import React, { useState, useEffect } from 'react';

function Home({ setCurrentPage }) {
  // --- STATE FOR DATABASE DATA ---
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH DATA FROM EXPRESS BACKEND ---
  useEffect(() => {
    fetch('https://fashion-forward-ai.onrender.com///api/outfits')
      .then(response => response.json())
      .then(data => {
        setSavedOutfits(data); // Save the database info into React State
        setIsLoading(false);
      })
      .catch(error => {
        console.error("❌ Failed to fetch outfits:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF8F9] font-sans text-gray-900 flex flex-col overflow-x-hidden pb-12">
      
      {/* COMPACT TOP NAVIGATION */}
      <nav className="flex justify-between items-center px-8 py-3 bg-white shadow-sm shrink-0 sticky top-0 z-50">
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold tracking-wide font-serif">FASHION FORWARD AI</h1>
          <p className="text-xs italic text-gray-500 font-serif">stylish font</p>
        </div>
        <div className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-wide">
          <button onClick={() => setCurrentPage('home')} className="bg-[#F5D0D6] px-3 py-1.5 rounded-md">HOME</button>
          <button onClick={() => setCurrentPage('builder')} className="hover:text-pink-500 uppercase">STYLE COMPASS</button>
          <button onClick={() => setCurrentPage('occasions')} className="hover:text-pink-500 uppercase">OCCASION GUIDE</button>
          <button onClick={() => setCurrentPage('accessories')} className="hover:text-pink-500 uppercase">ACCESSORY VAULT</button>
          <button onClick={() => setCurrentPage('trends')} className="hover:text-pink-500 uppercase">TREND FORECASTING</button>
        </div>
        <button onClick={() => setCurrentPage('auth')} className="border border-gray-800 px-3 py-1.5 text-xs font-bold rounded-md hover:bg-gray-100">LOG IN/SIGN UP</button>
      </nav>

      {/* COMPACT HERO SECTION */}
      <header className="relative w-full h-[25vh] min-h-[180px] flex flex-col justify-center items-center text-center shrink-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1600&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="z-10 relative bg-white/70 backdrop-blur-sm px-8 py-4 rounded-xl shadow-sm">
          <h2 className="text-3xl font-serif font-black mb-2 text-gray-900">YOUR ULTIMATE FASHION GUIDE</h2>
          <p className="text-xs text-gray-700 font-medium">Select a module below to start styling.</p>
        </div>
      </header>

      {/* MAIN DASHBOARD GRID */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: AI Outfit Builder */}
          <div className="bg-white rounded-2xl shadow-sm border border-pink-100 hover:shadow-lg transition-all group flex flex-col overflow-hidden relative min-h-[250px]">
            <div className="h-2/5 bg-[#FFF5F7] p-4 flex flex-col justify-center items-center text-center border-b border-pink-100 z-10 relative">
              <h3 className="text-lg font-black tracking-wide">AI OUTFIT BUILDER</h3>
              <p className="text-[10px] text-gray-500 mt-1">Get precise matching combinations.</p>
            </div>
            <div className="absolute inset-0 pt-[40%]">
              <img src="https://images.unsplash.com/photo-1596392927852-2a18c336fb78?w=500&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                 <button onClick={() => setCurrentPage('builder')} className="bg-[#F5D0D6] text-black px-6 py-2 rounded-md text-xs font-bold shadow-md hover:bg-pink-300 transition-colors">
                    ENTER BUILDER
                 </button>
              </div>
            </div>
          </div>

          {/* Card 2: Occasions Guide */}
          <div className="bg-white rounded-2xl shadow-sm border border-pink-100 hover:shadow-lg transition-all group flex flex-col overflow-hidden relative min-h-[250px]">
            <div className="h-2/5 bg-[#FFF5F7] p-4 flex flex-col justify-center items-center text-center border-b border-pink-100 z-10 relative">
              <h3 className="text-lg font-black tracking-wide">OCCASION GUIDE</h3>
              <p className="text-[10px] text-gray-500 mt-1">What to wear for every event.</p>
            </div>
            <div className="absolute inset-0 pt-[40%] grid grid-cols-2 grid-rows-2">
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&q=80" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
              <img src="https://images.unsplash.com/photo-1522228115018-d838bcce5c3a?w=200&q=80" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                 <button onClick={() => setCurrentPage('occasions')} className="bg-[#F5D0D6] text-black px-6 py-2 rounded-md text-xs font-bold shadow-md hover:bg-pink-300 transition-colors">
                     BROWSE OCCASIONS
                </button>
              </div>
            </div>
          </div>
            
          {/* Card 3: Accessory Vault */}
          <div className="bg-white rounded-2xl shadow-sm border border-pink-100 hover:shadow-lg transition-all group flex flex-col overflow-hidden relative min-h-[250px]">
            <div className="h-2/5 bg-[#FFF5F7] p-4 flex flex-col justify-center items-center text-center border-b border-pink-100 z-10 relative">
              <h3 className="text-lg font-black tracking-wide">ACCESSORY VAULT</h3>
              <p className="text-[10px] text-gray-500 mt-1">Perfect pairings for your look.</p>
            </div>
            <div className="absolute inset-0 pt-[40%] bg-[#FDF8F9] flex items-center justify-center p-4">
              <div className="grid grid-cols-2 gap-2 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="bg-[#F5D0D6] rounded-lg overflow-hidden"><img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&q=80" className="w-full h-full object-cover mix-blend-multiply opacity-70"/></div>
                <div className="bg-[#F5D0D6] rounded-lg overflow-hidden"><img src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&q=80" className="w-full h-full object-cover mix-blend-multiply opacity-70"/></div>
              </div>
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                 <button onClick={() => setCurrentPage('accessories')} className="bg-[#F5D0D6] text-black px-6 py-2 rounded-md text-xs font-bold shadow-md hover:bg-pink-300 transition-colors">
                    OPEN VAULT
                 </button>
              </div>
            </div>
          </div>

        </div>

        {/* --- NEW SECTION: DIGITAL WARDROBE (DATABASE DATA) --- */}
        <div className="mt-8 border-t-2 border-pink-100 pt-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-2xl font-serif font-black uppercase">My Digital Wardrobe</h3>
              <p className="text-xs text-gray-500 mt-1">Your saved AI combinations.</p>
            </div>
            <span className="text-xs font-bold bg-pink-100 text-pink-700 px-3 py-1 rounded-full">{savedOutfits.length} Saved</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-bold text-gray-400">Loading your wardrobe from MongoDB...</p>
            </div>
          ) : savedOutfits.length === 0 ? (
            <div className="bg-white border border-dashed border-pink-200 rounded-2xl py-16 flex flex-col items-center text-center">
              <span className="text-4xl mb-3 opacity-50">🧥</span>
              <p className="text-sm font-bold text-gray-400">Your wardrobe is empty.</p>
              <p className="text-xs text-gray-400 mt-1">Generate an outfit in the Style Compass to see it here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Loop through the MongoDB data and create a card for each outfit */}
              {savedOutfits.map((outfit) => (
                <div key={outfit._id} className="bg-white border border-pink-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 leading-tight uppercase">{outfit.title}</h4>
                      <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">{outfit.occasion}</span>
                    </div>
                    {/* Display the saved Base Color as a visual swatch */}
                    {outfit.baseColor && (
                      <div 
                        className="w-6 h-6 rounded-full border border-gray-200 shadow-sm shrink-0" 
                        style={{ backgroundColor: outfit.baseColor }}
                        title={outfit.baseColor}
                      ></div>
                    )}
                  </div>

                  {/* Card Body: The Garments list */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Included Pieces:</p>
                    <ul className="space-y-1">
                      {outfit.garments.map((garment, index) => (
                        <li key={index} className="text-xs font-medium text-gray-700 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-pink-400"></span> {garment}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Footer: Timestamp */}
                  <p className="text-[9px] text-gray-400 font-bold mt-4 text-right">
                    SAVED: {new Date(outfit.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default Home;