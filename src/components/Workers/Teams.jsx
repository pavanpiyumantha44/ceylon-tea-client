import { useState, useEffect } from 'react';
import {
  Users,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  User2
} from "lucide-react";
import { allTeams, createTeam,removeTeam} from "../../services/teamSlice";
import { ClipLoader, HashLoader, PropagateLoader, PulseLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import {Link} from 'react-router-dom';


const Teams = () => {
  const [workerView, setWorkerView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });


  const [teamsData, setTeamsData] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [reload,setReload] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const workersPerPage = 8;

  const getAllTeams = async()=>{
    const teamsResponse = await allTeams();
    if(teamsResponse.data.success){   
      const teams = teamsResponse.data.data;
      setTeamsData(teams);
      setLoadingTeams(false);
    }
  }

  const deleteTeam = async(id)=>{
    const deleteResponse = await removeTeam(id);
    if(deleteResponse.data.success){
       toast.success("Team deleted sucessfully!", {
            position: 'top-center',
          });
    setReload(!reload);
    }else{
       toast.error("Failed to delete Team!", {
            position: 'top-center',
          });
    }
    
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
      e.preventDefault();    
      try {     
         const response = await createTeam(formData);
        if(response.data.success){
          setFormData({name:'',description:''})
          setReload(!reload);
        }
          
      } catch (error) {
        console.log(error);
      }
    };

  const departments = ['all', 'Plucking', 'Processing', 'Packaging', 'Quality Control'];
  const statuses = ['all', 'Present', 'Absent', 'On Leave'];

  // Filter and search logic
  const filteredTeams = teamsData.filter(team => {
    const matchesSearch = `${team.name}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch
  });

  // Sorting logic
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (sortConfig.key === 'name') {
      aValue = `${a.name}`;
      bValue = `${b.name}`;
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedTeams.length / workersPerPage);
  const startIndex = (currentPage - 1) * workersPerPage;
  const endIndex = startIndex + workersPerPage;
  const currentTeams = sortedTeams.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectTeams = (teamId) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTeams(
      selectedTeams.length === currentTeams.length 
        ? [] 
        : currentTeams.map(team => team.teamId)
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

  useEffect(()=>{
    getAllTeams();
  },[reload])

  return (
    <>
     {loadingTeams ? 
      <>
        <div className="w-auto h-2/3 flex items-center justify-center">
                  <PropagateLoader
                      color="#48bb78"
                      loading={loadingTeams}
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Teams Management</h2>
              <p className="text-gray-600 mt-1">Manage and monitor Teams</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setWorkerView(!workerView)}
                className={workerView ? "flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium": "flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"}
              >
                {workerView ? " Close Add Teams " : " Add Team "}
                {workerView ? <X className='h-4 w-4 mr-2'/>:<Plus className="h-4 w-4 mr-2" />}
              </button>
              
              <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
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
                    //onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {selectedTeams.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{selectedTeams.length} selected</span>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Filter Dropdowns */}
              {workerView && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="p-1 border-b mb-6 border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800">Add New Team</h2>
                          <p className="text-sm text-gray-600">Enter Team details to add them to the system</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="TEA-PLUCKING"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Tea Plucking"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-400 text-white-500 rounded-lg hover:bg-green-400 transition-colors"
                      >
                        Add Team
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
                        checked={selectedTeams.length === currentTeams.length && currentTeams.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th 
                      className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('personCode')}
                    >
                      ID
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">Description</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTeams.map((team) => (
                    <tr key={team.teamId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedTeams.includes(team.teamId)}
                          onChange={() => handleSelectTeams(team.teamId)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      
                      <td className="p-4">
                        <Link to={`/dashboard/viewteam/${team.teamId}`} className="flex items-center space-x-3 cursor-pointer">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                             {team.name.substr(0,2)}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {team.name}
                            </div>
                          </div>
                        </Link>
                      </td>                                                                
                      <td className="p-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <User2 className="h-3 w-3 mr-1" />
                          {team.description}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" onClick={()=>deleteTeam(team.teamId)}>
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
                  Showing {startIndex + 1} to {Math.min(endIndex, sortedTeams.length)} of {sortedTeams.length} workers
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
      </div>
    </div>}
    </>
  );
};

export default Teams;