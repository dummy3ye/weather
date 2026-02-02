import React, { useState, useEffect } from 'react';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // HELPER: Determines the background color based on temperature
  const getTheme = () => {
    if (!weather || !weather.main) return 'bg-[#F9F6F2]'; // Default Pastel
    const temp = weather.main.temp;
    if (temp > 35) return 'bg-[#FFD8B1]'; // Hot: Pastel Coral
    if (temp > 30) return 'bg-[#FFECD2]'; // Warm: Pastel Orange
    if (temp < 15) return 'bg-[#E0F2F1]'; // Cool: Pastel Mint
    return 'bg-[#F9F6F2]'; // Normal
  };

  const fetchWeather = async (targetCity: string) => {
    if (!targetCity) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${targetCity}`);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchWeather('Dhaka'); }, []);

  return (
    /* The theme class is applied here with a transition for smoothness */
    <div className={`min-h-screen ${getTheme()} transition-colors duration-1000 flex items-center justify-center p-6 font-sans text-[#333333]`}>
      
      <div className="w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl">
        
        {/* Search Input Area */}
        <div className="relative mb-10 group">
          <input 
            type="text"
            placeholder="Search city (e.g. Barishal)..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchWeather(city)}
            className="w-full pl-6 pr-20 py-4 bg-white/60 border-none rounded-2xl outline-none shadow-inner focus:ring-2 focus:ring-black/5 transition-all"
          />
          <button 
            onClick={() => fetchWeather(city)}
            className="absolute right-2 top-2 bottom-2 px-5 bg-[#333333] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black active:scale-95 transition-all"
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>

        {weather && weather.main ? (
          <div className="text-center animate-in fade-in zoom-in duration-700">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-2 opacity-60">
              {weather.name}, {weather.sys.country}
            </h2>
            
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-white blur-3xl rounded-full opacity-50"></div>
              <img 
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
                alt="status"
                className="relative w-44 h-44 drop-shadow-sm grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>

            <div className="mt-[-10px]">
              <h1 className="text-8xl font-thin tracking-tighter inline-block">{Math.round(weather.main.temp)}°</h1>
            </div>
            
            <p className="mt-4 text-[11px] font-bold italic opacity-40 uppercase tracking-widest">
              {weather.weather[0].description}
            </p>
          </div>
        ) : (
          <div className="text-center py-20 opacity-20 italic">Waking up the pulse...</div>
        )}
      </div>
    </div>
  );
}