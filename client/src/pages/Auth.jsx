import React, { useState } from 'react';

function Auth({ setCurrentPage, setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Decide which URL to hit based on the toggle state
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`https://fashion-forward-api.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (isLogin) {
        // Save the digital key to the browser!
        localStorage.setItem('fashion_token', data.token);
        setToken(data.token);
        setCurrentPage('home'); // Send them to the dashboard
      } else {
        // If they just signed up, switch to login mode automatically
        setIsLogin(true);
        setError('Account created! Please log in.');
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-sm border border-pink-100 flex flex-col">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black font-serif uppercase tracking-wide">
            {isLogin ? 'Welcome Back' : 'Join the Vault'}
          </h2>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            {isLogin ? 'Log in to access your digital wardrobe.' : 'Create an account to start styling.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 transition-all"
            />
          </div>

          {error && (
            <div className={`p-3 rounded-lg text-xs font-bold ${error.includes('created') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {error}
            </div>
          )}

          <button type="submit" className="bg-gray-900 text-white py-4 rounded-xl font-black tracking-widest hover:bg-pink-600 transition-colors mt-2">
            {isLogin ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <button 
          onClick={() => { setIsLogin(!isLogin); setError(''); }} 
          className="mt-6 text-xs font-bold text-gray-500 hover:text-pink-500 transition-colors"
        >
          {isLogin ? "Don't have an account? Sign up." : "Already have an account? Log in."}
        </button>
      </div>
    </div>
  );
}

export default Auth;