import React, { useState, useEffect } from 'react';
import { MealShare } from '../types';
import { db } from '../services/storage';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Users, MapPin, ChefHat, Plus, Loader, X } from 'lucide-react';

const MealSharing: React.FC = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<MealShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHosting, setIsHosting] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  // Form State
  const [dish, setDish] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [slots, setSlots] = useState('4');
  const [time, setTime] = useState('');

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    setLoading(true);
    const data = await db.getMeals();
    setMeals(data);
    setLoading(false);
  };

  const handleJoin = async (mealId: string) => {
    if (!user) return;
    setJoiningId(mealId);
    try {
        await db.joinMeal(mealId, user.id);
        await loadMeals();
    } catch (e: any) {
        alert(e.message);
    } finally {
        setJoiningId(null);
    }
  };

  const handleHostMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await db.createMeal({
        hostId: user.id,
        hostName: user.name,
        dish,
        description,
        pricePerPerson: Number(price),
        slotsTotal: Number(slots),
        time: time || 'Today',
        location: user.university || 'Hostel',
    });

    await loadMeals();
    setIsHosting(false);
    // Reset
    setDish('');
    setDescription('');
    setPrice('');
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      <div className="bg-orange-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-2xl font-bold">Never Eat Alone</h2>
            <p className="text-orange-100 mt-1">Join a group order or find home-cooked meals in your hostel.</p>
            <button 
                onClick={() => setIsHosting(true)}
                className="mt-4 bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-orange-50 flex items-center gap-1"
            >
                <Plus size={16} /> Host a Meal
            </button>
        </div>
        <ChefHat className="absolute -bottom-4 -right-4 text-orange-400 opacity-50" size={120} />
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-700 text-lg">Happening Now</h3>
        {loading ? (
             <div className="flex justify-center p-8 text-gray-400">
                <Loader className="animate-spin" />
             </div>
        ) : (
            meals.map((meal) => {
                const isFull = meal.slotsTaken >= meal.slotsTotal;
                const isJoined = user && meal.attendees.includes(user.id);
                return (
                    <div key={meal.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-lg text-gray-800">{meal.dish}</h4>
                                <p className="text-sm text-gray-500">Hosted by <span className="font-medium text-gray-700">{meal.hostName}</span></p>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-xl text-orange-600">Rs. {meal.pricePerPerson}</span>
                                <span className="text-[10px] text-gray-400 uppercase">Per Person</span>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100 italic">"{meal.description}"</p>

                        <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-orange-400" />
                                <span>{meal.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-orange-400" />
                                <span>{meal.location}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                            <div className="flex items-center gap-2">
                                <Users size={18} className="text-gray-400" />
                                <span className="font-medium text-gray-700">
                                    {meal.slotsTaken}/{meal.slotsTotal} <span className="text-gray-400 font-normal">joined</span>
                                </span>
                                <div className="w-20 h-2 bg-gray-100 rounded-full ml-2 overflow-hidden">
                                    <div 
                                        className="h-full bg-orange-500 rounded-full" 
                                        style={{ width: `${(meal.slotsTaken / meal.slotsTotal) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleJoin(meal.id)}
                                disabled={isFull || isJoined || joiningId === meal.id}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                    isFull || isJoined
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                }`}
                            >
                                {joiningId === meal.id ? '...' : (isJoined ? 'Joined' : (isFull ? 'Full' : 'Join'))}
                            </button>
                        </div>
                    </div>
                );
            })
        )}
      </div>

       {/* Host Modal */}
       {isHosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">Host a Meal</h3>
                    <button onClick={() => setIsHosting(false)} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleHostMeal} className="p-4 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">What are you making/ordering?</label>
                        <input type="text" required placeholder="e.g. Chicken Biryani" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500" value={dish} onChange={e => setDish(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price/Person</label>
                            <input type="number" required placeholder="300" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500" value={price} onChange={e => setPrice(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Slots</label>
                            <input type="number" required placeholder="4" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500" value={slots} onChange={e => setSlots(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input type="text" required placeholder="e.g. 8:00 PM Today" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500" value={time} onChange={e => setTime(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea required placeholder="Any details?" rows={2} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>

                    <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-700 transition-transform active:scale-95">
                        Post Meal
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default MealSharing;
