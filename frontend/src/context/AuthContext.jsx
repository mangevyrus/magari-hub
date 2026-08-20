import {
    createContext,
    useContext,
    useState,
} from "react";

import {
    loginAdmin,
    logoutAdmin,
    isAuthenticated,
} from "../services/authService";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    const [
        authenticated,
        setAuthenticated,
    ] = useState(
        isAuthenticated()
    );


    /*
    |--------------------------------------------------------------------------
    | ADMIN LOGIN
    |--------------------------------------------------------------------------
    */

    const login = async (
        username,
        password
    ) => {

        const data = await loginAdmin(
            username,
            password
        );

        setAuthenticated(true);

        return data;
    };


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    const logout = () => {

        logoutAdmin();

        setAuthenticated(false);
    };


    return (

        <AuthContext.Provider
            value={{
                authenticated,
                login,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>

    );
}


/*
|--------------------------------------------------------------------------
| CUSTOM HOOK
|--------------------------------------------------------------------------
*/

export function useAuth() {

    return useContext(
        AuthContext
    );
}