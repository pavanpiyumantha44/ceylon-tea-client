import React, { useState, useEffect } from "react";
import { 
  Package, 
  AlertTriangle, 
  BarChart3, 
  DollarSign, 
  Search, 
  RefreshCw, 
  Download, 
  Plus, 
  X, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { addStockItem, getStockItems } from "../../services/stockService";
import { Link } from "react-router-dom";

const Inventory = () => {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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


  const fetchStockData = async () => {
    try {
      setLoading(true);
      const fetchStockItemsResponse = await getStockItems();
      if(fetchStockItemsResponse.data.success){    
        setStockItems(fetchStockItemsResponse.data.data);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch stock data");
      console.error("Error fetching stock:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  // Define minimum stock levels by category
  const minStockLevels = {
    "TEA": 500,
    "FERTILIZER": 300,
    "TOOLS": 20,
    "FUEL": 100,
  };
  // Calculate stock status
  const getStockStatus = (quantity, category) => {
    const minLevel = minStockLevels[category] || 100;
    if (quantity <= minLevel * 0.5) return "Critical";
    if (quantity <= minLevel) return "Low";
    return "Good";
  };

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

  // Filter stock items
  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, itemsPerPage]);

  // Calculate stats
  const totalStock = stockItems.length;
  const lowStockItems = stockItems.filter(item => 
    getStockStatus(item.quantity, item.category) === "Low" || 
    getStockStatus(item.quantity, item.category) === "Critical"
  ).length;
  const categories = [...new Set(stockItems.map(item => item.category))];
  const totalValue = stockItems.reduce((sum, item) => 
    sum + (item.quantity * Number(item.unitPrice)), 0
  );

  // Add Stock Modal Component
  const AddStockModal = () => {
    const [formData, setFormData] = useState({
      name: "",
      category: "",
      quantity: '',
      unit: "kg",
      unitPrice:'',
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const availableCategories = ['TEA','FERTILIZER','TOOLS','FUEL'];

    const validateForm = () => {
      const errors = {};
      
      if (!formData.name.trim()) {
        errors.name = "Product name is required";
      } else if (formData.name.trim().length < 2) {
        errors.name = "Product name must be at least 2 characters";
      }
      
      if (!formData.category) {
        errors.category = "Category is required";
      }
      
      if (!formData.quantity) {
        errors.quantity = "Quantity is required";
      } else if (isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
        errors.quantity = "Quantity must be a positive number";
      }
      if (!formData.unitPrice) {
        errors.quantity = "Unit Price is required";
      } else if (isNaN(formData.unitPrice) || Number(formData.unitPrice) <= 0) {
        errors.quantity = "Unit Price must be a positive number";
      }
      
      return errors;
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
        const stockResponse = await addStockItem(formData);
        if(stockResponse.data.success){
          console.log(stockResponse.data);
        }
        
        const newItem = {
          itemId: (stockItems.length + 1).toString(),
          name: formData.name.trim(),
          category: formData.category,
          unit: formData.unit,
          quantity: Number(formData.quantity),
          unitPrice:Number(formData.unitPrice),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setStockItems(prev => [...prev, newItem]);
        
        // Reset form
        setFormData({
          name: "",
          category: "",
          quantity: "",
          unit: "kg",
          unitPrice:""
        });
        setFormErrors({});
        setShowAddModal(false);
        
      } catch (error) {
        console.error("Error adding stock:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClose = () => {
      setShowAddModal(false);
      setFormData({
        name: "",
        category: "",
        quantity: "",
        unit: "kg"
      });
      setFormErrors({});
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add New Stock Item</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {formErrors.category && (
                <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
              )}
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    formErrors.quantity ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.quantity && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.quantity}</p>
                )}
              </div>
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="kg">Kg</option>
                  <option value="g">g</option>
                  <option value="l">L</option>
                  <option value="">count</option>
                </select>
              </div>
            </div>
            {/* Unit Price (LKR) */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Unit Price (LKR) *
              </label>
              <input
                type="number"
                id="unitPrice"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleInputChange}
                placeholder="Enter unit price"
                min={0}
                max={300000}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.unitPrice ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.unitPrice && (
                <p className="text-red-500 text-xs mt-1">{formErrors.unitPrice}</p>
              )}
            </div>

            {/* Additional Info */}
            {formData.category && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Minimum Level:</span>
                    <span className="font-medium">{minStockLevels[formData.category] || 100} {formData.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per {formData.unit}:</span>
                    <span className="font-medium">{formData.unitPrice || 0} LKR</span>
                  </div>
                  {formData.quantity && (
                    <div className="flex justify-between">
                      <span>Estimated Value:</span>
                      <span className="font-medium text-green-600">
                        {(Number(formData.unitPrice || 0) * Number(formData.quantity)).toLocaleString()} LKR
                      </span>
                    </div>
                  )}
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
                  "Add Stock Item"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Mobile Card Component
  const MobileCard = ({ item }) => {
    const status = getStockStatus(item.quantity, item.category);
    const minLevel = minStockLevels[item.category] || 100;
    const price = item.unitPrice || 0;
    
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
            <p className="text-xs text-gray-500 mt-1">ID: {item.itemId}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "Good"
              ? "bg-green-100 text-green-800"
              : status === "Low"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}>
            {status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500">Category</p>
            <p className="text-sm font-medium text-gray-900">{item.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Stock</p>
            <p className="text-sm font-medium text-gray-900">{item.quantity.toLocaleString()} {item.unit.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Min Level</p>
            <p className="text-sm font-medium text-gray-900">{minLevel} {item.unit.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="text-sm font-medium text-gray-900">{price} LKR</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">{formatTimeAgo(item.createdAt)}</p>
          <div className="flex space-x-2">
            <Link to={`/dashboard/editProduct/${item.itemId}`} className="text-green-600 hover:text-green-700 text-xs font-medium flex items-center">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Link>
            <button className="text-red-600 hover:text-red-700 text-xs font-medium flex items-center">
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </button>
          </div>
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
            Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} results
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
            <span className="text-gray-600">Loading inventory...</span>
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
              onClick={fetchStockData}
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
      {/* Add Stock Modal */}
      <AddStockModal />

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Stock Items</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {totalStock.toLocaleString()}
              </p>
            </div>
            <Package className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">{lowStockItems}</p>
            </div>
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
            </div>
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Value</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{totalValue.toLocaleString()} LKR</p>
            </div>
            <DollarSign className="h-6 w-6 text-green-600" />
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <button 
                onClick={fetchStockData}
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
          {currentItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            currentItems.map((item) => (
              <MobileCard key={item.itemId} item={item} />
            ))
          )}
          {filteredItems.length > 0 && <Pagination />}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Stock Management
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-600">Product</th>
                  <th className="text-left p-4 font-medium text-gray-600">Category</th>
                  <th className="text-left p-4 font-medium text-gray-600">Aval. Stock</th>
                  <th className="text-left p-4 font-medium text-gray-600">Min. Level</th>
                  <th className="text-left p-4 font-medium text-gray-600">Unit Price</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No items found matching your criteria
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => {
                    const status = getStockStatus(item.quantity, item.category);
                    const minLevel = minStockLevels[item.category] || 100;
                    const price = item.unitPrice || 0;
                    
                    return (
                      <tr key={item.itemId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td><Link to={`/dashboard/editProduct/${item.itemId}`} className="p-4 font-medium text-gray-900 hover:cursor-pointer">{item.name}</Link></td>
                        <td className="p-4 text-gray-600">{item.category}</td>
                        <td className="p-4 text-gray-900 font-medium">
                          {item.quantity.toLocaleString()} {item.unit.toUpperCase()}
                        </td>
                        <td className="p-4 text-gray-600">{minLevel} {item.unit.toUpperCase()}</td>
                        <td className="p-4 text-gray-900">{price} LKR</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              status === "Good"
                                ? "bg-green-100 text-green-800"
                                : status === "Low"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">
                          {formatTimeAgo(item.updatedAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {filteredItems.length > 0 && <Pagination />}
        </div>
      )}
    </div>
  );
};

export default Inventory;