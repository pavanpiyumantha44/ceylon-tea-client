import API from "./api";

export const analyzeImage = (formData)=>API.post('/ai/analyzeImage',formData);