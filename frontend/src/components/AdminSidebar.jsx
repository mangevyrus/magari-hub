import {
    LayoutDashboard,
    CarFront,
    PlusCircle,
    LogOut,
    X,
    Store,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";


function AdminSidebar({
    mobileOpen,
    setMobileOpen,
}) {

    const navigate = useNavigate();


    const handleLogout = () => {

        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "refresh_token"
        );

        setMobileOpen(false);

        navigate(
            "/admin/login",
            {
                replace: true,
            }
        );

    };


    const links = [

        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },

        {
            name: "Vehicles",
            path: "/admin/vehicles",
            icon: CarFront,
        },

        {
            name: "Add Vehicle",
            path: "/admin/vehicles/new",
            icon: PlusCircle,
        },

    ];


    return (

        <>

            {/* MOBILE OVERLAY */}

            {mobileOpen && (

                <div
                    onClick={() =>
                        setMobileOpen(false)
                    }
                    className="fixed inset-0 z-40 bg-[#12395B]/40 backdrop-blur-sm lg:hidden"
                />

            )}


            {/* SIDEBAR */}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-72 flex-col
                    border-r border-blue-100
                    bg-white
                    shadow-xl
                    transition-transform duration-300

                    lg:translate-x-0
                    ${mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >

                {/* LOGO */}

                <div className="flex h-20 items-center justify-between border-b border-blue-100 px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#12395B] shadow-lg">

                            <CarFront
                                size={23}
                                className="text-white"
                            />

                        </div>

                        <div>

                            <h1 className="text-lg font-extrabold text-[#12395B]">
                                MagariHub
                            </h1>

                            <p className="text-[11px] font-bold uppercase tracking-widest text-[#2F80C0]">
                                Admin Panel
                            </p>

                        </div>

                    </div>


                    <button
                        onClick={() =>
                            setMobileOpen(false)
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 lg:hidden"
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* NAVIGATION */}

                <nav className="flex-1 space-y-2 px-4 py-6">

                    <p className="mb-4 px-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                        Management
                    </p>


                    {links.map(
                        ({
                            name,
                            path,
                            icon: Icon,
                        }) => (

                            <NavLink
                                key={path}
                                to={path}
                                onClick={() =>
                                    setMobileOpen(false)
                                }
                                className={({
                                    isActive,
                                }) =>
                                    `
                                    flex items-center gap-3
                                    rounded-xl px-4 py-3.5
                                    text-sm font-bold
                                    transition

                                    ${
                                        isActive
                                            ? "bg-[#EAF6FF] text-[#2F80C0] shadow-sm"
                                            : "text-slate-500 hover:bg-[#F5F9FC] hover:text-[#12395B]"
                                    }
                                    `
                                }
                            >

                                <Icon size={19} />

                                {name}

                            </NavLink>

                        )
                    )}

                </nav>


                {/* BOTTOM */}

                <div className="border-t border-blue-100 p-4">

                    <div className="mb-3 rounded-xl bg-[#F5F9FC] p-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF6FF]">

                                <Store
                                    size={18}
                                    className="text-[#2F80C0]"
                                />

                            </div>

                            <div>

                                <p className="text-sm font-bold text-[#12395B]">
                                    MagariHub
                                </p>

                                <p className="text-xs text-slate-400">
                                    Administrator
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"
                    >

                        <LogOut size={19} />

                        Logout

                    </button>

                </div>

            </aside>

        </>

    );
}


export default AdminSidebar;