const API_URL = "http://magari-hub.onrender.com/api";


/*
|--------------------------------------------------------------------------
| CUSTOMER REGISTER
|--------------------------------------------------------------------------
*/

export const registerCustomer = async (customerData) => {

    const response = await fetch(
        `${API_URL}/auth/register/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(customerData),
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.detail ||
            data.message ||
            Object.values(data)
                .flat()
                .join(" ") ||
            "Registration failed."
        );
    }

    return data;
};


/*
|--------------------------------------------------------------------------
| CUSTOMER LOGIN
|--------------------------------------------------------------------------
*/

export const loginCustomer = async (
    username,
    password
) => {

    const response = await fetch(
        `${API_URL}/auth/token/`,
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

    if (!response.ok) {

        throw new Error(
            data.detail ||
            "Invalid username or password."
        );
    }


    localStorage.setItem(
        "customer_access_token",
        data.access
    );

    localStorage.setItem(
        "customer_refresh_token",
        data.refresh
    );

    window.dispatchEvent(                             //notify the Navbar when authentication changes.
    new Event("customer-auth-changed")
);

    return data;
};


/*
|--------------------------------------------------------------------------
| CUSTOMER LOGOUT
|--------------------------------------------------------------------------
*/

export const logoutCustomer = () => {

    localStorage.removeItem(
        "customer_access_token"
    );

    localStorage.removeItem(
        "customer_refresh_token"
    );

    
    window.dispatchEvent(                                     //notify the Navbar when authentication changes.
        new Event("customer-auth-changed")
    );

};


/*
|--------------------------------------------------------------------------
| GET CUSTOMER ACCESS TOKEN
|--------------------------------------------------------------------------
*/

export const getCustomerAccessToken = () => {

    return localStorage.getItem(
        "customer_access_token"
    );
};


/*
|--------------------------------------------------------------------------
| CHECK CUSTOMER AUTHENTICATION
|--------------------------------------------------------------------------
*/

export const isCustomerAuthenticated = () => {

    return Boolean(
        localStorage.getItem(
            "customer_access_token"
        )
    );
};


/*
|--------------------------------------------------------------------------
| GET CURRENT CUSTOMER
|--------------------------------------------------------------------------
*/

export const getCurrentCustomer = async () => {

    const token =
        getCustomerAccessToken();

    if (!token) {
        return null;
    }

    const response = await fetch(
        `${API_URL}/auth/me/`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {

        return null;
    }

    return await response.json();
};


/*
|--------------------------------------------------------------------------
| GET CUSTOMER PROFILE
|--------------------------------------------------------------------------
*/

export const getCustomerProfile = async () => {

    const token =
        getCustomerAccessToken();

    const response = await fetch(
        `${API_URL}/auth/profile/`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.detail ||
            "Failed to load profile."
        );
    }

    return data;
};


/*
|--------------------------------------------------------------------------
| UPDATE CUSTOMER PROFILE
|--------------------------------------------------------------------------
*/

export const updateCustomerProfile = async (
    profileData
) => {

    const token =
        getCustomerAccessToken();

    const response = await fetch(
        `${API_URL}/auth/profile/`,
        {
            method: "PATCH",

            headers: {
                Authorization:
                    `Bearer ${token}`,
            },

            body: profileData,
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.detail ||
            "Failed to update profile."
        );
    }

    return data;
};


/*
|--------------------------------------------------------------------------
| UPDATE CUSTOMER ACCOUNT
|--------------------------------------------------------------------------
*/

export const updateCustomerAccount = async (
    accountData
) => {

    const token =
        getCustomerAccessToken();

    const response = await fetch(
        `${API_URL}/auth/account/`,
        {
            method: "PATCH",

            headers: {
                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${token}`,
            },

            body: JSON.stringify(
                accountData
            ),
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.detail ||
            "Failed to update account."
        );
    }

    return data;
};


/*
|--------------------------------------------------------------------------
| REFRESH CUSTOMER ACCESS TOKEN
|--------------------------------------------------------------------------
*/

export const refreshCustomerAccessToken =
    async () => {

        const refreshToken =
            localStorage.getItem(
                "customer_refresh_token"
            );

        if (!refreshToken) {
            return null;
        }

        const response = await fetch(
            `${API_URL}/auth/token/refresh/`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    refresh:
                        refreshToken,
                }),
            }
        );

        if (!response.ok) {

            logoutCustomer();

            return null;
        }

        const data =
            await response.json();

        localStorage.setItem(
            "customer_access_token",
            data.access
        );

        if (data.refresh) {

            localStorage.setItem(
                "customer_refresh_token",
                data.refresh
            );



            
        }

        return data.access;
    };



export const changeCustomerPassword = async (
    current_password,
    new_password,
    confirm_password
) => {
    const token = getCustomerAccessToken();

    if (!token) {
        throw new Error("You are not logged in.");
    }

    const response = await fetch(
        `${API_URL}/auth/change-password/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                current_password,
                new_password,
                confirm_password,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
                data.message ||
                Object.values(data)
                    .flat()
                    .join(" ") ||
                "Failed to change password."
        );
    }

    return data;
};

