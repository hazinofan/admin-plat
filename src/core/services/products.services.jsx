import axios from "axios";
import environement from "../environement";

const API_URL = environement.BACKEND_URL ;

// Get the token from localStorage
const getAuthToken = () => localStorage.getItem("token");

// Add a new product
export const addProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found.");
    }

    console.log("Sending payload to API:", productData)

    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,  
        "Content-Type": "application/json",
      },
    });

    console.log("API response:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error in addProduct service:", error);
    console.error("Error details:", error.response?.data); 
    throw error;
  }
};



// Delete a product by ID
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Get all products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get a product by ID
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

// Updating products
export const updateProduct = async (productId, productData) => {
  try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(`${API_URL}/products/${productId}`, productData, {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      });

      return response.data;
  } catch (error) {
      console.error("Error updating product:", error);
      throw error;
  }
};

