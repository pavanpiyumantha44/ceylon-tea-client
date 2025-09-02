import React, { useState, useEffect } from "react";
import { 
  Truck, 
  Car, 
  AlertTriangle, 
  Settings, 
  CheckCircle, 
  Search, 
  RefreshCw, 
  Download, 
  Plus, 
  X, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Wrench
} from "lucide-react";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([
    {
      vehicleId: "1",
      vehicleType: "Truck",
      plateNumber: "KA-1234",
      status: "available",
      imageUrl: "https://via.placeholder.com/400x300/10b981/ffffff?text=Truck",
      createdAt: "2024-07-15T09:30:00.000Z",
      updatedAt: "2024-08-01T14:20:00.000Z"
    },
    {
      vehicleId: "2",
      vehicleType: "Van",
      plateNumber: "WP-5678",
      status: "in_use",
      imageUrl: "https://via.placeholder.com/400x300/059669/ffffff?text=Van",
      createdAt: "2024-06-20T11:15:00.000Z",
      updatedAt: "2024-08-01T16:45:00.000Z"
    },
    {
      vehicleId: "3",
      vehicleType: "Pickup",
      plateNumber: "CP-9012",
      status: "maintenance",
      imageUrl: "https://via.placeholder.com/400x300/dc2626/ffffff?text=Pickup",
      createdAt: "2024-05-10T08:45:00.000Z",
      updatedAt: "2024-07-28T10:30:00.000Z"
    },
    {
      vehicleId: "4",
      vehicleType: "Tractor",
      plateNumber: "SP-3456",
      status: "available",
      imageUrl: "https://via.placeholder.com/400x300/10b981/ffffff?text=Tractor",
      createdAt: "2024-04-25T13:20:00.000Z",
      updatedAt: "2024-08-01T09:15:00.000Z"
    },
    {
      vehicleId: "5",
      vehicleType: "Lorry",
      plateNumber: "NW-7890",
      status: "in_use",
      imageUrl: "https://via.placeholder.com/400x300/059669/ffffff?text=Lorry",
      createdAt: "2024-03-12T15:45:00.000Z",
      updatedAt: "2024-07-30T12:00:00.000Z"
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Check for mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Format time ago
  const formatTimeAgo = (date) => {
    if (!date) return "Never";
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case "available":
        return {
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          label: "Available"
        };
      case "in_use":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: MapPin,
          label: "In Use"
        };
      case "maintenance":
        return {
          color: "bg-red-100 text-red-800",
          icon: Wrench,
          label: "Maintenance"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: Settings,
          label: status
        };
    }
  };

  // Get vehicle type icon
  const getVehicleIcon = (type) => {
    switch (type.toLowerCase()) {
      case "truck":
      case "lorry":
        return Truck;
      case "van":
      case "pickup":
        return Car;
      case "tractor":
        return Settings;
      default:
        return Car;
    }
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vehicleId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || vehicle.status === statusFilter;
    const matchesType = !typeFilter || vehicle.vehicleType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, itemsPerPage]);

  // Calculate stats
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === "available").length;
  const inUseVehicles = vehicles.filter(v => v.status === "in_use").length;
  const maintenanceVehicles = vehicles.filter(v => v.status === "maintenance").length;
  const vehicleTypes = [...new Set(vehicles.map(v => v.vehicleType))];
  const statuses = [...new Set(vehicles.map(v => v.status))];

  // Add Vehicle Modal Component
  const AddVehicleModal = () => {
    const [formData, setFormData] = useState({
      vehicleType: "",
      plateNumber: "",
      status: "available",
      imageUrl: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const availableTypes = ['Truck', 'Van', 'Pickup', 'Tractor', 'Lorry', 'Motorcycle'];
    const availableStatuses = [
      { value: 'available', label: 'Available' },
      { value: 'in_use', label: 'In Use' },
      { value: 'maintenance', label: 'Maintenance' }
    ];

    const validateForm = () => {
      const errors = {};
      
      if (!formData.vehicleType) {
        errors.vehicleType = "Vehicle type is required";
      }
      
      if (!formData.plateNumber.trim()) {
        errors.plateNumber = "Plate number is required";
      } else if (formData.plateNumber.trim().length < 2) {
        errors.plateNumber = "Plate number must be at least 2 characters";
      } else if (vehicles.some(v => v.plateNumber.toLowerCase() === formData.plateNumber.toLowerCase())) {
        errors.plateNumber = "Plate number already exists";
      }
      
      if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
        errors.imageUrl = "Please enter a valid image URL";
      }
      
      return errors;
    };

    const isValidUrl = (string) => {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when user starts typing
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setIsSubmitting(true);
      
      try {
        const newVehicle = {
          vehicleId: (vehicles.length + 1).toString(),
          vehicleType: formData.vehicleType,
          plateNumber: formData.plateNumber.trim().toUpperCase(),
          status: formData.status,
          imageUrl: formData.imageUrl || `https://via.placeholder.com/400x300/10b981/ffffff?text=${formData.vehicleType}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setVehicles(prev => [...prev, newVehicle]);
        
        // Reset form
        setFormData({
          vehicleType: "",
          plateNumber: "",
          status: "available",
          imageUrl: "",
        });
        setFormErrors({});
        setShowAddModal(false);
        
      } catch (error) {
        console.error("Error adding vehicle:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClose = () => {
      setShowAddModal(false);
      setFormData({
        vehicleType: "",
        plateNumber: "",
        status: "available",
        imageUrl: "",
      });
      setFormErrors({});
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add New Vehicle</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {/* Vehicle Type */}
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type *
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.vehicleType ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select vehicle type</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {formErrors.vehicleType && (
                <p className="text-red-500 text-xs mt-1">{formErrors.vehicleType}</p>
              )}
            </div>

            {/* Plate Number */}
            <div>
              <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Plate Number *
              </label>
              <input
                type="text"
                id="plateNumber"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleInputChange}
                placeholder="e.g., WP-1234"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.plateNumber ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.plateNumber && (
                <p className="text-red-500 text-xs mt-1">{formErrors.plateNumber}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {availableStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/vehicle-image.jpg"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.imageUrl ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.imageUrl && (
                <p className="text-red-500 text-xs mt-1">{formErrors.imageUrl}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to use default placeholder image
              </p>
            </div>

            {/* Preview */}
            {formData.vehicleType && formData.plateNumber && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Vehicle:</span>
                    <span className="font-medium">{formData.vehicleType} - {formData.plateNumber.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(formData.status).color}`}>
                      {getStatusInfo(formData.status).label}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Adding...
                  </>
                ) : (
                  "Add Vehicle"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Mobile Card Component
  const MobileCard = ({ vehicle }) => {
    const statusInfo = getStatusInfo(vehicle.status);
    const VehicleIcon = getVehicleIcon(vehicle.vehicleType);
    
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {vehicle.imageUrl ? (
              <img 
                src={vehicle.imageUrl} 
                alt={`${vehicle.vehicleType} ${vehicle.plateNumber}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: vehicle.imageUrl ? 'none' : 'flex' }}>
              <VehicleIcon className="h-8 w-8" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{vehicle.plateNumber}</h4>
                <p className="text-xs text-gray-500 mt-1">{vehicle.vehicleType}</p>
                <p className="text-xs text-gray-500">ID: {vehicle.vehicleId}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${statusInfo.color}`}>
                <statusInfo.icon className="h-3 w-3 mr-1" />
                {statusInfo.label}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500">Created</p>
            <p className="text-sm font-medium text-gray-900">{formatTimeAgo(vehicle.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Last Updated</p>
            <p className="text-sm font-medium text-gray-900">{formatTimeAgo(vehicle.updatedAt)}</p>
          </div>
        </div>
        
        <div className="flex justify-end items-center space-x-2">
          <button className="text-green-600 hover:text-green-700 text-xs font-medium flex items-center">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </button>
          <button className="text-red-600 hover:text-red-700 text-xs font-medium flex items-center">
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </button>
        </div>
      </div>
    );
  };

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 bg-white border-t border-gray-200 space-y-2 sm:space-y-0">
        <div className="text-sm text-gray-600">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredVehicles.length)} of {filteredVehicles.length} vehicles
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {!isMobile && (
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          )}
          
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 text-sm border rounded ${
                currentPage === number
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center">
            <Loader2 className="animate-spin h-6 w-6 text-green-600 mr-2" />
            <span className="text-gray-600">Loading vehicle data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Vehicle Modal */}
      <AddVehicleModal />

      {/* Vehicle Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {totalVehicles.toLocaleString()}
              </p>
            </div>
            <Truck className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{availableVehicles}</p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Use</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{inUseVehicles}</p>
            </div>
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">{maintenanceVehicles}</p>
            </div>
            <Wrench className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{getStatusInfo(status).label}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Types</option>
              {vehicleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setLoading(true)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                {!isMobile && "Refresh"}
              </button>
              
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-1" />
                {!isMobile && "Export"}
              </button>
              
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                {!isMobile && "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      {isMobile ? (
        <div className="space-y-4">
          {currentVehicles.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            currentVehicles.map((vehicle) => (
              <MobileCard key={vehicle.vehicleId} vehicle={vehicle} />
            ))
          )}
          {filteredVehicles.length > 0 && <Pagination />}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Vehicle Fleet Management
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Truck className="h-4 w-4" />
                <span>Total Vehicles: {filteredVehicles.length}</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-600">Vehicle</th>
                  <th className="text-left p-4 font-medium text-gray-600">Type</th>
                  <th className="text-left p-4 font-medium text-gray-600">Plate Number</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Created</th>
                  <th className="text-left p-4 font-medium text-gray-600">Last Updated</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No vehicles found matching your criteria
                    </td>
                  </tr>
                ) : (
                  currentVehicles.map((vehicle) => {
                    const statusInfo = getStatusInfo(vehicle.status);
                    const VehicleIcon = getVehicleIcon(vehicle.vehicleType);
                    
                    return (
                      <tr key={vehicle.vehicleId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {vehicle.imageUrl ? (
                                <img 
                                  src={vehicle.imageUrl} 
                                  alt={`${vehicle.vehicleType} ${vehicle.plateNumber}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: vehicle.imageUrl ? 'none' : 'flex' }}>
                                <VehicleIcon className="h-6 w-6" />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{vehicle.plateNumber}</div>
                              <div className="text-sm text-gray-500">ID: {vehicle.vehicleId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{vehicle.vehicleType}</td>
                        <td className="p-4 text-gray-900 font-medium">{vehicle.plateNumber}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit ${statusInfo.color}`}>
                            <statusInfo.icon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">
                          {formatTimeAgo(vehicle.createdAt)}
                        </td>
                        <td className="p-4 text-gray-500">
                          {formatTimeAgo(vehicle.updatedAt)}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button className="text-green-600 hover:text-green-700 p-1">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700 p-1">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {filteredVehicles.length > 0 && <Pagination />}
        </div>
      )}

      {/* Vehicle Type Summary */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fleet Summary by Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicleTypes.map(type => {
            const typeVehicles = vehicles.filter(v => v.vehicleType === type);
            const availableCount = typeVehicles.filter(v => v.status === "available").length;
            const inUseCount = typeVehicles.filter(v => v.status === "in_use").length;
            const maintenanceCount = typeVehicles.filter(v => v.status === "maintenance").length;
            const VehicleIcon = getVehicleIcon(type);
            
            return (
              <div key={type} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <VehicleIcon className="h-4 w-4 mr-2" />
                    {type}
                  </h4>
                  <span className="text-sm font-bold text-gray-700">{typeVehicles.length}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Available:
                    </span>
                    <span className="font-medium">{availableCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      In Use:
                    </span>
                    <span className="font-medium">{inUseCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600 flex items-center">
                      <Wrench className="h-3 w-3 mr-1" />
                      Maintenance:
                    </span>
                    <span className="font-medium">{maintenanceCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group">
            <Plus className="h-5 w-5 text-gray-400 group-hover:text-green-600 mr-2" />
            <span className="text-gray-600 group-hover:text-green-600 font-medium">Add Vehicle</span>
          </button>
          
          <button className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
            <Settings className="h-5 w-5 text-gray-400 group-hover:text-blue-600 mr-2" />
            <span className="text-gray-600 group-hover:text-blue-600 font-medium">Bulk Update</span>
          </button>
          
          <button className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group">
            <Download className="h-5 w-5 text-gray-400 group-hover:text-purple-600 mr-2" />
            <span className="text-gray-600 group-hover:text-purple-600 font-medium">Export Data</span>
          </button>
          
          <button className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group">
            <Wrench className="h-5 w-5 text-gray-400 group-hover:text-orange-600 mr-2" />
            <span className="text-gray-600 group-hover:text-orange-600 font-medium">Maintenance</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;