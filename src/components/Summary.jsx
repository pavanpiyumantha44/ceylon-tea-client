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
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from "react-router-dom"
import WeatherForeCasting from "./WeatherForecasting/WeatherForeCasting";
import { getSummaryStats } from "../services/summaryService";
const Summary = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState([
  {
    title: "Daily Production",
    value: "0 kg",
    change: "+0%",
    positive: true,
    icon: Leaf,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Active Workers",
    value: "0",
    change: "+0%",
    positive: true,
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Inventory Stock",
    value: "0",
    change: "-0%",
    positive: false,
    icon: Package,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Revenue",
    value: "0 LKR",
    change: "+0%",
    positive: true,
    icon: DollarSign,
    color: "bg-yellow-100 text-yellow-600",
  },
  ]);

  const productionData = [
    { month: "Apr", production: 45000, target: 50000 },
    { month: "May", production: 52000, target: 55000 },
    { month: "Jun", production: 48000, target: 52000 },
    { month: "Jul", production: 61000, target: 58000 },
    { month: "Aug", production: 55000, target: 60000 },
    { month: "Sep", production: 5400, target: 65000 },
  ];

  const showAlert = ()=>{
     toast.info(`Hey ${user.firstName} ${user.lastName} 👋! Welcome Back`, {
      position: 'top-center',
    });
  }
  const fetchSummary = async () => {
  try {
    const summaryResponse = await getSummaryStats();
    if (summaryResponse.data.success) {
      const summary = summaryResponse.data.data;

      // Update the stats array
      const updatedStats = stats.map(stat => {
        switch (stat.title) {
          case "Daily Production":
            return { ...stat, value: `${summary.totalKgs} Kg` };
          case "Active Workers":
            return { ...stat, value: `${summary.activeWorkers}` };
          case "Inventory Stock":
            return { ...stat, value: `${summary.totalStockItems}` };
          case "Revenue":
            return { ...stat, value: `${summary.stockValue} LKR` };
          default:
            return stat;
        }
      });

      setStats(updatedStats);
    }
  } catch (error) {
    console.error("Error fetching summary stats:", error);
  }
};

  useEffect(()=>{
    showAlert();
    fetchSummary();
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
        <WeatherForeCasting/>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to='/dashboard/teaPlucking' className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group">
            <Factory className="h-8 w-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600 group-hover:text-green-700">
              Tea Production
            </span>
          </Link>
          <Link to='/dashboard/inventory' className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group">
            <Package className="h-8 w-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600 group-hover:text-green-700">
              Check Inventory
            </span>
          </Link>
          <Link to='/dashboard/workers' className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group">
            <Users className="h-8 w-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600 group-hover:text-green-700">
              Manage Workers
            </span>
          </Link>
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