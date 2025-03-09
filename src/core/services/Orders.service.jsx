import axios from "axios";
import environement from "../environement";


const BASE_URL = environement.ENGINE_URL

// Retrieve token from localStorage
const getToken = () => localStorage.getItem("token");

// ✅ Get all orders
export const getAllOrders = async () => {
    const token = getToken();

    const response = await axios.get(`${BASE_URL}/users/orders`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// ✅ Get an order by ID
export const getOrderById = async (orderId) => {
    const token = getToken();

    const response = await axios.get(`${BASE_URL}/users/orders/${orderId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// ✅ Delete an order by ID
export const deleteOrder = async (orderId) => {
    const token = getToken();

    const response = await axios.delete(`${BASE_URL}/users/orders/${orderId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

