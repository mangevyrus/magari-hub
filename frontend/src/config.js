
export const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://magari-hub.onrender.com/api";

export const BACKEND_URL =
    API_URL.replace(/\/api\/?$/, "");
