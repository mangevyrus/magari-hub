import {
    Menu,
    Bell,
    Search,
} from "lucide-react";


function AdminNavbar({ setMobileOpen }) {

    return (

        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-blue-100 bg-white/95 px-5 backdrop-blur md:px-8">


            {/* LEFT */}

            <div className="flex items-center gap-4">

                <button
                    onClick={() =>
                        setMobileOpen(true)
                    }
                    className="rounded-xl p-2 text-[#12395B] hover:bg-[#EAF6FF] lg:hidden"
                >

                    <Menu size={22} />

                </button>


                <div className="hidden items-center gap-2 rounded-xl bg-[#F5F9FC] px-4 py-2.5 md:flex">

                    <Search
                        size={17}
                        className="text-slate-400"
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />

                </div>

            </div>


            {/* RIGHT */}

            <div className="flex items-center gap-3">

                <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 text-[#12395B] transition hover:bg-[#EAF6FF]">

                    <Bell size={19} />

                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#2F80C0] ring-2 ring-white" />

                </button>


                <div className="hidden h-8 w-px bg-blue-100 sm:block" />


                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF6FF] font-bold text-[#12395B]">
                        A
                    </div>

                    <div className="hidden sm:block">

                        <p className="text-sm font-bold text-[#12395B]">
                            Administrator
                        </p>

                        <p className="text-xs text-slate-400">
                            Super Admin
                        </p>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default AdminNavbar;