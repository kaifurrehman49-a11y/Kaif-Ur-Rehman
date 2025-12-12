import React, { useState, useEffect } from 'react';
import { MarketItem } from '../types';
import { generateListingDescription } from '../services/geminiService';
import { db } from '../services/storage';
import { useAuth } from '../contexts/AuthContext';
import { Plus, MapPin, Sparkles, X, Loader } from 'lucide-react';

const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSelling, setIsSelling] = useState(false);
  
  // Form State
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCondition, setNewItemCondition] = useState('Used - Good');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const data = await db.getItems();
    setItems(data);
    setLoading(false);
  };

  const handleGenerateDescription = async () => {
    if (!newItemTitle) return;
    setIsGenerating(true);
    const desc = await generateListingDescription(newItemTitle, newItemCondition);
    setNewItemDesc(desc);
    setIsGenerating(false);
  };

  const handlePostItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await db.createItem({
        sellerId: user.id,
        sellerName: user.name,
        title: newItemTitle,
        description: newItemDesc,
        price: Number(newItemPrice),
        category: 'Other',
        image: `https://picsum.photos/seed/${newItemTitle + Date.now()}/300/200`,
        location: user.university || 'Campus',
    });

    await loadItems();
    setIsSelling(false);
    // Reset form
    setNewItemTitle('');
    setNewItemDesc('');
    setNewItemPrice('');
  };

  return (
    <div className="pb-24">
      {/* Header with Search and Sell Button */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">Girls Market</h2>
        <button 
            onClick={() => setIsSelling(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 shadow-md hover:bg-pink-700 transition-colors"
        >
            <Plus size={16} /> Sell Item
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8 text-gray-400">
            <Loader className="animate-spin" />
        </div>
      ) : (
        /* Grid of Items */
        <div className="p-4 grid grid-cols-2 gap-4">
            {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="relative h-32 bg-gray-200">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {item.location}
                    </span>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wide">{item.category}</span>
                        <span className="text-xs text-gray-400">{new Date(item.postedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm mt-1 line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 flex-1">{item.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                        <span className="font-bold text-gray-900">Rs. {item.price.toLocaleString()}</span>
                        <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700 font-medium">Chat</button>
                    </div>
                </div>
            </div>
            ))}
            {items.length === 0 && (
                <div className="col-span-2 text-center py-10 text-gray-500">
                    <p>No items yet. Be the first to sell something!</p>
                </div>
            )}
        </div>
      )}

      {/* Sell Modal */}
      {isSelling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">Sell an Item</h3>
                    <button onClick={() => setIsSelling(false)} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handlePostItem} className="p-4 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Title</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g. Scientific Calculator"
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-shadow"
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
                            <input 
                                type="number" 
                                required
                                placeholder="1500"
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-pink-500"
                                value={newItemPrice}
                                onChange={(e) => setNewItemPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                            <select 
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none bg-white"
                                value={newItemCondition}
                                onChange={(e) => setNewItemCondition(e.target.value)}
                            >
                                <option>New</option>
                                <option>Used - Like New</option>
                                <option>Used - Good</option>
                                <option>Used - Fair</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <button 
                                type="button" 
                                onClick={handleGenerateDescription}
                                disabled={isGenerating || !newItemTitle}
                                className="text-xs flex items-center gap-1 text-pink-600 font-medium hover:text-pink-800 disabled:opacity-50"
                            >
                                <Sparkles size={12} />
                                {isGenerating ? 'Writing...' : 'AI Auto-Fill'}
                            </button>
                        </div>
                        <textarea 
                            rows={3}
                            required
                            placeholder="Describe your item..."
                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-pink-500"
                            value={newItemDesc}
                            onChange={(e) => setNewItemDesc(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-pink-700 transition-transform active:scale-95"
                    >
                        Post Listing
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
