import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    CarFront,
    MessageSquare,
    Clock3,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Send,
    Loader2,
    User,
    Mail,
    Calendar,
    RefreshCw,
    AlertCircle,
    Search,
    X,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";


function AdminInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [response, setResponse] = useState("");
    const [status, setStatus] = useState("pending");

    const [searchTerm, setSearchTerm] = useState("");


    // ============================================================
    // LOAD INQUIRIES
    // ============================================================

    const loadInquiries = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await api.get(
                "/inquiries/admin/"
            );

            const data = Array.isArray(result.data)
                ? result.data
                : result.data.results || [];

            setInquiries(data);

        } catch (err) {
            console.error(
                "Failed to load inquiries:",
                err.response?.data || err
            );

            setError(
                getErrorMessage(
                    err,
                    "Unable to load inquiries."
                )
            );
        } finally {
            setLoading(false);
        }
    };


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        loadInquiries();
    }, []);


    // ============================================================
    // OPEN INQUIRY
    // ============================================================

    const openInquiry = (inquiry) => {
        setSelectedInquiry(inquiry);

        setResponse(
            inquiry.admin_response || ""
        );

        setStatus(
            inquiry.status || "pending"
        );

        setError("");
        setSuccess("");
    };


    // ============================================================
    // CLOSE INQUIRY PANEL
    // ============================================================

    const closeInquiry = () => {
        setSelectedInquiry(null);
        setResponse("");
        setStatus("pending");
        setError("");
        setSuccess("");
    };


    // ============================================================
    // UPDATE INQUIRY
    // ============================================================

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!selectedInquiry) {
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const result = await api.patch(
                `/inquiries/admin/${selectedInquiry.id}/`,
                {
                    admin_response: response,
                    status: status,
                }
            );

            const updatedInquiry = result.data;

            // Update inquiry in the list
            setInquiries((currentInquiries) =>
                currentInquiries.map((inquiry) =>
                    inquiry.id === updatedInquiry.id
                        ? updatedInquiry
                        : inquiry
                )
            );

            // Update selected inquiry
            setSelectedInquiry(updatedInquiry);

            setResponse(
                updatedInquiry.admin_response || ""
            );

            setStatus(
                updatedInquiry.status || "pending"
            );

            setSuccess(
                "Inquiry updated successfully."
            );

        } catch (err) {
            console.error(
                "Failed to update inquiry:",
                err.response?.data || err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to update inquiry."
                )
            );

        } finally {
            setSaving(false);
        }
    };


    // ============================================================
    // FILTER INQUIRIES
    // ============================================================

    const filteredInquiries = inquiries.filter(
        (inquiry) => {
            const search = searchTerm
                .toLowerCase()
                .trim();

            if (!search) {
                return true;
            }

            return (
                String(
                    inquiry.customer_username || ""
                )
                    .toLowerCase()
                    .includes(search) ||

                String(
                    inquiry.customer_email || ""
                )
                    .toLowerCase()
                    .includes(search) ||

                String(
                    inquiry.vehicle_name || ""
                )
                    .toLowerCase()
                    .includes(search) ||

                String(
                    inquiry.subject || ""
                )
                    .toLowerCase()
                    .includes(search) ||

                String(
                    inquiry.message || ""
                )
                    .toLowerCase()
                    .includes(search)
            );
        }
    );


    // ============================================================
    // STATISTICS
    // ============================================================

    const pendingCount = inquiries.filter(
        (inquiry) =>
            inquiry.status === "pending"
    ).length;

    const respondedCount = inquiries.filter(
        (inquiry) =>
            inquiry.status === "responded"
    ).length;

    const closedCount = inquiries.filter(
        (inquiry) =>
            inquiry.status === "closed"
    ).length;


    return (
        <AdminLayout>

        

            <header className="sticky top-0 z-30 border-b border-[#8B1A1A]/20 bg-white/95 backdrop-blur">

                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">

                    <div className="flex items-center gap-4">

                        <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#6A5A4A] transition hover:bg-[#8B1A1A]/5 hover:text-[#8B1A1A]"
                        >
                            <ArrowLeft size={18} />
                            Dashboard
                        </Link>

                        <div className="hidden h-7 w-px bg-[#8B1A1A]/20 sm:block" />

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B1A1A]">
                                <MessageSquare
                                    size={20}
                                    className="text-white"
                                />
                            </div>

                            <div>
                                <h1 className="font-extrabold text-[#2D1B0E]">
                                    Inquiries
                                </h1>

                                <p className="hidden text-xs font-semibold text-[#8B1A1A] sm:block">
                                    ADMIN PANEL
                                </p>
                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={loadInquiries}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl bg-[#8B1A1A]/10 px-4 py-2.5 text-sm font-bold text-[#8B1A1A] transition hover:bg-[#8B1A1A]/20 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        <span className="hidden sm:inline">
                            Refresh
                        </span>
                    </button>

                </div>

            </header>



            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">

                {/* PAGE TITLE */}

                <div className="mb-8">

                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
                        Customer Support
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold text-[#2D1B0E] md:text-4xl">
                        Customer Inquiries
                    </h1>

                    <p className="mt-2 text-[#6A5A4A]">
                        Review customer inquiries and respond to their requests.
                    </p>

                </div>



                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCardRed
                        title="Total Inquiries"
                        value={inquiries.length}
                        icon={MessageSquare}
                    />

                    <StatCardRed
                        title="Pending"
                        value={pendingCount}
                        icon={Clock3}
                    />

                    <StatCardRed
                        title="Responded"
                        value={respondedCount}
                        icon={CheckCircle2}
                    />

                    <StatCardRed
                        title="Closed"
                        value={closedCount}
                        icon={XCircle}
                    />

                </div>


            
                {error && !selectedInquiry && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">

                        <AlertCircle
                            size={19}
                            className="mt-0.5 shrink-0"
                        />

                        <div>
                            {error}
                        </div>

                    </div>
                )}


            

                <div className="mb-5 rounded-2xl border border-[#8B1A1A]/20 bg-white p-4 shadow-sm">

                    <div className="flex items-center gap-3 rounded-xl bg-[#FDF8F5] px-4 py-3">

                        <Search
                            size={19}
                            className="text-[#8B1A1A]"
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                            placeholder="Search by customer, email, vehicle, subject..."
                            className="w-full bg-transparent text-sm text-[#2D1B0E] outline-none placeholder:text-[#8A7A6A]"
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearchTerm("")
                                }
                                className="text-[#8A7A6A] hover:text-[#2D1B0E]"
                            >
                                <X size={17} />
                            </button>
                        )}

                    </div>

                </div>


           

                <section className="overflow-hidden rounded-2xl border border-[#8B1A1A]/20 bg-white shadow-sm">

                    <div className="border-b border-[#8B1A1A]/10 px-5 py-5">

                        <h2 className="text-lg font-extrabold text-[#2D1B0E]">
                            All Inquiries
                        </h2>

                        <p className="mt-1 text-sm text-[#6A5A4A]">
                            Customer questions and support requests.
                        </p>

                    </div>


                    {loading ? (

                        <div className="space-y-3 p-5">

                            {[1, 2, 3, 4, 5].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-24 animate-pulse rounded-xl bg-[#FDF8F5] border border-[#8B1A1A]/10"
                                    />
                                )
                            )}

                        </div>

                    ) : filteredInquiries.length === 0 ? (

                        <div className="px-5 py-16 text-center">

                            <MessageSquare
                                size={38}
                                className="mx-auto text-[#8B1A1A]"
                            />

                            <p className="mt-4 font-extrabold text-[#2D1B0E]">
                                {searchTerm
                                    ? "No inquiries found"
                                    : "No customer inquiries yet"}
                            </p>

                            <p className="mt-2 text-sm text-[#6A5A4A]">
                                {searchTerm
                                    ? "Try a different search term."
                                    : "Customer inquiries will appear here."}
                            </p>

                        </div>

                    ) : (

                        <div>

                            {filteredInquiries.map(
                                (inquiry) => (
                                    <InquiryRowRed
                                        key={inquiry.id}
                                        inquiry={inquiry}
                                        onClick={() =>
                                            openInquiry(
                                                inquiry
                                            )
                                        }
                                    />
                                )
                            )}

                        </div>

                    )}

                </section>

            </main>



            {selectedInquiry && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D1B0E]/40 p-4 backdrop-blur-sm">

                    <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#8B1A1A]/20 bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-[#8B1A1A]/10 px-5 py-5">

                            <div>

                                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8B1A1A]">
                                    Inquiry #{selectedInquiry.id}
                                </p>

                                <h2 className="mt-1 text-xl font-extrabold text-[#2D1B0E]">
                                    {selectedInquiry.subject}
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={closeInquiry}
                                className="rounded-xl p-2 text-[#6A5A4A] transition hover:bg-[#8B1A1A]/5 hover:text-[#2D1B0E]"
                            >
                                <X size={21} />
                            </button>

                        </div>


                        {/* MODAL CONTENT */}

                        <div className="overflow-y-auto p-5">

                            {/* CUSTOMER INFORMATION */}

                            <div className="grid gap-4 sm:grid-cols-2">

                                <InfoBoxRed
                                    icon={User}
                                    label="Customer"
                                    value={
                                        selectedInquiry.customer_username ||
                                        "Unknown"
                                    }
                                />

                                <InfoBoxRed
                                    icon={Mail}
                                    label="Email"
                                    value={
                                        selectedInquiry.customer_email ||
                                        "No email"
                                    }
                                />

                                <InfoBoxRed
                                    icon={CarFront}
                                    label="Vehicle"
                                    value={
                                        selectedInquiry.vehicle_name ||
                                        "Unknown vehicle"
                                    }
                                />

                                <InfoBoxRed
                                    icon={Calendar}
                                    label="Submitted"
                                    value={formatDate(
                                        selectedInquiry.created_at
                                    )}
                                />

                            </div>


                            {/* CUSTOMER MESSAGE */}

                            <div className="mt-5 rounded-2xl border border-[#8B1A1A]/20 bg-[#FDF8F5] p-5">

                                <div className="mb-3 flex items-center gap-2">

                                    <MessageSquare
                                        size={18}
                                        className="text-[#8B1A1A]"
                                    />

                                    <h3 className="font-extrabold text-[#2D1B0E]">
                                        Customer Message
                                    </h3>

                                </div>

                                <p className="whitespace-pre-wrap text-sm leading-7 text-[#6A5A4A]">
                                    {selectedInquiry.message}
                                </p>

                            </div>


                            {/* ADMIN RESPONSE FORM */}

                            <form
                                onSubmit={handleUpdate}
                                className="mt-5"
                            >

                                <div className="mb-5">

                                    <label className="mb-2 block text-sm font-extrabold text-[#2D1B0E]">
                                        Admin Response
                                    </label>

                                    <textarea
                                        value={response}
                                        onChange={(e) =>
                                            setResponse(
                                                e.target.value
                                            )
                                        }
                                        rows={7}
                                        placeholder="Write your response to the customer..."
                                        className="w-full resize-y rounded-xl border border-[#8B1A1A]/20 bg-white px-4 py-3.5 text-sm leading-6 text-[#2D1B0E] outline-none transition placeholder:text-[#8A7A6A] focus:border-[#8B1A1A] focus:ring-4 focus:ring-[#8B1A1A]/10"
                                    />

                                </div>


                                {/* STATUS */}

                                <div className="mb-5">

                                    <label className="mb-2 block text-sm font-extrabold text-[#2D1B0E]">
                                        Inquiry Status
                                    </label>

                                    <select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-[#8B1A1A]/20 bg-white px-4 py-3.5 text-sm font-semibold text-[#2D1B0E] outline-none transition focus:border-[#8B1A1A] focus:ring-4 focus:ring-[#8B1A1A]/10"
                                    >

                                        <option value="pending">
                                            Pending
                                        </option>

                                        <option value="responded">
                                            Responded
                                        </option>

                                        <option value="closed">
                                            Closed
                                        </option>

                                    </select>

                                </div>


                                {/* UPDATE ERROR */}

                                {error && (
                                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">

                                        <AlertCircle
                                            size={18}
                                            className="mt-0.5 shrink-0"
                                        />

                                        <div className="whitespace-pre-wrap">
                                            {error}
                                        </div>

                                    </div>
                                )}


                                {/* SUCCESS */}

                                {success && (
                                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-600">

                                        <CheckCircle2
                                            size={18}
                                            className="shrink-0"
                                        />

                                        {success}

                                    </div>
                                )}


                                {/* BUTTONS */}

                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                    <button
                                        type="button"
                                        onClick={closeInquiry}
                                        className="rounded-xl border border-[#8B1A1A]/20 px-5 py-3 text-sm font-bold text-[#6A5A4A] transition hover:bg-[#FDF8F5]"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B1A1A] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515] hover:shadow-xl hover:shadow-[#8B1A1A]/30 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        {saving ? (
                                            <>
                                                <Loader2
                                                    size={17}
                                                    className="animate-spin"
                                                />

                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Send
                                                    size={17}
                                                />

                                                Save Response
                                            </>
                                        )}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            )}

        </AdminLayout>
    );
}


// ============================================================
// STAT CARD - DEEP REDISH
// ============================================================

function StatCardRed({
    title,
    value,
    icon: Icon,
}) {
    return (
        <div className="rounded-2xl border border-[#8B1A1A]/15 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-[#8B1A1A]/30">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm font-semibold text-[#6A5A4A]">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-[#2D1B0E]">
                        {value}
                    </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B1A1A]/10">

                    <Icon
                        size={22}
                        className="text-[#8B1A1A]"
                    />

                </div>

            </div>

        </div>
    );
}


// ============================================================
// INQUIRY ROW - DEEP REDISH
// ============================================================

function InquiryRowRed({
    inquiry,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-4 border-b border-[#8B1A1A]/10 px-5 py-5 text-left transition last:border-b-0 hover:bg-[#FDF8F5]"
        >

            {/* ICON */}

            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#8B1A1A]/10 sm:flex">

                <MessageSquare
                    size={21}
                    className="text-[#8B1A1A]"
                />

            </div>


            {/* DETAILS */}

            <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                    <p className="font-extrabold text-[#2D1B0E]">
                        {inquiry.subject}
                    </p>

                    <StatusBadgeRed
                        status={inquiry.status}
                    />

                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8A7A6A]">

                    <span>
                        {inquiry.customer_username ||
                            "Unknown customer"}
                    </span>

                    <span className="hidden sm:inline">
                        •
                    </span>

                    <span>
                        {inquiry.vehicle_name ||
                            "Unknown vehicle"}
                    </span>

                </div>

                <p className="mt-2 line-clamp-2 text-sm text-[#6A5A4A]">
                    {inquiry.message}
                </p>

            </div>


            {/* DATE */}

            <div className="hidden shrink-0 text-right md:block">

                <p className="text-xs font-semibold text-[#8A7A6A]">
                    {formatDate(
                        inquiry.created_at
                    )}
                </p>

                <p className="mt-2 text-xs font-bold text-[#8B1A1A]">
                    View
                </p>

            </div>

        </button>
    );
}


// ============================================================
// STATUS BADGE - DEEP REDISH
// ============================================================

function StatusBadgeRed({
    status,
}) {
    if (status === "responded") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold capitalize text-green-600">
                <CheckCircle2 size={13} />
                Responded
            </span>
        );
    }

    if (status === "closed") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold capitalize text-slate-600">
                <XCircle size={13} />
                Closed
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold capitalize text-amber-600">
            <Clock3 size={13} />
            Pending
        </span>
    );
}


// ============================================================
// INFO BOX - DEEP REDISH
// ============================================================

function InfoBoxRed({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-[#FDF8F5] border border-[#8B1A1A]/10 p-4">

            <div className="mb-2 flex items-center gap-2 text-[#8B1A1A]">

                <Icon size={17} />

                <span className="text-[11px] font-extrabold uppercase tracking-wide">
                    {label}
                </span>

            </div>

            <p className="break-words text-sm font-bold text-[#2D1B0E]">
                {value}
            </p>

        </div>
    );
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(date) {
    if (!date) {
        return "—";
    }

    try {
        return new Date(date).toLocaleString();
    } catch {
        return "—";
    }
}


// ============================================================
// ERROR MESSAGE
// ============================================================

function getErrorMessage(
    error,
    fallback
) {
    const data = error?.response?.data;

    if (!data) {
        return (
            error?.message ||
            fallback
        );
    }

    if (typeof data === "string") {
        return data;
    }

    if (data.detail) {
        return data.detail;
    }

    const messages = [];

    Object.entries(data).forEach(
        ([field, value]) => {
            if (Array.isArray(value)) {
                messages.push(
                    `${field}: ${value.join(" ")}`
                );
            } else if (
                typeof value === "string"
            ) {
                messages.push(
                    `${field}: ${value}`
                );
            } else {
                messages.push(
                    `${field}: ${JSON.stringify(value)}`
                );
            }
        }
    );

    return messages.length
        ? messages.join("\n")
        : fallback;
}


export default AdminInquiries;