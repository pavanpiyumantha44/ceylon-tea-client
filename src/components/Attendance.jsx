import { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  User,
  MapPin,
  Timer,
  Coffee,
  UserCheck,
  UserX,
  CalendarDays
} from "lucide-react";

const Attendance = () => {
  const [attendanceView, setAttendanceView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [markingMode, setMarkingMode] = useState(false);

  // Mock attendance data with comprehensive examples
  const [attendanceData, setAttendanceData] = useState([
    // Today's attendance (2025-08-25)
    {
      workerId: 'W001',
      name: 'Kumara Silva',
      department: 'Plucking',
      team: 'Team A',
      checkIn: '07:30',
      checkOut: '16:45',
      breakTime: '45 min',
      workHours: '8h 30m',
      status: 'Present',
      overtime: '30m',
      location: 'Field 1 - Upper Estate',
      date: '2025-08-25'
    },
    {
      workerId: 'W002',
      name: 'Nimal Perera',
      department: 'Processing',
      team: 'Team B',
      checkIn: '08:00',
      checkOut: '17:00',
      breakTime: '60 min',
      workHours: '8h 0m',
      status: 'Present',
      overtime: '0',
      location: 'Factory Floor - Withering',
      date: '2025-08-25'
    },
    {
      workerId: 'W003',
      name: 'Kamala Jayasinghe',
      department: 'Packaging',
      team: 'Team C',
      checkIn: '-',
      checkOut: '-',
      breakTime: '-',
      workHours: '0h 0m',
      status: 'Absent',
      overtime: '0',
      location: '-',
      date: '2025-08-25'
    },
    {
      workerId: 'W004',
      name: 'Sunil Fernando',
      department: 'Quality Control',
      team: 'Team D',
      checkIn: '09:00',
      checkOut: '13:00',
      breakTime: '30 min',
      workHours: '3h 30m',
      status: 'Half Day',
      overtime: '0',
      location: 'Quality Lab',
      date: '2025-08-25'
    },
    {
      workerId: 'W005',
      name: 'Priyanka Wijeratne',
      department: 'Plucking',
      team: 'Team A',
      checkIn: '-',
      checkOut: '-',
      breakTime: '-',
      workHours: '0h 0m',
      status: 'On Leave',
      overtime: '0',
      location: '-',
      date: '2025-08-25'
    },
    {
      workerId: 'W006',
      name: 'Ravi Gunasekara',
      department: 'Processing',
      team: 'Team B',
      checkIn: '08:15',
      checkOut: '17:30',
      breakTime: '45 min',
      workHours: '8h 30m',
      status: 'Late',
      overtime: '30m',
      location: 'Factory Floor - Rolling',
      date: '2025-08-25'
    },
    {
      workerId: 'W007',
      name: 'Sanduni Rathnayake',
      department: 'Packaging',
      team: 'Team C',
      checkIn: '07:45',
      checkOut: '16:30',
      breakTime: '45 min',
      workHours: '8.0',
      status: 'Present',
      overtime: '0',
      location: 'Packaging Unit A',
      date: '2025-08-25'
    },
    {
      workerId: 'W008',
      name: 'Mahinda Samaraweera',
      department: 'Plucking',
      team: 'Team A',
      checkIn: '07:00',
      checkOut: '17:00',
      breakTime: '60 min',
      workHours: '9.0',
      status: 'Present',
      overtime: '1.0',
      location: 'Field 2 - Lower Estate',
      date: '2025-08-25'
    },
    {
      workerId: 'W009',
      name: 'Anjula Wickramasinghe',
      department: 'Quality Control',
      team: 'Team D',
      checkIn: '08:30',
      checkOut: '17:15',
      breakTime: '45 min',
      workHours: '8.0',
      status: 'Present',
      overtime: '0',
      location: 'Testing Lab',
      date: '2025-08-25'
    },
    {
      workerId: 'W010',
      name: 'Chamara Mendis',
      department: 'Processing',
      team: 'Team B',
      checkIn: '08:00',
      checkOut: '18:00',
      breakTime: '60 min',
      workHours: '9.0',
      status: 'Present',
      overtime: '1.0',
      location: 'Factory Floor - Drying',
      date: '2025-08-25'
    },
    {
      workerId: 'W011',
      name: 'Niluka Senevirathne',
      department: 'Packaging',
      team: 'Team C',
      checkIn: '07:30',
      checkOut: '16:15',
      breakTime: '45 min',
      workHours: '8.0',
      status: 'Present',
      overtime: '0',
      location: 'Packaging Unit B',
      date: '2025-08-25'
    },
    {
      workerId: 'W012',
      name: 'Tharindu Jayawardena',
      department: 'Plucking',
      team: 'Team A',
      checkIn: '-',
      checkOut: '-',
      breakTime: '-',
      workHours: '0',
      status: 'On Leave',
      overtime: '0',
      location: '-',
      date: '2025-08-25'
    },
    // Previous day data (2025-08-24) for comparison
    {
      workerId: 'W001',
      name: 'Kumara Silva',
      department: 'Plucking',
      team: 'Team A',
      checkIn: '07:45',
      checkOut: '16:30',
      breakTime: '45 min',
      workHours: '8.0',
      status: 'Present',
      overtime: '0',
      location: 'Field 1 - Upper Estate',
      date: '2025-08-24'
    },
    {
      workerId: 'W002',
      name: 'Nimal Perera',
      department: 'Processing',
      team: 'Team B',
      checkIn: '08:00',
      checkOut: '17:00',
      breakTime: '60 min',
      workHours: '8.0',
      status: 'Present',
      overtime: '0',
      location: 'Factory Floor - Withering',
      date: '2025-08-24'
    },
    {
      workerId: 'W003',
      name: 'Kamala Jayasinghe',
      department: 'Packaging',
      team: 'Team C',
      checkIn: '07:30',
      checkOut: '16:30',
      breakTime: '60 min',
      workHours: '8.0',
      status: 'Present',
      overtime: '0',
      location: 'Packaging Unit A',
      date: '2025-08-24'
    },
    {
      workerId: 'W004',
      name: 'Sunil Fernando',
      department: 'Quality Control',
      team: 'Team D',
      checkIn: '08:30',
      checkOut: '17:30',
      breakTime: '60 min',
      workHours: '8.0',
      status: 'Present',
      overtime: '0',
      location: 'Quality Lab',
      date: '2025-08-24'
    },
    {
      workerId: 'W005',
      name: 'Priyanka Wijeratne',
      department: 'Plucking',
      team: 'Team A',
      checkIn: '07:30',
      checkOut: '16:45',
      breakTime: '45 min',
      workHours: '8.5',
      status: 'Present',
      overtime: '0.5',
      location: 'Field 3 - Organic Section',
      date: '2025-08-24'
    },
    {
      workerId: 'W006',
      name: 'Ravi Gunasekara',
      department: 'Processing',
      team: 'Team B',
      checkIn: '-',
      checkOut: '-',
      breakTime: '-',
      workHours: '0',
      status: 'Absent',
      overtime: '0',
      location: '-',
      date: '2025-08-24'
    },
    {
      workerId: 'W007',
      name: 'Sanduni Rathnayake',
      department: 'Packaging',
      team: 'Team C',
      checkIn: '07:45',
      checkOut: '16:30',
      breakTime: '45 min',
      workHours: '8.0',
      status: 'Present',
      overtime: '0',
      location: 'Packaging Unit A',
      date: '2025-08-24'
    },
    {
      workerId: 'W008',
      name: 'Mahinda Samaraweera',
      department: 'Plucking',
      team: 'Team A',
      checkIn: '07:00',
      checkOut: '18:00',
      breakTime: '60 min',
      workHours: '10.0',
      status: 'Present',
      overtime: '2.0',
      location: 'Field 2 - Lower Estate',
      date: '2025-08-24'
    },
    // Weekend data (2025-08-23) - Reduced staff
    {
      workerId: 'W002',
      name: 'Nimal Perera',
      department: 'Processing',
      team: 'Team B',
      checkIn: '09:00',
      checkOut: '15:00',
      breakTime: '60 min',
      workHours: '5.0',
      status: 'Present',
      overtime: '0',
      location: 'Factory Floor - Maintenance',
      date: '2025-08-23'
    },
    {
      workerId: 'W004',
      name: 'Sunil Fernando',
      department: 'Quality Control',
      team: 'Team D',
      checkIn: '10:00',
      checkOut: '14:00',
      breakTime: '30 min',
      workHours: '3.5',
      status: 'Present',
      overtime: '0',
      location: 'Quality Lab',
      date: '2025-08-23'
    },
    {
      workerId: 'W010',
      name: 'Chamara Mendis',
      department: 'Processing',
      team: 'Team B',
      checkIn: '09:00',
      checkOut: '17:00',
      breakTime: '60 min',
      workHours: '7.0',
      status: 'Present',
      overtime: '0',
      location: 'Factory Floor - Weekend Shift',
      date: '2025-08-23'
    }
  ]);

  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [reload, setReload] = useState(true);

  const workersPerPage = 8;

  const departments = ['all', 'Plucking', 'Processing', 'Packaging', 'Quality Control'];
  const statuses = ['all', 'Present', 'Absent', 'Half Day', 'On Leave', 'Late'];

  // Filter and search logic
  const filteredWorkers = attendanceData.filter(worker => {
    const matchesSearch = `${worker.name} ${worker.workerId}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || worker.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || worker.status === selectedStatus;
    const matchesDate = worker.date === selectedDate;
    return matchesSearch && matchesDepartment && matchesStatus && matchesDate;
  });

  // Sorting logic
  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (sortConfig.key === 'name') {
      aValue = a.name;
      bValue = b.name;
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedWorkers.length / workersPerPage);
  const startIndex = (currentPage - 1) * workersPerPage;
  const endIndex = startIndex + workersPerPage;
  const currentWorkers = sortedWorkers.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectWorkers = (workerId) => {
    setSelectedWorkers(prev => 
      prev.includes(workerId) 
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedWorkers(
      selectedWorkers.length === currentWorkers.length 
        ? [] 
        : currentWorkers.map(worker => worker.workerId)
    );
  };

  const markAttendance = (workerId, action) => {
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    setAttendanceData(prev => prev.map(worker => {
      if (worker.workerId === workerId) {
        let updatedWorker = { ...worker };
        
        if (action === 'checkin' && worker.checkIn === '-') {
          updatedWorker.checkIn = currentTime;
          updatedWorker.status = 'Present';
          updatedWorker.location = worker.department === 'Plucking' ? 'Field 1 - Upper Estate' : 
                                   worker.department === 'Processing' ? 'Factory Floor - Processing' :
                                   worker.department === 'Packaging' ? 'Packaging Unit A' : 'Quality Lab';
        } else if (action === 'checkout' && worker.checkIn !== '-' && worker.checkOut === '-') {
          updatedWorker.checkOut = currentTime;
          
          // Calculate actual work hours
          const checkInTime = worker.checkIn.split(':');
          const checkOutTime = currentTime.split(':');
          const checkInMinutes = parseInt(checkInTime[0]) * 60 + parseInt(checkInTime[1]);
          const checkOutMinutes = parseInt(checkOutTime[0]) * 60 + parseInt(checkOutTime[1]);
          
          // Total minutes worked
          const totalMinutes = checkOutMinutes - checkInMinutes;
          
          // Convert to hours and minutes format
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          const workHoursDisplay = `${hours}h ${minutes}m`;
          
          // Calculate overtime (anything over 8 hours = 480 minutes)
          const overtimeMinutes = Math.max(0, totalMinutes - 480);
          const overtimeHours = Math.floor(overtimeMinutes / 60);
          const overtimeMins = overtimeMinutes % 60;
          const overtimeDisplay = overtimeMinutes > 0 ? `${overtimeHours}h ${overtimeMins}m` : '0';
          
          updatedWorker.workHours = workHoursDisplay;
          updatedWorker.overtime = overtimeDisplay;
        } else if (action === 'absent') {
          updatedWorker = {
            ...worker,
            checkIn: '-',
            checkOut: '-',
            breakTime: '-',
            workHours: '0h 0m',
            status: 'Absent',
            overtime: '0',
            location: '-'
          };
        } else if (action === 'leave') {
          updatedWorker = {
            ...worker,
            checkIn: '-',
            checkOut: '-',
            breakTime: '-',
            workHours: '0h 0m',
            status: 'On Leave',
            overtime: '0',
            location: '-'
          };
        }
        
        return updatedWorker;
      }
      return worker;
    }));
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Present': 'bg-green-100 text-green-800 border-green-200',
      'Absent': 'bg-red-100 text-red-800 border-red-200',
      'Half Day': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'On Leave': 'bg-blue-100 text-blue-800 border-blue-200',
      'Late': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Present': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Absent': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Half Day': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'On Leave': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'Late': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Calculate summary stats
  const totalWorkers = attendanceData.filter(w => w.date === selectedDate).length;
  const presentWorkers = attendanceData.filter(w => w.date === selectedDate && w.status === 'Present').length;
  const absentWorkers = attendanceData.filter(w => w.date === selectedDate && w.status === 'Absent').length;
  const onLeaveWorkers = attendanceData.filter(w => w.date === selectedDate && w.status === 'On Leave').length;
  const attendanceRate = totalWorkers > 0 ? ((presentWorkers / totalWorkers) * 100).toFixed(1) : 0;

  return (
    <>
      {loadingAttendance ? (
        <div className="w-auto h-2/3 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
        </div>
      ) : (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
          {/* Header Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Workers</p>
                  <p className="text-2xl font-bold text-gray-900">{totalWorkers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-green-600">{presentWorkers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{absentWorkers}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On Leave</p>
                  <p className="text-2xl font-bold text-blue-600">{onLeaveWorkers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{attendanceRate}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Timer className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
                  <p className="text-gray-600 mt-1">Track and manage worker attendance</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setMarkingMode(!markingMode)}
                    className={markingMode ? "flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium": "flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"}
                  >
                    {markingMode ? <X className='h-4 w-4 mr-2'/> : <CheckCircle className="h-4 w-4 mr-2" />}
                    {markingMode ? "Exit Marking" : "Mark Attendance"}
                  </button>
                  
                  <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Search and Date */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search workers or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center space-x-3">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'All Status' : status}
                      </option>
                    ))}
                  </select>
                  
                  {selectedWorkers.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{selectedWorkers.length} selected</span>
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
                        Mark Present
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={selectedWorkers.length === currentWorkers.length && currentWorkers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th 
                      className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      Worker Details
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">Department</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Check In/Out</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Work Hours</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      {markingMode ? 'Quick Actions' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentWorkers.map((worker) => (
                    <tr key={worker.workerId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedWorkers.includes(worker.workerId)}
                          onChange={() => handleSelectWorkers(worker.workerId)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {worker.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{worker.name}</div>
                            <div className="text-sm text-gray-500">{worker.workerId}</div>
                            <div className="text-xs text-gray-400">{worker.team}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-3 w-3 mr-1" />
                          {worker.department}
                        </div>
                        {worker.location !== '-' && (
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {worker.location}
                          </div>
                        )}
                      </td>
                      
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 w-8">In:</span>
                            <span className="font-medium">{worker.checkIn}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 w-8">Out:</span>
                            <span className="font-medium">{worker.checkOut}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900">
                            {worker.workHours}
                          </div>
                          {worker.breakTime !== '-' && (
                            <div className="text-xs text-gray-500">
                              Break: {worker.breakTime}
                            </div>
                          )}
                          {worker.overtime !== '0' && (
                            <div className="text-xs text-orange-600">
                              OT: {worker.overtime}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(worker.status)}
                          {getStatusBadge(worker.status)}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        {markingMode ? (
                          <div className="flex items-center space-x-1">
                            {worker.checkIn === '-' ? (
                              <button 
                                onClick={() => markAttendance(worker.workerId, 'checkin')}
                                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Check In"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            ) : worker.checkOut === '-' ? (
                              <button 
                                onClick={() => markAttendance(worker.workerId, 'checkout')}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Check Out"
                              >
                                <Clock className="h-4 w-4" />
                              </button>
                            ) : (
                              <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                                Complete
                              </span>
                            )}
                            
                            {worker.status !== 'Absent' && (
                              <button 
                                onClick={() => markAttendance(worker.workerId, 'absent')}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Mark Absent"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                            
                            {worker.status !== 'On Leave' && (
                              <button 
                                onClick={() => markAttendance(worker.workerId, 'leave')}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Mark On Leave"
                              >
                                <Calendar className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Clock className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, sortedWorkers.length)} of {sortedWorkers.length} workers
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-gray-200 bg-white border border-gray-300"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                            currentPage === page
                              ? "bg-green-600 text-white"
                              : "text-gray-700 hover:bg-gray-200 bg-white border border-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-gray-200 bg-white border border-gray-300"
                    }`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Attendance;