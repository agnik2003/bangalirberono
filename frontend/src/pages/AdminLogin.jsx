import { API } from '../data/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        // We now rely on the httpOnly cookie sent by the server
        navigate('/admin/dashboard'); 
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Cannot connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#c9a96e]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#e07b39]/10 blur-[100px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-[#111114] border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9a96e]/15 to-[#e07b39]/10 border border-[#c9a96e]/20 mb-6">
            <Lock size={28} className="text-[#c9a96e]" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-[#a09a8e] text-sm">Sign in to manage Bangalir Berano</p>
        </div>
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#6b6560] uppercase tracking-wider mb-2 ml-1">
              Admin ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-[#a09a8e]" />
              </div>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter Admin ID"
                autoComplete="username"
                className="w-full bg-[#16161a] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white text-[15px] focus:outline-none focus:border-[#c9a96e]/50 focus:bg-[#1a1a1f] transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6b6560] uppercase tracking-wider mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-[#a09a8e]" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-[#16161a] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white text-[15px] focus:outline-none focus:border-[#c9a96e]/50 focus:bg-[#1a1a1f] transition-all"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#c9a96e] to-[#e07b39] text-[#0a0a0b] font-bold py-4 rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-[13px] text-[#a09a8e] hover:text-white transition-colors"
          >
            &larr; Back to Website
          </button>
        </div>
      </motion.div>
    </div>
  );
}




