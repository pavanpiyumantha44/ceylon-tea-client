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
} from "lucide-react";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';

const Summary = () => {
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
  const showAlert = ()=>{
     toast.success('Hey 👋!', {
      position: 'top-center',
    });
  }
  useEffect(()=>{
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

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div
                  className={`mt-1 p-1 rounded-full ${
                    activity.status === "success"
                      ? "bg-green-100"
                      : activity.status === "warning"
                      ? "bg-yellow-100"
                      : "bg-blue-100"
                  }`}
                >
                  {activity.status === "success" ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : activity.status === "warning" ? (
                    <AlertCircle className="h-3 w-3 text-yellow-600" />
                  ) : (
                    <Activity className="h-3 w-3 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-green-600 hover:text-green-700 font-medium">
            View all activities
          </button>
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
