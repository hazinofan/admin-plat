import axios from "axios";
import environement from "../environement";

const API_URL = environement.BACKEND_URL ;

// Update Ticket Status
export const updateTicketStatus = async (ticketId, newStatus) => {
    const token = localStorage.getItem("token"); // Assuming authentication uses a token

    const response = await axios.patch(`${API_URL}/users/tickets/${ticketId}`, 
        { status: newStatus },
        {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        }
    );

    return response.data;
};

// Get a ticket by ID
export const getTicketById = async (ticketId) => {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/users/tickets/${ticketId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
