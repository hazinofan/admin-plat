import axios from "axios";
import environement from "../environement";

const API_URL = environement.BACKEND_URL ;

// Retrieve token from localStorage
const getToken = () => localStorage.getItem("token");

// ✅ Get all users
export const getAllUsers = async () => {
    const token = getToken();

    const response = await axios.get(`${API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// ✅ Get a user by ID
export const getUserById = async (userId) => {
    const token = getToken();

    const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// ✅ Delete a user by ID
export const deleteUser = async (userId) => {
    const token = getToken();

    const response = await axios.delete(`${API_URL}/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

//Update User Data
export const updateUser = async (userId, updateData) => {
    const token = getToken();

    const response = await axios.patch(`${API_URL}/users/${userId}/update`, updateData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    return response.data;
};

