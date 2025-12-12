import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/storage';
import { analyzeRoommateCompatibility } from '../services/geminiService';
import { Sparkles, MessageCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RoommateFinder: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ id: string; text: string } | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
        setLoading(true);
        const data = await db.getUsers();
        // Filter out current user
        setUsers(data.filter(u => u.id !== currentUser?.id));
        setLoading(false);
    };
    loadUsers();
  }, [currentUser]);

  const handleAnalyze = async (user: User) => {
    if (!currentUser) return;
    setAnalyzingId(user.id);
    setAnalysisResult(null);
    const result = await analyzeRoommateCompatibility(currentUser, user);
    setAnalysisResult({ id: user.id, text: result });
    setAnalyzingId(null);
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="bg-pink-600 rounded-xl p-4 text-white shadow-lg">
        <h2 className="text-xl font-bold">Find Your Sisters</h2>
        <p className="text-pink-100 text-sm">Safe matches for female students near you.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
             <div className="flex justify-center p-8 text-gray-400">
                <Loader className="animate-spin" />
             </div>
        ) : (
            users.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex p-4 gap-4">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-pink-100" />
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-800">{user.name}</h3>
                        <p className="text-xs text-pink-600 font-medium">{user.university} • {user.year}</p>
                    </div>
                    {/* Placeholder for real matching logic later */}
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold">NEW</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{user.bio}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                        {user.habits.slice(0, 3).map((habit, idx) => (
                            <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200">{habit}</span>
                        ))}
                    </div>
                </div>
                </div>

                {/* AI Analysis Section */}
                {analysisResult && analysisResult.id === user.id && (
                <div className="mx-4 mb-4 p-3 bg-pink-50 rounded-lg border border-pink-100 text-sm text-pink-900 animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-2 items-start">
                        <Sparkles size={16} className="mt-0.5 text-pink-500 flex-shrink-0" />
                        <p>{analysisResult.text}</p>
                    </div>
                </div>
                )}

                <div className="grid grid-cols-2 border-t border-gray-100 divide-x divide-gray-100">
                <button 
                    onClick={() => handleAnalyze(user)}
                    disabled={analyzingId === user.id}
                    className="py-3 text-sm font-medium text-pink-600 hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
                >
                    {analyzingId === user.id ? (
                        <span className="animate-pulse">Analyzing...</span>
                    ) : (
                        <>
                            <Sparkles size={16} />
                            AI Sister Check
                        </>
                    )}
                </button>
                <button className="py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <MessageCircle size={16} />
                    Message
                </button>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default RoommateFinder;
