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
  CalendarDays,
  Menu,
  Eye,
  Edit
} from "lucide-react";
import { allWorkers } from '../../services/workerService';
import { allTeams } from '../../services/teamSlice';
import { addInitialData, getAllAttendance } from '../../services/attendanceService';


const Attendance = () => {
  const [attendanceView, setAttendanceView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [markingMode, setMarkingMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [teams,setTeams] = useState([]);

  // Check if mobile on component mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock attendance data with comprehensive examples
  const [attendanceData, setAttendanceData] = useState([]);
  const [initialData,setInitialData] = useState([]);

  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [reload, setReload] = useState(true);

  const workersPerPage = isMobile ? 6 : 8;

  const statuses = ['ALL', 'PRESENT', 'ABSENT', 'HALFDAY', 'LEAVE'];

  // Filter and search logic
  const filteredWorkers = attendanceData.filter(worker => {
    const matchesSearch = `${worker.name} ${worker.workerId}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = selectedTeam === 'all' || worker.team === selectedTeam;
    const matchesStatus = selectedStatus === 'all' || worker.status === selectedStatus;
    const matchesDate = worker.date === selectedDate;
    return matchesSearch && matchesTeam && matchesStatus && matchesDate;
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
    // const currentTime = new Date().toLocaleTimeString('en-US', { 
    //   hour12: false, 
    //   hour: '2-digit', 
    //   minute: '2-digit' 
    // });
    const currentTime = new Date().toLocaleTimeString();

    setAttendanceData(prev => prev.map(worker => {
      if (worker.workerId === workerId) {
        let updatedWorker = { ...worker };
        
        if (action === 'checkin' && worker.checkIn === '-') {
          updatedWorker.checkIn = currentTime;
          updatedWorker.checkOut = '-'; // Ensure checkout is still pending
          updatedWorker.status = 'PRESENT';
          updatedWorker.workHours = 'In Progress'; // Show work is in progress
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
        } else if (action === 'ABSENT') {
          updatedWorker = {
            ...worker,
            checkIn: '-',
            checkOut: '-',
            breakTime: '-',
            workHours: '0h 0m',
            status: 'ABSENT',
            overtime: '0',
            location: '-'
          };
        } else if (action === 'leave') {
          // Handle leave - if already checked in, mark as HALFDAY, otherwise full day leave
          if (worker.checkIn !== '-' && worker.checkOut === '-') {
            // HALFDAY leave (checked in but leaving early)
            updatedWorker.checkOut = currentTime;
            updatedWorker.status = 'HALFDAY';
            
            // Calculate HALFDAY work hours
            const checkInTime = worker.checkIn.split(':');
            const checkOutTime = currentTime.split(':');
            const checkInMinutes = parseInt(checkInTime[0]) * 60 + parseInt(checkInTime[1]);
            const checkOutMinutes = parseInt(checkOutTime[0]) * 60 + parseInt(checkOutTime[1]);
            const totalMinutes = checkOutMinutes - checkInMinutes;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            updatedWorker.workHours = `${hours}h ${minutes}m`;
            updatedWorker.overtime = '0';
          } else {
            // Full day leave (never checked in)
            updatedWorker = {
              ...worker,
              checkIn: '-',
              checkOut: '-',
              breakTime: '-',
              workHours: '0h 0m',
              status: 'LEAVE',
              overtime: '0',
              location: '-'
            };
          }
        }
        
        return updatedWorker;
      }
      return worker;
    }));
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'PRESENT': 'bg-green-100 text-green-800 border-green-200',
      'ABSENT': 'bg-red-100 text-red-800 border-red-200',
      'HALFDAY': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'LEAVE': 'bg-blue-100 text-blue-800 border-blue-200',
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
      case 'PRESENT': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ABSENT': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'HALFDAY': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'LEAVE': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'Late': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Calculate summary stats
  const totalWorkers = attendanceData.filter(w => w.date === selectedDate).length;
  const PRESENTWorkers = attendanceData.filter(w => w.date === selectedDate && w.status === 'PRESENT').length;
  const ABSENTWorkers = attendanceData.filter(w => w.date === selectedDate && w.status === 'ABSENT').length;
  const onLeaveWorkers = attendanceData.filter(w => w.date === selectedDate && w.status === 'LEAVE').length;
  const attendanceRate = totalWorkers > 0 ? ((PRESENTWorkers / totalWorkers) * 100).toFixed(1) : 0;

  // Mobile Card Component for Worker
  const WorkerCard = ({ worker }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      {/* Worker Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {markingMode && (
            <input
              type="checkbox"
              checked={selectedWorkers.includes(worker.workerId)}
              onChange={() => handleSelectWorkers(worker.workerId)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4"
            />
          )}
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
            {worker.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-base">{worker.name}</div>
            <div className="text-sm text-gray-500">{worker.workerId}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(worker.status)}
          {getStatusBadge(worker.status)}
        </div>
      </div>

      {/* Worker Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Team</div>
          <div className="text-sm font-medium text-gray-900">{worker.team}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Work Hours</div>
          <div className="text-sm font-medium text-gray-900">{worker.workHours}</div>
          {worker.overtime !== '0' && (
            <div className="text-xs text-orange-600">OT: {worker.overtime}</div>
          )}
        </div>
      </div>

      {/* Check In/Out Times */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Check In</div>
          <div className="text-sm font-medium text-gray-900">{worker.checkIn}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Check Out</div>
          <div className="text-sm font-medium text-gray-900">{worker.checkOut}</div>
        </div>
      </div>

      {/* Actions */}
      {markingMode ? (
        <div className="pt-3 border-t border-gray-100">
          {worker.checkIn === '-' ? (
            // Worker hasn't checked in yet - show check in, ABSENT, and leave options
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => markAttendance(worker.workerId, 'checkin')}
                className="flex items-center justify-center px-3 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Check In
              </button>
              <button 
                onClick={() => markAttendance(worker.workerId, 'ABSENT')}
                className="flex items-center justify-center px-3 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                <XCircle className="h-4 w-4 mr-1" />
                ABSENT
              </button>
              <button 
                onClick={() => markAttendance(worker.workerId, 'leave')}
                className="flex items-center justify-center px-3 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Leave
              </button>
            </div>
          ) : worker.checkOut === '-' ? (
            // Worker has checked in but not out - show checkout and half-day leave options
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => markAttendance(worker.workerId, 'checkout')}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Clock className="h-4 w-4 mr-2" />
                Check Out
              </button>
              <button 
                onClick={() => markAttendance(worker.workerId, 'leave')}
                className="flex items-center justify-center px-4 py-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
              >
                <Calendar className="h-4 w-4 mr-2" />
                HALFDAY
              </button>
            </div>
          ) : (
            // Worker has completed full day
            <div className="flex items-center justify-center text-sm text-gray-500 px-4 py-3 bg-gray-100 rounded-lg font-medium">
              <CheckCircle className="h-4 w-4 mr-2" />
              Day Completed
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </button>
          <button className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );

  const FetchWorkers = async()=>{
    const workersResponse = await allWorkers();
    var mappedAttendance="";
    var today = new Date();
    today.setHours(0,0,0,0);
    if(workersResponse.data.success){
      mappedAttendance = workersResponse.data.allPerson.map(worker => ({
      workerId: worker.personCode,
      personId:worker.personId,
      name: worker.firstName,   
      team: worker.teamMemberships[0]?.team?.name || "-",
      checkIn: "-",
      checkOut: "-",
      startDttm: new Date(),
      endDttm: new Date(),
      currentDate: today,
      workHours: 0,
      status: "-",
      overtime: "0",           
      date: new Date().toISOString().split("T")[0],
    }));
    
    setInitialData(mappedAttendance);
    }
    //console.log(mappedAttendance);
    const initialDataSetupResponse = await addInitialData(mappedAttendance)
    const fetchAttendanceResponse = await getAllAttendance();
    if(fetchAttendanceResponse.data.success){
      const mappedAttendance = workersResponse.data.allPerson.map(worker => ({
      workerId: worker.personCode,
      personId:worker.personId,
      name: worker.firstName,   
      team: worker.teamMemberships[0]?.team?.name || "-",
      checkIn: "-",
      checkOut: "-",
      startDttm: new Date(),
      endDttm: new Date(),
      currentDate: today,
      workHours: 0,
      status: "-",
      overtime: "0",           
      date: new Date().toISOString().split("T")[0],
    }));
      console.log(fetchAttendanceResponse.data);
      setAttendanceData(mappedAttendance);
    }
  }
  const FetchTeams = async()=>{
    const teamsResponse = await allTeams();
    if(teamsResponse.data.success){
      setTeams(teamsResponse.data.data);
    }
  }
  useEffect(()=>{
    FetchWorkers();
    FetchTeams();
  },[])
  return (
    <>
      {loadingAttendance ? (
        <div className="w-auto h-2/3 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
        </div>
      ) : (
        <div className="space-y-4 p-3 md:p-6 bg-gray-50 min-h-screen">
          {/* Header Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">Total</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{totalWorkers}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">PRESENT</p>
                  <p className="text-xl md:text-2xl font-bold text-green-600">{PRESENTWorkers}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <UserCheck className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 col-span-2 md:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">ABSENT</p>
                  <p className="text-xl md:text-2xl font-bold text-red-600">{ABSENTWorkers}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <UserX className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hidden md:block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">LEAVE</p>
                  <p className="text-xl md:text-2xl font-bold text-blue-600">{onLeaveWorkers}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hidden md:block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">Rate</p>
                  <p className="text-xl md:text-2xl font-bold text-purple-600">{attendanceRate}%</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Timer className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Attendance Management</h2>
                  <p className="text-gray-600 mt-1 text-sm md:text-base">Track and manage worker attendance</p>
                </div>
                
                <div className="flex items-center space-x-2 md:space-x-3">
                  <button
                    onClick={() => setMarkingMode(!markingMode)}
                    className={`flex items-center px-3 md:px-4 py-2 rounded-xl transition-colors font-medium text-sm md:text-base ${
                      markingMode 
                        ? "bg-red-600 text-white hover:bg-red-700" 
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {markingMode ? <X className='h-4 w-4 mr-1 md:mr-2'/> : <CheckCircle className="h-4 w-4 mr-1 md:mr-2" />}
                    <span className="hidden sm:inline">{markingMode ? "Exit Marking" : "Mark Attendance"}</span>
                    <span className="sm:hidden">{markingMode ? "Exit" : "Mark"}</span>
                  </button>
                  
                  <button className="flex items-center px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm md:text-base">
                    <Download className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50">
              {/* Mobile: Search and Date Row */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search workers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                  />
                </div>
                
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm flex-shrink-0"
                />
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center px-3 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>

              {/* Desktop Filters or Mobile Expandable Filters */}
              <div className={`${isMobile && !showFilters ? 'hidden' : 'flex'} flex-col space-y-3 ${!isMobile ? 'md:flex-row md:items-center md:justify-between md:space-y-0' : ''}`}>
                <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3'}`}>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className={`px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${isMobile ? 'w-full' : ''}`}
                  >
                    {teams.map(team => (
                      <option key={team.teamId} value={team.name}>
                        {team === 'all' ? 'All Teams' : team.name}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className={`px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${isMobile ? 'w-full' : ''}`}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'All Status' : status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Content - Mobile Cards or Desktop Table */}
            {isMobile ? (
              <div className="p-4">
                {/* Mobile: Bulk Actions for Selected Workers */}
                {markingMode && selectedWorkers.length > 0 && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">
                        {selectedWorkers.length} worker{selectedWorkers.length > 1 ? 's' : ''} selected
                      </span>
                      <button 
                        onClick={() => setSelectedWorkers([])}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        PRESENT
                      </button>
                      <button className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-medium">
                        <XCircle className="h-3 w-3 mr-1" />
                        ABSENT
                      </button>
                      <button className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium">
                        <Calendar className="h-3 w-3 mr-1" />
                        Leave
                      </button>
                    </div>
                  </div>
                )}

                {currentWorkers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No workers found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentWorkers.map((worker) => (
                      <WorkerCard key={worker.workerId} worker={worker} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Desktop Table */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left p-4">
                        <input
                          type="checkbox"
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
                      <th className="text-left p-4 font-semibold text-gray-700">Team</th>
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
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-3 w-3 mr-1" />
                            {worker.team}
                          </div>
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
                                // Worker hasn't checked in yet - show all initial options
                                <>
                                  <button 
                                    onClick={() => markAttendance(worker.workerId, 'checkin')}
                                    className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                    title="Check In"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => markAttendance(worker.workerId, 'ABSENT')}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Mark ABSENT"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => markAttendance(worker.workerId, 'leave')}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Mark LEAVE"
                                  >
                                    <Calendar className="h-4 w-4" />
                                  </button>
                                </>
                              ) : worker.checkOut === '-' ? (
                                // Worker has checked in but not out - show checkout and half-day options
                                <>
                                  <button 
                                    onClick={() => markAttendance(worker.workerId, 'checkout')}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Check Out"
                                  >
                                    <Clock className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => markAttendance(worker.workerId, 'leave')}
                                    className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                                    title="HALFDAY Leave"
                                  >
                                    <Calendar className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                // Worker has completed the day
                                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                                  Complete
                                </span>
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
            )}

            {/* Pagination */}
            <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="text-sm text-gray-600 text-center md:text-left">
                  Showing {startIndex + 1} to {Math.min(endIndex, sortedWorkers.length)} of {sortedWorkers.length} workers
                </div>
                
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 md:px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-gray-200 bg-white border border-gray-300"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(Math.min(isMobile ? 3 : 5, totalPages))].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 md:px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
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
                    className={`flex items-center px-3 md:px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-gray-200 bg-white border border-gray-300"
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
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