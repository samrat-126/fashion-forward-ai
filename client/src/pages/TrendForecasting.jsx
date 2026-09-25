import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function TrendForecasting({ setCurrentPage }) {
  const [trends, setTrends] = useState([
    { _id: '1', title: 'Vanilla & Popcorn Yellows', category: 'Colorway', growthRate: '+22%', region: 'EU / US', sentiment: 'Surging' },
    { _id: '2', title: 'Alternative Animal Prints (Zebra)', category: 'Pattern', growthRate: '+21%', region: 'Global', sentiment: 'Breakout' },
    { _id: '3', title: 'Bubble-Hem & Ruffled Skirts', category: 'Silhouette', growthRate: '+17%', region: 'US Market', sentiment: 'Rising' },
    { _id: '4', title: 'Nature-Inspired Greens (Pickled/Pea)', category: 'Colorway', growthRate: '+13%', region: 'Global', sentiment: 'Stable' }
  ]);

  const [searchDesign, setSearchDesign] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

const handleAskAI = async (userInput, type) => {
  try {
    const response = await fetch('https://fashion-forward-ai.onrender.comapi/ai/consult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userInput, contextType: type })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    
    // Display data.result on your screen!
    console.log("AI Advice:", data.result);
  } catch (err) {
    console.error(err);
  }
};

  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    if (!searchDesign) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Call your backend AI socket
      const response = await fetch('https://fashion-forward-ai.onrender.comapi/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: searchDesign, 
          contextType: 'trend' 
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Display the live Gemini AI response
      setAnalysisResult({
        score: 'Live AI Analysis',
        match: data.result,
        recommendation: 'Generated securely via Gemini Cloud Model.'
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch AI analysis. Check your server console.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F9] font-sans text-gray-900 flex flex-col p-8">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto w-full mb-8 flex justify-between items-center">
        <button onClick={() => setCurrentPage('home')} className="text-xs font-bold text-gray-500 hover:text-pink-500 transition-colors">
          ← BACK TO DASHBOARD
        </button>
        <h2 className="text-xl font-black tracking-wide font-serif uppercase">AI Trend Intelligence & Forecasting</h2>
      </div>

      <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT 2 COLUMNS: LIVE MARKET TRENDS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black uppercase tracking-wide">Live Runway & Social Pulse</h3>
                <p className="text-xs text-gray-500">Real-time predictive analytics tracking micro-trends.</p>
              </div>
              <span className="text-[10px] font-bold bg-pink-100 text-pink-700 px-3 py-1 rounded-full uppercase">Updated Live</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trends.map(trend => (
                <div key={trend._id} className="bg-[#FFF5F7] border border-pink-100 p-4 rounded-xl flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest">{trend.category}</span>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{trend.growthRate}</span>
                  </div>
                  <h4 className="font-black text-sm text-gray-900 mb-2">{trend.title}</h4>
                  <div className="flex justify-between items-center pt-3 border-t border-pink-200/50 text-[10px] text-gray-500 font-bold">
                    <span>Region: {trend.region}</span>
                    <span className="text-gray-900">Status: {trend.sentiment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DESIGN VIABILITY CHECKER */}
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black uppercase tracking-wide mb-1">Design Viability Check</h3>
            <p className="text-xs text-gray-500 mb-6">Test a concept against predictive data models before investing.</p>

            <form onSubmit={handleRunAnalysis} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Enter Concept / Garment Idea</label>
                <input 
                  type="text" 
                  placeholder="e.g., Olive Green Satin Midi Skirt"
                  value={searchDesign}
                  onChange={(e) => setSearchDesign(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <button 
                type="submit" 
                disabled={isAnalyzing || !searchDesign}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-black text-xs tracking-widest hover:bg-pink-600 transition-colors disabled:bg-gray-400"
              >
                {isAnalyzing ? 'ANALYZING RUNWAY DATA...' : 'RUN VIABILITY CHECK 📊'}
              </button>
            </form>

            {analysisResult && (
  <div className="mt-6 bg-[#FFF5F7] border border-pink-200 p-5 rounded-2xl animate-fade-in shadow-inner">
    <div className="flex justify-between items-center mb-4 pb-3 border-b border-pink-200/50">
      <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest">
        {analysisResult.score}
      </span>
      <span className="text-[9px] font-black text-gray-400 bg-white px-2 py-1 rounded shadow-sm border border-pink-100">
        {analysisResult.recommendation}
      </span>
    </div>
    
    {/* This is the magic component that renders the AI text beautifully */}
    <div className="text-xs text-gray-700 leading-relaxed font-medium markdown-content space-y-2">
      <ReactMarkdown 
        components={{
          strong: ({node, ...props}) => <span className="font-black text-gray-900" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-sm font-black text-pink-700 mt-4 mb-1 uppercase tracking-wider" {...props} />,
          p: ({node, ...props}) => <p className="mb-2" {...props} />
        }}
      >
        {analysisResult.match}
      </ReactMarkdown>
    </div>
  </div>
)}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Powered by Predictive Fashion Analytics</p>
          </div>
        </div>

      </main>
    </div>
  );
}

export default TrendForecasting;