import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle,
  AlertCircle,
  Calendar,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Eye,
  Mail,
  Phone,
  MapPin,
  Award,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Home
} from "lucide-react";
import WorkerDataEntryForm from './WorkerDataEntryForm';
import { allWorkers, deleteWorker } from "../../services/workerService";
import { ClipLoader, HashLoader, PropagateLoader, PulseLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';

const Workers = () => {
  const [workerView, setWorkerView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const [workersData, setWorkersData] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [workersCount, setWorkersCount] = useState(0);
  const [leaveWorkersCount, setLeaveWorkersCount] = useState(0);
  const [presentWorkersCount, setPersonWorkersCount] = useState(0);
  const [absentWorkersCount, setAbsentWorkersCount] = useState(0);
  const [reload,setReload] = useState(false);

  const workersPerPage = 8;

  const getAllWorkers = async()=>{
    const response =  await allWorkers();
    if(response.data.success){
      console.log(response.data)
      const allPersons = response.data.allPerson;
      setWorkersData(allPersons);
      setWorkersCount(allPersons.length)
      const leaveWorkers = allPersons.filter(val => val.status === "LEAVE");
      const presentWorkers = allPersons.filter(val => val.status === "PRESENT");
      const absentWorkers = allPersons.filter(val => val.status === "ABSENT");

      setLeaveWorkersCount(leaveWorkers.length);
      setPersonWorkersCount(presentWorkers.length);
      setAbsentWorkersCount(absentWorkers.length);
      console.log(leaveWorkersCount);

      setLoadingWorkers(false);
    }
  }
  const deletePerson = async(id)=>{
    const deleteResponse = await deleteWorker(id);
    if(deleteResponse.data.success){
       toast.success("Worker deleted sucessfully!", {
            position: 'top-center',
          });
    setReload(!reload);
    }else{
       toast.error("Failed to delete wroker!", {
            position: 'top-center',
          });
    }
    
  }
  useEffect(()=>{
    getAllWorkers();
  },[reload])


  const departments = ['all', 'Plucking', 'Processing', 'Packaging', 'Quality Control'];
  const statuses = ['all', 'Present', 'Absent', 'On Leave'];

  // Filter and search logic
  const filteredWorkers = workersData.filter(worker => {
    const matchesSearch = `${worker.firstName} ${worker.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         worker.personCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         worker.role.userRole.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || worker.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || worker.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Sorting logic
  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (sortConfig.key === 'name') {
      aValue = `${a.firstName} ${a.lastName}`;
      bValue = `${b.firstName} ${b.lastName}`;
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

  const handleSelectWorker = (workerId) => {
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
        : currentWorkers.map(worker => worker.personId)
    );
  };

  const getStatusBadge = (status) => {
    const newStatus = status=="N"?"Present":"Absent";
    const statusStyles = {
      'Present': 'bg-green-100 text-green-800 border-green-200',
      'Absent': 'bg-red-100 text-red-800 border-red-200',
      'On Leave': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[newStatus] || 'bg-gray-100 text-gray-800'}`}>
        {newStatus}
      </span>
    );
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
     {loadingWorkers ? 
      <>
        <div className="w-auto h-2/3 flex items-center justify-center">
                  <PropagateLoader
                      color="#48bb78"
                      loading={loadingWorkers}
                      cssOverride={{
                        display: "block",
                        margin: "0 auto",
                        borderColor: "#48bb78",
                      }}
                      size={20}
                    />
        </div>
      </>
      :
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header Stats */}
      <ToastContainer autoClose={2000} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Workers</p>
              <p className="text-3xl font-bold text-gray-900">{workersData.length}</p>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Present Today</p>
              <p className="text-3xl font-bold text-green-600">{presentWorkersCount}</p>
              <p className="text-sm text-green-600 mt-1">{(workersData.length/workersData.length)*100}% attendance</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">On Leave</p>
              <p className="text-3xl font-bold text-yellow-600">{leaveWorkersCount}</p>
              <p className="text-sm text-yellow-600 mt-1">{(leaveWorkersCount/workersData.length)*100}% of workforce</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Absent</p>
              <p className="text-3xl font-bold text-red-600">{absentWorkersCount}</p>
              <p className="text-sm text-red-600 mt-1">Need attention</p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Worker Management</h2>
              <p className="text-gray-600 mt-1">Manage and monitor your tea factory workforce</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setWorkerView(!workerView)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                {workerView ? "Add Worker" : "View Workers"}
              </button>
              
              <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {workerView ? (
          <>
            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search workers, ID, or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {selectedWorkers.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{selectedWorkers.length} selected</span>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Filter Dropdowns */}
              {showFilters && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>
                            {dept === 'all' ? 'All Departments' : dept}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>
                            {status === 'all' ? 'All Statuses' : status}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setSelectedDepartment('all');
                          setSelectedStatus('all');
                          setSearchQuery('');
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
                    <th className="text-left p-4 font-semibold text-gray-700">Worker</th>
                    <th 
                      className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('personCode')}
                    >
                      ID
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">Role</th>
                    {/* <th className="text-left p-4 font-semibold text-gray-700">Department</th> */}
                    <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Address</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentWorkers.map((worker) => (
                    <tr key={worker.personId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedWorkers.includes(worker.personId)}
                          onChange={() => handleSelectWorker(worker.personId)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {getInitials(worker.firstName, worker.lastName)}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {worker.firstName} {worker.lastName}
                            </div>
                            <div className="text-sm text-gray-600">{worker.nicNumber}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {worker.personCode}
                        </span>
                      </td>
                      
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{worker.role.userRole}</div>
                          <div className="text-sm text-gray-600">{worker.department}</div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {worker.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-1" />
                            {worker.email}
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        {getStatusBadge(worker.isDeleted)}
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Home className="h-3 w-3 mr-1" />
                          {worker.address}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" onClick={()=>deletePerson(worker.personId)}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
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
          </>
        ) : (
          <WorkerDataEntryForm setReload={setReload}/>
        )}
      </div>
    </div>}
    </>
  );
};

export default Workers;