import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hi! I'm your Fashion Forward AI stylist. Upload a photo of an item, or ask me anything! ✨" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // Holds the image preview
  const [imageBase64, setImageBase64] = useState(null);     // Holds the data for the API
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Handle Image Selection and Base64 Conversion
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the chat UI
      setSelectedImage(URL.createObjectURL(file));
      
      // Convert to Base64 for the API
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove the "data:image/jpeg;base64," prefix for the Gemini API
        const base64String = reader.result.split(',')[1];
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() && !imageBase64) return;

    // Add user message (and image preview if exists) to UI
    const newUserMsg = { 
      id: Date.now(), 
      sender: 'user', 
      text: text || "Analyze this image.",
      image: selectedImage 
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setSelectedImage(null); // Clear preview
    const payloadImage = imageBase64; // store it for the fetch call
    setImageBase64(null); // Clear base64
    setIsTyping(true);

    try {
      const response = await fetch('https://fashion-forward-api.onrender.com/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Act as a witty, high-end personal shopper. The user says: "${text || 'What do you think of this?'}". Keep the response concise, stylish, and conversational.`, 
          contextType: 'chat',
          image: payloadImage // SEND THE IMAGE TO THE BACKEND
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: data.result }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "⚠️ Server connection lost while analyzing the image." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-pink-100 flex flex-col overflow-hidden animate-fade-in origin-bottom-right">
          
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="font-black text-sm uppercase tracking-widest">AI Stylist Room</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-[#FDF8F9] flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-pink-600 text-white rounded-br-sm' : 'bg-white border border-pink-100 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                  {/* Render Image if the user uploaded one */}
                  {msg.image && (
                    <img src={msg.image} alt="User upload" className="w-full rounded-lg mb-2 object-cover border border-pink-400/30" />
                  )}
                  {msg.sender === 'ai' ? (
                    <ReactMarkdown 
                      components={{
                        strong: ({node, ...props}) => <span className="font-black text-gray-900" {...props} />,
                        p: ({node, ...props}) => <p className="mb-1 last:mb-0 leading-relaxed" {...props} />
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-pink-100 p-4 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0 flex flex-col gap-2">
            
            {/* Image Preview Banner above input */}
            {selectedImage && (
              <div className="flex items-center justify-between bg-pink-50 p-2 rounded-lg border border-pink-100">
                <div className="flex items-center gap-2">
                  <img src={selectedImage} alt="Preview" className="w-8 h-8 object-cover rounded" />
                  <span className="text-[10px] font-bold text-pink-700">Image attached</span>
                </div>
                <button onClick={() => {setSelectedImage(null); setImageBase64(null);}} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} className="flex gap-2 relative items-center">
              
              {/* Hidden File Input */}
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
              />
              
              {/* Custom Camera Button */}
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-gray-400 hover:text-pink-600 transition-colors p-1"
                title="Upload image"
              >
                📷
              </button>

              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about styles, or upload a pic..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
              />
              <button 
                type="submit"
                disabled={(!inputValue.trim() && !imageBase64) || isTyping}
                className="absolute right-1 top-1 bottom-1 bg-gray-900 hover:bg-pink-600 disabled:bg-gray-300 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                ↑
              </button>
            </form>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen ? 'bg-pink-600 text-white rotate-90' : 'bg-gray-900 text-white'}`}
      >
        {isOpen ? '✕' : '✨'}
      </button>
    </div>
  );
}

export default AIChatWidget;