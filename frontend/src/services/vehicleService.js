import api from "./api";


// =========================================================
// GET VEHICLES
// =========================================================

export const getVehicles = async (query = "") => {

    const response = await api.get(
        `/vehicles/${query}`
    );

    return response.data;

};


// =========================================================
// GET SINGLE VEHICLE
// =========================================================

export const getVehicle = async (id) => {

    const response = await api.get(
        `/vehicles/${id}/`
    );

    return response.data;

};


// =========================================================
// GET BRANDS
// =========================================================

export const getBrands = async () => {

    const response = await api.get(
        "/brands/"
    );

    return response.data;

};


// =========================================================
// GET CATEGORIES
// =========================================================

export const getCategories = async () => {

    const response = await api.get(
        "/categories/"
    );

    return response.data;

};


// =========================================================
// CREATE VEHICLE
// =========================================================

export const createVehicle = async (
    vehicleData
) => {

    const response = await api.post(
        "/vehicles/",
        vehicleData
    );

    return response.data;

};


// =========================================================
// UPDATE VEHICLE
// =========================================================

export const updateVehicle = async (
    id,
    vehicleData
) => {

    const response = await api.patch(
        `/vehicles/${id}/`,
        vehicleData
    );

    return response.data;

};


// =========================================================
// DELETE VEHICLE
// =========================================================

export const deleteVehicle = async (
    id
) => {

    const response = await api.delete(
        `/vehicles/${id}/`
    );

    return response.data;

};


// =========================================================
// UPLOAD VEHICLE IMAGES
// =========================================================

export const uploadVehicleImages = async (
    vehicleId,
    files
) => {

    const formData = new FormData();

    files.forEach((file) => {

        formData.append(
            "images",
            file
        );

    });


    const response = await api.post(
        `/vehicles/${vehicleId}/upload-images/`,
        formData,
        {
            headers: {
                 // Axios automatically sets the multipart boundary
               
            },
        }
    );


    return response.data;

};


// =========================================================
// SET PRIMARY IMAGE
// =========================================================

export const setPrimaryImage = async (
    vehicleId,
    imageId
) => {

    const response = await api.post(
        `/vehicles/${vehicleId}/set-primary-image/`,
        {
            image_id: imageId,
        }
    );

    return response.data;

};


// =========================================================
// DELETE VEHICLE IMAGE
// =========================================================

export const deleteVehicleImage = async (
    vehicleId,
    imageId
) => {

    const response = await api.delete(
        `/vehicles/${vehicleId}/delete-image/${imageId}/`
    );

    return response.data;

};