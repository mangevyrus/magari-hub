import { useState } from "react";

import {
    Menu,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";


function AdminLayout({
    children,
}) {

    const [
        mobileOpen,
        setMobileOpen
    ] = useState(false);


    return (

        <div className="min-h-screen bg-[#F5F9FC]">

            <AdminSidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />


            {/* MAIN */}

            <div className="lg:pl-72">

                {/* MOBILE HEADER */}

                <header className="sticky top-0 z-30 flex h-16 items-center border-b border-blue-100 bg-white/95 px-5 backdrop-blur lg:hidden">

                    <button
                        onClick={() =>
                            setMobileOpen(true)
                        }
                        className="rounded-xl p-2 text-[#12395B] hover:bg-blue-50"
                    >

                        <Menu size={23} />

                    </button>

                    <span className="ml-3 font-extrabold text-[#12395B]">
                        MagariHub Admin
                    </span>

                </header>


                {children}

            </div>

        </div>

    );

}


export default AdminLayout;