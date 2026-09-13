
import { API_URL } from "../config";


// ============================================================
// GET ADMIN TOKEN
// ============================================================

const getToken = () => {

    return (
        localStorage.getItem(
            "access_token"
        ) ||
        localStorage.getItem(
            "admin_token"
        )
    );
};


// ============================================================
// AUTH HEADERS
// ============================================================

const getHeaders = () => {

    const token =
        getToken();

    return {

        "Content-Type":
            "application/json",

        Authorization:
            `Bearer ${token}`,

    };
};


// ============================================================
// GET ALL ADMIN ORDERS
// ============================================================

export const getAdminOrders =
    async () => {

        const response =
            await fetch(
                `${API_URL}/orders/admin/`,
                {
                    method: "GET",
                    headers:
                        getHeaders(),
                }
            );


        const data =
            await response
                .json()
                .catch(
                    () => []
                );


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Failed to load admin orders."
            );

        }


        return data;
    };


// ============================================================
// GET SINGLE ADMIN ORDER
// ============================================================

export const getAdminOrder =
    async (orderId) => {

        const response =
            await fetch(
                `${API_URL}/orders/admin/${orderId}/`,
                {
                    method: "GET",
                    headers:
                        getHeaders(),
                }
            );


        const data =
            await response
                .json()
                .catch(
                    () => ({})
                );


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Failed to load order."
            );

        }


        return data;
    };


// ============================================================
// UPDATE ADMIN ORDER
// ============================================================

export const updateAdminOrder =
    async (
        orderId,
        orderData
    ) => {

        const response =
            await fetch(
                `${API_URL}/orders/admin/${orderId}/`,
                {
                    method: "PATCH",
                    headers:
                        getHeaders(),
                    body:
                        JSON.stringify(
                            orderData
                        ),
                }
            );


        const data =
            await response
                .json()
                .catch(
                    () => ({})
                );


        if (!response.ok) {

            throw new Error(
                data.status?.[0] ||
                data.detail ||
                "Failed to update order."
            );

        }


        return data;
    };

