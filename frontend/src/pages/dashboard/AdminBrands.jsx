
import AdminLayout from "../../layouts/AdminLayout";

import { useEffect, useState } from "react";

import {
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    Upload,
    RefreshCw,
    CarFront,
    Image as ImageIcon,
} from "lucide-react";

import api from "../../services/api";

function AdminBrands() {
    // ========================================================
    // STATE
    // ========================================================

    const [brands, setBrands] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editingBrand, setEditingBrand] = useState(null);

    const [deleteBrand, setDeleteBrand] = useState(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        logo: null,
    });

    const [preview, setPreview] = useState(null);

    // ========================================================
    // LOAD BRANDS
    // ========================================================

    const loadBrands = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/brands/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setBrands(data);
        } catch (err) {
            console.error("Loading brands error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to load brands."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBrands();
    }, []);

    // ========================================================
    // SEARCH
    // ========================================================

    const filteredBrands = brands.filter((brand) =>
        brand.name
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    // ========================================================
    // OPEN CREATE MODAL
    // ========================================================

    const openCreateModal = () => {
        setEditingBrand(null);

        setForm({
            name: "",
            description: "",
            logo: null,
        });

        setPreview(null);

        setError("");

        setShowModal(true);
    };

    // ========================================================
    // OPEN EDIT MODAL
    // ========================================================

    const openEditModal = (brand) => {
        setEditingBrand(brand);

        setForm({
            name: brand.name || "",
            description: brand.description || "",
            logo: null,
        });

        setPreview(brand.logo || null);

        setError("");

        setShowModal(true);
    };

    // ========================================================
    // CLOSE MODAL
    // ========================================================

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);

        setEditingBrand(null);

        setForm({
            name: "",
            description: "",
            logo: null,
        });

        setPreview(null);
    };

    // ========================================================
    // FORM CHANGE
    // ========================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    // ========================================================
    // LOGO CHANGE
    // ========================================================

    const handleLogoChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setForm((current) => ({
            ...current,
            logo: file,
        }));

        setPreview(URL.createObjectURL(file));
    };

    // ========================================================
    // SAVE BRAND
    // ========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.name.trim()) {
            setError("Brand name is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const formData = new FormData();

            formData.append(
                "name",
                form.name.trim()
            );

            formData.append(
                "description",
                form.description.trim()
            );

            if (form.logo) {
                formData.append(
                    "logo",
                    form.logo
                );
            }

            let response;

            if (editingBrand) {
                response = await api.patch(
                    `/brands/${editingBrand.id}/`,
                    formData
                );
            } else {
                response = await api.post(
                    "/brands/",
                    formData
                );
            }

            if (editingBrand) {
                setBrands((current) =>
                    current.map((brand) =>
                        brand.id === editingBrand.id
                            ? response.data
                            : brand
                    )
                );
            } else {
                setBrands((current) => [
                    response.data,
                    ...current,
                ]);
            }

            closeModal();
        } catch (err) {
            console.error(
                "Saving brand error:",
                err
            );

            const data = err.response?.data;

            if (typeof data === "object") {
                const firstError = Object.values(data)
                    .flat()
                    .find(Boolean);

                setError(
                    firstError ||
                    "Unable to save brand."
                );
            } else {
                setError(
                    "Unable to save brand."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    // ========================================================
    // DELETE BRAND
    // ========================================================

    const handleDelete = async () => {
        if (!deleteBrand) return;

        try {
            setSaving(true);
            setError("");

            await api.delete(
                `/brands/${deleteBrand.id}/`
            );

            setBrands((current) =>
                current.filter(
                    (brand) =>
                        brand.id !== deleteBrand.id
                )
            );

            setDeleteBrand(null);
        } catch (err) {
            console.error(
                "Delete brand error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to delete brand. Make sure there are no vehicles using this brand."
            );

            setDeleteBrand(null);
        } finally {
            setSaving(false);
        }
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <AdminLayout>

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <header className="border-b border-blue-100 bg-white">

                <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2F80C0]">
                                Management
                            </p>

                            <h1 className="mt-2 text-3xl font-extrabold text-[#12395B] md:text-4xl">
                                Brands
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Manage vehicle brands and their logos.
                            </p>

                        </div>

                        <div className="flex gap-3">

                            <button
                                onClick={loadBrands}
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-[#12395B] shadow-sm transition hover:bg-[#F8FCFF] disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={17}
                                    className={
                                        loading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                Refresh
                            </button>

                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#12395B] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0E2E4A]"
                            >
                                <Plus size={18} />

                                Add Brand
                            </button>

                        </div>

                    </div>

                </div>

            </header>


            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">

                {/* ERROR */}

                {error && !showModal && (

                    <div className="mb-6 flex items-start justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-sm font-semibold text-red-600">

                        <span>{error}</span>

                        <button
                            onClick={() => setError("")}
                            className="ml-4 rounded-lg p-1 hover:bg-red-100"
                        >
                            <X size={17} />
                        </button>

                    </div>

                )}


                {/* ================================================= */}
                {/* SEARCH */}
                {/* ================================================= */}

                <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

                    <div className="relative max-w-xl">

                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search brands..."
                            className="w-full rounded-xl border border-blue-100 bg-[#F8FCFF] py-3.5 pl-11 pr-4 text-sm font-medium text-[#12395B] outline-none transition placeholder:text-slate-400 focus:border-[#2F80C0] focus:ring-4 focus:ring-blue-50"
                        />

                    </div>

                </section>


                {/* ================================================= */}
                {/* BRAND GRID */}
                {/* ================================================= */}

                <section className="mt-6">

                    {loading ? (

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                            {[1, 2, 3, 4, 5, 6].map(
                                (item) => (

                                    <div
                                        key={item}
                                        className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
                                    >

                                        <div className="h-24 animate-pulse rounded-xl bg-[#EAF6FF]" />

                                        <div className="mt-4 h-5 w-32 animate-pulse rounded bg-slate-100" />

                                        <div className="mt-2 h-4 w-24 animate-pulse rounded bg-slate-100" />

                                    </div>

                                )
                            )}

                        </div>

                    ) : filteredBrands.length === 0 ? (

                        <div className="rounded-2xl border border-blue-100 bg-white px-5 py-20 text-center shadow-sm">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF6FF]">

                                <CarFront
                                    size={30}
                                    className="text-[#2F80C0]"
                                />

                            </div>

                            <h3 className="mt-5 text-lg font-extrabold text-[#12395B]">
                                No brands found
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                                Add your first vehicle brand or change your search.
                            </p>

                        </div>

                    ) : (

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                            {filteredBrands.map(
                                (brand) => (

                                    <BrandCard
                                        key={brand.id}
                                        brand={brand}
                                        onEdit={
                                            openEditModal
                                        }
                                        onDelete={
                                            setDeleteBrand
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>


            {/* ================================================= */}
            {/* CREATE / EDIT MODAL */}
            {/* ================================================= */}

            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12395B]/40 px-5 backdrop-blur-sm">

                    <div className="w-full max-w-lg rounded-2xl border border-blue-100 bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-blue-100 px-6 py-5">

                            <div>

                                <h2 className="text-xl font-extrabold text-[#12395B]">
                                    {editingBrand
                                        ? "Edit Brand"
                                        : "Add Brand"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    {editingBrand
                                        ? "Update brand information and logo."
                                        : "Create a new vehicle brand."}
                                </p>

                            </div>

                            <button
                                onClick={closeModal}
                                disabled={saving}
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#12395B]"
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="p-6"
                        >

                            {error && (

                                <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                                    {error}
                                </div>

                            )}


                            {/* LOGO */}

                            <div className="mb-6">

                                <label className="mb-2 block text-sm font-bold text-[#12395B]">
                                    Brand Logo
                                </label>

                                <label className="group relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-blue-100 bg-[#F8FCFF] transition hover:border-[#2F80C0]">

                                    {preview ? (

                                        <img
                                            src={preview}
                                            alt="Brand logo preview"
                                            className="h-full w-full object-contain p-5"
                                        />

                                    ) : (

                                        <div className="text-center">

                                            <Upload
                                                size={30}
                                                className="mx-auto text-[#2F80C0]"
                                            />

                                            <p className="mt-2 text-sm font-bold text-[#12395B]">
                                                Upload brand logo
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                PNG, JPG, WEBP
                                            </p>

                                        </div>

                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleLogoChange
                                        }
                                        className="hidden"
                                    />

                                </label>

                            </div>


                            {/* NAME */}

                            <div className="mb-5">

                                <label className="mb-2 block text-sm font-bold text-[#12395B]">
                                    Brand Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Toyota"
                                    className="w-full rounded-xl border border-blue-100 bg-[#F8FCFF] px-4 py-3.5 text-sm font-medium text-[#12395B] outline-none transition placeholder:text-slate-400 focus:border-[#2F80C0] focus:ring-4 focus:ring-blue-50"
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="mb-6">

                                <label className="mb-2 block text-sm font-bold text-[#12395B]">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows={4}
                                    placeholder="Short description about this brand..."
                                    className="w-full resize-none rounded-xl border border-blue-100 bg-[#F8FCFF] px-4 py-3.5 text-sm font-medium text-[#12395B] outline-none transition placeholder:text-slate-400 focus:border-[#2F80C0] focus:ring-4 focus:ring-blue-50"
                                />

                            </div>


                            {/* ACTIONS */}

                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="flex-1 rounded-xl border border-blue-100 px-4 py-3.5 text-sm font-bold text-[#12395B] transition hover:bg-[#F5F9FC] disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 rounded-xl bg-[#12395B] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#0E2E4A] disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingBrand
                                        ? "Update Brand"
                                        : "Create Brand"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* DELETE MODAL */}
            {/* ================================================= */}

            {deleteBrand && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12395B]/40 px-5 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-6 shadow-2xl">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                            <Trash2
                                size={22}
                                className="text-red-500"
                            />

                        </div>

                        <h2 className="mt-5 text-xl font-extrabold text-[#12395B]">
                            Delete Brand?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">

                            You are about to delete{" "}

                            <span className="font-bold text-[#12395B]">
                                {deleteBrand.name}
                            </span>

                            . This will only work if no vehicles are currently using this brand.

                        </p>

                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={() =>
                                    setDeleteBrand(null)
                                }
                                disabled={saving}
                                className="flex-1 rounded-xl border border-blue-100 px-4 py-3 text-sm font-bold text-[#12395B] transition hover:bg-[#F5F9FC]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={saving}
                                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
                            >
                                {saving
                                    ? "Deleting..."
                                    : "Delete Brand"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </AdminLayout>
    );
}


// ============================================================
// BRAND CARD
// ============================================================

function BrandCard({
    brand,
    onEdit,
    onDelete,
}) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">

            {/* LOGO */}

            <div className="flex h-40 items-center justify-center bg-[#F8FCFF] p-6">

                {brand.logo ? (

                    <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="h-full w-full object-contain"
                    />

                ) : (

                    <div className="flex flex-col items-center justify-center text-slate-300">

                        <ImageIcon size={38} />

                        <span className="mt-2 text-xs font-bold">
                            No logo
                        </span>

                    </div>

                )}

            </div>


            {/* CONTENT */}

            <div className="p-5">

                <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                        <h3 className="truncate text-lg font-extrabold text-[#12395B]">
                            {brand.name}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                            {brand.description ||
                                "No description provided."}
                        </p>

                    </div>

                </div>


                {/* ACTIONS */}

                <div className="mt-5 flex items-center gap-2">

                    <button
                        onClick={() =>
                            onEdit(brand)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#EAF6FF] px-3 py-2.5 text-xs font-extrabold text-[#2F80C0] transition hover:bg-[#DDF2FF]"
                    >
                        <Pencil size={15} />

                        Edit
                    </button>

                    <button
                        onClick={() =>
                            onDelete(brand)
                        }
                        className="rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        title="Delete brand"
                    >
                        <Trash2 size={17} />
                    </button>

                </div>

            </div>

        </div>
    );
}

export default AdminBrands;
