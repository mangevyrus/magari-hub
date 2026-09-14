import { getCustomerAccessToken } from "./customerAuthService";

const API_URL = "http://magari-hub.onrender.com/api";


/*
|--------------------------------------------------------------------------
| CREATE INQUIRY
|--------------------------------------------------------------------------
*/

export const createInquiry = async (inquiryData) => {

    const token = getCustomerAccessToken();

    if (!token) {
        throw new Error(
            "Please sign in to send an inquiry."
        );
    }

    const response = await fetch(
        `${API_URL}/inquiries/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify(inquiryData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.message ||
            "Failed to send inquiry."
        );
    }

    return data;
};


/*
|--------------------------------------------------------------------------
| GET MY INQUIRIES
|--------------------------------------------------------------------------
*/

export const getMyInquiries = async () => {

    const token = getCustomerAccessToken();

    if (!token) {
        throw new Error(
            "Please sign in."
        );
    }

    const response = await fetch(
        `${API_URL}/inquiries/`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            "Failed to load inquiries."
        );
    }

    return data;
};


/*
|--------------------------------------------------------------------------
| GET SINGLE INQUIRY
|--------------------------------------------------------------------------
*/

export const getInquiry = async (id) => {

    const token = getCustomerAccessToken();

    if (!token) {
        throw new Error(
            "Please sign in."
        );
    }

    const response = await fetch(
        `${API_URL}/inquiries/${id}/`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            "Failed to load inquiry."
        );
    }

    return data;
};