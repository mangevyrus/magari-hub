
const API_URL = "http://magari-hub.onrender.com/api";

// ============================================================
// GET CUSTOMER TOKEN
// ============================================================

const getToken = () => {
    return localStorage.getItem("customer_access_token");
};

// ============================================================
// AUTH HEADERS
// ============================================================

const getHeaders = () => {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// ============================================================
// HANDLE API ERROR
// ============================================================

const getErrorMessage = (data, fallback) => {
    if (!data) {
        return fallback;
    }

    if (typeof data === "string") {
        return data;
    }

    if (data.detail) {
        return data.detail;
    }

    const fields = [
        "vehicle",
        "full_name",
        "phone",
        "email",
        "location",
        "fulfillment_method",
        "notes",
    ];

    for (const field of fields) {
        if (data[field]) {
            if (Array.isArray(data[field])) {
                return data[field][0];
            }

            return data[field];
        }
    }

    return fallback;
};

// ============================================================
// CREATE ORDER
// ============================================================

export const createOrder = async (orderData) => {
    const token = getToken();

    if (!token) {
        throw new Error("You must be logged in to create an order.");
    }

    const response = await fetch(`${API_URL}/orders/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(orderData),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(
                data,
                "Failed to create order."
            )
        );
    }

    return data;
};

// ============================================================
// GET MY ORDERS
// ============================================================

export const getMyOrders = async () => {
    const token = getToken();

    if (!token) {
        throw new Error("You must be logged in.");
    }

    const response = await fetch(`${API_URL}/orders/`, {
        method: "GET",
        headers: getHeaders(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(
                data,
                "Failed to load orders."
            )
        );
    }

    return data;
};

// ============================================================
// GET SINGLE ORDER
// ============================================================

export const getOrder = async (orderId) => {
    if (!orderId) {
        throw new Error("Order ID is required.");
    }

    const token = getToken();

    if (!token) {
        throw new Error("You must be logged in.");
    }

    const response = await fetch(
        `${API_URL}/orders/${orderId}/`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(
                data,
                "Failed to load order."
            )
        );
    }

    return data;
};

