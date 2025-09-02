import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  ChevronDown,
  ChevronRight,
  Monitor,
  FileText,
  UserPlus,
  UserCheck,
  BoxIcon,
  Warehouse,
  TrendingDown,
  PlusCircle,
  MinusCircle,
  Route,
  MapPinIcon,
  BarChart,
  LineChart,
  UserCog,
  Shield,
  Database,
  ConciergeBell,
  LogOut,
  Ratio,
  User,
  ScrollText,
  NotebookText,
  Lightbulb,
  ListOrdered,
  MapPinHouse,
  Fence,
  ListEnd
} from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../app/auth/authSlice';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState({});
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
    setUserDropdownOpen(false);
    navigate('/profile');
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home,
      subItems: [
        { id: '', label: 'Overview', icon: Monitor },
        { id: 'reports', label: 'Reports', icon: FileText },
      ]
    },
    { 
      id: 'production', 
      label: 'Production', 
      icon: Factory,
      subItems: [
        { id: 'teaPlucking', label: 'Tea Plucking Records', icon: Leaf },
      ]
    },
    { 
      id: 'inventory', 
      label: 'Inventory', 
      icon: Package,
      subItems: [
        { id: 'inventory', label: 'Stock Levels', icon: BoxIcon },
        { id: 'stockTransactions', label: 'Stock Transactions', icon: ListEnd }
      ]
    },
    { 
      id: 'solution', 
      label: 'Solutions', 
      icon: Lightbulb,
      subItems: [
        { id: 'solution', label: 'AI Solutions', icon: Ratio},
      ]
    },
    { 
      id: 'workers', 
      label: 'Workers', 
      icon: Users,
      subItems: [
        { id: 'workers', label: 'All Workers', icon: Users },
        { id: 'teams', label: 'Teams', icon: UserPlus },
      ]
    },
    { 
      id: 'place', 
      label: 'Place', 
      icon: MapPinHouse,
      subItems: [
        { id: 'place', label: 'All Places', icon: Fence},
      ]
    },
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: ConciergeBell,
      subItems: [
        { id: 'tasks', label: 'All Tasks', icon: ScrollText},
      ]
    },
    { 
      id: 'attendance', 
      label: 'Attendance', 
      icon: UserCheck,
      subItems: [
        { id: 'attendance', label: 'Mark Attendance', icon: UserCheck},
      ]
    },
     { 
      id: 'payroll', 
      label: 'Payroll', 
      icon: DollarSign,
      subItems: [
        { id: 'payroll', label: 'Payroll', icon: DollarSign},
      ]
    },
    { 
      id: 'distribution', 
      label: 'Distribution', 
      icon: Truck,
      subItems: [
        { id: 'vehicles', label: 'Vehicles', icon: Truck },
        { id: 'tracking', label: 'Tracking', icon: MapPinIcon }
      ]
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      subItems: [
        { id: 'profile', label: 'Profile', icon: UserCog },
      ]
    },
  ];

  // Handle menu item click - close sidebar on mobile
  const handleMenuItemClick = (itemId) => {
    setActiveTab(itemId);
    // Close sidebar on mobile when menu item is clicked
    if (window.innerWidth < 1024) { // lg breakpoint
      setSidebarOpen(false);
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Handle sub-item click
  const handleSubItemClick = (parentId, subItemId) => {
    setActiveTab(subItemId);
    // Close sidebar on mobile when sub-item is clicked
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:relative lg:transform-none overflow-hidden ${
        sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
      } ${sidebarExpanded ? 'lg:w-64' : 'lg:w-20'}`}>
        <div className={`flex items-center h-16 border-b border-gray-200 ${sidebarExpanded ? 'justify-between px-6' : 'justify-center px-4'}`}>
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
        
        <nav className={`mt-6 px-4 max-h-[calc(100vh-4rem)] ${sidebarExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedMenus[item.id];
            const hasSubItems = item.subItems && item.subItems.length > 0;
            
            return (
              <div key={item.id} className="relative group mb-1">
                {/* Main Menu Item */}
                <button
                  onClick={() => hasSubItems ? toggleDropdown(item.id) : handleMenuItemClick(item.id)}
                  className={`w-full flex items-center py-3 text-left rounded-lg transition-colors duration-200 ${
                    sidebarExpanded ? 'px-3' : 'px-3 justify-center'
                  } ${
                    activeTab === item.id 
                      ? 'bg-green-50 text-green-700 border-r-4 border-green-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${sidebarExpanded ? 'mr-3' : ''}`} />
                  {sidebarExpanded && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {hasSubItems && (
                        <div className="ml-2">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </button>

                {/* Dropdown Menu */}
                {hasSubItems && isExpanded && sidebarExpanded && (
                  <div className="mt-1 ml-4 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <Link
                          key={subItem.id}
                          to={`${subItem.id}`}
                          className={`flex items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
                            activeTab === subItem.id
                              ? 'bg-green-100 text-green-700 border-l-2 border-green-500'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                          onClick={() => handleSubItemClick(item.id, subItem.id)}
                        >
                          <SubIcon className="h-4 w-4 mr-2" />
                          <span className="text-sm">{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
                
                {/* Tooltip for collapsed sidebar */}
                {!sidebarExpanded && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                    {hasSubItems && (
                      <div className="mt-1 border-t border-gray-600 pt-1">
                        {item.subItems.map((subItem, index) => (
                          <div key={subItem.id} className="text-xs text-gray-300">
                            {subItem.label}
                          </div>
                        ))}
                      </div>
                    )}
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
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Avatar with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
                >
                  <span className="text-white text-sm font-medium">{user?.role?.substring(0, 1)}</span>
                </button>
                
                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
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