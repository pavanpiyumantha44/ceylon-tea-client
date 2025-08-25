import {
  Menu,
  X,
  Home,
  Users,
  Package,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Leaf,
  Factory,
  Truck,
  DollarSign,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Gauge,
  Sunrise,
  Sunset,
  CloudDrizzle,
  Zap
} from "lucide-react";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getWeatherData } from "../services/weatherService";

const Summary = () => {
  const { user } = useSelector((state) => state.auth);
  const stats = [
    {
      title: "Daily Production",
      value: "2,847 kg",
      change: "+12.5%",
      positive: true,
      icon: Leaf,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Active Workers",
      value: "156",
      change: "+3.2%",
      positive: true,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Inventory Stock",
      value: "18,234 kg",
      change: "-2.1%",
      positive: false,
      icon: Package,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Revenue",
      value: "$42,580",
      change: "+8.7%",
      positive: true,
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Production batch #2847 completed",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      action: "Quality check failed for batch #2846",
      time: "4 hours ago",
      status: "warning",
    },
    {
      id: 3,
      action: "New shipment dispatched to Region A",
      time: "6 hours ago",
      status: "info",
    },
    {
      id: 4,
      action: "15 new workers registered",
      time: "1 day ago",
      status: "success",
    },
    {
      id: 5,
      action: "Equipment maintenance scheduled",
      time: "2 days ago",
      status: "info",
    },
  ];

  const productionData = [
    { month: "Jan", production: 45000, target: 50000 },
    { month: "Feb", production: 52000, target: 55000 },
    { month: "Mar", production: 48000, target: 52000 },
    { month: "Apr", production: 61000, target: 58000 },
    { month: "May", production: 55000, target: 60000 },
    { month: "Jun", production: 67000, target: 65000 },
  ];

  // Sample weather data - you can replace this with real data later
  const weatherData = {
    location: "Panwila, Sri Lanka",
    current: {
      temperature: 28,
      condition: "Partly Cloudy",
      humidity: 75,
      windSpeed: 12,
      pressure: 1013,
      visibility: 8,
      uvIndex: 6,
      sunrise: "06:15",
      sunset: "18:25"
    },
    forecast: [
      { day: "Today", high: 30, low: 24, condition: "Partly Cloudy", icon: Cloud },
      { day: "Tomorrow", high: 29, low: 23, condition: "Light Rain", icon: CloudRain },
      { day: "Wednesday", high: 27, low: 22, condition: "Rainy", icon: CloudRain },
      { day: "Thursday", high: 31, low: 25, condition: "Sunny", icon: Sun },
      { day: "Friday", high: 28, low: 23, condition: "Cloudy", icon: Cloud }
    ]
  };

  const showAlert = ()=>{
     toast.info(`Hey ${user.firstName} ${user.lastName} 👋! Welcome Back`, {
      position: 'top-center',
    });
  }

  const fetchWeather = async()=>{
    const res = await getWeatherData();
    console.log(res.data);
  }
  useEffect(()=>{
    //fetchWeather();
    showAlert();
  },[])

  return (
    <div className="space-y-6">
       <ToastContainer autoClose={2000} />
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.positive ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ml-1 ${
                        stat.positive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Production Overview
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Production</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">Target</span>
              </div>
            </div>
          </div>
          <div className="h-64 overflow-hidden">
            <div className="h-full flex items-end justify-between space-x-2 px-2">
              {productionData.map((data, index) => {
                const maxValue = Math.max(
                  ...productionData.map((d) => Math.max(d.production, d.target))
                );
                const productionHeight = (data.production / maxValue) * 180;
                const targetHeight = (data.target / maxValue) * 180;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="w-full max-w-16 flex flex-col items-center mb-3 relative">
                      {/* Production Bar */}
                      <div className="w-full mb-1 relative">
                        <div
                          className="w-full bg-green-500 rounded-t transition-all duration-500 ease-out"
                          style={{
                            height: `${productionHeight}px`,
                            minHeight: "4px",
                          }}
                        ></div>
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-medium">
                          {(data.production / 1000).toFixed(0)}k
                        </div>
                      </div>

                      {/* Target Line */}
                      <div
                        className="absolute w-full border-t-2 border-dashed border-gray-400"
                        style={{ bottom: `${targetHeight + 20}px` }}
                      >
                        <div className="absolute -right-8 -top-3 text-xs text-gray-500">
                          {(data.target / 1000).toFixed(0)}k
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Weather Section */}
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
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group">
            <Factory className="h-8 w-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600 group-hover:text-green-700">
              Start Production
            </span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group">
            <Package className="h-8 w-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600 group-hover:text-green-700">
              Check Inventory
            </span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group">
            <Users className="h-8 w-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600 group-hover:text-green-700">
              Manage Workers
            </span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group">
            <BarChart3 className="h-8 w-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600 group-hover:text-green-700">
              View Reports
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;