import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    CarFront,
    Tags,
    FolderTree,
    MessageSquare,
    Settings,
    LogOut,
    X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";


function AdminSidebar({ mobileOpen, setMobileOpen }) {

    const { logout } = useAuth();


    const navigation = [
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
            name: "Brands",
            path: "/admin/brands",
            icon: Tags,
        },
        {
            name: "Categories",
            path: "/admin/categories",
            icon: FolderTree,
        },
        {
            name: "Enquiries",
            path: "/admin/enquiries",
            icon: MessageSquare,
        },
    ];


    const handleLogout = () => {

        logout();

        window.location.href =
            "/admin/login";
    };


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


            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-[270px] flex-col
                    bg-[#12395B]
                    shadow-2xl
                    transition-transform duration-300
                    lg:static
                    lg:translate-x-0
                    ${mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >

                {/* LOGO */}

                <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">

                            <CarFront
                                size={22}
                                className="text-[#12395B]"
                            />

                        </div>

                        <div>

                            <h1 className="text-xl font-black tracking-tight text-white">
                                Magari<span className="text-[#A9DCFF]">Hub</span>
                                
                            </h1>
 
                            <p className="text-[10px] font-medium uppercase tracking-wider text-blue-200">
                                Admin Panel
                            </p>

                        </div>

                    </div>


                    <button
                        onClick={() =>
                            setMobileOpen(false)
                        }
                        className="rounded-lg p-2 text-blue-200 hover:bg-white/10 lg:hidden"
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* NAVIGATION */}

                <nav className="flex-1 space-y-1 px-4 py-6">

                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">
                        Main Menu
                    </p>


                    {navigation.map((item) => {

                        const Icon = item.icon;

                        return (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() =>
                                    setMobileOpen(false)
                                }
                                className={({ isActive }) =>
                                    `
                                    group flex items-center gap-3
                                    rounded-xl px-3 py-3
                                    text-sm font-semibold
                                    transition
                                    ${
                                        isActive
                                            ? "bg-white text-[#12395B] shadow-lg shadow-black/10"
                                            : "text-blue-100 hover:bg-white/10 hover:text-white"
                                    }
                                    `
                                }
                            >

                                <Icon
                                    size={19}
                                    className="shrink-0"
                                />

                                <span>
                                    {item.name}
                                </span>

                            </NavLink>

                        );

                    })}


                    <div className="my-6 border-t border-white/10" />

                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">
                        System
                    </p>


                    <NavLink
                        to="/admin/settings"
                        onClick={() =>
                            setMobileOpen(false)
                        }
                        className={({ isActive }) =>
                            `
                            flex items-center gap-3
                            rounded-xl px-3 py-3
                            text-sm font-semibold
                            transition
                            ${
                                isActive
                                    ? "bg-white text-[#12395B]"
                                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                            }
                            `
                        }
                    >

                        <Settings size={19} />

                        Settings

                    </NavLink>

                </nav>


                {/* USER / LOGOUT */}

                <div className="border-t border-white/10 p-4">

                    <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2F80C0] font-bold text-white">
                            A
                        </div>

                        <div className="min-w-0">

                            <p className="truncate text-sm font-bold text-white">
                                Administrator
                            </p>

                            <p className="truncate text-xs text-blue-200">
                                System Admin
                            </p>

                        </div>

                    </div>


                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-blue-100 transition hover:bg-red-500/10 hover:text-red-200"
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