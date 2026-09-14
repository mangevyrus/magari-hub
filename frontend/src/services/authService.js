const API_URL = "https://magari-hub.onrender.com/api";


/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
*/

export const loginAdmin = async (
    username,
    password
) => {

    const response = await fetch(
        `${API_URL}/auth/admin-token/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                username,
                password,
            }),
        }
    );


    const data = await response.json();


    /*
    |--------------------------------------------------------------------------
    | LOGIN ERROR
    |--------------------------------------------------------------------------
    */

    if (!response.ok) {

        throw new Error(

            data.non_field_errors?.[0] ||

            data.detail ||

            "Invalid administrator credentials."

        );

    }


    /*
    |--------------------------------------------------------------------------
    | STORE ADMIN JWT TOKENS
    |--------------------------------------------------------------------------
    */

    localStorage.setItem(
        "access_token",
        data.access
    );

    localStorage.setItem(
        "refresh_token",
        data.refresh
    );


    return data;

};


/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

export const logoutAdmin = () => {

    localStorage.removeItem(
        "access_token"
    );

    localStorage.removeItem(
        "refresh_token"
    );

};


/*
|--------------------------------------------------------------------------
| GET ACCESS TOKEN
|--------------------------------------------------------------------------
*/

export const getAccessToken = () => {

    return localStorage.getItem(
        "access_token"
    );

};


/*
|--------------------------------------------------------------------------
| CHECK AUTHENTICATION
|--------------------------------------------------------------------------
*/

export const isAuthenticated = () => {

    return Boolean(
        localStorage.getItem(
            "access_token"
        )
    );

};


/*
|--------------------------------------------------------------------------
| REFRESH ACCESS TOKEN
|--------------------------------------------------------------------------
*/

export const refreshAccessToken = async () => {

    const refreshToken =
        localStorage.getItem(
            "refresh_token"
        );


    if (!refreshToken) {

        return null;

    }


    const response = await fetch(

        `${API_URL}/auth/token/refresh/`,

        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                refresh: refreshToken,
            }),

        }

    );


    if (!response.ok) {

        logoutAdmin();

        return null;

    }


    const data =
        await response.json();


    localStorage.setItem(
        "access_token",
        data.access
    );


    /*
    |--------------------------------------------------------------------------
    | SIMPLE JWT ROTATION
    |--------------------------------------------------------------------------
    */

    if (data.refresh) {

        localStorage.setItem(
            "refresh_token",
            data.refresh
        );

    }


    return data.access;

};