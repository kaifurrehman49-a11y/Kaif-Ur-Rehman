import React, { useState, useEffect } from 'react';
import { ServiceProvider } from '../types';
import { db } from '../services/storage';
import { Star, Phone, MapPin, Search, Loader } from 'lucide-react';

const ServicesDirectory: React.FC = () => {
  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Laundry', 'Food', 'Stationery', 'Repair'];

  useEffect(() => {
    const loadServices = async () => {
        setLoading(true);
        const data = await db.getServices();
        setServices(data);
        setLoading(false);
    };
    loadServices();
  }, []);

  const filteredServices = filter === 'All' 
    ? services 
    : services.filter(s => s.type === filter);

  return (
    <div className="pb-24 h-full flex flex-col">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Hostel Essentials</h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search laundry, food..." 
                className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-500"
            />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {filters.map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        filter === f 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto">
        {loading ? (
             <div className="flex justify-center p-8 text-gray-400">
                <Loader className="animate-spin" />
             </div>
        ) : (
            filteredServices.map((service) => (
            <div key={service.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wide bg-pink-50 px-2 py-0.5 rounded-md">{service.type}</span>
                        <h3 className="font-bold text-gray-800 text-lg mt-1">{service.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-yellow-700 border border-yellow-100">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-bold">{service.rating}</span>
                    </div>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>

                <div className="flex flex-col gap-2 mt-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} />
                        <span className="truncate">{service.location}</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-2">
                    <a href={`tel:${service.contact}`} className="flex-1 bg-pink-600 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-pink-700 transition-colors">
                        <Phone size={16} /> Call Now
                    </a>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ServicesDirectory;
