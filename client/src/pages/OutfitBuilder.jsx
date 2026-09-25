import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Added for professional AI formatting

function OutfitBuilder({ setCurrentPage }) {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('colors'); // 'colors', 'garments', or 'aesthetic'
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // --- FEATURE 1 STATE: COLOR MATCHER ---
  const [unitCount, setUnitCount] = useState(2);
  const [selectedBaseColor, setSelectedBaseColor] = useState('#000000');
  
  // Massive color palette for user selection
  const colorPalette = [
    '#000000', '#FFFFFF', '#808080', '#C0C0C0', '#F5F5DC', // Neutrals
    '#FF0000', '#800000', '#FFC0CB', '#FF69B4', '#FFA500', // Reds/Pinks/Orange
    '#FFFF00', '#808000', '#008000', '#00FF00', '#2E8B57', // Yellows/Greens
    '#0000FF', '#000080', '#87CEEB', '#4B0082', '#7b007b'  // Blues/Purples
  ];

  // --- FEATURE 2 STATE: GARMENT DETAILS ---
  const [mainCategory, setMainCategory] = useState('Tops');
  const [subCategory, setSubCategory] = useState('T-Shirt');
  const [garmentColor, setGarmentColor] = useState('#000000'); 

  // Categorized Garment Data
  const garmentTypes = {
    Tops: ['T-Shirt', 'Button-Down Shirt', 'Polo', 'Cargo Shirt', 'Oversized Tee', 'Hoodie', 'Turtleneck'],
    Bottoms: ['Jeans (Slim)', 'Jeans (Baggy)', 'Jeans (Straight)', 'Chinos', 'Formal Trousers', 'Track Pants', 'Cargo Pants'],
    Outerwear: ['Denim Jacket', 'Blazer', 'Trench Coat', 'Puffer Jacket', 'Cardigan', 'Leather Jacket']
  };

  // --- FEATURE 3 STATE: AESTHETIC DIRECTOR (Bonus Feature) ---
  const [vibe, setVibe] = useState('Minimalist');

  // --- LIVE AI SOCKET INTEGRATION ---
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setAiResult(null);

    // Build the exact prompt based on which tab the user is using
    let promptText = "";
    if (activeTab === 'colors') {
      promptText = `Act as an expert stylist. Build a stylish, modern ${unitCount}-piece outfit using the base hex color ${selectedBaseColor} as the foundation. Suggest complementing colors, garments, and brief styling tips.`;
    } else if (activeTab === 'garments') {
      promptText = `Act as an expert stylist. Style an outfit centered around a ${garmentColor} ${subCategory} (Category: ${mainCategory}). Suggest what other pieces, shoes, and accessories would complete this look perfectly.`;
    } else if (activeTab === 'aesthetic') {
      promptText = `Act as an expert stylist. Create a complete outfit breakdown that perfectly captures the '${vibe}' aesthetic. Include specific garment types, a color palette, and accessory recommendations.`;
    }

    try {
      // Call your backend AI socket
      const response = await fetch('https://fashion-forward-ai.onrender.com///api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: promptText, 
          contextType: 'outfit' 
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Display the live Gemini AI response
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
         <h2 className="text-xl font-black tracking-wide font-serif uppercase">Style Compass AI</h2>
      </div>

      <main className="max-w-7xl mx-auto w-full bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-pink-100 flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT PANEL: THE INPUT TOOLS */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-2xl font-black mb-6 tracking-wide">OUTFIT BUILDER</h3>
          
          {/* Custom Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('colors')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${activeTab === 'colors' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              1. COLOR MATCHER
            </button>
            <button 
              onClick={() => setActiveTab('garments')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${activeTab === 'garments' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              2. GARMENT DETAILS
            </button>
            <button 
              onClick={() => setActiveTab('aesthetic')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${activeTab === 'aesthetic' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              3. AESTHETIC VIBE
            </button>
          </div>

          {/* TAB 1: COLOR MATCHER */}
          {activeTab === 'colors' && (
            <div className="bg-[#FFF5F7] p-6 rounded-xl border border-pink-100 flex-1 flex flex-col">
              <label className="text-xs font-bold mb-2 text-gray-700">How many pieces are in your outfit?</label>
              <select 
                value={unitCount} 
                onChange={(e) => setUnitCount(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full mb-6 font-medium focus:outline-none"
              >
                <option value={2}>2 Pieces (e.g., Top + Bottom)</option>
                <option value={3}>3 Pieces (e.g., Top + Bottom + Jacket)</option>
                <option value={4}>4 Pieces (e.g., Includes Accessories/Shoes)</option>
              </select>

              <label className="text-xs font-bold mb-2 text-gray-700">Select your base color from palette:</label>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-3 mb-6">
                {colorPalette.map((hex, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedBaseColor(hex)}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${selectedBaseColor === hex ? 'border-pink-500 shadow-md scale-110' : 'border-gray-200 shadow-sm'}`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>

              {/* Drag-and-Drop Color Picker */}
              <label className="text-xs font-bold mb-2 text-gray-700 border-t border-pink-200 pt-4">Or create a custom color:</label>
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  value={selectedBaseColor} 
                  onChange={(e) => setSelectedBaseColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer border border-gray-300 p-1 bg-white"
                />
                <span className="text-sm font-mono font-bold text-gray-600">{selectedBaseColor.toUpperCase()}</span>
              </div>
            </div>
          )}

          {/* TAB 2: GARMENT DETAILS */}
          {activeTab === 'garments' && (
            <div className="bg-[#FFF5F7] p-6 rounded-xl border border-pink-100 flex-1 flex flex-col">
              <label className="text-xs font-bold mb-2 text-gray-700">Select Garment Category:</label>
              <select 
                value={mainCategory} 
                onChange={(e) => {
                  setMainCategory(e.target.value);
                  setSubCategory(garmentTypes[e.target.value][0]); 
                }}
                className="border border-gray-300 p-2 rounded w-full mb-6 font-medium focus:outline-none"
              >
                {Object.keys(garmentTypes).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <label className="text-xs font-bold mb-2 text-gray-700">Select Specific Fit/Style:</label>
              <select 
                value={subCategory} 
                onChange={(e) => setSubCategory(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full mb-6 font-medium focus:outline-none"
              >
                {garmentTypes[mainCategory].map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <label className="text-xs font-bold mb-2 text-gray-700 border-t border-pink-200 pt-4">What color is this specific garment?</label>
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  value={garmentColor} 
                  onChange={(e) => setGarmentColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer border border-gray-300 p-1 bg-white"
                />
                <span className="text-sm font-mono font-bold text-gray-600">{garmentColor.toUpperCase()}</span>
              </div>
            </div>
          )}

          {/* TAB 3: AESTHETIC VIBE */}
          {activeTab === 'aesthetic' && (
            <div className="bg-[#FFF5F7] p-6 rounded-xl border border-pink-100 flex-1 flex flex-col">
              <p className="text-xs text-gray-500 mb-4">Let the AI style you based on popular internet fashion aesthetics.</p>
              <label className="text-xs font-bold mb-2 text-gray-700">Choose your Vibe:</label>
              <select 
                value={vibe} 
                onChange={(e) => setVibe(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full font-medium focus:outline-none"
              >
                <option value="Streetwear">Streetwear</option>
                <option value="Old Money / Quiet Luxury">Old Money / Quiet Luxury</option>
                <option value="Y2K Retro">Y2K Retro</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Dark Academia">Dark Academia</option>
              </select>
            </div>
          )}

          {/* Master Generate Button */}
          <button 
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="mt-6 bg-gray-900 text-white py-4 rounded-xl font-black tracking-widest hover:bg-pink-600 transition-colors disabled:bg-gray-400"
          >
            {isGenerating ? 'CONSULTING AI STYLIST...' : 'ASK AI STYLIST ✨'}
          </button>
        </div>

        {/* RIGHT PANEL: AI OUTPUT SOCKET */}
        <div className="w-full lg:w-[450px] bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col relative overflow-hidden">
          <h4 className="font-bold text-sm tracking-wide mb-4 text-center border-b pb-4">AI COMBINATION RESULTS</h4>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
            {isGenerating ? (
              // Loading State Animation
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-bold text-gray-500 animate-pulse">Running fashion algorithm...</p>
              </div>
            ) : aiResult ? (
              // Live AI Result rendered with Markdown
              <div className="w-full text-left flex flex-col h-full">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-pink-100 mb-4 max-h-[450px] overflow-y-auto">
                   <div className="flex justify-between items-center mb-3 pb-2 border-b border-pink-50">
                     <p className="text-[10px] text-pink-600 font-black uppercase tracking-widest">AI Stylist Output</p>
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
              // Empty State
              <div className="text-gray-400 flex flex-col items-center">
                <span className="text-4xl mb-2">👕</span>
                <p className="text-xs font-medium max-w-[200px]">Configure your options on the left and click Generate to see AI matches.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default OutfitBuilder;