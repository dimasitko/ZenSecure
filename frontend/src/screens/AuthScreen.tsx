import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'male',
    interestedIn: 'female'
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setSuccessMsg('');

  try {
    if (isLogin) {
      const res = await api.post('/auth/login', { 
        email: formData.email, 
        password: formData.password 
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      navigate('/discover');
    } else {
      const res = await api.post('/auth/register', formData);
      setSuccessMsg(res.data.message);
      setIsLogin(true); 
    }
  } catch (err: any) {
    setError(err.response?.data?.error || 'Something went wrong. Try again.');
  }
};

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] relative overflow-y-auto custom-scrollbar px-6 py-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/10 blur-[80px] pointer-events-none" />
      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-2">
            ZenMatch
          </h1>
          <p className="text-gray-400 text-sm">
            {isLogin ? "Welcome back. You've been missed." : "Find your perfect match today."}
          </p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-rose-500/10 border border-rose-500/50 text-rose-500 rounded-xl text-sm mb-4">{error}</div>}
            {successMsg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 rounded-xl text-sm mb-4">{successMsg}</div>}
              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-900/50 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-rose-500/50 placeholder-gray-600 transition-all border border-gray-800 focus:bg-gray-900"
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-900/50 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-rose-500/50 placeholder-gray-600 transition-all border border-gray-800 focus:bg-gray-900"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-gray-900/50 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-rose-500/50 placeholder-gray-600 transition-all border border-gray-800 focus:bg-gray-900"
                />
              </div>

              {!isLogin && (
                <div className="flex gap-4 pt-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block pl-1">I am a</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-rose-500 appearance-none"
                    >
                      <option value="male">Man</option>
                      <option value="female">Woman</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block pl-1">Looking for</label>
                    <select 
                      value={formData.interestedIn}
                      onChange={(e) => setFormData({ ...formData, interestedIn: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-rose-500 appearance-none"
                    >
                      <option value="female">Women</option>
                      <option value="male">Men</option>
                    </select>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-2xl py-4 font-medium transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 mt-6"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-white hover:text-rose-400 transition-colors font-medium"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};