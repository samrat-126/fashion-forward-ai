import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Added for professional AI formatting

function AccessoryVault({ setCurrentPage }) {
  // --- STATE: ACCESSORY INPUTS ---
  const [baseOutfit, setBaseOutfit] = useState('');
  const [occasion, setOccasion] = useState('Casual');
  const [metalTone, setMetalTone] = useState('Gold');
  
  // State for multiple accessory types (Checkboxes)
  const [selectedTypes, setSelectedTypes] = useState({
    Watches: true,
    Jewelry: true,
    Belts: false,
    Bags: false,
    Sunglasses: false,
    Headwear: false
  });

  // --- STATE: AI SOCKET ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Handle toggling accessory types
  const toggleType = (type) => {
    setSelectedTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // --- LIVE AI SOCKET INTEGRATION ---
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setAiResult(null);

    // 1. Filter out only the selected accessory types
    const requestedAccessories = Object.keys(selectedTypes)
      .filter(key => selectedTypes[key])
      .join(', ');

    // 2. Build the exact prompt for Gemini
    const promptText = `Act as an expert fashion stylist and accessory curator. My base outfit is: "${baseOutfit}". The occasion is: "${occasion}". I prefer ${metalTone} hardware and metal tones. Please recommend specific accessories to perfectly complete this look. Focus specifically on these categories: ${requestedAccessories || 'general accessories'}. Keep your advice stylish, professional, and concise.`;

    try {
      // 3. Call your universal backend AI socket
      const response = await fetch('https://fashion-forward-ai.onrender.com///api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: promptText, 
          contextType: 'accessory' 
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
         <h2 className="text-xl font-black tracking-wide font-serif uppercase">Accessory Vault</h2>
      </div>

      <main className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8">
        
        {/* LEFT PANEL: THE INPUT TOOLS */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-pink-100 flex-1 flex flex-col">
            <h3 className="text-2xl font-black mb-2 tracking-wide uppercase">Curate Your Details</h3>
            <p className="text-xs text-gray-500 mb-6 font-medium">Tell the AI what you're wearing, and it will find the perfect finishing touches.</p>
            
            {/* Input Section 1: The Base */}
            <div className="bg-[#FFF5F7] p-6 rounded-xl border border-pink-100 mb-6">
              <label className="text-xs font-bold mb-2 text-gray-700 block">1. What is your base outfit?</label>
              <input 
                type="text" 
                placeholder="e.g., Simple black slip dress, or White tee and blue jeans" 
                value={baseOutfit}
                onChange={(e) => setBaseOutfit(e.target.value)}
                className="border border-gray-300 p-3 rounded-lg w-full mb-4 font-medium focus:outline-none focus:ring-2 focus:ring-pink-300"
              />

              <label className="text-xs font-bold mb-2 text-gray-700 block">2. What is the occasion?</label>
              <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg outline-none mb-2 font-medium">
                <option>Casual / Everyday</option>
                <option>Professional / Office</option>
                <option>Date Night</option>
                <option>Formal / Evening Wear</option>
                <option>Vacation / Resort</option>
              </select>
            </div>

            {/* Input Section 2: Preferences */}
            <div className="bg-[#FFF5F7] p-6 rounded-xl border border-pink-100 mb-6">
              <label className="text-xs font-bold mb-3 text-gray-700 block">3. Preferred Hardware / Metal Tone</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {['Gold', 'Silver', 'Rose Gold', 'Mixed Metals'].map((metal) => (
                  <button 
                    key={metal}
                    onClick={() => setMetalTone(metal)}
                    className={`py-2 text-xs font-bold rounded-md border transition-all ${metalTone === metal ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
                  >
                    {metal}
                  </button>
                ))}
              </div>

              <label className="text-xs font-bold mb-3 text-gray-700 block border-t border-pink-200 pt-4">4. What do you need? (Select all that apply)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(selectedTypes).map((type) => (
                  <div 
                    key={type} 
                    onClick={() => toggleType(type)}
                    className={`cursor-pointer p-3 rounded-lg border flex items-center justify-between transition-all ${selectedTypes[type] ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white hover:border-pink-300'}`}
                  >
                    <span className={`text-xs font-bold ${selectedTypes[type] ? 'text-pink-700' : 'text-gray-600'}`}>{type}</span>
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${selectedTypes[type] ? 'bg-pink-500 border-pink-500' : 'border-gray-300'}`}>
                      {selectedTypes[type] && <span className="text-white text-[10px]">✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button 
              onClick={handleGenerateAI}
              disabled={isGenerating || !baseOutfit}
              className="mt-auto bg-gray-900 text-white py-4 rounded-xl font-black tracking-widest hover:bg-pink-600 transition-colors disabled:bg-gray-400"
            >
              {isGenerating ? 'CURATING ACCESSORIES...' : 'CURATE MY ACCESSORIES ✨'}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: AI OUTPUT SOCKET */}
        <div className="w-full lg:w-[450px] bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col relative overflow-hidden">
          <h4 className="font-bold text-sm tracking-wide mb-4 text-center border-b pb-4">AI ACCESSORY CURATION</h4>
          
          <div className="flex-1 flex flex-col h-full min-h-[400px]">
            {isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-bold text-gray-500 animate-pulse">Matching metals and textures...</p>
              </div>
            ) : aiResult ? (
              <div className="w-full text-left animate-fade-in flex flex-col h-full">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-pink-100 mb-4 max-h-[500px] overflow-y-auto">
                   <div className="flex justify-between items-center mb-3 pb-2 border-b border-pink-50">
                     <p className="text-[10px] text-pink-600 font-black uppercase tracking-widest">VAULT UNLOCKED</p>
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
              <div className="grid grid-cols-2 gap-3 h-full pb-4">
                <div className="flex flex-col gap-3">
                    <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&q=80" className="w-full h-32 object-cover rounded-lg opacity-70" alt="Accessory 1" />
                    <img src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&q=80" className="w-full flex-1 object-cover rounded-lg opacity-70" alt="Accessory 2" />
                </div>
                <div className="flex flex-col gap-3">
                    <img src="https://images.unsplash.com/photo-1599643478524-fb66f70bc008?w=300&q=80" className="w-full flex-1 object-cover rounded-lg opacity-70" alt="Accessory 3" />
                    <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&q=80" className="w-full h-32 object-cover rounded-lg opacity-70" alt="Accessory 4" />
                </div>
                <div className="col-span-2 absolute inset-0 flex flex-col items-center justify-center mt-12 bg-white/40 backdrop-blur-sm">
                  <span className="text-4xl mb-3 text-pink-400">💍</span>
                  <p className="text-xs font-bold text-gray-800 bg-white px-4 py-2 rounded-full shadow-sm">Provide your outfit details to unlock</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default AccessoryVault;