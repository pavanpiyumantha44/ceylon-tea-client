import React, { useState,useEffect } from 'react'
import { Cloud,CloudRain,Sun,MapPin,Droplets,Wind,Gauge,Eye,Sunrise,Sunset } from 'lucide-react';
import { getWeatherData } from '../../services/weatherService';

const WeatherForeCasting = () => {
 const [weatherData, setWeatherData] = useState(null);
  
  const mapWeatherIcon = (main) => {
  switch (main.toLowerCase()) {
    case "clouds":
      return Cloud;
    case "rain":
      return CloudRain;
    case "clear":
      return Sun;
    default:
      return Cloud;
  }
};

const formatWeatherData = (apiResponse) => {
  const { city, list } = apiResponse;

  const currentData = list[0];

  const current = {
    temperature: Math.round(currentData.main.temp),
    condition: currentData.weather[0].description, // e.g. "light rain"
    humidity: currentData.main.humidity,
    windSpeed: currentData.wind.speed,
    pressure: currentData.main.pressure,
    visibility: currentData.visibility / 1000, // convert to km
    uvIndex: null, // OpenWeatherMap forecast API doesn't have UV index
    sunrise: new Date(city.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sunset: new Date(city.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const forecastMap = {};

  list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "long" });

    if (!forecastMap[day]) {
      forecastMap[day] = {
        day,
        high: item.main.temp_max,
        low: item.main.temp_min,
        condition: item.weather[0].description,
        icon: mapWeatherIcon(item.weather[0].main)
      };
    } else {
      forecastMap[day].high = Math.max(forecastMap[day].high, item.main.temp_max);
      forecastMap[day].low = Math.min(forecastMap[day].low, item.main.temp_min);
    }
  });

  const forecast = Object.values(forecastMap).slice(0, 5);

  return {
    location: `${city.name}, ${city.country}`,
    current,
    forecast
  };
};

  const fetchWeather = async()=>{
    const res = await getWeatherData();
    const formatted = formatWeatherData(res.data);
    setWeatherData(formatted);
  }
  
  useEffect(()=>{
    fetchWeather();
  },[])

  if (!weatherData) return <div>Loading...</div>;
  return (
    <>
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Weather Conditions</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{weatherData.location}</span>
            </div>
          </div>
          <div className="bg-white p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Weather */}
              <div className="space-y-4">
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2">
                    <Cloud className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-3xl font-bold text-gray-800">{weatherData.current.temperature}°C</p>
                      <p className="text-sm text-gray-600">{weatherData.current.condition}</p>
                    </div>
                  </div>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-gray-600">Humidity</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{weatherData.current.humidity}%</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Wind className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-gray-600">Wind Speed</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{weatherData.current.windSpeed} km/h</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Gauge className="h-4 w-4 text-purple-500" />
                      <span className="text-xs text-gray-600">Pressure</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{weatherData.current.pressure} hPa</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-600">Visibility</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{weatherData.current.visibility} km</p>
                  </div>
                </div>

                {/* Sun Times */}
                <div className="flex md:block justify-center items-center lg:block bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Sunrise className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Sunrise</span>
                    <span className="text-sm font-semibold text-gray-800">{weatherData.current.sunrise}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sunset className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Sunset</span>
                    <span className="text-sm font-semibold text-gray-800">{weatherData.current.sunset}</span>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-gray-800 mb-3">5-Day Forecast</h4>
                <div className="space-y-2">
                  {weatherData.forecast.map((day, index) => {
                    const Icon = day.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-5 w-5 ${
                            day.condition.includes('Rain') ? 'text-blue-500' : 
                            day.condition.includes('Sunny') ? 'text-yellow-500' : 
                            'text-gray-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{day.day}</p>
                            <p className="text-xs text-gray-600">{day.condition}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-800">{day.high}°</p>
                          <p className="text-xs text-gray-500">{day.low}°</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
    </div>
    </>
  )
}

export default WeatherForeCasting