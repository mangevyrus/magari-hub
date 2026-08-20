import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
//import AdminLayout from "../../layouts/AdminLayout";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Star,
    CarFront,
    CheckCircle2,
    CircleDollarSign,
    X,
    RefreshCw,
    Eye,
} from "lucide-react";

import {
    getVehicles,
    deleteVehicle,
    updateVehicle,
} from "../../services/vehicleService";

import { Link } from "react-router-dom";


function AdminVehicles() {

    const [vehicles, setVehicles] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const [condition, setCondition] = useState("");

    const [featured, setFeatured] = useState("");

    const [deleteTarget, setDeleteTarget] =
        useState(null);

    const [deleting, setDeleting] =
        useState(false);

    const [updatingFeatured, setUpdatingFeatured] =
        useState(null);


    // =========================================================
    // LOAD VEHICLES
    // =========================================================

    const loadVehicles = async () => {

        try {

            setLoading(true);

            setError("");

            const params =
                new URLSearchParams();

            if (search) {

                params.append(
                    "search",
                    search
                );

            }

            if (status) {

                params.append(
                    "status",
                    status
                );

            }

            if (condition) {

                params.append(
                    "condition",
                    condition
                );

            }

            if (featured) {

                params.append(
                    "featured",
                    featured
                );

            }

            const query =
                params.toString()
                    ? `?${params.toString()}`
                    : "";

            const data =
                await getVehicles(query);

            setVehicles(
                Array.isArray(data)
                    ? data
                    : data.results || []
            );

        } catch (err) {

            console.error(
                "Failed to load vehicles:",
                err
            );

            setError(
                err.response?.data?.detail ||
                err.message ||
                "Failed to load vehicles."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // FILTER LOAD
    // =========================================================

    useEffect(() => {

        loadVehicles();

    }, [status, condition, featured]);


    // =========================================================
    // SEARCH DEBOUNCE
    // =========================================================

    useEffect(() => {

        const timer =
            setTimeout(() => {

                loadVehicles();

            }, 400);

        return () =>
            clearTimeout(timer);

    }, [search]);


    // =========================================================
    // STATISTICS
    // =========================================================

    const statistics = useMemo(() => {

        return {

            total: vehicles.length,

            available:
                vehicles.filter(
                    vehicle =>
                        vehicle.status ===
                        "available"
                ).length,

            sold:
                vehicles.filter(
                    vehicle =>
                        vehicle.status ===
                        "sold"
                ).length,

            featured:
                vehicles.filter(
                    vehicle =>
                        vehicle.featured
                ).length,

        };

    }, [vehicles]);


    // =========================================================
    // DELETE VEHICLE
    // =========================================================

    const handleDelete = async () => {

        if (!deleteTarget) {

            return;

        }

        try {

            setDeleting(true);

            await deleteVehicle(
                deleteTarget.id
            );

            setVehicles(
                previous =>
                    previous.filter(
                        vehicle =>
                            vehicle.id !==
                            deleteTarget.id
                    )
            );

            setDeleteTarget(null);

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.detail ||
                err.message ||
                "Failed to delete vehicle."
            );

        } finally {

            setDeleting(false);

        }

    };


    // =========================================================
    // TOGGLE FEATURED
    // =========================================================

    const handleFeatured = async (
        vehicle
    ) => {

        try {

            setUpdatingFeatured(
                vehicle.id
            );

            const updated =
                await updateVehicle(
                    vehicle.id,
                    {
                        featured:
                            !vehicle.featured
                    }
                );

            setVehicles(
                previous =>
                    previous.map(
                        item =>
                            item.id ===
                            vehicle.id
                                ? {
                                    ...item,
                                    featured:
                                        updated.featured
                                }
                                : item
                    )
            );

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.detail ||
                err.message ||
                "Failed to update vehicle."
            );

        } finally {

            setUpdatingFeatured(
                null
            );

        }

    };


    // =========================================================
    // FORMAT PRICE
    // =========================================================

    const formatPrice = (
        price
    ) => {

        return Number(
            price || 0
        ).toLocaleString();

    };


    // =========================================================
    // PRIMARY IMAGE
    // =========================================================

    const getPrimaryImage = (
        vehicle
    ) => {

        const primary =
            vehicle.images?.find(
                image =>
                    image.is_primary
            );

        const first =
            primary ||
            vehicle.images?.[0];

        if (!first?.image) {

            return null;

        }

        if (
            first.image.startsWith(
                "http"
            )
        ) {

            return first.image;

        }

        return `http://127.0.0.1:8000${first.image}`;

    };


    return (

        <AdminLayout>


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <header className="border-b border-blue-100 bg-white">

                <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">

                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2F80C0]">
                                MagariHub Admin
                            </p>

                            <h1 className="mt-1 text-3xl font-extrabold text-[#12395B]">
                                Vehicle Inventory
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage your dealership inventory.
                            </p>

                        </div>


                        <Link
                            to="/admin/vehicles/new"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#12395B] px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#2F80C0]"
                        >

                            <Plus size={19} />

                            Add New Vehicle

                        </Link>

                    </div>

                </div>

            </header>


            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">


                {/* ================================================= */}
                {/* STATISTICS */}
                {/* ================================================= */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCard
                        title="Total Vehicles"
                        value={statistics.total}
                        icon={CarFront}
                    />

                    <StatCard
                        title="Available"
                        value={statistics.available}
                        icon={CheckCircle2}
                    />

                    <StatCard
                        title="Sold"
                        value={statistics.sold}
                        icon={CircleDollarSign}
                    />

                    <StatCard
                        title="Featured"
                        value={statistics.featured}
                        icon={Star}
                    />

                </div>


                {/* ================================================= */}
                {/* FILTERS */}
                {/* ================================================= */}

                <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

                    <div className="flex flex-col gap-4 lg:flex-row">


                        {/* SEARCH */}

                        <div className="relative flex-1">

                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2F80C0]"
                            />

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search by brand, model or variant..."
                                className="w-full rounded-xl border border-blue-100 bg-[#F5F9FC] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#2F80C0] focus:ring-4 focus:ring-blue-100"
                            />

                        </div>


                        {/* STATUS */}

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target.value
                                )
                            }
                            className="rounded-xl border border-blue-100 bg-[#F5F9FC] px-4 py-3.5 text-sm font-semibold text-[#12395B] outline-none focus:border-[#2F80C0]"
                        >

                            <option value="">
                                All Status
                            </option>

                            <option value="available">
                                Available
                            </option>

                            <option value="reserved">
                                Reserved
                            </option>

                            <option value="sold">
                                Sold
                            </option>

                            <option value="draft">
                                Draft
                            </option>

                            <option value="archived">
                                Archived
                            </option>

                        </select>


                        {/* CONDITION */}

                        <select
                            value={condition}
                            onChange={(e) =>
                                setCondition(
                                    e.target.value
                                )
                            }
                            className="rounded-xl border border-blue-100 bg-[#F5F9FC] px-4 py-3.5 text-sm font-semibold text-[#12395B] outline-none focus:border-[#2F80C0]"
                        >

                            <option value="">
                                All Conditions
                            </option>

                            <option value="new">
                                New
                            </option>

                            <option value="used">
                                Used
                            </option>

                            <option value="certified">
                                Certified
                            </option>

                        </select>


                        {/* FEATURED */}

                        <select
                            value={featured}
                            onChange={(e) =>
                                setFeatured(
                                    e.target.value
                                )
                            }
                            className="rounded-xl border border-blue-100 bg-[#F5F9FC] px-4 py-3.5 text-sm font-semibold text-[#12395B] outline-none focus:border-[#2F80C0]"
                        >

                            <option value="">
                                All Vehicles
                            </option>

                            <option value="true">
                                Featured Only
                            </option>

                        </select>


                        {/* REFRESH */}

                        <button
                            onClick={loadVehicles}
                            className="flex items-center justify-center rounded-xl border border-blue-100 px-4 py-3.5 text-[#12395B] transition hover:bg-[#EAF6FF]"
                            title="Refresh"
                        >

                            <RefreshCw
                                size={18}
                            />

                        </button>

                    </div>

                </div>


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (

                    <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">

                        {error}

                    </div>

                )}


                {/* ================================================= */}
                {/* TABLE */}
                {/* ================================================= */}

                <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">


                    {/* TABLE HEADER */}

                    <div className="hidden grid-cols-[90px_1fr_150px_130px_130px_130px] gap-4 border-b border-blue-100 bg-[#F8FCFF] px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-slate-400 lg:grid">

                        <span>
                            Photo
                        </span>

                        <span>
                            Vehicle
                        </span>

                        <span>
                            Price
                        </span>

                        <span>
                            Status
                        </span>

                        <span>
                            Featured
                        </span>

                        <span>
                            Action
                        </span>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <div className="space-y-3 p-5">

                            {[1, 2, 3, 4].map(
                                item => (

                                    <div
                                        key={item}
                                        className="h-24 animate-pulse rounded-xl bg-[#F5F9FC]"
                                    />

                                )
                            )}

                        </div>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        vehicles.length === 0 && (

                            <div className="px-5 py-20 text-center">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF6FF]">

                                    <CarFront
                                        size={28}
                                        className="text-[#2F80C0]"
                                    />

                                </div>

                                <h3 className="mt-5 text-xl font-extrabold text-[#12395B]">
                                    No vehicles found
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Try changing your filters or add a new vehicle.
                                </p>

                            </div>

                        )}


                    {/* VEHICLES */}

                    {!loading &&
                        vehicles.map(
                            vehicle => {

                                const image =
                                    getPrimaryImage(
                                        vehicle
                                    );

                                return (

                                    <div
                                        key={vehicle.id}
                                        className="grid gap-4 border-b border-blue-50 px-5 py-5 transition hover:bg-[#F8FCFF] lg:grid-cols-[90px_1fr_150px_130px_130px_130px] lg:items-center"
                                    >


                                        {/* IMAGE */}

                                        <div className="h-20 w-24 overflow-hidden rounded-xl bg-[#EAF6FF]">

                                            {image ? (

                                                <img
                                                    src={image}
                                                    alt={`${vehicle.brand_name} ${vehicle.model}`}
                                                    className="h-full w-full object-cover"
                                                />

                                            ) : (

                                                <div className="flex h-full items-center justify-center">

                                                    <CarFront
                                                        size={25}
                                                        className="text-[#2F80C0]"
                                                    />

                                                </div>

                                            )}

                                        </div>


                                        {/* VEHICLE */}

                                        <div>

                                            <div className="flex items-center gap-2">

                                                <p className="text-sm font-bold text-[#2F80C0]">
                                                    {vehicle.brand_name}
                                                </p>

                                                {vehicle.featured && (

                                                    <Star
                                                        size={14}
                                                        className="fill-current text-[#2F80C0]"
                                                    />

                                                )}

                                            </div>

                                            <h3 className="mt-1 text-lg font-extrabold text-[#12395B]">
                                                {vehicle.model}
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-400">

                                                {vehicle.variant &&
                                                    `${vehicle.variant} • `}

                                                {vehicle.year}

                                            </p>

                                        </div>


                                        {/* PRICE */}

                                        <div>

                                            <p className="font-extrabold text-[#12395B]">

                                                ${formatPrice(
                                                    vehicle.price
                                                )}

                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {vehicle.location || "No location"}
                                            </p>

                                        </div>


                                        {/* STATUS */}

                                        <div>

                                            <StatusBadge
                                                status={
                                                    vehicle.status
                                                }
                                            />

                                        </div>


                                        {/* FEATURED */}

                                        <div>

                                            <button
                                                disabled={
                                                    updatingFeatured ===
                                                    vehicle.id
                                                }
                                                onClick={() =>
                                                    handleFeatured(
                                                        vehicle
                                                    )
                                                }
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                    vehicle.featured
                                                        ? "bg-blue-100 text-[#2F80C0]"
                                                        : "bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-[#2F80C0]"
                                                }`}
                                            >

                                                <Star
                                                    size={13}
                                                    className={
                                                        vehicle.featured
                                                            ? "fill-current"
                                                            : ""
                                                    }
                                                />

                                                {updatingFeatured ===
                                                vehicle.id
                                                    ? "Updating..."
                                                    : vehicle.featured
                                                        ? "Featured"
                                                        : "Feature"}

                                            </button>

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="flex gap-2">

                                            {/* VIEW */}

                                            <Link
                                                to={`/vehicles/${vehicle.id}`}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-[#12395B] hover:text-white"
                                                title="View"
                                            >

                                                <Eye
                                                    size={16}
                                                />

                                            </Link>


                                            {/* EDIT */}

                                            <Link
                                                to={`/admin/vehicles/${vehicle.id}/edit`}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF6FF] text-[#2F80C0] transition hover:bg-[#2F80C0] hover:text-white"
                                                title="Edit"
                                            >

                                                <Pencil
                                                    size={16}
                                                />

                                            </Link>


                                            {/* DELETE */}

                                            <button
                                                onClick={() =>
                                                    setDeleteTarget(
                                                        vehicle
                                                    )
                                                }
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white"
                                                title="Delete"
                                            >

                                                <Trash2
                                                    size={16}
                                                />

                                            </button>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                </div>

            </main>


            {/* ================================================= */}
            {/* DELETE MODAL */}
            {/* ================================================= */}

            {deleteTarget && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#12395B]/40 p-5 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="flex items-start justify-between">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                                <Trash2
                                    size={22}
                                    className="text-red-500"
                                />

                            </div>

                            <button
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        <h2 className="mt-5 text-xl font-extrabold text-[#12395B]">
                            Delete this vehicle?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">

                            You are about to permanently
                            delete{" "}

                            <strong className="text-[#12395B]">

                                {deleteTarget.brand_name}{" "}
                                {deleteTarget.model}

                            </strong>

                            . This action cannot be undone.

                        </p>


                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                className="flex-1 rounded-xl border border-blue-100 py-3 font-bold text-[#12395B] transition hover:bg-[#F5F9FC]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 rounded-xl bg-red-500 py-3 font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
                            >

                                {deleting
                                    ? "Deleting..."
                                    : "Delete Vehicle"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </AdminLayout>

    );

}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
    title,
    value,
    icon: Icon,
}) {

    return (

        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm font-semibold text-slate-400">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-[#12395B]">
                        {value}
                    </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF6FF]">

                    <Icon
                        size={23}
                        className="text-[#2F80C0]"
                    />

                </div>

            </div>

        </div>

    );

}


// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
    status,
}) {

    const styles = {

        available:
            "bg-green-50 text-green-600",

        reserved:
            "bg-amber-50 text-amber-600",

        sold:
            "bg-red-50 text-red-500",

        draft:
            "bg-slate-100 text-slate-500",

        archived:
            "bg-slate-100 text-slate-400",

    };

    return (

        <span
            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                styles[status] ||
                "bg-slate-100 text-slate-500"
            }`}
        >

            {status || "Unknown"}

        </span>

    );

}


export default AdminVehicles;