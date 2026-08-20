import { Link } from "react-router-dom";
import {
    Heart,
    Menu,
    Search,
    UserRound,
    X,
} from "lucide-react";
import { useState } from "react";

function Navbar() {

    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur">

            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

                {/* LOGO */}

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#12395B] text-white shadow-sm">
                        🚘
                    </div>

                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-[#12395B]">
                            Magari<span className="text-[#2F80C0]">Hub</span>
                        </h1>

                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Drive with confidence
                        </p>
                    </div>

                </Link>


                {/* DESKTOP NAVIGATION */}

                <nav className="hidden items-center gap-8 md:flex">

                    <Link
                        to="/"
                        className="font-semibold text-[#12395B] transition hover:text-[#2F80C0]"
                    >
                        Home
                    </Link>

                    <Link
                        to="/vehicles"
                        className="font-medium text-slate-600 transition hover:text-[#2F80C0]"
                    >
                        Vehicles
                    </Link>

                    <Link
                        to="/about"
                        className="font-medium text-slate-600 transition hover:text-[#2F80C0]"
                    >
                        About Us
                    </Link>

                    <Link
                        to="/contact"
                        className="font-medium text-slate-600 transition hover:text-[#2F80C0]"
                    >
                        Contact
                    </Link>

                </nav>


                {/* ACTIONS */}

                <div className="hidden items-center gap-3 md:flex">

                    <button className="rounded-xl p-2.5 text-slate-600 transition hover:bg-blue-50 hover:text-[#2F80C0]">
                        <Heart size={20} />
                    </button>

                    <button className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2.5 font-semibold text-[#12395B] transition hover:border-blue-200 hover:bg-blue-50">
                        <UserRound size={18} />
                        Sign In
                    </button>

                </div>


                {/* MOBILE BUTTON */}

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="rounded-xl bg-blue-50 p-2.5 text-[#12395B] md:hidden"
                >
                    {mobileOpen ? (
                        <X size={23} />
                    ) : (
                        <Menu size={23} />
                    )}
                </button>

            </div>


            {/* MOBILE MENU */}

            {mobileOpen && (

                <div className="border-t border-blue-100 bg-white px-5 py-5 md:hidden">

                    <div className="flex flex-col gap-2">

                        <Link
                            to="/"
                            className="rounded-xl px-4 py-3 font-semibold text-[#12395B] hover:bg-blue-50"
                            onClick={() => setMobileOpen(false)}
                        >
                            Home
                        </Link>

                        <Link
                            to="/vehicles"
                            className="rounded-xl px-4 py-3 font-medium text-slate-600 hover:bg-blue-50"
                            onClick={() => setMobileOpen(false)}
                        >
                            Vehicles
                        </Link>

                        <Link
                            to="/about"
                            className="rounded-xl px-4 py-3 font-medium text-slate-600 hover:bg-blue-50"
                            onClick={() => setMobileOpen(false)}
                        >
                            About Us
                        </Link>

                        <Link
                            to="/contact"
                            className="rounded-xl px-4 py-3 font-medium text-slate-600 hover:bg-blue-50"
                            onClick={() => setMobileOpen(false)}
                        >
                            Contact
                        </Link>

                    </div>

                </div>

            )}

        </header>
    );
}

export default Navbar;