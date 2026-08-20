import { useEffect, useState } from "react";
import {
    ArrowRight,
    Search,
    ShieldCheck,
    CarFront,
    BadgeCheck,
    Headphones,
} from "lucide-react";

import VehicleCard from "../../components/VehicleCard";
import Navbar from "../../components/Navbar";
import { getVehicles } from "../../services/vehicleService";


function Home() {

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadVehicles = async () => {

            try {

                const data = await getVehicles();

                setVehicles(data);

            } catch (error) {

                console.error(
                    "Failed to load vehicles:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadVehicles();

    }, []);


    return (

        <div className="min-h-screen bg-[#F5F9FC]">

            <Navbar />


            {/* HERO */}

            <section className="relative overflow-hidden bg-[#EAF6FF]">

                {/* Decorative shapes */}

                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/70 blur-3xl" />

                <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />


                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-2 lg:py-24">


                    {/* LEFT */}

                    <div>

                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-[#2F80C0] shadow-sm">

                            <span className="h-2 w-2 rounded-full bg-[#2F80C0]" />

                            Soko lako la magari linaloaminika

                        </div>


                        <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.05] tracking-tight text-[#12395B] md:text-6xl lg:text-7xl">

                            Pata gari

                            <span className="block text-[#2F80C0]">
                                linalokufaa.
                            </span>

                        </h1>


                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">

                            Chunguza magari bora kutoka kwa wauzaji wanaoaminika.
                            Linganisha, gundua na upate gari lako bora
                            kwa ujasiri.

                        </p>


                        {/* SEARCH BOX */}

                        <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-3 shadow-[0_15px_40px_rgba(18,57,91,0.1)]">

                            <div className="flex flex-col gap-3 md:flex-row">

                                <div className="flex flex-1 items-center gap-3 rounded-xl bg-[#F5F9FC] px-4 py-3">

                                    <Search
                                        size={20}
                                        className="text-[#2F80C0]"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Tafuta kwa jina au mfano wa gari..."
                                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                    />

                                </div>


                                <button className="flex items-center justify-center gap-2 rounded-xl bg-[#12395B] px-7 py-3.5 font-bold text-white transition hover:bg-[#2F80C0]">

                                    Tafuta Magari

                                    <ArrowRight size={18} />

                                </button>

                            </div>

                        </div>

                    </div>


                    {/* RIGHT IMAGE */}

                    <div className="relative hidden lg:block">

                        <div className="absolute -inset-4 rounded-[2rem] bg-white/60 blur-2xl" />

                        <div className="relative overflow-hidden rounded-[2rem] border-8 border-white shadow-[0_30px_70px_rgba(18,57,91,0.15)]">

                            <img
                                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
                                alt="Gari la kifahari"
                                className="h-[500px] w-full object-cover"
                            />

                        </div>


                        {/* FLOATING CARD */}

                        <div className="absolute -bottom-6 -left-8 flex items-center gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-xl">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF6FF] text-[#2F80C0]">

                                <BadgeCheck size={25} />

                            </div>

                            <div>

                                <p className="text-sm font-extrabold text-[#12395B]">
                                    Magari Yanayoaminika
                                </p>

                                <p className="text-xs text-slate-400">
                                    Orodha iliyokaguliwa kwa ubora
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* TRUST FEATURES */}

            <section className="border-b border-blue-100 bg-white">

                <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-blue-100 px-5 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-8">

                    <div className="flex items-center gap-4 py-7 md:px-8">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF6FF] text-[#2F80C0]">

                            <ShieldCheck size={24} />

                        </div>

                        <div>

                            <h3 className="font-bold text-[#12395B]">
                                Wauzaji Wanaoaminika
                            </h3>

                            <p className="text-sm text-slate-400">
                                Nunua kwa ujasiri
                            </p>

                        </div>

                    </div>


                    <div className="flex items-center gap-4 py-7 md:px-8">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF6FF] text-[#2F80C0]">

                            <CarFront size={24} />

                        </div>

                        <div>

                            <h3 className="font-bold text-[#12395B]">
                                Magari Bora
                            </h3>

                            <p className="text-sm text-slate-400">
                                Orodha iliyochaguliwa kwa makini
                            </p>

                        </div>

                    </div>


                    <div className="flex items-center gap-4 py-7 md:px-8">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF6FF] text-[#2F80C0]">

                            <Headphones size={24} />

                        </div>

                        <div>

                            <h3 className="font-bold text-[#12395B]">
                                Msaada wa Wataalamu
                            </h3>

                            <p className="text-sm text-slate-400">
                                Tupo hapa kukusaidia
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* FEATURED VEHICLES */}

            <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">

                <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">

                    <div>

                        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#2F80C0]">
                            Orodha Yetu
                        </p>

                        <h2 className="text-3xl font-extrabold tracking-tight text-[#12395B] md:text-4xl">
                            Magari Yanayojulikana
                        </h2>

                        <p className="mt-3 max-w-xl text-slate-500">
                            Chunguza baadhi ya magari ya hivi karibuni
                            yanayopatikana kwenye MagariHub.
                        </p>

                    </div>


                    <button className="flex items-center gap-2 font-bold text-[#2F80C0] transition hover:text-[#12395B]">

                        Tazama magari yote

                        <ArrowRight size={18} />

                    </button>

                </div>


                {loading ? (

                    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

                        {[1, 2, 3].map((item) => (

                            <div
                                key={item}
                                className="h-[470px] animate-pulse rounded-2xl bg-white"
                            />

                        ))}

                    </div>

                ) : vehicles.length === 0 ? (

                    <div className="rounded-2xl border border-blue-100 bg-white px-6 py-20 text-center">

                        <CarFront
                            size={45}
                            className="mx-auto text-[#2F80C0]"
                        />

                        <h3 className="mt-5 text-2xl font-extrabold text-[#12395B]">
                            Hakuna magari yanayopatikana bado
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-slate-500">
                            Ongeza gari lako la kwanza kutoka kwenye
                            paneli ya usimamizi ya Django na litaonekana hapa.
                        </p>

                    </div>

                ) : (

                    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

                        {vehicles.map((vehicle) => (

                            <VehicleCard
                                key={vehicle.id}
                                vehicle={vehicle}
                            />

                        ))}

                    </div>

                )}

            </section>


            {/* CTA */}

            <section className="px-5 pb-20 md:px-8">

                <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#12395B] px-8 py-14 md:px-14">

                    <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

                        <div>

                            <p className="mb-2 font-semibold text-blue-200">
                                Uko tayari kupata gari lako lijalo?
                            </p>

                            <h2 className="text-3xl font-extrabold text-white md:text-4xl">
                                Safari yako ijayo inaanzia hapa.
                            </h2>

                        </div>


                        <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-[#12395B] transition hover:bg-[#EAF6FF]">

                            Tazama Magari

                            <ArrowRight size={18} />

                        </button>

                    </div>

                </div>

            </section>


            {/* FOOTER */}

            <footer className="border-t border-blue-100 bg-white">

                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-8 text-sm text-slate-400 md:flex-row md:px-8">

                    <p>
                        © 2026 MagariHub. Haki zote zimehifadhiwa.
                    </p>

                    <div className="flex gap-6">

                        <span className="cursor-pointer hover:text-[#2F80C0]">
                            Sera ya Faragha
                        </span>

                        <span className="cursor-pointer hover:text-[#2F80C0]">
                            Masharti
                        </span>

                        <span className="cursor-pointer hover:text-[#2F80C0]">
                            Wasiliana Nasi
                        </span>

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default Home;