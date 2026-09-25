import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Added for professional AI formatting

function OccasionGuide({ setCurrentPage }) {
  // --- STATE: AI EVENT STYLIST ---
  const [eventName, setEventName] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('Evening');
  const [venue, setVenue] = useState('Indoors');
  const [weather, setWeather] = useState('Mild / Room Temp');
  
  // --- STATE: PLUS ONE COORDINATION ---
  const [hasPartner, setHasPartner] = useState(false);
  const [partnerGender, setPartnerGender] = useState('Female');
  const [partnerOutfitType, setPartnerOutfitType] = useState('One Piece / Dress');
  const [partnerColorTop, setPartnerColorTop] = useState('#800020'); 
  const [partnerColorBottom, setPartnerColorBottom] = useState('#000000'); 

  // --- STATE: AI SOCKET ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // --- STATE: DRESS CODE DECODER ---
  const [activeCategory, setActiveCategory] = useState('Wedding');
  const [activeCode, setActiveCode] = useState('Cocktail');

  // Dress Code Dictionary
  const dressCodes = {
    Wedding: {
      'Black Tie': { desc: 'The ultimate formal event. Strict and elegant.', key: 'Tuxedo, bow tie, formal dress shoes.', dont: 'No regular suits, no neckties, no brown shoes.' },
      'Cocktail': { desc: 'A balance between elegant and comfortable.', key: 'Dark suit, solid tie, polished oxfords.', dont: 'No tuxedos, no jeans, no sneakers.' },
      'Beach Formal': { desc: 'Elegant but dressed for the elements.', key: 'Linen suit, light colors, loafers.', dont: 'No shorts, no sandals, no heavy wool.' }
    },
    Professional: {
      'Business Formal': { desc: 'Traditional corporate attire.', key: 'Navy or charcoal suit, conservative tie.', dont: 'No loud patterns, no casual shoes.' },
      'Business Casual': { desc: 'Professional but relaxed.', key: 'Chinos, button-down shirt, blazer optional.', dont: 'No ripped jeans, no t-shirts.' }
    },
    DateNight: {
      'Upscale Dinner': { desc: 'Impressive and sharp.', key: 'Blazer, dark denim, Chelsea boots.', dont: 'No sportswear, no graphic tees.' },
      'Casual Coffee': { desc: 'Effortless and approachable.', key: 'Clean white tee, overshirt, neat sneakers.', dont: 'No sweatpants, no overly formal suits.' }
    }
  };

  // --- LIVE AI SOCKET INTEGRATION ---
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setAiResult(null);

    // 1. Build the Partner context string if applicable
    let partnerDetails = '';
    if (hasPartner) {
      const colorDesc = partnerOutfitType === 'One Piece / Dress' 
        ? `the main color being ${partnerColorTop}` 
        : `a top color of ${partnerColorTop} and bottom color of ${partnerColorBottom}`;
      
      partnerDetails = `I am attending with my partner (${partnerGender}) who is wearing a ${partnerOutfitType} with ${colorDesc}. Please ensure my outfit coordinates perfectly with theirs without clashing.`;
    }

    // 2. Build the final prompt for Gemini
    const promptText = `Act as an expert event stylist. I am attending the following event: "${eventName}". The context is: Time: ${timeOfDay}, Venue: ${venue}, Weather: ${weather}. ${partnerDetails} Suggest a complete, stylish outfit for me that fits this exact occasion and weather. Provide brief styling tips.`;

    try {
      // 3. Call your universal backend AI socket
      const response = await fetch('http://localhost:5000/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: promptText, 
          contextType: 'occasion' 
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // 4. Update state with successful AI response
      setAiResult({
        message: data.result,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err) {
      console.error(err);
      setAiResult({
        message: "⚠️ Error connecting to AI. Please ensure your backend is running.",
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F9] font-sans text-gray-900 p-8 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto w-full mb-6 flex justify-between items-center shrink-0">
         <button onClick={() => setCurrentPage('home')} className="text-sm font-bold text-gray-500 hover:text-pink-500 flex items-center gap-2 transition-colors">
            ← BACK TO DASHBOARD
         </button>
         <h2 className="text-xl font-black tracking-wide font-serif uppercase">Occasion Guide</h2>
      </div>

      <main className="max-w-7xl mx-auto w-full flex flex-col gap-8">
        
        {/* TOP SECTION: AI EVENT STYLIST & SOCKET */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-pink-100 flex flex-col lg:flex-row gap-8">
          
          {/* Left: Input Form */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-2xl font-black mb-2 tracking-wide uppercase">AI Event Stylist</h3>
            <p className="text-xs text-gray-500 mb-6 font-medium">Give the AI the exact context of your event for perfect recommendations.</p>
            
            <div className="bg-[#FFF5F7] p-6 rounded-xl border border-pink-100 mb-6">
              <label className="text-xs font-bold mb-2 text-gray-700 block">1. What is the occasion?</label>
              <input 
                type="text" 
                placeholder="e.g., My girlfriend's outdoor birthday dinner" 
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="border border-gray-300 p-3 rounded-lg w-full mb-4 font-medium focus:outline-none focus:ring-2 focus:ring-pink-300"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold mb-2 text-gray-700 block">Time of Day</label>
                  <select value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)} className="w-full p-2 border rounded-lg outline-none">
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                    <option>Late Night</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold mb-2 text-gray-700 block">Venue</label>
                  <select value={venue} onChange={(e) => setVenue(e.target.value)} className="w-full p-2 border rounded-lg outline-none">
                    <option>Indoors</option>
                    <option>Outdoors</option>
                    <option>Beach / Waterfront</option>
                    <option>City / Urban</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold mb-2 text-gray-700 block">Weather</label>
                  <select value={weather} onChange={(e) => setWeather(e.target.value)} className="w-full p-2 border rounded-lg outline-none">
                    <option>Mild / Room Temp</option>
                    <option>Hot & Humid</option>
                    <option>Cold & Windy</option>
                    <option>Rainy</option>
                  </select>
                </div>
              </div>

              {/* Plus One Toggle Feature */}
              <div className="mt-6 pt-4 border-t border-pink-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-bold text-gray-800">Attending with a partner?</span>
                    <p className="text-[10px] text-gray-500">The AI will suggest complementary styles.</p>
                  </div>
                  {/* Custom Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={hasPartner} onChange={() => setHasPartner(!hasPartner)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
                
                {/* Detailed Partner Input Block */}
                {hasPartner && (
                  <div className="mt-4 animate-fade-in bg-white p-4 rounded-lg border border-pink-200 shadow-sm flex flex-col gap-4">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Partner's Gender</label>
                        <select value={partnerGender} onChange={(e) => setPartnerGender(e.target.value)} className="w-full p-2 border border-gray-200 rounded text-sm outline-none focus:border-pink-300">
                          <option>Female</option>
                          <option>Male</option>
                          <option>Non-binary</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Outfit Type</label>
                        <select value={partnerOutfitType} onChange={(e) => setPartnerOutfitType(e.target.value)} className="w-full p-2 border border-gray-200 rounded text-sm outline-none focus:border-pink-300">
                          <option>One Piece / Dress</option>
                          <option>Two Piece (Top & Bottom)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-6 items-center pt-2 border-t border-gray-100">
                      {partnerOutfitType === 'One Piece / Dress' ? (
                        <div className="flex items-center gap-3">
                          <input type="color" value={partnerColorTop} onChange={(e) => setPartnerColorTop(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                          <span className="text-xs font-bold text-gray-700">Main Outfit Color</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <input type="color" value={partnerColorTop} onChange={(e) => setPartnerColorTop(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                            <span className="text-xs font-bold text-gray-700">Top Color</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="color" value={partnerColorBottom} onChange={(e) => setPartnerColorBottom(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                            <span className="text-xs font-bold text-gray-700">Bottom Color</span>
                          </div>
                        </>
                      )}
                    </div>

                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleGenerateAI}
              disabled={isGenerating || !eventName}
              className="bg-gray-900 text-white py-4 rounded-xl font-black tracking-widest hover:bg-pink-600 transition-colors disabled:bg-gray-400"
            >
              {isGenerating ? 'ANALYZING EVENT...' : 'DRESS ME FOR THIS EVENT ✨'}
            </button>
          </div>

          {/* Right: AI Output & Vibe Board */}
          <div className="w-full lg:w-[450px] bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col relative overflow-hidden">
            <h4 className="font-bold text-sm tracking-wide mb-4 text-center border-b pb-4">AI EVENT LOOKBOOK</h4>
            
            <div className="flex-1 flex flex-col h-full min-h-[350px]">
              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-xs font-bold text-gray-500 animate-pulse">Checking dress codes and weather...</p>
                </div>
              ) : aiResult ? (
                // Live AI Result rendered with Markdown (Matching your professional UI styling)
                <div className="w-full text-left flex flex-col h-full animate-fade-in">
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-pink-100 mb-4 max-h-[450px] overflow-y-auto">
                     <div className="flex justify-between items-center mb-3 pb-2 border-b border-pink-50">
                       <p className="text-[10px] text-pink-600 font-black uppercase tracking-widest">EVENT READY</p>
                       <p className="text-[10px] font-bold text-gray-400">{aiResult.timestamp}</p>
                     </div>
                     
                     <div className="text-xs text-gray-700 leading-relaxed font-medium space-y-2">
                       <ReactMarkdown 
                         components={{
                           strong: ({node, ...props}) => <span className="font-black text-gray-900" {...props} />,
                           h3: ({node, ...props}) => <h3 className="text-sm font-black text-pink-700 mt-4 mb-1 uppercase tracking-wider" {...props} />,
                           p: ({node, ...props}) => <p className="mb-2" {...props} />,
                           ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                           li: ({node, ...props}) => <li className="" {...props} />
                         }}
                       >
                         {aiResult.message}
                       </ReactMarkdown>
                     </div>
                  </div>
                </div>
              ) : (
                /* Static Masonry Vibe Board (Shows before AI generation) */
                <div className="grid grid-cols-2 gap-2 h-full">
                  <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=300&q=80" className="w-full h-40 object-cover rounded-lg opacity-80" alt="Vibe 1"/>
                  <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&q=80" className="w-full h-32 object-cover rounded-lg opacity-80 mt-8" alt="Vibe 2"/>
                  <img src="https://images.unsplash.com/photo-1522228115018-d838bcce5c3a?w=300&q=80" className="w-full h-32 object-cover rounded-lg opacity-80 -mt-8" alt="Vibe 3"/>
                  <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80" className="w-full h-40 object-cover rounded-lg opacity-80" alt="Vibe 4"/>
                  <div className="col-span-2 absolute inset-0 flex flex-col items-center justify-center mt-12 bg-white/40 backdrop-blur-sm">
                    <span className="text-3xl mb-2">🥂</span>
                    <p className="text-xs font-bold text-gray-800 bg-white px-4 py-2 rounded-full shadow-sm">Enter event details to generate look</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: DRESS CODE DECODER */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black tracking-wide uppercase">The Dress Code Decoder</h3>
            <p className="text-sm text-gray-500 mt-2">Never overdress or underdress again. Select a category below.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Category Selector */}
            <div className="w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
              {Object.keys(dressCodes).map(category => (
                <button 
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setActiveCode(Object.keys(dressCodes[category])[0]); // Reset code when category changes
                  }}
                  className={`px-4 py-3 text-sm font-bold rounded-lg text-left whitespace-nowrap transition-colors ${activeCategory === category ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-pink-100'}`}
                >
                  {category} Events
                </button>
              ))}
            </div>

            {/* Dress Code Details Display */}
            <div className="flex-1">
              {/* Tabs for specific codes within category */}
              <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4 overflow-x-auto">
                 {Object.keys(dressCodes[activeCategory]).map(code => (
                   <button 
                     key={code}
                     onClick={() => setActiveCode(code)}
                     className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${activeCode === code ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`}
                   >
                     {code}
                   </button>
                 ))}
              </div>

              {/* The "Cheat Sheet" Card */}
              <div className="bg-[#FDF8F9] border border-pink-100 rounded-xl p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50"></div>
                 
                 <h4 className="text-2xl font-black text-gray-900 mb-2 uppercase">{activeCode}</h4>
                 <p className="text-sm text-gray-600 italic mb-6">{dressCodes[activeCategory][activeCode].desc}</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                   <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                     <h5 className="font-bold text-xs text-green-700 mb-2 uppercase tracking-wider">The Key Pieces</h5>
                     <p className="text-sm font-medium">{dressCodes[activeCategory][activeCode].key}</p>
                   </div>
                   <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                     <h5 className="font-bold text-xs text-red-700 mb-2 uppercase tracking-wider">Strict Don'ts</h5>
                     <p className="text-sm font-medium">{dressCodes[activeCategory][activeCode].dont}</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default OccasionGuide;