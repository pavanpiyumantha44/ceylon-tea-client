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
  User2,
  LocateIcon
} from "lucide-react";
import { ClipLoader, HashLoader, PropagateLoader, PulseLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import {Link} from 'react-router-dom';
import { allPlaces, createPlace, deletePlace } from '../../services/placeService';


const Place = () => {
  const [placeView, setPlaceView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlaces, setselectedPlaces] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });


  const [placeData, setPlaceData] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [reload,setReload] = useState(true);
  const [formData, setFormData] = useState({
    placeCode: '',
    description: '',
    size:''
  });

  const placesPerPage = 8;

  const getAllPlaces = async()=>{
    const placesResponse = await allPlaces();
    if(placesResponse.data.success){   
      const places = placesResponse.data.data;
      setPlaceData(places);
      setLoadingPlaces(false);
    }
  }

  const deleteplaces = async(id)=>{
    const deleteResponse = await deletePlace(id);
    if(deleteResponse.data.success){
       toast.success("place deleted sucessfully!", {
            position: 'top-center',
          });
    setReload(!reload);
    }else{
       toast.error("Failed to delete place!", {
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
         const response = await createPlace(formData);
        if(response.data.success){
          setFormData({name:'',description:''})
          setReload(!reload);
        }
          
      } catch (error) {
        console.log(error);
      }
    };

  // Filter and search logic
  const filteredPlaces = placeData.filter(place => {
    const matchesSearch = `${place.placeCode}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch
  });

  // Sorting logic
  const sortedplaces = [...filteredPlaces].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (sortConfig.key === 'placeCode') {
      aValue = `${a.placeCode}`;
      bValue = `${b.placeCode}`;
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedplaces.length / placesPerPage);
  const startIndex = (currentPage - 1) * placesPerPage;
  const endIndex = startIndex + placesPerPage;
  const currentPlaces = sortedplaces.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectplaces = (placeId) => {
    setselectedPlaces(prev => 
      prev.includes(placeId) 
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId]
    );
  };

  const handleSelectAll = () => {
    setselectedPlaces(
      selectedPlaces.length === currentPlaces.length 
        ? [] 
        : currentPlaces.map(place => place.placeId)
    );
  };

  useEffect(()=>{
    getAllPlaces();
  },[reload])

  return (
    <>
     {loadingPlaces ? 
      <>
        <div className="w-auto h-2/3 flex items-center justify-center">
                  <PropagateLoader
                      color="#48bb78"
                      loading={loadingPlaces}
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
              <h2 className="text-2xl font-bold text-gray-900">Place Management</h2>
              <p className="text-gray-600 mt-1">Manage Places</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPlaceView(!placeView)}
                className={placeView ? "flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium": "flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"}
              >
                {placeView ? " Close Add Place " : " Add Place "}
                {placeView ? <X className='h-4 w-4 mr-2'/>:<Plus className="h-4 w-4 mr-2" />}
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
                    placeholder="Search Place Code, or Description..."
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
                  
                  {selectedPlaces.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{selectedPlaces.length} selected</span>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Filter Dropdowns */}
              {placeView && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="p-1 border-b mb-6 border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800">Add New Place</h2>
                          <p className="text-sm text-gray-600">Enter Place details to add them to the system</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Place Code</label>
                      <input
                        type="text"
                        name="placeCode"
                        value={formData.placeCode}
                        onChange={handleInputChange}
                        placeholder="A21"
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Size (Ha)</label>
                      <input
                        type="number"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        placeholder="Tea Plucking"
                        min={1}
                        max={100}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-400 transition-colors"
                      >
                        Add Place
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
                        checked={selectedPlaces.length === currentPlaces.length && currentPlaces.length > 0}
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
                    <th className="text-left p-4 font-semibold text-gray-700">Area Size (ha)</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPlaces.map((place) => (
                    <tr key={place.placeId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedPlaces.includes(place.placeId)}
                          onChange={() => handleSelectplaces(place.placeId)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      
                      <td className="p-4">
                        <Link to={`/dashboard/viewplace/${place.placeId}`} className="flex items-center space-x-3 cursor-pointer">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                             {place.placeCode.substr(0,2)}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {place.placeCode}
                            </div>
                          </div>
                        </Link>
                      </td>                                                                
                      <td className="p-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <LocateIcon className="h-3 w-3 mr-1" />
                          {place.description}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <LocateIcon className="h-3 w-3 mr-1" />
                          {place.size}Ha
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" onClick={()=>deleteplaces(place.placeId)}>
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
                  Showing {startIndex + 1} to {Math.min(endIndex, sortedplaces.length)} of {sortedplaces.length} workers
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

export default Place;