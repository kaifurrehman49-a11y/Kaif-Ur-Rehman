import React, { useState } from 'react';
import Navigation from './components/Navigation';
import RoommateFinder from './components/RoommateFinder';
import Marketplace from './components/Marketplace';
import MealSharing from './components/MealSharing';
import ServicesDirectory from './components/ServicesDirectory';
import Auth from './components/Auth';
import { AppView } from './types';
import { getHostelLifeAdvice } from './services/geminiService';
import { Sparkles, X, LogOut, Heart } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [adviceQuery, setAdviceQuery] = useState('');
  const [adviceResult, setAdviceResult] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const handleGetAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adviceQuery.trim()) return;
    setLoadingAdvice(true);
    const advice = await getHostelLifeAdvice(adviceQuery);
    setAdviceResult(advice);
    setLoadingAdvice(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-pink-50 text-pink-600 font-bold">Loading HostelHub Girls...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.ROOMMATES:
        return <RoommateFinder />;
      case AppView.MARKETPLACE:
        return <Marketplace />;
      case AppView.MEALS:
        return <MealSharing />;
      case AppView.SERVICES:
        return <ServicesDirectory />;
      case AppView.HOME:
      default:
        return (
          <div className="p-4 space-y-6 pb-24 animate-in fade-in">
             {/* Header */}
             <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        HostelHub <Heart className="text-pink-500 fill-current" size={20} />
                    </h1>
                    <p className="text-sm text-gray-500">Welcome, {user.name.split(' ')[0]}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => logout()} className="text-gray-400 hover:text-red-500">
                    <LogOut size={20} />
                  </button>
                  <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-pink-100 object-cover" />
                </div>
             </div>

             {/* AI Advisor Card */}
             <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                    <Sparkles size={20} className="text-yellow-200" />
                    <span className="font-semibold text-sm tracking-wider uppercase">AI Big Sister</span>
                </div>
                <h2 className="text-xl font-bold mb-4">Ask about safety, studies, or life!</h2>
                
                {adviceResult ? (
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 mb-4 animate-in fade-in">
                        <p className="text-sm leading-relaxed">{adviceResult}</p>
                        <button onClick={() => setAdviceResult('')} className="mt-2 text-xs text-pink-200 hover:text-white flex items-center gap-1">
                            <X size={12} /> Clear
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleGetAdvice} className="relative">
                        <input 
                            type="text" 
                            placeholder="e.g. Is it safe to order food late?"
                            value={adviceQuery}
                            onChange={(e) => setAdviceQuery(e.target.value)}
                            className="w-full bg-white/20 border border-white/30 rounded-xl py-3 pl-4 pr-12 text-sm placeholder-pink-200 text-white focus:outline-none focus:bg-white/30 transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={loadingAdvice}
                            className="absolute right-2 top-2 bottom-2 bg-white text-pink-600 rounded-lg px-3 text-xs font-bold shadow-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                            {loadingAdvice ? '...' : 'Ask'}
                        </button>
                    </form>
                )}
             </div>

             {/* Quick Actions Grid */}
             <div>
                <h3 className="font-bold text-gray-800 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setCurrentView(AppView.ROOMMATES)} className="bg-pink-50 hover:bg-pink-100 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors border border-pink-100">
                        <span className="text-2xl">👯‍♀️</span>
                        <span className="text-sm font-bold text-pink-800">Find Sister</span>
                    </button>
                    <button onClick={() => setCurrentView(AppView.MARKETPLACE)} className="bg-purple-50 hover:bg-purple-100 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors border border-purple-100">
                        <span className="text-2xl">💄</span>
                        <span className="text-sm font-bold text-purple-800">Buy/Sell</span>
                    </button>
                    <button onClick={() => setCurrentView(AppView.MEALS)} className="bg-orange-50 hover:bg-orange-100 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors border border-orange-100">
                        <span className="text-2xl">🍰</span>
                        <span className="text-sm font-bold text-orange-800">Share Treat</span>
                    </button>
                    <button onClick={() => setCurrentView(AppView.SERVICES)} className="bg-teal-50 hover:bg-teal-100 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors border border-teal-100">
                        <span className="text-2xl">🧖‍♀️</span>
                        <span className="text-sm font-bold text-teal-800">Services</span>
                    </button>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-pink-50/30">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative">
          {renderView()}
          <Navigation currentView={currentView} setView={setCurrentView} />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
  );
};

export default App;