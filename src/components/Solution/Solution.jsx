import React, { useState, useRef } from 'react';
import { Upload, Image, Eye, Download, Sparkles, RefreshCw, FileImage, X, CheckCircle, AlertCircle, Camera, Zap } from 'lucide-react';
import {analyzeImage} from '../../services/AIAnalaysisService';

import axios from 'axios';

const Solution = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [diseaseName, setDiseaseName] = useState('');
  const [foundSolutions,setFoundSolutions] = useState([]);
  const [successfulResponse,setSuccessfulResponse] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
        setAnalysisResult(null);
      } else {
        alert('Please select a valid image file');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setAnalysisResult(null);
    }
  };

  const simulateAIAnalysis = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Create FormData to send the image file
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('lang', selectedLanguage);
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      // Send image to backend
      const response = await axios.post(`${baseUrl}/ai/analyzeImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });
      
      
      // Process the response from your backend
      const diseaseResponse = response.data;
      console.log(diseaseResponse);
      setDiseaseName(diseaseResponse.data.disease)
      setFoundSolutions(diseaseResponse.data.solutions);
      setSuccessfulResponse(diseaseResponse.data.success);
      
      // Format the response to match your UI structure
      const analysisResult = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        filename: selectedImage.name,
        foundDisease: diseaseResponse.data.disease || "Tea Plant Disease",
        foundSolutions: diseaseResponse.data.solutions,
      };
      
      setAnalysisResult(analysisResult);
      setAnalysisHistory(prev => [analysisResult, ...prev.slice(0, 4)]);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to analyze image. ';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out. Please try again.';
      } else if (error.response) {
        errorMessage += `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage += 'Unable to connect to server. Please check your connection.';
      } else {
        errorMessage += 'An unexpected error occurred.';
      }
      
      //alert(errorMessage);
      
      // Optionally show a fallback mock analysis for demo purposes
      // You can remove this in production
      const fallbackAnalysis = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        filename: selectedImage.name,
        confidence: 0,
        primaryCategory: "Analysis Failed",
        detectedObjects: [],
        qualityMetrics: {
          sharpness: "Unknown",
          lighting: "Unknown",
          composition: "Unknown",
          resolution: "Unknown"
        },
        insights: ["Analysis could not be completed"],
        recommendations: ["Please try again or check your connection"],
        technicalDetails: {
          processingTime: "0.00 seconds",
          modelVersion: "Error",
          accuracy: "0%",
          dataPoints: 0
        }
      };
      
      setAnalysisResult(fallbackAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAll = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDiseaseName(null);
    setFoundSolutions([]);
    setSuccessfulResponse(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Sparkles className="h-8 w-8 text-green-600 mr-3" />
              AI Image Analysis
            </h1>
            <p className="text-gray-600 mt-2">Upload an image of a diseased tea plant or a tea leave</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-xl">
              <Camera className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Image Upload */}
        <div className="xl:col-span-1 space-y-6">
          {/* Upload Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-green-600" />
                Image Upload
              </h2>
            </div>
            
            <div className="p-6">
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your image here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPG, PNG, WebP files up to 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
              
              {selectedImage && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedImage.name}</p>
                        <p className="text-sm text-gray-600">
                          {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearAll}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {selectedImage && (
                <div className="mt-4 space-y-4">
                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Analysis Language
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {['English', 'Sinhala', 'Tamil'].map((language) => (
                        <label 
                          key={language}
                          className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name="language"
                            value={language}
                            checked={selectedLanguage === language}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500 focus:ring-2"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            {language}
                          </span>
                          {selectedLanguage === language && (
                            <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={simulateAIAnalysis}
                    disabled={isAnalyzing}
                    className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Analyze Image
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={clearAll}
                    className="w-full flex items-center justify-center px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Analysis History */}
          {analysisHistory.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Recent Analysis</h3>
              </div>
              <div className="p-6 space-y-3">
                {analysisHistory.map((analysis) => (
                  <div key={analysis.id} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{analysis.filename}</p>
                        <p className="text-xs text-gray-600">{analysis.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Image Preview & Results */}
        <div className="xl:col-span-2 space-y-6">
          {/* Image Preview */}
          {imagePreview && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-green-600" />
                  Image Preview
                </h2>
              </div>
              <div className="p-6">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-contain bg-gray-50 rounded-xl border border-gray-200"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                      <div className="bg-white p-4 rounded-xl flex items-center space-x-3">
                        <RefreshCw className="h-6 w-6 text-green-600 animate-spin" />
                        <span className="font-medium text-gray-900">AI Analysis in Progress...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {foundSolutions.length > 0 && diseaseName !== "" ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-green-600" />
                    AI Analysis Results
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Primary Classification */}
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Diseases Identified
                  </h3>                 
                </div>
                <p className="text-black-700 font-medium">{analysisResult.foundDisease}</p>   

                {/* Detected Objects */}
                <div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-green-blue mb-5">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Suggested Best Solutions
                  </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                    {foundSolutions.map((obj, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="px-2 font-bold text-gray-900">{obj.title}</span>
                        <div className="flex items-center justify-between mb-2">   
                          <span className={`px-2 py-1 rounded-lg text-md`}>
                            {obj.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                  <button className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </button>
                  <button 
                    onClick={simulateAIAnalysis}
                    className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Re-analyze
                  </button>
                  <button className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                    <Image className="h-4 w-4 mr-2" />
                    Save to Gallery
                  </button>
                </div>
              </div>
            </div>
          ): diseaseName === 'Not a valid image, Reselect a proper image and try again!' ? (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {diseaseName}
                  </h3>                 
                </div>
            ): null}

          {/* Empty State */}
          {!imagePreview && !isAnalyzing && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Image Selected</h3>
              <p className="text-gray-600 mb-6">
                Upload an image to get started with AI-powered analysis
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium mx-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Solution;