const API_URL =
    "http://magari-hub.onrender.com/api";


// ============================================================
// GET CUSTOMER TOKEN
// ============================================================

const getToken = () => {
    return localStorage.getItem(
        "customer_access_token"
    );
};


// ============================================================
// AUTH HEADERS
// ============================================================

const getHeaders = () => {

    const token = getToken();

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};


// ============================================================
// GET CART
// ============================================================

export const getCart = async () => {

    const response = await fetch(
        `${API_URL}/cart/`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.detail ||
            "Failed to load cart."
        );
    }

    return data;
};


// ============================================================
// ADD VEHICLE
// ============================================================

export const addToCart = async (
    vehicleId
) => {

    if (!vehicleId) {

        throw new Error(
            "Vehicle is required."
        );
    }

    const response = await fetch(
        `${API_URL}/cart/items/`,
        {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                vehicle: vehicleId,
            }),
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.vehicle?.[0] ||
            data.detail ||
            "Failed to add vehicle to cart."
        );
    }

    return data;
};


// ============================================================
// REMOVE VEHICLE
// ============================================================

export const removeFromCart = async (
    vehicleId
) => {

    const response = await fetch(
        `${API_URL}/cart/items/${vehicleId}/`,
        {
            method: "DELETE",
            headers: getHeaders(),
        }
    );

    if (!response.ok) {

        const data =
            await response.json()
                .catch(() => ({}));

        throw new Error(
            data.detail ||
            "Failed to remove vehicle."
        );
    }

    return true;
};


// ============================================================
// CLEAR CART
// ============================================================

export const clearCart = async () => {

    const response = await fetch(
        `${API_URL}/cart/clear/`,
        {
            method: "DELETE",
            headers: getHeaders(),
        }
    );

    if (!response.ok) {

        const data =
            await response.json()
                .catch(() => ({}));

        throw new Error(
            data.detail ||
            "Failed to clear cart."
        );
    }

    return true;
};

// ============================================================
// CART COUNT
// ============================================================

export const getCartCount = async () => {
    const cart = await getCart();

    return cart.item_count || 0;
};


// ============================================================
// CART TOTAL
// ============================================================

export const getCartTotal = async () => {
    const cart = await getCart();

    return Number(
        cart.total || 0
    );
};


//// ============================================================
// CHECK IF VEHICLE IS IN CART
// ============================================================

export const isInCart = async (vehicleId) => {
    if (!vehicleId) {
        return false;
    }

    const cart = await getCart();

    const items = cart?.items || [];

    return items.some(
        (item) =>
            Number(item.vehicle) === Number(vehicleId)
    );
};