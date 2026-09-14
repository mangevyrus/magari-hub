import api from "./api";
const API_URL = "http://magari-hub.onrender.com/api";

/*
|--------------------------------------------------------------------------
| Get JWT access token
|--------------------------------------------------------------------------
*/

const getAccessToken = () => {
    return (
        localStorage.getItem("access") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("accessToken")
    );
};


/*
|--------------------------------------------------------------------------
| Authenticated request
|--------------------------------------------------------------------------
*/

const authenticatedRequest = async (
    endpoint,
    options = {}
) => {

    const token = getAccessToken();

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            headers: {
                ...(options.headers || {}),

                "Authorization": `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {

        if (response.status === 401) {
            throw new Error(
                "Your admin session has expired. Please login again."
            );
        }

        if (response.status === 403) {
            throw new Error(
                "You do not have permission to perform this action."
            );
        }

        const errorData = await response.json()
            .catch(() => ({}));

        throw new Error(
            errorData.detail ||
            "Something went wrong."
        );
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};


/*
|--------------------------------------------------------------------------
| Get admin vehicles
|--------------------------------------------------------------------------
*/

export const getAdminVehicles = async (
    params = ""
) => {

    return authenticatedRequest(
        `/vehicles/${params}`
    );
};


/*
|--------------------------------------------------------------------------
| Delete vehicle
|--------------------------------------------------------------------------
*/

export const deleteVehicle = async (
    vehicleId
) => {

    return authenticatedRequest(
        `/vehicles/${vehicleId}/`,
        {
            method: "DELETE",
        }
    );
};


/*
|--------------------------------------------------------------------------
| Update vehicle
|--------------------------------------------------------------------------
*/

export const updateVehicle = async (
    vehicleId,
    data
) => {

    return authenticatedRequest(
        `/vehicles/${vehicleId}/`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(data),
        }
    );
};


/*
|--------------------------------------------------------------------------
| Toggle featured
|--------------------------------------------------------------------------
*/

export const toggleFeatured = async (
    vehicleId,
    featured
) => {

    return updateVehicle(
        vehicleId,
        {
            featured,
        }
    );
};
export const getDashboardStats = async () => {

    const response = await api.get(
        "/vehicles/dashboard_stats/"
    );

    return response.data;

};
