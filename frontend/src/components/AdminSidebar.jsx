import {
    LayoutDashboard,
    CarFront,
    PlusCircle,
    LogOut,
    X,
    Store,
    Users,
    MessageCircle,
    BarChart3,
    Settings,
    List,
    Plus,
    Badge,
} from "lucide-react";

import { NavLink, useNavigate, Link } from "react-router-dom";
import magarilogo from "../assets/magarilogo.png"; // Adjust path as needed

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


    const mainLinks = [
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

 {
            name: "Orders",
            path: "/admin/orders",
            icon: List,
        },

        {
            name: "Brands",
            path: "/admin/brands",
            icon: Badge,
        },
        {
            name: "Categories",
            path: "/admin/categories",
            icon: List,
        },
    ];

    const managementLinks = [
        {
            name: "Users",
            path: "/admin/users",
            icon: Users,
        },
        {
            name: "Inquiries",
            path: "/admin/inquiries",
            icon: MessageCircle,
        },
        {
            name: "Analytics",
            path: "/admin/analytics",
            icon: BarChart3,
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: Settings,
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
                    className="fixed inset-0 z-40 bg-[#0B1E2E]/40 backdrop-blur-sm lg:hidden"
                />

            )}


            {/* SIDEBAR */}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-72 flex-col
                    border-r border-[#D4A853]/20
                    bg-white
                    shadow-2xl
                    transition-transform duration-300

                    lg:translate-x-0
                    ${mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >

                {/* LOGO - Bingwa Magari Used */}

                <div className="flex h-20 items-center justify-between border-b border-[#D4A853]/20 px-6 bg-gradient-to-r from-[#FAF7F2] to-white">

                    <Link
                        to="/"
                        className="flex items-center gap-3"
                        onClick={() => setMobileOpen(false)}
                    >
                        {/* Logo - Premium size with gold border */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B1E2E] to-[#1A3A4F] shadow-md border-2 border-[#D4A853]/40 p-1.5">
                            <img 
                                src={magarilogo} 
                                alt="Bingwa Magari Used Logo"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div>
                            <h1 className="text-lg font-extrabold tracking-tight text-[#0B1E2E]">
                                Bingwa
                                <span className="text-[#D4A853] ml-1">Magari Used</span>
                            </h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A853]">
                                Admin Panel
                            </p>
                        </div>

                    </Link>


                    <button
                        onClick={() =>
                            setMobileOpen(false)
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-[#D4A853]/10 lg:hidden transition"
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* NAVIGATION */}

                <nav className="flex-1 overflow-y-auto px-4 py-6">

                    {/* MAIN MENU */}

                    <p className="mb-3 px-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                        Main Menu
                    </p>

                    {mainLinks.map(({
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
                                transition-all duration-200
                                mb-1

                                ${
                                    isActive
                                        ? "bg-gradient-to-r from-[#0B1E2E] to-[#1A3A4F] text-white shadow-lg shadow-[#0B1E2E]/20"
                                        : "text-slate-500 hover:bg-[#FAF7F2] hover:text-[#0B1E2E] hover:border-l-4 hover:border-[#D4A853]"
                                }
                                `
                            }
                        >
                            <Icon size={19} className={`
                                ${({ isActive }) => 
                                    isActive ? "text-[#D4A853]" : ""
                                }
                            `} />
                            {name}
                        </NavLink>

                    ))}


                    <div className="my-6 border-t border-[#D4A853]/20" />


                    {/* MANAGEMENT */}

                    <p className="mb-3 px-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                        Management
                    </p>

                    {managementLinks.map(({
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
                                transition-all duration-200
                                mb-1

                                ${
                                    isActive
                                        ? "bg-gradient-to-r from-[#0B1E2E] to-[#1A3A4F] text-white shadow-lg shadow-[#0B1E2E]/20"
                                        : "text-slate-500 hover:bg-[#FAF7F2] hover:text-[#0B1E2E] hover:border-l-4 hover:border-[#D4A853]"
                                }
                                `
                            }
                        >
                            <Icon size={19} className={`
                                ${({ isActive }) => 
                                    isActive ? "text-[#D4A853]" : ""
                                }
                            `} />
                            {name}
                        </NavLink>

                    ))}

                </nav>


                {/* BOTTOM - User Info & Logout */}

                <div className="border-t border-[#D4A853]/20 p-4 bg-gradient-to-r from-white to-[#FAF7F2]">

                    <div className="mb-3 rounded-xl bg-gradient-to-r from-[#FAF7F2] to-white p-4 border border-[#D4A853]/10">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0B1E2E] to-[#1A3A4F] border-2 border-[#D4A853]/30">

                                <Store
                                    size={18}
                                    className="text-[#D4A853]"
                                />

                            </div>

                            <div>

                                <p className="text-sm font-bold text-[#0B1E2E]">
                                    Bingwa Magari
                                </p>

                                <p className="text-xs text-[#D4A853] font-semibold">
                                    Administrator
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
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