import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../services/api";


function ProtectedAdminRoute() {

    const [loading, setLoading] =
        useState(true);

    const [isAdmin, setIsAdmin] =
        useState(false);


    useEffect(() => {

        const checkAdmin = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            // No token
            if (!token) {

                setIsAdmin(false);
                setLoading(false);

                return;
            }


            try {

                const response =
                    await api.get(
                        "/auth/me/"
                    );


                const user =
                    response.data;


                // ADMIN CHECK
                if (
                    user.is_staff === true ||
                    user.is_superuser === true
                ) {

                    setIsAdmin(true);

                } else {

                    setIsAdmin(false);

                }

            } catch (error) {

                console.error(
                    "Admin authentication failed:",
                    error
                );

                localStorage.removeItem(
                    "access_token"
                );

                localStorage.removeItem(
                    "refresh_token"
                );

                setIsAdmin(false);

            } finally {

                setLoading(false);

            }

        };


        checkAdmin();

    }, []);


    // ---------------------------------------------------------
    // LOADING
    // ---------------------------------------------------------

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-[#F5F9FC]">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#2F80C0]" />

                    <p className="mt-4 text-sm font-semibold text-[#12395B]">
                        Checking administrator access...
                    </p>

                </div>

            </div>

        );

    }


    // ---------------------------------------------------------
    // NOT ADMIN
    // ---------------------------------------------------------

    if (!isAdmin) {

        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );

    }


    // ---------------------------------------------------------
    // ADMIN
    // ---------------------------------------------------------

    return <Outlet />;

}


export default ProtectedAdminRoute;