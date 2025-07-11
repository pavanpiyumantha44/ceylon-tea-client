import React, { useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
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
  Outdent,
} from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../app/auth/authSlice';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const {user} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = ()=>{
    dispatch(logout());
    navigate('/login');
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'production', label: 'Production', icon: Factory },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'distribution', label: 'Distribution', icon: Truck },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Handle menu item click - close sidebar on mobile
  const handleMenuItemClick = (itemId) => {
    setActiveTab(itemId);
    // Close sidebar on mobile when menu item is clicked
    if (window.innerWidth < 1024) { // lg breakpoint
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:relative lg:transform-none ${
        sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
      } ${sidebarExpanded ? 'lg:w-64' : 'lg:w-16'}`}>
        <div className={`flex items-center h-16 border-b border-gray-200 ${sidebarExpanded ? 'justify-between px-6' : 'justify-center px-3'}`}>
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            {sidebarExpanded && <span className="text-xl font-bold text-gray-800">CeylonTea</span>}
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="hidden lg:block p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            >
              <Menu className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative group">
                <Link
                  to={`${item.id !== "dashboard" ? item.id : ""}`}
                  className={`w-full flex items-center py-3 mb-1 text-left rounded-lg transition-colors duration-200 ${
                    sidebarExpanded ? 'px-3' : 'px-2 justify-center'
                  } ${
                    activeTab === item.id 
                      ? 'bg-green-50 text-green-700 border-r-4 border-green-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => handleMenuItemClick(item.id)}
                >
                  <Icon className={`h-5 w-5 ${sidebarExpanded ? 'mr-3' : ''}`} />
                  {sidebarExpanded && <span>{item.label}</span>}
                </Link>
                
                {/* Tooltip for collapsed sidebar */}
                {!sidebarExpanded && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Sidebar Overlay - positioned relative to main content */}
        {sidebarOpen && (
          <div 
            className="absolute inset-0 bg-transparent z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 relative">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-800 capitalize">{activeTab}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button className="relative p-2 text-gray-500 hover:text-gray-700" onClick={handleLogout}>
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
               <div className="h-8 w-10 flex items-center justify-center">
                <span className="text-black text-sm font-medium">{user?.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 flex-1">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;