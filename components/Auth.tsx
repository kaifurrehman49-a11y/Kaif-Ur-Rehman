import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';

const Auth: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [bio, setBio] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const newUser: Omit<User, 'id'> = {
          email,
          password,
          name,
          university,
          degree: 'Undecided',
          year: 'Freshman',
          bio: bio || 'New here!',
          habits: [],
          // Female avatar seed by default
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&hair=long01`,
          lookingForRoommate: true
        };
        await register(newUser);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-pink-700 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">HostelHub Girls</h1>
          <p className="text-pink-200">Safe. Secure. Sisterhood.</p>
        </div>
        
        <div className="p-8">
          <div className="flex gap-4 mb-6 border-b border-gray-100 pb-2">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-2 font-medium text-sm transition-colors ${isLogin ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-400'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-2 font-medium text-sm transition-colors ${!isLogin ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-400'}`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">University</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500" value={university} onChange={e => setUniversity(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bio</label>
                  <input type="text" placeholder="Short intro..." className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500" value={bio} onChange={e => setBio(e.target.value)} />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
              <input type="email" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
              <input type="password" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-pink-700 transition-all active:scale-95 disabled:opacity-70 mt-4"
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Join Sisterhood')}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">Girls Only Environment. Data saved locally.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
