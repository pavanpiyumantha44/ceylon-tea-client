import React, { useState, useEffect } from "react";
import { 
  ChevronRight, 
  ArrowLeft, 
  Save, 
  X, 
  Package, 
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  History,
  BarChart3
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getItem, updateItem } from "../../services/stockService";
import { ToastContainer, toast } from 'react-toastify';

const EditProduct = ({ productId, onBack, onSave }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const {id} = useParams();

  // Check for mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Define categories and units
  const availableCategories = ["TEA", "FERTILIZER", "TOOLS", "FUEL"];
  const availableUnits = ["Kg", "g", "L","Count"];

    const minStockLevels = {
    "TEA": 500,
    "FERTILIZER": 300,
    "TOOLS": 20,
    "FUEL": 100,
  };

   const fetchProduct = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        const stockItemResponse = await getItem(id);
        if(stockItemResponse.data.success){
          setProduct(stockItemResponse.data.data);
          setError(null);
        }
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

  // Mock product data - replace with actual API call
  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleInputChange = (field, value) => {
    if (product) {
      setProduct(prev => ({
        ...prev,
        [field]: value
      }));
      setHasChanges(true);
    }
  };
const validateForm = () => {
      const errors = [];
      
      if (!product.name.trim()) {
        errors.push("Product name is required");
      } else if (product.name.trim().length < 2) {
        errors.push("Product name must be at least 2 characters");
      }
      
      if (!product.category) {
        errors.push("Category is required");
      }
      
      if (!product.quantity) {
        errors.push("Quantity is required");
      } else if (isNaN(product.quantity) || Number(product.quantity) <= 0) {
        errors.push("Quantity must be a positive number");
      }
      if (!product.unitPrice) {
        errors.push("Unit Price is required");
      } else if (isNaN(product.unitPrice) || Number(product.unitPrice) <= 0) {
        errors.push("Unit Price must be a positive number");
      }
      
      return errors;
    };
  const handleSave = async () => {
    setSaving(true);
    try {
      const errorMsg = validateForm();
      if(errorMsg.length>0){
        toast.error(errorMsg[0], {
               position: 'top-center',
            });
      }
      else{
          const updateStockItemResponse = await updateItem(id,product);
          if(updateStockItemResponse.data.success){
            toast.success("Item Updated sucessfully!", {
                        position: 'top-center',
                      });
            
          const updatedProduct = {
            ...product,
            updatedAt: new Date()
          };
          
          setProduct(updatedProduct);
          setHasChanges(false);
          
          if (onSave) {
            onSave(updatedProduct);
          }
        }
      }
    } catch (err) {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const getStockStatus = () => {
    if (!product) return "Unknown";
    const minLevel = minStockLevels[product.category] || 100;
    if (product.quantity <= minLevel * 0.5) return "Critical";
    if (product.quantity <= minLevel) return "Low";
    return "Good";
  };

  const calculateProfitMargin = () => {
    if (!product || !product.costPrice || !product.sellingPrice) return 0;
    return (((product.sellingPrice - product.costPrice) / product.costPrice) * 100).toFixed(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="animate-spin h-6 w-6 text-green-600 mr-2" />
          <span className="text-gray-600">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Product</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const stockStatus = getStockStatus();
  const profitMargin = calculateProfitMargin();

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer autoClose={2000} />
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link 
                to={"/dashboard/inventory"}
                className="flex items-center hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {!isMobile && "Inventory"}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium truncate max-w-32 sm:max-w-none">
                {product.name}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {hasChanges && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full hidden sm:inline">
                  Unsaved changes
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center text-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-1" />
                    {!isMobile && "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    {!isMobile && "Save"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Stock Item Information</h3>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={product.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={product.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="kg">Kg</option>
                      <option value="g">g</option>
                      <option value="l">L</option>
                      <option value="">count</option>
                    </select>
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Price (LKR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={product.unitPrice}
                      onChange={(e) => handleInputChange('unitPrice', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Stock Status</h4>
                <div className="flex items-center mb-3">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    stockStatus === "Good"
                      ? "bg-green-100 text-green-800"
                      : stockStatus === "Low"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {stockStatus === "Good" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {stockStatus}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Stock:</span>
                    <span className="font-medium">{product.quantity.toLocaleString()} {product.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Value:</span>
                    <span className="font-medium text-green-600">
                      {(product.quantity * product.unitPrice).toLocaleString()} LKR
                    </span>
                  </div>
                  <div className="flex justify-between">
                     <Package className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-xs text-gray-500">Created:</span>
                    <span className="text-xs font-medium ml-auto">{formatDate(product.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-xs text-gray-500">Last Updated:</span>
                    <span className="text-xs font-medium ml-auto">{formatTimeAgo(product.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">You have unsaved changes</p>
                <p className="text-xs text-amber-600 mt-1">Don't forget to save your changes</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="ml-2 px-3 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;