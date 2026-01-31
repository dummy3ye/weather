import { useEffect, useState } from 'react';

// Define the shape of our data
interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
}

// Icon Mapping: Make sure these files exist in /public/icons/
const iconMap: Record<string, string> = {
  'Clear': '/icons/sun.svg',
  'Clouds': '/icons/cloud.svg',
  'Rain': '/icons/rain.svg',
  'Thunderstorm': '/icons/storm.svg',
  'Drizzle': '/icons/rain.svg',
  'Mist': '/icons/fog.svg',
  'Haze': '/icons/fog.svg',
};

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/weather')
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching weather:", err);
        setLoading(false);
      });
  }, []);

  // Determine which icon to show (Default to sun if unknown)
  const getIcon = (condition: string) => {
    return iconMap[condition] || '/icons/sun.svg';
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        {loading ? (
          <p className="loading-text">Scanning Atmosphere...</p>
        ) : weather ? (
          <>
            <div className="icon-container">
              <img 
                src={getIcon(weather.condition)} 
                alt={weather.condition} 
                className="floating-icon" 
              />
            </div>
            <h1 className="temp">{Math.round(weather.temperature)}°C</h1>
            <h2 className="city">{weather.city}</h2>
            <p className="condition">{weather.condition}</p>
            
            <div className="details">
               <div className="detail-item">
                  <span>Humidity</span>
                  <span>{weather.humidity}%</span>
               </div>
            </div>
          </>
        ) : (
          <p className="error-text">Data Unavailable</p>
        )}
      </div>
    </div>
  );
}

export default App;