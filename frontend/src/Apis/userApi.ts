import apiClient from "./apiService";
import axios from "axios";

export const getUserHomeData = async () => {
  try {
    const response = await axios.get("/api/home");
    return response.data; // return the data directly
  } catch (error: any) {
    console.error("API call error:", error);
    return { error: error.message };
  }
};


export const getProductFilter = async () => {
  try {
    const response = await apiClient.get("/Product/GetAllProductProperties/ProductProperties");
    return response.data;
  } catch (error) {}
};
export const getContentPages = async () => {
  try {
    const response = await apiClient.get("/UserAppContent/GetContent");
    return response.data;
  } catch (error) {}
};
export const getProducts = async (params: {
  genetics?: string[];
  page?: number;
  pageSize?: number;
}) => {
  try {
    const response = await apiClient.get('/products', {
      params: {
        ...params,
        genetics: params.genetics || [],
      },
      paramsSerializer: { indexes: null }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return { products: [] };
  }
};